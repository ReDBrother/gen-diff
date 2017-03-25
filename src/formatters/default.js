import _ from 'lodash';
import { unchanged, changed, added, deleted, object } from '..';

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

export default toString;
