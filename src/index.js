import _ from 'lodash';
import fs from 'fs';

const UNCHANGED = 'unchanhed';
const CHANGED = 'changed';
const ADDED = 'added';
const DELETED = 'deleted';

const createMessage = (key, info) => {
  switch (info.status) {
    case UNCHANGED:
      return `  ${key}: ${info.value}`;
    case CHANGED:
      return `+ ${key}: ${info.after}\n- ${key}: ${info.before}`;
    case ADDED:
      return `+ ${key}: ${info.value}`;
    case DELETED:
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
        status: UNCHANGED,
        value,
      };
    } else if (_.has(after, key)) {
      newAcc[key] = {
        status: CHANGED,
        before: value,
        after: after[key],
      };
    } else {
      newAcc[key] = {
        status: DELETED,
        value,
      };
    }
  }, {});
  const result = _.transform(after, (acc, value, key) => {
    const newAcc = acc;
    if (!_.has(before, key)) {
      newAcc[key] = {
        status: ADDED,
        value,
      };
    }
  }, first);

  return toString(result);
};

export default (path1, path2) => {
  const data1 = fs.readFileSync(path1, 'utf8');
  const data2 = fs.readFileSync(path2, 'utf8');
  return matching(JSON.parse(data1), JSON.parse(data2));
};
