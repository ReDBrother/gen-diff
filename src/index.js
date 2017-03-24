import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import getParser from './parsers';

const unchanged = 0;
const changed = 1;
const added = 2;
const deleted = 3;
const object = 4;

const createMessage = (arr) => {
  const modifyValue = (value) => {
    const predicate = _.isObject(value);
    return predicate ? createMessage(value) : value;
  };

  const newArr = arr.reduce((acc, item) => {
    if (item.status === changed) {
      const afterValue = modifyValue(item.afterValue);
      const beforeValue = modifyValue(item.beforeValue);

      return [...acc,
        { key: `+ ${item.key}`, value: afterValue },
        { key: `- ${item.key}`, value: beforeValue },
      ];
    }

    const value = modifyValue(item.value);

    switch (item.status) {
      case unchanged:
      case object:
        return [...acc, { key: `  ${item.key}`, value }];
      case added:
        return [...acc, { key: `+ ${item.key}`, value }];
      case deleted:
        return [...acc, { key: `- ${item.key}`, value }];
      default :
        throw new Error(`Unknown status '${item.status}'`);
    }
  }, []);

  const obj = _.keyBy(newArr, 'key');
  const result = _.mapValues(obj, info => info.value);
  return result;
};

const toString = (arr) => {
  const message = createMessage(arr);
  const result = JSON.stringify(message, null, '\t');
  return result.replace(/"|,/gi, '');
};

const compareTwoConfigurations = (firstConfig, secondConfig) => {
  const keys = _.union(Object.keys(firstConfig), Object.keys(secondConfig));
  const result = keys.map((key) => {
    const beforeValue = firstConfig[key];
    const afterValue = secondConfig[key];

    if (beforeValue instanceof Object && afterValue instanceof Object) {
      return {
        key,
        status: unchanged,
        value: compareTwoConfigurations(beforeValue, afterValue),
      };
    } else if (beforeValue === afterValue) {
      return {
        key,
        status: unchanged,
        value: beforeValue,
      };
    } else if (_.has(firstConfig, key) && _.has(secondConfig, key)) {
      return {
        key,
        status: changed,
        afterValue,
        beforeValue,
      };
    }

    const iter = (obj) => {
      const keysObj = Object.keys(obj);
      return keysObj.map((item) => {
        if (item instanceof Object) {
          return iter(item);
        }

        return {
          key: item,
          status: object,
          value: obj[item],
        };
      });
    };
    const processValue = (value) => {
      const predicate = _.isObject(value);
      return predicate ? iter(value) : value;
    };

    if (!_.has(firstConfig, key)) {
      return {
        key,
        status: added,
        value: processValue(afterValue),
      };
    }

    return {
      key,
      status: deleted,
      value: processValue(beforeValue),
    };
  });

  return result;
};

export default (path1, path2) => {
  const extname1 = path.extname(path1);
  const extname2 = path.extname(path2);
  const parser1 = getParser(extname1);
  const parser2 = getParser(extname2);
  const data1 = fs.readFileSync(path1, 'utf8');
  const data2 = fs.readFileSync(path2, 'utf8');
  const obj1 = parser1.parse(data1);
  const obj2 = parser2.parse(data2);
  const result = compareTwoConfigurations(obj1, obj2);
  return toString(result);
};
