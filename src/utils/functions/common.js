import { ExclamationCircleFilled } from '@ant-design/icons';
import { Modal } from 'antd';
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

export const Numb = (val) => {
  if (!val) {
    return 0;
  }
  let mNum = val.toString().replace(/(\r\n|\n|\r|,| |-)/g, '');
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
  showLog({
    value,
    pResult: parseFloat(value)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ','),
  });
  return parseFloat(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const getErrorMessage = ({ code, message }) => {
  showLog({ code, message });
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
  showLog({ error, msg });
  Firebase.addErrorLogs(Object.assign(error, { msg }));
};
