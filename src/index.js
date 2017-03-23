import _ from 'lodash';
import fs from 'fs';
import getParser from './parsers';

const UNCHANGED = 0;
const CHANGED = 1;
const ADDED = 2;
const DELETED = 3;

const createMessage = (info) => {
  switch (info.status) {
    case UNCHANGED:
      return `  ${info.key}: ${info.value}`;
    case CHANGED:
      return `+ ${info.key}: ${info.afterValue}\n- ${info.key}: ${info.beforeValue}`;
    case ADDED:
      return `+ ${info.key}: ${info.value}`;
    case DELETED:
      return `- ${info.key}: ${info.value}`;
    default:
      throw new Error(`Unknown status '${info.status}'`);
  }
};

const toString = (arr) => {
  const newArr = arr.map((item) => {
    const message = createMessage(item);
    return message;
  });
  const str = newArr.join('\n');

  return `{\n${str}\n}`;
};

const compareTwoConfigurations = (firstConfig, secondConfig) => {
  const keysOfFirstConfig = Object.keys(firstConfig);
  const first = keysOfFirstConfig.reduce((acc, key) => {
    if (firstConfig[key] === secondConfig[key]) {
      return [...acc, {
        key,
        status: UNCHANGED,
        value: firstConfig[key],
      }];
    } else if (_.has(secondConfig, key)) {
      return [...acc, {
        key,
        status: CHANGED,
        beforeValue: firstConfig[key],
        afterValue: secondConfig[key],
      }];
    }

    return [...acc, {
      key,
      status: DELETED,
      value: firstConfig[key],
    }];
  }, []);
  const keysOfSecondConfig = Object.keys(secondConfig);
  const result = keysOfSecondConfig.reduce((acc, key) => {
    if (!_.has(firstConfig, key)) {
      return [...acc, {
        key,
        status: ADDED,
        value: secondConfig[key],
      }];
    }

    return acc;
  }, first);

  return result;
};

export default (path1, path2) => {
  const parser1 = getParser(path1);
  const parser2 = getParser(path2);
  const data1 = fs.readFileSync(path1, 'utf8');
  const data2 = fs.readFileSync(path2, 'utf8');
  const obj1 = parser1.parse(data1);
  const obj2 = parser2.parse(data2);
  const result = compareTwoConfigurations(obj1, obj2);
  return toString(result);
};
