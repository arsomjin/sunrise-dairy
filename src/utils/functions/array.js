import namor from 'namor';
import { Numb, showWarn } from './common';

export const arrayForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

export const chunkArray = (array, chunkLength) => {
  if (!(Array.isArray(array) && chunkLength > 0)) {
    return showWarn('Input Error at chankArray function!');
  }
  let cArray = [];
  while (array.length > 0) {
    let chunk = array.splice(0, chunkLength);
    cArray.push(chunk);
  }
  return cArray;
};

export const distinctArr = (arrItems, distinctKeys, sumKeys) => {
  // arrItems: Array, distinctKeys: Array, sumKeys: Array
  let arr = JSON.parse(JSON.stringify(arrItems)); // deep copy array.
  if (arr.length === 0) return [];
  let result = [];
  arr.reduce((res, elem) => {
    let gk = '';
    // eslint-disable-next-line array-callback-return
    distinctKeys.map((k) => {
      if (typeof elem[k] !== 'undefined') {
        gk = gk.concat(`${elem[k]}/`);
      }
    });
    if (!res[gk]) {
      if (typeof sumKeys !== 'undefined') {
        sumKeys.map((sk) => {
          elem[sk] = Numb(elem[sk]);
          return sk;
        });
      }
      res[gk] = elem;
      result.push(res[gk]);
    } else {
      if (typeof sumKeys !== 'undefined') {
        sumKeys.map((sk) => {
          res[gk][sk] += Numb(elem[sk]);
          return sk;
        });
      }
    }
    return res;
  }, {});
  return result;
};

export const distinctElement = (arrayOfElements) => {
  const uniqueArray = [...new Set(arrayOfElements)];
  let result = uniqueArray.map((elem, i) => ({
    name: elem,
    count: arrayOfElements.filter((l) => l === elem).length,
  }));
  return result;
};

export const arrayMin = (arrayOfElements) => {
  return arrayOfElements.reduce(function (p, v) {
    return p < v ? p : v;
  });
};

export const arrayMax = (arrayOfElements) => {
  return arrayOfElements.reduce(function (p, v) {
    return p > v ? p : v;
  });
};

export const sortArr = (arrItems, sortKey) => {
  let arr = JSON.parse(JSON.stringify(arrItems)); // deep copy array.
  if (arr.length === 0) {
    return [];
  }
  let sArr = arr;
  let dir = 1;
  if (sortKey[0] === '-') {
    dir = -1;
    sortKey = sortKey.substring(1);
  }
  sArr = arr.sort((a, b) => {
    return a[sortKey] > b[sortKey] ? dir : a[sortKey] < b[sortKey] ? -dir : 0;
  });
  return sArr;
};

export const sortArrByMultiKeys = (arrItems, sortKeys) => {
  // showLog('arrItems', arrItems);
  if (!(!!arrItems && Array.isArray(arrItems) && Array.isArray(sortKeys))) {
    return arrItems;
  }
  let arr = JSON.parse(JSON.stringify(arrItems)); // deep copy array.
  if (arr.length === 0) {
    return [];
  }
  // eslint-disable-next-line array-callback-return
  const result = arr.sort((a, b) => {
    (sortKeys || [])
      .map((o) => {
        if (!o || !(!!a[o] || !!b[o])) {
          return 1;
        }
        let dir = 1;
        if (o[0] === '-') {
          dir = -1;
          o = o.substring(1);
        }
        return a[o] > b[o] ? dir : a[o] < b[o] ? -dir : 0;
      })
      .reduce((p, n) => (p ? p : n), 0);
  });
  return result;
};

export const searchArr = (arrItems, search, keys) => {
  if (!Array.isArray(arrItems)) {
    return [];
  }
  if (arrItems && arrItems.length > 0) {
    const arr = JSON.parse(JSON.stringify(arrItems));
    const result = arr.filter((item) =>
      keys.some((key) =>
        String(item[key]).toLowerCase().includes(search.toLowerCase())
      )
    );
    return result;
  }
  return [];
};

export const insertArr = (arr, index, insertItems) => {
  if (!arr || !Array.isArray(arr) || !insertItems) {
    return arr;
  }
  if (typeof index !== 'number') {
    return arr;
  }
  return [
    // part of the array before the specified index
    ...arr.slice(0, index),
    // inserted items array
    ...insertItems,
    // part of the array after the specified index
    ...arr.slice(index),
  ];
};

export const range = (len) => {
  const arr = [];
  for (let i = 0; i < len; i++) {
    arr.push(i);
  }
  return arr;
};

const newPerson = () => {
  const statusChance = Math.random();
  return {
    firstName: namor.generate({ words: 1, numbers: 0 }),
    lastName: namor.generate({ words: 1, numbers: 0 }),
    age: Math.floor(Math.random() * 30),
    visits: Math.floor(Math.random() * 100),
    progress: Math.floor(Math.random() * 100),
    status:
      statusChance > 0.66
        ? 'relationship'
        : statusChance > 0.33
        ? 'complicated'
        : 'single',
  };
};

export function makeData(...lens) {
  const makeDataLevel = (depth = 0) => {
    const len = lens[depth];
    return range(len).map((d) => {
      return {
        ...newPerson(),
        subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
      };
    });
  };

  return makeDataLevel();
}
