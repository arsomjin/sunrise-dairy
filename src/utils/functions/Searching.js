import React from 'react';
import { Tag } from 'antd';
import dayjs from 'dayjs';
import { arrayForEach, distinctArr, sortArr } from './array';
import { isTimeTypeField } from './times';
import { parser, showToBeContinue } from './common';
import { uniq } from 'lodash';

const _ = require('lodash');

export const tagColors = ['blue', 'gold', 'cyan', 'red', 'green'];

export const __DEV__ = process.env.NODE_ENV !== 'production';

const onPreventMouseDown = (event) => {
  event.preventDefault();
  event.stopPropagation();
};

export const tagRender = (props) => {
  const { label, closable, onClose, ...mProps } = props;
  return (
    <Tag
      color={tagColors[Math.floor(Math.random() * 5)]}
      onMouseDown={onPreventMouseDown}
      closable={closable}
      onClose={onClose}
      style={{ marginRight: 3 }}
      {...mProps}
    >
      {label}
    </Tag>
  );
};

export const getEditArr = (editData, users) => {
  let changeArr = sortArr(editData, '-time');
  // showLog('sorted_data', editData);
  let result = changeArr.map((item) => {
    const detail = item.changes ? (
      <div className="d-flex my-2" style={{ flexWrap: 'wrap' }}>
        {item.changes.map((ch, k) => {
          let dCh = { ...ch };
          Object.keys(ch).forEach((k) => {
            // showLog({ k });
            if (isTimeTypeField(k)) {
              // showLog('timeField', k);
              dCh[k] = dayjs(dCh[k]).format('HH:mm');
            }
          });
          return (
            <Tag key={k} closable={false} size="small" className="mx-1">
              {JSON.stringify(dCh).slice(1, JSON.stringify(dCh).length - 1)}
            </Tag>
          );
        })}
      </div>
    ) : (
      'ไม่มีข้อมูล...'
    );

    return {
      time: item.time,
      title: `${users[item.uid]?.firstName || ''}${
        users[item.uid]?.nickName ? `(${users[item.uid]?.nickName || ''})` : ''
      }`,
      detail,
      onClick: () => showToBeContinue(),
    };
  });
  return result;
};

export const createOptionsFromFirestore = async ({
  searchText,
  searchCollection,
  orderBy,
  wheres,
  firestore,
  labels,
}) => {
  try {
    // console.log({ searchText, searchCollection, orderBy, wheres, labels });
    let searchRef = firestore;
    searchCollection.split('/').map((txt, n) => {
      if (n % 2 === 0) {
        searchRef = searchRef.collection(txt);
      } else {
        searchRef = searchRef.doc(txt);
      }
      return txt;
    });
    if (wheres) {
      wheres.map((wh) => {
        // console.log({ wh });
        searchRef = searchRef.where(wh[0], wh[1], wh[2]);
        return wh;
      });
    }
    let dataArr = [];
    let fields = Array.isArray(orderBy) ? orderBy : [orderBy];
    if (labels) {
      fields = fields.concat(labels);
      fields = uniq(fields);
    }

    if (Array.isArray(orderBy)) {
      // search multiple fields.
      await arrayForEach(orderBy, async (field) => {
        const arr = await fetchSearchsEachField(
          searchText,
          field,
          searchRef,
          fields
        );
        dataArr = dataArr.concat(arr);
      });
      dataArr = distinctArr(dataArr, [orderBy[0]]);
    } else {
      // search 1 field.
      dataArr = await fetchSearchsEachField(
        searchText,
        orderBy,
        searchRef,
        fields
      );
    }
    // dataArr = distinctArr(
    //   dataArr,
    //   Array.isArray(orderBy) ? orderBy : [orderBy]
    // );
    const option = dataArr.map((item) => {
      if (labels || Array.isArray(orderBy)) {
        let label = '';
        (labels || orderBy).map((l, i) => {
          label = `${label}${
            item[l] && i > 0
              ? l === 'lastName'
                ? ' '
                : l === 'firstName'
                ? ''
                : ' - '
              : ''
          }${item[l] || ''}${
            ['saleNo', 'bookNo', 'serviceNo'].includes(l) ? ' ' : ''
          }`;
          // showLog({ label, item: item[l] });
          return l;
        });
        return {
          label,
          value: item[Array.isArray(orderBy) ? orderBy[0] : orderBy],
        };
      }
      return {
        label: item[orderBy],
        value: item[orderBy],
      };
    });
    return option;
  } catch (e) {
    throw e;
  }
};

