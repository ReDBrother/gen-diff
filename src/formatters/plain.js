import { unchanged, changed, added, deleted, object } from '..';

const createMessage = (diff) => {
  const modifyArr = (arr) => {
    const result = arr.map((item) => {
      const iter = (array) => {
        const newItems = array.map((info) => {
          const newKey = `${item.key}.${info.key}`;
          return {
            key: newKey,
            type: info.type,
            beforeValue: info.beforeValue,
            afterValue: info.afterValue,
          };
        });

        const processedItems = modifyArr(newItems);
        return [item, ...processedItems];
      };

      if (item.beforeValue instanceof Array) {
        return iter(item.beforeValue);
      } else if (item.afterValue instanceof Array) {
        return iter(item.afterValue);
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
      return condition ? 'complex value' : `value: '${value}'`;
    };

    switch (item.type) {
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
          status: `added with ${getInfoAboutValue(item.afterValue)}`,
        }];
      case deleted:
        return [...acc, {
          name: item.key,
          status: 'removed',
        }];
      default :
        throw new Error(`Unknown type '${item.type}'`);
    }
  };
  const arr = modifiedDiff.reduce(iter, []);
  const result = arr
    .map(item => `Property '${item.name}' was ${item.status}`)
    .join('\n');
  return result;
};

const toString = (diff) => {
  const message = createMessage(diff);
  return message;
};

export default toString;
