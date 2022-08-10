// @ts-ignore
import Heading from '@theme/Heading';
// @ts-ignore
import PropItem from '@theme/PropItem';
// @ts-ignore
import renderProps from '@theme/renderProps';
import React from 'react';

import { Prop } from '../../types';

import styles from './styles.module.css';

export interface Metadata {
  name?: string;
  description?: React.ReactNode;
  props: Prop[];
}

function PropsTable(p: { props?: Prop[]; headingLevel?: string }) {
  const props = renderProps(p.props || [], { tokenMap: styles });

  return (
    <>
      {props.map((prop: any) => (
        <PropItem
          prop={prop}
          key={prop.name}
          heading={
            <Heading as={`h${p.headingLevel || '3'}`} id={prop.name}>
              <span>{prop.name}</span>
              {prop.propData.required && (
                <strong className={styles.required}>required</strong>
              )}
            </Heading>
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
