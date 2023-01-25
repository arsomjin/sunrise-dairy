import { ExclamationCircleFilled } from '@ant-design/icons';
import { Modal, message } from 'antd';
import dayjs from 'dayjs';
import { isMobile } from 'react-device-detect';
import Firebase from 'services/firebase/api';
import { __DEV__ } from 'utils';

export const capitalize = (word) =>
  `${word[0].toUpperCase()}${word.slice(1).toLowerCase()}`;

export const getDifference = (value, prevValue) =>
  prevValue !== 0
    ? `${((Math.abs(value - prevValue) / prevValue) * 100).toFixed(0)}%`
    : '100%';

export const validateEmail = (email) => {
  let re =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};

export const shallowPartialCompare = (obj, partialObj) =>
  Object.keys(partialObj).every(
    (key) => obj.hasOwnProperty(key) && obj[key] === partialObj[key]
  );

export const waitFor = (ms) =>
  new Promise((r) => {
    const delayWaitFor = setTimeout(() => {
      clearTimeout(delayWaitFor);
      r(true);
    }, ms);
  });

export const showLog = (tag, log) => {
  if (__DEV__) {
    if (typeof tag !== 'undefined' && typeof log !== 'undefined') {
      console.log(`${tag}: `, log);
    } else if (typeof log === 'undefined') {
      console.log(tag);
    }
  }
};
export const showWarn = (tag, log) => {
  if (__DEV__) {
    if (typeof tag !== 'undefined' && typeof log !== 'undefined') {
      console.warn(`${tag}: `, log);
    } else if (typeof log === 'undefined') {
      console.warn(tag);
    }
  }
};

export const showAlert = ({
  title,
  content,
  dismissable = true, // Whether a close (x) button is visible on top right of the modal dialog or not
  onOk,
  onCancel,
  ...props
}) => {
  const config = {
    title: title || undefined,
    content: content || undefined,
    closable: dismissable,
    okButtonProps: { className: 'bg-blue-500 hover:bg-blue-600' },
    ...(onOk && { onOk }),
    ...(onCancel && { onCancel }),
    ...props,
  };
  return Modal.info(config);
};

export const showConfirm = ({
  title,
  content,
  dismissable = true, // Whether a close (x) button is visible on top right of the modal dialog or not
  onOk,
  onCancel,
  ...props
}) => {
  const config = {
    title: title || undefined,
    content: content || undefined,
    closable: dismissable,
    okButtonProps: { className: 'bg-blue-500 hover:bg-blue-600' },
    ...(onOk && { onOk }),
    ...(onCancel && { onCancel }),
    ...props,
  };
  return Modal.confirm(config);
};

export const showSuccess = ({
  title,
  content,
  dismissable = true, // Whether a close (x) button is visible on top right of the modal dialog or not
  onOk,
  onCancel,
  ...props
}) => {
  const config = {
    title: title || undefined,
    content: content || undefined,
    closable: dismissable,
    okButtonProps: { className: 'bg-blue-500 hover:bg-blue-600' },
    ...(onOk && { onOk }),
    ...(onCancel && { onCancel }),
    ...props,
  };
  return Modal.success(config);
};

export const showWarning = ({
  title,
  content,
  dismissable = true, // Whether a close (x) button is visible on top right of the modal dialog or not
  onOk,
  onCancel,
  ...props
}) => {
  const config = {
    title: title || undefined,
    content: content || undefined,
    closable: dismissable,
    okButtonProps: { className: 'bg-blue-500 hover:bg-blue-600' },
    ...(onOk && { onOk }),
    ...(onCancel && { onCancel }),
    ...props,
  };
  return Modal.warning(config);
};

export const showError = ({
  title,
  content,
  dismissable = true, // Whether a close (x) button is visible on top right of the modal dialog or not
  onOk,
  onCancel,
  ...props
}) => {
  const config = {
    title: title || undefined,
    content: content || undefined,
    closable: dismissable,
    okButtonProps: { className: 'bg-blue-500 hover:bg-blue-600' },
    ...(onOk && { onOk }),
    ...(onCancel && { onCancel }),
    ...props,
  };
  return Modal.error(config);
};

export const showDelete = ({
  title,
  content,
  dismissable = true, // Whether a close (x) button is visible on top right of the modal dialog or not
  onOk,
  onCancel,
  ...props
}) => {
  const config = {
    title: title || undefined,
    content: content || undefined,
    closable: dismissable,
    ...(onOk && { onOk }),
    ...(onCancel && { onCancel }),
    ...props,
    icon: <ExclamationCircleFilled />,
    okType: 'danger',
  };
  return Modal.confirm(config);
};

