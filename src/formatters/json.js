import { unchanged, changed, added, deleted, object } from '..';

const createMessage = (diff) => {
  const iter = (acc, item) => {
    const processValue = (value) => {
      const condition = value instanceof Array;
      return condition ? createMessage(value) : value;
    };

    const beforeValue = processValue(item.beforeValue);
    const afterValue = processValue(item.afterValue);

    switch (item.type) {
      case object:
      case unchanged:
        return { ...acc, [item.key]: beforeValue };
      case changed:
        return { ...acc,
          [item.key]: {
            [added]: afterValue,
            [deleted]: beforeValue,
          },
        };
      case added:
        return { ...acc,
          [item.key]: {
            [added]: afterValue,
          },
        };
      case deleted:
        return { ...acc,
          [item.key]: {
            [deleted]: beforeValue,
          },
        };
      default:
        throw new Error(`Unknown status '${item.type}'`);
    }
  };

  const result = diff.reduce(iter, {});
  return result;
};

const toString = (diff) => {
  const message = createMessage(diff);
  const result = JSON.stringify(message, null, '\t');
  return result;
};

export default toString;
