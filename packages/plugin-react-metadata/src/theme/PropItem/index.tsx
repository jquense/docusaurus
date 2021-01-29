import React from 'react';

import { Prop } from '../../types';

function PropItem(p: {
  prop: Prop;
  children?: React.ReactNode;
  heading: React.ReactElement;
  description: React.ReactElement;
  typeDef: React.ReactElement;
  defaultValue?: React.ReactElement;
}) {
  return (
    <>
      {p.heading}

      {p.description}
      {p.children}
      <div>
        <div>
          <strong>type:</strong> {p.typeDef}
        </div>
        {p.defaultValue && (
          <div className="margin-top--sm">
            <strong>default:</strong>
            {p.defaultValue}
          </div>
        )}
      </div>
    </>
  );
}

export default PropItem;
