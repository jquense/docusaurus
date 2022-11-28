import type { ImportResolver } from 'jarle';
import React from 'react';

export const allValues = (obj: Record<string, Promise<any>>) => {
  const keys = Object.keys(obj);
  return Promise.all(keys.map((k) => obj[k])).then((values) => {
    const next: Record<string, any> = {};
    keys.forEach((k, i) => {
      next[k] = values[i];
    });
    return next;
  });
};

export const Context = React.createContext<ImportResolver | null>(null);

export default ({
  imports,
  children,
}: {
  imports?: ImportResolver;
  children: React.ReactNode;
}) => <Context.Provider value={imports || null}>{children}</Context.Provider>;
