// @ts-ignore
import BrowserOnly from '@docusaurus/BrowserOnly';
import clsx from 'clsx';
import { Editor, Error, InfoMessage, Preview, Provider } from 'jarle';
import * as React from 'react';

import styles from './styles.module.css';

const Info = (props: any) => (
  <InfoMessage
    {...props}
    className={clsx(props.className, styles.infoMessage)}
  />
);

export interface Props
  extends Omit<React.ComponentProps<typeof Provider>, 'children' | 'code'> {
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

const Playground = React.forwardRef(
  (
    {
      children,
      inline = false,
      className,
      editorClassName,
      previewClassName,
      errorClassName,
      codeFirst = false,
      prismTheme,
      editor: editorConfig = 'show',
      ...props
    }: Props,
    ref: React.Ref<HTMLDivElement>,
  ) => {
    const [showEditor, setShowEditor] = React.useState(
      editorConfig === 'show',
    );

    const showButton = editorConfig === 'collapse' && (
      <div>
        <button
          className={styles.playgroundButton}
          onClick={() => setShowEditor((prev) => !prev)}
        >
          {showEditor ? 'Hide' : 'Show'} Code
        </button>
      </div>
    );

    const editor = showEditor && (
      <Editor
        infoComponent={Info}
        className={clsx(editorClassName, styles.playgroundEditor)}
      />
    );
    const preview = (
      <BrowserOnly fallback={<div>Loading…</div>}>
        {() => (
          <div className={clsx(previewClassName, styles.playgroundPreview)}>
            <Preview />
            <Error className={clsx(errorClassName, styles.error)} />
          </div>
        )}
      </BrowserOnly>
    );

    return (
      <>
        <div
          ref={ref}
          className={clsx(
            className,
            styles.playground,
            inline && styles.inline,
          )}
        >
          <Provider
            code={children.replace(/\n$/, '')}
            theme={prismTheme}
            {...props}
          >
            {!codeFirst ? (
              <>
                {preview}
                {editor}
              </>
            ) : (
              <>
                {editor}
                {preview}
              </>
            )}
          </Provider>
        </div>
        {showButton}
      </>
    );
  },
);

Playground.displayName = 'Playground';

export default Playground;
