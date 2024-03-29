import React, { ReactNode } from 'react';
import { cleanDocletValue } from './doclets';

import { CustomPropType, Doclet, Prop } from './types';

export function docletsToMap(doclets: Doclet[]) {
  return new Map(doclets.map(({ name, value }) => [name, value]));
}

export function getDoclet(doclets: Doclet[] = [], name: string) {
  const doc = doclets.find((d) => d.name === name);
  return doc && doc.value;
}

export function getDisplayTypeName(typeName?: string) {
  if (typeName === 'func') return 'function';
  if (typeName === 'bool') return 'boolean';

  return typeName;
}

export function getTypeName(prop: Prop) {
  const { type } = prop;
  const name = getDisplayTypeName(type?.name);

  if (name === 'custom')
    return cleanDocletValue(
      getDoclet(prop.tags, 'type') || (type as CustomPropType).raw,
    );

  return name;
}

export function joinElements<T>(
  arr: Array<T>,
  delim: ReactNode,
  fn: (item: T, idx: number) => ReactNode,
) {
  return arr.reduce((acc, val, idx, list) => {
    let item = fn(val, idx);
    if (React.isValidElement(item)) {
      // eslint-disable-next-line react/no-array-index-key
      item = React.cloneElement(item, { key: idx });
    }

    // eslint-disable-next-line no-param-reassign
    acc = acc.concat(item);

    return idx === list.length - 1 ? acc : acc.concat(delim);
  }, [] as ReactNode[]);
}
