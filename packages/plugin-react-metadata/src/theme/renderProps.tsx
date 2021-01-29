import sortBy from 'lodash/sortBy';
import React from 'react';

import DefaultValue from './DefaultPropValue';
import PropTypeValue from './PropTypeValue';
import TypescriptTypeValue, { TokenMap } from './TypescriptTypeValue';
import { Prop } from '../types';
import { docletsToMap, getTypeName } from '../utils';

const isElementType = (
  name: string | undefined,
  types: Array<string | RegExp>,
) => {
  return types.some((t) => {
    if (typeof t === 'string') return t === name;
    return !!name?.match(t);
  });
};

export interface RenderPropsOptions {
  tokenMap?: TokenMap;
  elementTypes?: Array<string | RegExp>;
}

export default function renderProps(
  propsData: Prop[],
  {
    tokenMap,
    elementTypes = ['elementType', /React\.ComponentType(<.*>)?/],
  }: RenderPropsOptions = {},
) {
  return sortBy(propsData, 'name')
    .filter(
      (prop) =>
        !prop.tags.find((d) => d.name === 'private' || d.name === 'ignore'),
    )
    .map((propData) => {
      const { name, type, defaultValue, description, tags, tsType } = propData;

      const docletMap = docletsToMap(tags);
      const typeName = getTypeName(propData);

      const descJsx =
        typeof description === 'function' ? (
          React.createElement(description)
        ) : (
          <p>{description || ''}</p>
        );

      let renderedType = null;
      if (tsType)
        renderedType = (
          <TypescriptTypeValue type={tsType} tags={tags} tokens={tokenMap} />
        );
      else if (type)
        renderedType = (
          <PropTypeValue type={type} tags={tags} tokens={tokenMap} />
        );

      return {
        name,
        tags,
        typeName,
        description: descJsx,
        deprecated: docletMap.get('deprecated'),
        type: renderedType,
        defaultValue: defaultValue && (
          <DefaultValue
            {...defaultValue}
            isElementType={isElementType(typeName, elementTypes)}
          />
        ),
        propData,
      };
    });
}
