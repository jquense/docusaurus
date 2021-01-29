import path from 'path';

import type { Plugin } from '@docusaurus/types';

export default (): Plugin<any> => {
  return {
    name: 'docusaurus-theme-jarle-codeblock',

    getThemePath() {
      return path.join(__dirname, '..', 'lib', 'theme');
    },
    getTypeScriptThemePath() {
      return path.resolve(__dirname, './theme');
    },
  };
};
