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
      ...props
    }: Props,
    ref: React.Ref<HTMLDivElement>,
  ) => {
    const editor = (
      <Editor
        infoComponent={Info}
        className={clsx(editorClassName, styles.playgroundEditor)}
      />
    );
    const preview = (
      <div className={clsx(previewClassName, styles.playgroundPreview)}>
        <Preview />
        <Error className={clsx(errorClassName, styles.error)} />
      </div>
    );
    return (
      <div
        ref={ref}
        className={clsx(className, styles.playground, inline && styles.inline)}
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
    );
  },
);

Playground.displayName = 'Playground';

export default Playground;
