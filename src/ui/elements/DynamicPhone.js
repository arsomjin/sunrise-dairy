const { MaskedInput } = require('antd-mask-input');
const { useMemo } = require('react');

const DynamicPhone = (props) => {
  const cellphoneMask = '000-0000000';
  const phoneMask = '000-000-000';

  // always memoize dynamic masks
  const mask = useMemo(
    () => [
      {
        mask: cellphoneMask,
        lazy: false,
      },
      {
        mask: phoneMask,
        lazy: false,
      },
    ],
    []
  );

  return (
    <MaskedInput
      {...props}
      mask={mask}
      maskOptions={{
        dispatch: function (appended, dynamicMasked) {
          const isCellPhone = dynamicMasked.unmaskedValue[2] === '9';
          return dynamicMasked.compiledMasks[isCellPhone ? 0 : 1];
        },
      }}
    />
  );
};

export default DynamicPhone;
