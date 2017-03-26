import _ from 'lodash';
import { unchanged, changed, added, deleted, object } from '..';

const createMessage = (diff) => {
  const processValue = (value) => {
    const condition = _.isObject(value);
    return condition ? createMessage(value) : value;
  };

  const newArr = diff.reduce((acc, item) => {
    const afterValue = processValue(item.afterValue);
    const beforeValue = processValue(item.beforeValue);

    switch (item.type) {
      case unchanged:
      case object:
        return [...acc, { key: `  ${item.key}`, value: beforeValue }];
      case changed:
        return [...acc,
          { key: `+ ${item.key}`, value: afterValue },
          { key: `- ${item.key}`, value: beforeValue },
        ];
      case added:
        return [...acc, { key: `+ ${item.key}`, value: afterValue }];
      case deleted:
        return [...acc, { key: `- ${item.key}`, value: beforeValue }];
      default :
        throw new Error(`Unknown type '${item.type}'`);
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
