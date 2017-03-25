import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import getParser from './parsers';

const unchanged = 0;
const changed = 1;
const added = 2;
const deleted = 3;
const object = 4;

const createMessage = (diff) => {
  const processValue = (value) => {
    const condition = _.isObject(value);
    return condition ? createMessage(value) : value;
  };

  const newArr = diff.reduce((acc, item) => {
    if (item.status === changed) {
      const afterValue = processValue(item.afterValue);
      const beforeValue = processValue(item.beforeValue);

      return [...acc,
        { key: `+ ${item.key}`, value: afterValue },
        { key: `- ${item.key}`, value: beforeValue },
      ];
    }

    const value = processValue(item.value);

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

const toString = (diff) => {
  const message = createMessage(diff);
  const result = JSON.stringify(message, null, '\t');
  return result.replace(/"|,/gi, '');
};

const createPlainMessage = (diff) => {
  const modifyArr = (arr) => {
    const result = arr.map((item) => {
      const value = item.value;
      if (value instanceof Array) {
        const newItems = value.map((info) => {
          const newKey = `${item.key}.${info.key}`;
          if (info.status === changed) {
            return {
              key: newKey,
              status: info.status,
              beforeValue: info.beforeValue,
              afterValue: info.afterValue,
            };
          }

          return {
            key: newKey,
            status: info.status,
            value: info.value,
          };
        });

        const processedItems = modifyArr(newItems);
        return [item, ...processedItems];
      }

      return item;
    });
    return result;
  };
  const modifiedDiff = modifyArr(diff);

  const iter = (acc, item) => {
    if (item instanceof Array) {
      const newAcc = item.reduce(iter, acc);
      return newAcc;
    }
    const getInfoAboutValue = (value) => {
      const condition = value instanceof Object;
      return condition ? 'complex value' : `value: '${item.value}'`;
    };

    switch (item.status) {
      case object:
      case unchanged:
        return acc;
      case changed:
        return [...acc, {
          name: item.key,
          status: `updated. From '${item.beforeValue}' to '${item.afterValue}'`,
        }];
      case added:
        return [...acc, {
          name: item.key,
          status: `added with ${getInfoAboutValue(item.value)}`,
        }];
      case deleted:
        return [...acc, {
          name: item.key,
          status: 'removed',
        }];
      default :
        throw new Error(`Unknown status '${item.status}'`);
    }
  };
  const arr = modifiedDiff.reduce(iter, []);
  const result = arr
    .map(item => `Property '${item.name}' was ${item.status}`)
    .join('\n');
  return result;
};

const toPlainString = (diff) => {
  const message = createPlainMessage(diff);
  return message;
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
      const condition = _.isObject(value);
      return condition ? iter(value) : value;
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

export default (path1, path2, keys = {}) => {
  const extname1 = path.extname(path1);
  const extname2 = path.extname(path2);
  const parser1 = getParser(extname1);
  const parser2 = getParser(extname2);
  const data1 = fs.readFileSync(path1, 'utf8');
  const data2 = fs.readFileSync(path2, 'utf8');
  const obj1 = parser1.parse(data1);
  const obj2 = parser2.parse(data2);
  const result = compareTwoConfigurations(obj1, obj2);
  const format = (str) => {
    switch (keys.format) {
      case 'plain':
        return toPlainString(str);
      default:
        return toString(str);
    }
  };
  return format(result);
};
