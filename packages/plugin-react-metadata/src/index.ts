/* eslint-disable no-await-in-loop */
/* eslint-disable no-param-reassign */
// @ts-ignore
import { promises as fs } from 'fs';
import path from 'path';

import type { LoadContext, Plugin } from '@docusaurus/types';
// @ts-ignore
import mdx from '@mdx-js/mdx';
// @ts-ignore
import fileEntryCache from 'file-entry-cache';
import { globby } from 'globby';
// @ts-ignore
import * as reactDocgen from 'react-docgen';
import { pascalCase } from 'tiny-case';

import jsDocHandler from './jsDocHandler';

const noop = `() => null`;

type Write = (parent: string | undefined, content: string) => Promise<string>;

const PLUGIN = 'docusaurus-plugin-react-metadata';

type LoadedContent = Array<{ file: string; docgen: Record<string, any>[] }>;

export default (
  ctx: LoadContext,
  options: any = {},
): Plugin<LoadedContent> => {
  const {
    src,
    mdx: mdxOptions,
    docgen = {},
    babel = {},
    watchPaths,
    parserOptions,
  } = options;

  const defaultHandlers = [...reactDocgen.defaultHandlers, jsDocHandler];

  const dataDir = `${ctx.generatedFilesDir}/${PLUGIN}/${options.id}/`;

  const cache = fileEntryCache.create('timestamps', dataDir);

  const extraCache = watchPaths
    ? fileEntryCache.create('extra-paths', dataDir)
    : null;

  async function stringify(value: any, write: Write, parent?: string) {
    let str = '';
    if (Array.isArray(value)) {
      const values = await Promise.all(
        value.map((v) => stringify(v, write, v?.name || parent)),
      );

      str = `[${values.join(',\n')}]`;
    } else if (value && typeof value === 'object') {
      str += '{\n';
      for (const [key, keyValue] of Object.entries(value)) {
        if (key === 'description') {
          if (keyValue) {
            const file = await write(parent, await mdx(keyValue, mdxOptions));
            str += `"${key}": require('./${file}').default,\n`;
          } else {
            str += `"${key}": ${noop},\n`;
          }
        } else {
          str += `"${key}": ${await stringify(keyValue, write, key)},\n`;
        }
      }
      str += '}';
    } else {
      str += JSON.stringify(value);
    }
    return str;
  }

  return {
    name: PLUGIN,
    getPathsToWatch() {
      return [].concat(src, watchPaths || []);
    },
    getThemePath() {
      return path.join(__dirname, '..', 'lib', 'theme');
    },
    getTypeScriptThemePath() {
      return path.resolve(__dirname, './theme');
    },

    async loadContent() {
      let rerunAll = false;
      const [allFiles, extraFiles] = await Promise.all([
        globby(src),
        extraCache && globby(watchPaths),
      ]);

      if (extraCache) {
        rerunAll = !!extraCache.getUpdatedFiles(extraFiles).length;
      }

      const changedFiles: string[] = cache.getUpdatedFiles(allFiles);
      const files = rerunAll ? allFiles : changedFiles;

      const content = await Promise.all(
        files.map(async (file) => {
          try {
            return {
              docgen: reactDocgen.parse(
                await fs.readFile(file),
                docgen.resolver ||
                  reactDocgen.resolver.findAllComponentDefinitions,
                defaultHandlers.concat(docgen.handlers || []),
                {
                  filename: file,
                  parserOptions,
                  ...babel,
                },
              ),
              file,
            };
          } catch (e) {
            if (e.message.includes('No suitable component definition found'))
              return null;

            console.error(e.message, file);
          }
          return null;
        }),
      );

      return content.filter(Boolean) as any;
    },

    async contentLoaded({ content, actions }) {
      const { createData } = actions;

      await Promise.all(
        // eslint-disable-next-line @typescript-eslint/no-shadow
        content.flatMap(({ file, docgen }) => {
          return docgen.map(async (component) => {
            component.displayName =
              component.displayName ||
              pascalCase(path.basename(file, path.extname(file)));

            const name = component.displayName;

            component.props = Object.entries(component.props || {}).map(
              // eslint-disable-next-line @typescript-eslint/no-shadow
              ([name, value]: [string, any]) => ({
                name,
                ...value,
              }),
            );

            const write = async (p = '', data: string) => {
              const filename = `${name}_${p ? `${p}_` : ''}description.js`;
              await createData(
                filename,
                `import { mdx } from '@mdx-js/react';\n\n${data}`,
              );
              return filename;
            };

            return createData(
              `${name}.js`,
              `module.exports = ${await stringify(component, write)}`,
            );
          });
        }),
      );

      cache.reconcile(true);
      extraCache?.reconcile(true);
    },

    configureWebpack() {
      const scope = options.id === 'default' ? '' : `/${options.id}`;

      return {
        resolve: {
          alias: {
            [`@react-metadata${scope}`]: dataDir,
          },
        },
      };
    },
  };
};
