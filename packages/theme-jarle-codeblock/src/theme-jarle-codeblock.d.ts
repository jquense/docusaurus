/* eslint-disable @typescript-eslint/triple-slash-reference */
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/// <reference types="@docusaurus/theme-classic" />
/// <reference types="@docusaurus/module-type-aliases" />

// declare module '@docusaurus/theme-jarle-codeblock' {
//   export type ThemeConfig = {};
// }

declare module '@theme/ImportContext' {
  import type { ImportResolver } from 'jarle';
  import type { Context } from 'react';

  export const Context: Context<ImportResolver | null>;

  export default function ImportProvider(props: {
    imports?: ImportResolver;
    children: React.ReactNode;
  }): JSX.Element;
}

declare module '@theme/Playground' {
  import type { Props as BaseProps } from '@theme/CodeBlock';
  import type { Props as ProviderProps } from 'jarle/esm/Provider';

  type CodeBlockProps = Omit<BaseProps, 'className' | 'language' | 'title'>;

  export interface Props
    extends Omit<ProviderProps<any>, 'children' | 'code'> {
    inline?: boolean;
    children: string;
    className?: string;
    editorClassName?: string;
    previewClassName?: string;
    errorClassName?: string;
    codeFirst?: boolean;
    prismTheme?: any;
    editor?: 'show' | 'hide' | 'collapse';
  }

  export default function Playground(props: Props): JSX.Element;
}

declare module '@theme/CodeLiveScope' {
  type Scope = {
    [key: string]: unknown;
  };

  const CodeLiveScope: Scope;
  export default CodeLiveScope;
}
