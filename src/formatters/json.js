import { unchanged, changed, added, deleted, object } from '..';

const createMessage = (diff) => {
  const iter = (acc, item) => {
    const processValue = (value) => {
      const condition = value instanceof Array;
      return condition ? createMessage(value) : value;
    };

    switch (item.type) {
      case object:
      case unchanged:
        return { ...acc, [item.key]: processValue(item.beforeValue) };
      case changed:
        return { ...acc,
          [item.key]: {
            [added]: processValue(item.afterValue),
            [deleted]: processValue(item.beforeValue),
          },
        };
      case added:
        return { ...acc,
          [item.key]: {
            [added]: processValue(item.afterValue),
          },
        };
      case deleted:
        return { ...acc,
          [item.key]: {
            [deleted]: processValue(item.beforeValue),
          },
        };
      default:
        throw new Error(`Unknown status '${item.status}'`);
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
