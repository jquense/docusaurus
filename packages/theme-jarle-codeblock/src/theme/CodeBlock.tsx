/* eslint-disable import/no-unresolved */

// @ts-ignore
import CodeBlock from '@theme-init/CodeBlock';
import CodeLiveScope from '@theme/CodeLiveScope';
import Playground from '@theme/Playground';
import usePrismTheme from '@theme/hooks/usePrismTheme';
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
