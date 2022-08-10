import type { LoadContext, Plugin } from '@docusaurus/types';

export default (_: LoadContext, options = {}): Plugin<any> => {
  return {
    name: 'docusaurus-plugin-astroturf',
    configureWebpack() {
      return {
        module: {
          rules: [
            {
              test: /\.(j|t)sx?$/,
              exclude: /node_modules/,
              use: {
                loader: 'astroturf/loader',
                options: {
                  extension: '.module.css',
                  useAltLoader: true,
                  ...options,
                },
              },
            },
          ],
        },
      };
    },
  };
};
