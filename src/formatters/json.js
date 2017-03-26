import { unchanged, changed, added, deleted, object } from '..';

const createMessage = (diff) => {
  const iter = (acc, item) => {
    const processValue = (value) => {
      const condition = value instanceof Array;
      return condition ? createMessage(value) : value;
    };

    switch (item.status) {
      case object:
      case unchanged:
        return { ...acc, [item.key]: processValue(item.value) };
      case changed:
        return { ...acc,
          [item.key]: {
            [added]: processValue(item.afterValue),
            [deleted]: processValue(item.beforeValue),
          },
        };
      case added:
      case deleted:
        return { ...acc,
          [item.key]: {
            [item.status]: processValue(item.value),
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
