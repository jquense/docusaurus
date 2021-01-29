import React from 'react';
import renderProps from '@theme/renderProps';
import Heading from '@theme/Heading';
import PropItem from '@theme/PropItem';

import styles from './styles.module.css';
import { Prop } from '../../types';

export interface Metadata {
  name?: string;
  description?: React.ReactNode;
  props: Prop[];
}

function PropsTable(p: { props?: Prop[]; headingLevel?: string }) {
  const props = renderProps(p.props || [], { tokenMap: styles });
  const H = React.useMemo(() => Heading(`h${p.headingLevel || '3'}`), [
    p.headingLevel,
  ]);

  return (
    <>
      {props.map((prop: any) => (
        <PropItem
          prop={prop}
          key={prop.name}
          heading={
            <H id={prop.name}>
              <span>{prop.name}</span>
              {prop.propData.required && (
                <strong className={styles.required}>required</strong>
              )}
            </H>
          }
          description={prop.description}
          typeDef={<span className={styles.typeDef}>{prop.type}</span>}
          defaultValue={
            prop.defaultValue ? <code>{prop.defaultValue}</code> : null
          }
        />
      ))}
    </>
  );
}

export default PropsTable;
