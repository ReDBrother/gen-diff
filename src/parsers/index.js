import json from './json-parser';
import yaml from './yaml-parser';
import ini from './ini-parser';

const extentions = {
  json: { parser: json, items: ['.json'] },
  yaml: { parser: yaml, items: ['.yml', '.yaml'] },
  ini: { parser: ini, items: ['.ini'] },
};

export default (extension) => {
  const keys = Object.keys(extentions);
  const findParser = ([key, ...rest]) => {
    if (key === undefined) {
      throw new Error(`There is no parser for this '${extension}' extension`);
    }

    const items = extentions[key].items;
    const findMatch = items.find(item => extension === item);
    return findMatch ? extentions[key].parser : findParser(rest);
  };

  return findParser(keys);
};