export const showToBeContinue = () =>
  message['info']({
    content: 'To be continue..',
    style: {
      marginTop: isMobile ? 32 : 64,
    },
    duration: 2.5,
  }).then(() =>
    message['info']({
      content: 'อยู่ระหว่างดำเนินการ..',
      style: {
        marginTop: isMobile ? 32 : 64,
      },
      duration: 2.5,
    })
  );

export const Numb = (val) => {
  if (!val) {
    return 0;
  }
  let mNum = val.toString().replace(/(\r\n|\n|\r|,| |)/g, '');
  return isNaN(mNum) ? val : Number(mNum);
};

export const parser = (value) => {
  if (!value) {
    return value;
  }
  if (!(typeof value === 'number' || typeof value === 'string')) {
    return value;
  }
  return value.toString().replace(/(\r\n|\n|\r| |-|฿\s?)|(,*)/g, '');
};

export const formatNumber = (value) => {
  // showLog({ value });
  if (!value || isNaN(value)) {
    return value;
  }
  let decIndex = value.toString().indexOf('.');
  if (decIndex > -1) {
    // Has decimal.
    let fVal = value.substr(0, decIndex);
    fVal = parseFloat(fVal).toString();
    let bVal = parser(value.substr(decIndex));
    // bVal = bVal.replace(/./g, '');
    return `${fVal.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}${bVal}`;
  }
  return parseFloat(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const hasToParse = (fieldName) =>
  [
    'phoneNumber',
    'mobileNumber',
    'mobilePhoneNumber',
    'accNo',
    'bankAccNo',
    'discountCoupon',
    'discountPointRedeem',
    'SKCDiscount',
    'SKCManualDiscount',
    'AD_Discount',
    'netTotal',
    'amtOilType',
    'amtPartType',
  ].includes(fieldName);

export const cleanValuesBeforeSave = (values, skipDate) => {
  // Check undefined and replace to null,
  // Format date.
  if (typeof values !== 'object' || !values) {
    return values;
  }
  let mValues = { ...values };
  // showLog('value_to_be_clean', mValues);
  Object.keys(values).map((k, i) => {
    if (typeof values[k] === 'undefined') {
      mValues[k] = null;
    }
    // Return null
    if (!mValues[k]) {
      return k;
    }
    if (
      !skipDate &&
      k.length >= 4 &&
      (k.substr(-4) === 'Date' || k === 'date') &&
      !!values[k]
    ) {
      mValues[k] = dayjs(values[k]).format('YYYY-MM-DD');
    }
    if (Array.isArray(values[k])) {
      // showLog({ isArray: k, val: values[k] });
      mValues[k] = cleanArrayOfObject(values[k], skipDate);
    } else if (typeof mValues[k] === 'object') {
      mValues[k] = cleanObject(mValues[k]);
    }
    if (hasToParse(k) && ['number', 'string'].includes(typeof mValues[k])) {
      mValues[k] = parser(values[k]);
    }
    // showLog({ current_clean: { k, value: mValues[k] } });
    if (typeof mValues[k] === 'string' && mValues[k].startsWith(',')) {
      mValues[k] = mValues[k].substr(1);
    }
    return k;
  });
  return mValues;
};

const cleanArrayOfObject = (arr, skipDate) => {
  let result = [];
  let fArr = arr.filter((l) => !!l);
  for (var i = 0; i < fArr.length; i++) {
    if (fArr[i]) {
      result[i] =
        typeof fArr[i] === 'object' ? cleanObject(fArr[i], skipDate) : fArr[i];
      // showLog({ cleaned_obj_arr: result[i] });
    }
  }
  return result;
};

const cleanObject = (obj, skipDate) => {
  let mObj = { ...obj };
  Object.keys(obj).map((k) => {
    if (typeof obj[k] === 'undefined') {
      mObj[k] = null;
    }
    // Return null
    if (!mObj[k]) {
      return k;
    }
    if (
      !skipDate &&
      k.length >= 4 &&
      (k.substr(-4) === 'Date' || k === 'date')
    ) {
      mObj[k] = dayjs(obj[k]).format('YYYY-MM-DD');
    }
    if (hasToParse(k) && ['number', 'string'].includes(typeof mObj[k])) {
      mObj[k] = parser(obj[k]);
    }
    if (Array.isArray(obj[k])) {
      // Array in array. Just 1 level nested array can be checked.
      // mObj[k] = obj[k].join();
      mObj[k] = obj[k];
    }
    if (typeof mObj[k] === 'string' && mObj[k].startsWith(',')) {
      mObj[k] = obj[k].substr(1);
    }
    return k;
  });
  return mObj;
};

export const formatValuesBeforeLoad = (values) => {
  // Check undefined and replace to null,
  // Format date.
  if (typeof values !== 'object' || !values) {
    return values;
  }
  let mValues = { ...values };
  Object.keys(values).map((k, i) => {
    let dateType = k.length >= 4 && (k.substr(-4) === 'Date' || k === 'date');
    if (dateType && !!values[k]) {
      mValues[k] = dayjs(values[k], 'YYYY-MM-DD');
    }
    if (dateType && !values[k]) {
      mValues[k] = undefined;
    }
    if (values[k] === undefined && !dateType) {
      mValues[k] = null;
    }
    if (hasToParse(k)) {
      mValues[k] = parser(values[k]);
    }
    return k;
  });
  return mValues;
};

export const removeTags = (str) => {
  if (!str || str === null || str === '') return str;
  else str = str.toString();
  return str.replace(/(<([^>]+)>)/gi, '');
};

export const isObject = (object) => {
  return object != null && typeof object === 'object';
};

export const deepEqual = (object1, object2) => {
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    const val1 = object1[key];
    const val2 = object2[key];
    const areObjects = isObject(val1) && isObject(val2);
    if (
      (areObjects && !deepEqual(val1, val2)) ||
      (!areObjects && val1 !== val2)
    ) {
      return false;
    }
  }

  return true;
};

export const firstKey = (obj) => {
  if (!isObject(obj)) {
    return undefined;
  }
  for (var key in obj)
    if (Object.getOwnPropertyDescriptor(obj, key)) return key;
};

export const hasKey = (key, obj) => {
  if (!isObject(obj) || typeof key !== 'string') {
    return false;
  }
  return Object.keys(obj)
    .map((k) => k)
    .includes(key);
};

export function appendArguments(fn) {
  var slice = Array.prototype.slice.call.bind(Array.prototype.slice),
    args = slice(arguments, 1); // All arguments in function except 1st argument which is function itself.
  return function () {
    return fn.apply(this, args);
  };
}

export function appendArgumentsByArray(fn) {
  // Pass the function as 1st argument and then followed by the array of arguments to appended
  var slice = Array.prototype.slice.call.bind(Array.prototype.slice),
    args = slice(arguments, 1); // All arguments in function except 1st argument which is function itself.
  let argsArr = [];
  args.map((ar) => {
    if (ar) argsArr = argsArr.concat(ar);
    return ar;
  });
  return function () {
    return fn.apply(this, argsArr);
  };
}

export const getErrorMessage = ({ code, message }) => {
  if (!['number', 'string'].includes(typeof message) || !message) {
    return message;
  }
  let title = 'ไม่สำเร็จ';
  let detail = '';
  if (!!message) {
    let str = message.toString().trim();
    if (str.indexOf('Query.where') > -1) {
      detail = 'กรุณาตรวจสอบพารามิเตอร์ที่ใช้ในการค้นหาข้อมูล';
    } else {
      detail = 'กรุณาทำรายการใหม่อีกครั้ง';
    }
  }
  return { title, detail };
};

export const errorHandler = (error) => {
  let msg = getErrorMessage(error);
  showWarning({ title: msg.title, content: msg.detail });
  Firebase.addErrorLogs(Object.assign(error, { msg }));
};

export const getFullName = (data) =>
  data?.firstName
    ? `${data?.prefix || ''}${data?.firstName || ''} ${data?.lastName}`
    : data?.displayName || null;

export const getAddressText = (data) => {
  const { address, residence } = data;
  return `${address?.h_number}${address?.moo ? ` หมู่ ${address.moo} ` : ''}${
    address?.village ? ` หมู่บ้าน ${address.village} ` : ''
  }${address?.soi ? ` ซอย ${address.soi} ` : ''}${
    address?.road ? ` ถนน ${address.road} ` : ''
  }${address?.building ? ` อาคาร ${address.building} ` : ''}${
    address?.floor ? ` ชั้น ${address.floor} ` : ''
  } ต.${residence[2]} อ.${residence[1]} จ.${residence[0]} ${residence[3]}`;
};
