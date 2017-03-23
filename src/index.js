import _ from 'lodash';
import fs from 'fs';

const toString = (arr) => {
  const str = _.join(arr, '\n');
  return `{\n${str}\n}`;
};

const matching = (before, after) => {
  const first = _.transform(before, (acc, value, key) => {
    const newAcc = acc;
    if (after[key] === value) {
      newAcc.push(`  ${key}: ${value}`);
      return newAcc;
    } else if (_.has(after, key)) {
      newAcc.push(`+ ${key}: ${after[key]}`);
    }
    newAcc.push(`- ${key}: ${value}`);

    return newAcc;
  }, []);

  const result = _.transform(after, (acc, value, key) => {
    const newAcc = acc;
    if (!_.has(before, key)) {
      newAcc.push(`+ ${key}: ${value}`);
    }
    return newAcc;
  }, first);

  return toString(result);
};

export default (path1, path2) => {
  const data1 = fs.readFileSync(path1, 'utf8');
  const data2 = fs.readFileSync(path2, 'utf8');
  return matching(JSON.parse(data1), JSON.parse(data2));
};
