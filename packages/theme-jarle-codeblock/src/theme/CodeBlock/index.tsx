/* eslint-disable import/no-unresolved */

import { usePrismTheme } from '@docusaurus/theme-common';
import CodeBlock from '@theme-init/CodeBlock';
// @ts-ignore
import CodeLiveScope from '@theme/CodeLiveScope';
// @ts-ignore
import Playground from '@theme/Playground';
// @ts-ignore
import React from 'react';

const getLanguage = (className = '') => {
  const [, mode] = className.match(/language-(\w+)/) || [];
  return mode;
};

export default function LiveCodeBlock(props: any) {
  const prismTheme = usePrismTheme();

  if (props.live) {
    const language = props.language || getLanguage(props.className);

    return (
      <Playground
        scope={CodeLiveScope}
        theme={prismTheme}
        language={language}
        {...props}
      />
    );
  }

  return <CodeBlock {...props} />;
}
