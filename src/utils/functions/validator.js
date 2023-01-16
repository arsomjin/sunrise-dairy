import i18n from 'translations/i18n';

export const validateMobileNumber = (text) => {
  if (!text) {
    return false;
  }
  let inputtxt = text.replace(/(\r\n|\n|\r| |-)/g, '');
  const phoneno = /^0\(?([0-9]{2})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  if (phoneno.test(inputtxt)) return true;
  return false;
};

export const getRules = (rules) => {
  const requiredRule = [{ required: true, message: i18n.t('กรุณาป้อนข้อมูล') }];
  const numberRule = [
    ({ getFieldValue }) => ({
      validator(rule, value) {
        if (!value || !isNaN(value)) {
          return Promise.resolve();
        }

        return Promise.reject(i18n.t('กรุณาป้อนตัวเลข'));
      },
    }),
  ];
  const mobileNumberRule = [
    () => ({
      validator(rule, value) {
        if (!value) {
          return Promise.resolve();
        }
        if (validateMobileNumber(value)) {
          return Promise.resolve();
        }

        return Promise.reject('กรุณาตรวจสอบ เบอร์โทรศัพท์');
      },
    }),
  ];

  let result = [];

  rules.forEach((rule) => {
    switch (rule) {
      case 'required':
        result = result.concat(requiredRule);
        break;
      case 'number':
        result = result.concat(numberRule);
        break;
      case 'mobileNumber':
        result = result.concat(mobileNumberRule);
        break;

      default:
        break;
    }
  });

  return result;
};
