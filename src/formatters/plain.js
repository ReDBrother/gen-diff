import { unchanged, changed, added, deleted, object } from '..';

const createMessage = (diff) => {
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

const toString = (diff) => {
  const message = createMessage(diff);
  return message;
};

export default toString;
