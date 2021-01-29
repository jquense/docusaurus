const DOCLET_PATTERN = /^@(\w+)(?:$|\s((?:[^](?!^@\w))*))/gim;

export function cleanDocletValue(str: string) {
  return str.trim().replace(/^\{/, '').replace(/\}$/, '');
}

const isLiteral = (str: string) => /^('|"|true|false|\d+)/.test(str.trim());

/**
 * Remove doclets from string
 */
const cleanTags = (desc: string) => {
  desc = desc || ``;
  const idx = desc.search(DOCLET_PATTERN);
  return (idx === -1 ? desc : desc.substr(0, idx)).trim();
};

/**
 * Given a string, this function returns an array of doclet tags
 *
 * Adapted from https://github.com/reactjs/react-docgen/blob/ee8a5359c478b33a6954f4546637312764798d6b/src/utils/docblock.js#L62
 * Updated to strip \r from the end of doclets
 */
const getTags = (str: string) => {
  const doclets = [];
  let match = DOCLET_PATTERN.exec(str);
  let val;

  for (; match; match = DOCLET_PATTERN.exec(str)) {
    val = match[2] ? match[2].replace(/\r$/, ``) : true;
    const key = match[1];
    doclets.push({ name: key, value: val });
  }
  return doclets;
};

const parseTags = (description = '') => {
  return getTags(description) || [];
};

function parseType(type: any) {
  if (!type) {
    return undefined;
  }

  const { name, raw } = type;

  if (name === `union`) {
    return {
      name,
      value: raw.split(`|`).map((v: string) => {
        return { name: v.trim() };
      }),
    };
  }

  if (name === `enum`) {
    return { ...type };
  }

  if (raw) {
    return {
      name: raw,
    };
  }

  return { ...type };
}

/**
 * Reads the JSDoc "doclets" and applies certain ones to the prop type data
 * This allows us to "fix" parsing errors, or unparsable data with JSDoc
 * style comments
 */
const applyPropTags = (prop: any) => {
  prop.tags.forEach(({ name, value }: any) => {
    // the @type doclet to provide a prop type
    // Also allows enums (oneOf) if string literals are provided
    // ex: @type {("optionA"|"optionB")}
    if (name === `type`) {
      value = cleanDocletValue(value);

      if (prop.type === undefined) {
        prop.type = {};
      }

      prop.type.name = value;

      if (value[0] === `(`) {
        value = value
          .substring(1, value.length - 1)
          .split(`|`)
          .map((v: string) => v.trim());
        const typeName = value.every(isLiteral) ? `enum` : `union`;
        prop.type.name = typeName;
        prop.type.value = value.map((v: string) =>
          typeName === `enum`
            ? { value: v, computed: false }
            : { name: value },
        );
      }
      return;
    }

    // Use @required to mark a prop as required
    // useful for custom propTypes where there isn't a `.isRequired` addon
    if (name === `required` && value) {
      prop.required = true;
      return;
    }

    // Use @defaultValue to provide a prop's default value
    if ((name === `default` || name === `defaultValue`) && value != null) {
      prop.defaultValue = { value, computed: false };
    }
  });

  // lookup for tsTypes or flowTypes
  if (prop.type === undefined) {
    prop.type = parseType(prop.tsType) || parseType(prop.flowType);
  }

  return prop;
};

export { cleanTags, parseTags, applyPropTags };
