import React, { forwardRef, useRef, useImperativeHandle } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

export default forwardRef(({ country, ...props }, ref) => {
  const phoneInputRef = useRef();

  useImperativeHandle(
    ref,
    () => ({
      focus: () => {
        phoneInputRef.current.focus();
      },

      blur: () => {
        phoneInputRef.current.blur();
      },

      clear: () => {
        phoneInputRef.current.clear();
      },

      isFocused: () => {
        return phoneInputRef.current.isFocused();
      },

      setNativeProps(nativeProps) {
        phoneInputRef.current.setNativeProps(nativeProps);
      },
    }),
    []
  );

  return (
    <PhoneInput
      ref={phoneInputRef}
      country={country || 'th'}
      onlyCountries={['th']}
      localization={{ Thailand: 'ประเทศไทย' }}
      placeholder="0XXXXXXXXX"
      {...props}
    />
  );
});