export const createSelectOptions = async (arr, orderBy, labels) => {
  try {
    // console.log({ searchText, searchCollection, orderBy, wheres });
    const option = arr.map((item) => {
      if (labels || Array.isArray(orderBy)) {
        let label = '';
        (labels || orderBy).map((l, i) => {
          label = `${label}${
            item[l] && i > 0
              ? l === 'lastName'
                ? ' '
                : l === 'firstName'
                ? ''
                : ' - '
              : ''
          }${item[l] || ''}${['saleNo', 'bookNo'].includes(l) ? ' ' : ''}`;
          // showLog({ label, item: item[l] });
          return l;
        });
        return {
          label,
          value: item[Array.isArray(orderBy) ? orderBy[0] : orderBy],
        };
      }
      return {
        label: item[orderBy],
        value: item[orderBy],
      };
    });
    return option;
  } catch (e) {
    throw e;
  }
};

export const fetchFirestoreKeywords = async ({
  searchText,
  searchCollection,
  orderBy,
  wheres,
  firestore,
  startSearchAt,
  labels,
  limit = 30,
}) => {
  try {
    // console.log({ searchText, searchCollection, orderBy, wheres });
    if (!searchText || searchText?.length < (startSearchAt || 3)) {
      // Search after 3 characters
      // showLog('LESS_THAN', startSearchAt);
      return;
    }
    let searchRef = firestore;
    searchCollection.split('/').map((txt, n) => {
      if (n % 2 === 0) {
        searchRef = searchRef.collection(txt);
      } else {
        searchRef = searchRef.doc(txt);
      }
      return txt;
    });
    if (wheres) {
      wheres.map((wh) => {
        // console.log({ wh });
        searchRef = searchRef.where(wh[0], wh[1], wh[2]);
        return wh;
      });
    }
    let dataArr = [];
    let fields = Array.isArray(orderBy) ? orderBy : [orderBy];
    if (labels) {
      fields = fields.concat(labels);
      fields = uniq(fields);
    }

    // search from keywords field.
    dataArr = await fetchSearchsKeywords(searchText, searchRef, fields, limit);
    dataArr = distinctArr(dataArr, [orderBy[0]]);
    //  showLog({ dataArr });
    return dataArr;
  } catch (e) {
    throw e;
  }
};

export const createOptionsFromFirestoreKeywords = async ({
  searchText,
  searchCollection,
  orderBy,
  wheres,
  firestore,
  startSearchAt,
  labels,
  isUsed,
}) => {
  try {
    let dataArr = await fetchFirestoreKeywords({
      searchText,
      searchCollection,
      orderBy,
      wheres,
      firestore,
      startSearchAt,
      labels,
    });
    if (dataArr.length === 0 && !!dataArr[0]?.productCode) {
      let ArrIsUsed = dataArr.filter((l) => l.productCode.startsWith('2-'));
      let ArrIsNew = dataArr.filter((l) => !l.productCode.startsWith('2-'));
      let limit = 50;
      while (ArrIsUsed.length > 0 && ArrIsNew.length === 0 && !isUsed) {
        // Fetch until we have new product code.
        limit += 50;
        dataArr = await fetchFirestoreKeywords({
          searchText,
          searchCollection,
          orderBy,
          wheres,
          firestore,
          startSearchAt,
          labels,
          limit,
        });
        ArrIsUsed = dataArr.filter((l) => l.productCode.startsWith('2-'));
        ArrIsNew = dataArr.filter((l) => !l.productCode.startsWith('2-'));
      }
      dataArr = [...ArrIsNew, ...ArrIsUsed];
    }
    const option = await createSelectOptions(dataArr, orderBy, labels);
    return option;
  } catch (e) {
    throw e;
  }
};

export const partialText = (str) => {
  const parts = str.split(' ');
  if (parts.length > 1) {
    parts.shift();
    return parts.join(' ').toLowerCase();
  } else {
    return str.toLowerCase();
  }
};

export const fetchSearchsEachField = async (
  searchText,
  orderBy,
  searchRef,
  fields
) => {
  let limit = 30;
  try {
    let lowerArr = [];
    let partialArr = [];
    let sTxt = searchText.toLowerCase();
    const lowerSnap = await searchRef
      .orderBy(`${orderBy}_lower`)
      .startAt(sTxt)
      .endAt(sTxt + '\uf8ff')
      .limit(limit)
      .get();
    // Partial word.
    // const partialSnap = await searchRef
    //   .orderBy(`${orderBy}_partial`)
    //   .startAt(sTxt)
    //   .endAt(sTxt + '\uf8ff')
    //   .get();
    // Search in array
    // const arraySnap = await searchRef.where(orderBy, 'array-contains', term).get()
    if (!lowerSnap.empty) {
      lowerSnap.forEach((doc) => {
        let item = { _id: doc.id };
        fields.map((l) => {
          item = { ...item, [l]: doc.data()[l] };
          // showLog({ item });
          return l;
        });
        lowerArr.push(item);
      });
    }
    // if (partialSnap) {
    //   partialSnap.forEach((doc) => {
    //     let item = { _id: doc.id };
    //     fields.map((l) => {
    //       item = { ...item, [l]: doc.data()[l] };
    //     //  showLog({ item });
    //       return l;
    //     });
    //     partialArr.push(item);
    //   });
    // }
    // showLog({ lowerArr, partialArr });
    return lowerArr;
  } catch (e) {
    throw e;
  }
};

