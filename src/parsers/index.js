import json from './json-parser';
import yaml from './yaml-parser';
import ini from './ini-parser';

const EXTENSIONS = {
  json: { parser: json, items: ['json'] },
  yaml: { parser: yaml, items: ['yml', 'yaml'] },
  ini: { parser: ini, items: ['ini'] },
};

export default (path) => {
  const keys = Object.keys(EXTENSIONS);
  const findParser = ([key, ...rest]) => {
    if (key === undefined) {
      throw new Error(`There is no parser for this '${path}' file`);
    }

    const items = EXTENSIONS[key].items;
    const findMatch = items.filter(item => path.endsWith(item));
    return findMatch.length !== 0 ? EXTENSIONS[key].parser : findParser(rest);
  };

  return findParser(keys);
};
