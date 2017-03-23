import _ from 'lodash';
import fs from 'fs';
import yaml from 'js-yaml';
import ini from 'ini';

const Extentions = {
  JSON: { parser: JSON.parse, items: ['json'] },
  YAML: { parser: yaml.safeLoad, items: ['yml', 'yaml'] },
  INI: { parser: ini.parse, items: ['ini'] },
};

const Statuses = {
  UNCHANGED: 'unchanged',
  CHANGED: 'changed',
  ADDED: 'added',
  DELETED: 'deleted',
};

const createMessage = (key, info) => {
  switch (info.status) {
    case Statuses.UNCHANGED:
      return `  ${key}: ${info.value}`;
    case Statuses.CHANGED:
      return `+ ${key}: ${info.afterValue}\n- ${key}: ${info.beforeValue}`;
    case Statuses.ADDED:
      return `+ ${key}: ${info.value}`;
    case Statuses.DELETED:
      return `- ${key}: ${info.value}`;
    default:
      throw new Error(`Unknown status '${info.status}'`);
  }
};

const toString = (obj) => {
  const keys = _.keys(obj);
  const arr = keys.map((key) => {
    const message = createMessage(key, obj[key]);
    return message;
  });
  const str = _.join(arr, '\n');

  return `{\n${str}\n}`;
};

const matching = (before, after) => {
  const first = _.transform(before, (acc, value, key) => {
    const newAcc = acc;
    if (after[key] === value) {
      newAcc[key] = {
        status: Statuses.UNCHANGED,
        value,
      };
    } else if (_.has(after, key)) {
      newAcc[key] = {
        status: Statuses.CHANGED,
        beforeValue: value,
        afterValue: after[key],
      };
    } else {
      newAcc[key] = {
        status: Statuses.DELETED,
        value,
      };
    }
  }, {});
  const result = _.transform(after, (acc, value, key) => {
    const newAcc = acc;
    if (!_.has(before, key)) {
      newAcc[key] = {
        status: Statuses.ADDED,
        value,
      };
    }
  }, first);

  return toString(result);
};

const parse = (path1, path2) => {
  const extention1 = path1.split('.').pop();
  const keys = _.keys(Extentions);
  const findParser = ([key, ...rest]) => {
    if (key === undefined) {
      throw new Error(`'${extention1}' file extention not support in this version`);
    }

    const items = Extentions[key].items;
    return _.indexOf(items, extention1) !== -1 ? Extentions[key].parser : findParser(rest);
  };

  const parser = findParser(keys);

  const data1 = fs.readFileSync(path1, 'utf8');
  const data2 = fs.readFileSync(path2, 'utf8');
  const obj1 = parser(data1);
  const obj2 = parser(data2);
  return { obj1, obj2 };
};

export default (path1, path2) => {
  const { obj1, obj2 } = parse(path1, path2);
  return matching(obj1, obj2);
};
