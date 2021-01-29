import fs from 'fs';

import type { LoadContext, Plugin } from '@docusaurus/types';
import VirtualModulePlugin from 'astroturf/VirtualModulePlugin';
import findCacheDir from 'find-cache-dir';

const cacheDir = findCacheDir({ name: 'astroturf-loader' })!;

class CacheVirtualModulePlugin extends VirtualModulePlugin {
  files: any[] | null;

  cache: Record<string, string> | null;

  dirty = false;

  constructor() {
    super();

    this.cache = Object.create(null);

    try {
      fs.mkdirSync(cacheDir, { recursive: true });
    } catch {
      /* ignore */
    }

    try {
      this.files = JSON.parse(
        fs.readFileSync(`${cacheDir}/styles.json`, 'utf-8'),
      );
    } catch {
      this.files = null;
    }
  }

  writeAndCache(filePath: string, contents: string) {
    if (!this.cache![filePath] || this.cache![filePath] !== contents) {
      this.dirty = true;
    }

    this.cache![filePath] = contents;
    return this.writeModule(filePath, contents);
  }

  apply(compiler: any) {
    super.apply(compiler);

    let first = true;

    compiler.hooks.afterEnvironment.tap('CacheVirtualModulePlugin', () => {
      VirtualModulePlugin.augmentFileSystem(compiler);
    });

    compiler.hooks.compilation.tap(
      'CacheVirtualModulePlugin',
      (compilation: any) => {
        compilation.hooks.normalModuleLoader.tap(
          'LoaderPlugin',
          (loaderContext: any) => {
            loaderContext.emitVirtualFile = this.writeAndCache.bind(this);
          },
        );
      },
    );

    compiler.hooks.watchRun.tap('CacheVirtualModulePlugin', () => {
      if (first) {
        first = false;
        this.cache = Object.create(null);
      }
    });

    compiler.hooks.afterResolvers.tap('CacheVirtualModulePlugin', () => {
      if (this.files) {
        // console.log('ADD FILES');
        for (const [filePath, contents] of Object.entries(this.files)) {
          this.writeModule(filePath, contents);
        }
        this.files = null;
      }
    });

    compiler.hooks.done.tap('CacheVirtualModulePlugin', () => {
      try {
        if (this.dirty) {
          fs.writeFileSync(
            `${cacheDir}/styles.json`,
            JSON.stringify(this.cache),
          );
        }
      } catch (err) {
        console.error(err);
      } finally {
        this.dirty = false;
      }
    });
  }
}

module.exports = (_: LoadContext, options = {}): Plugin<any> => {
  return {
    name: 'docusaurus-plugin-astroturf',
    configureWebpack() {
      return {
        plugins: [new CacheVirtualModulePlugin()],
        module: {
          rules: [
            {
              test: /\.(j|t)sx?$/,
              exclude: /node_modules/,
              use: {
                loader: 'astroturf/loader',
                options: { extension: '.module.css', ...options },
              },
            },
          ],
        },
      };
    },
  };
};