export const fetchSearchsKeywords = async (
  searchText,
  searchRef,
  fields,
  limit
) => {
  if (!(!!searchText && !!searchRef)) {
    return [];
  }
  try {
    let arr = [];
    let sTxt = '';
    if (Array.isArray(searchText)) {
      sTxt =
        searchText.length > 0
          ? searchText[searchText.length - 1].toLowerCase()
          : '';
    } else {
      sTxt = searchText.toLowerCase();
    }

    const snapshot = await searchRef
      .where('keywords', 'array-contains', sTxt.toLowerCase())
      // .orderBy('name.last')
      // .startAfter(lastNameOfLastPerson)
      .limit(limit)
      .get();
    // console.log({ searchRef, sTxt: sTxt.toLowerCase() });
    if (!snapshot.empty) {
      snapshot.forEach((doc) => {
        let item = { _id: doc.id };
        fields.map((l) => {
          item = { ...item, [l]: doc.data()[l] };
          // showLog({ item });
          return l;
        });
        arr.push(item);
      });
    }
    // showLog({ arr });
    return arr;
  } catch (e) {
    throw e;
  }
};

export const addSearchFields = (values, fields) => {
  if (!values || !(fields && Array.isArray(fields))) {
    return values;
  }
  let mValues = { ...values };
  fields.map((field) => {
    if (values[field]) {
      mValues[`${field}_lower`] = values[field].toLowerCase();
      mValues[`${field}_partial`] = partialText(values[field]);
    }
    return field;
  });
  return mValues;
};

export const createKeywords = (name) => {
  const arrName = [];
  let curName = '';
  name.split('').forEach((letter) => {
    curName += letter;
    arrName.push(curName);
  });
  return arrName;
};

export const removeTabsNewLines = (txt) => {
  if (!txt || !['number', 'string'].includes(typeof txt)) {
    return txt;
  }
  let str = txt.toString();
  return str.replace(/\s\s+/g, ' ');
};

export const removeDoubleSpaces = (txt) => {
  if (!txt || !['number', 'string'].includes(typeof txt)) {
    return txt;
  }
  let str = txt.toString();
  return str.replace(/  +/g, ' ');
};

export const insertStringsAtIndex = (str, insertStr, idx) => {
  if (!str && isNaN(idx) && !insertStr) {
    return str;
  }
  return `${str.toString().substring(0, idx)}${insertStr}${str
    .toString()
    .substring(idx)}`;
};

export const formatBankAccNo = (str) => {
  if (!str) {
    return str;
  }
  let result = parser(str);
  result = insertStringsAtIndex(result, '-', 3);
  result = insertStringsAtIndex(result, '-', 5);
  result = insertStringsAtIndex(result, '-', 11);
  return result;
};

export const createNewId = (suffix = 'RN-DR') => {
  const lastNo = parseInt(Math.floor(Math.random() * 10000));
  const padLastNo = ('0'.repeat(3) + lastNo).slice(-5);
  const orderId = `${suffix}${dayjs().format('YYYYMMDD')}${padLastNo}`;
  return orderId;
};

export const createNewItemId = (suffix = 'RN-DR') => {
  const lastNo = parseInt(Math.floor(Math.random() * 10000));
  const padLastNo = ('0'.repeat(3) + lastNo).slice(-5);
  return `${suffix}-ITEM${dayjs().format('YYYYMMDD')}${padLastNo}`;
};

export const convertToArray = (elem) => {
  let result = !!elem ? (Array.isArray(elem) ? elem : elem.split(',')) : [];
  return result === [''] ? [] : result;
};

export const isAlphaNumeric = (inputtxt) => {
  if (!inputtxt || !['number', 'string'].includes(typeof inputtxt)) {
    return false;
  }
  var letterNumber = /^[0-9a-zA-Z]+$/;
  return inputtxt.toString().match(letterNumber);
};

export const cleanIdentityNumber = (str) => {
  // Remove non-alphanumeric from before and after.
  if (!str || !['number', 'string'].includes(typeof str)) {
    return str;
  }
  let result = str.trim();
  let before = result.substring(0, 1);
  let middle = result.substring(1, result.length - 1);
  let after = result.substring(result.length - 1, result.length);
  while (!(isAlphaNumeric(before) && isAlphaNumeric(after))) {
    before = result.substring(0, 1);
    middle = result.substring(1, result.length - 1);
    after = result.substring(result.length - 1, result.length);
    result = `${before.replace(/[^a-z0-9]/gi, '')}${middle}${after.replace(
      /[^a-z0-9]/gi,
      ''
    )}`;
  }
  return result;
};

export const cleanIdentityArray = (arr) => {
  // Remove non-alphanumeric from element in array.
  if (!arr || !Array.isArray(arr)) {
    return [];
  }
  const cleaned = arr.map((l) => cleanIdentityNumber(l));
  return cleaned;
};
