import jsonParser from './json-parser';
import yamlParser from './yaml-parser';
import iniParser from './ini-parser';

const parsers = {
  json: jsonParser,
  yaml: yamlParser,
  yml: yamlParser,
  ini: iniParser,
};

export default (extName) => {
  const parser = parsers[extName];
  if (parser) {
    return parser;
  }

  throw new Error(`There is no parser for this '${extName}' extension`);
};
