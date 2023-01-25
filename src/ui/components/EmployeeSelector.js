import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Select } from 'antd';
import { getFirestoreCollection } from 'services/firebase';
import { showWarn } from 'utils/functions/common';

export default forwardRef((props, ref) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  const selectRef = useRef();

  const getEmployees = useCallback(
    async (sDate) => {
      try {
        setLoading(true);
        const res = await getFirestoreCollection('sections/personal/employees');
        const arr = res
          ? Object.keys(res).map((k, id) => ({
              ...res[k],
              id,
              key: id,
              _id: k,
              nameSurname: `${res[k].prefix || ''}${res[k].firstName || ''} ${
                res[k].lastName || ''
              }`.trim(),
            }))
          : [];
        setLoading(false);
        setEmployees(arr);
      } catch (e) {
        showWarn(e);
        setLoading(false);
      }
    },
    [setLoading]
  );

  useEffect(() => {
    getEmployees();
  }, [getEmployees]);

  useImperativeHandle(
    ref,
    () => ({
      focus: () => {
        selectRef.current.focus();
      },

      blur: () => {
        selectRef.current.blur();
      },

      clear: () => {
        selectRef.current.clear();
      },

      isFocused: () => {
        return selectRef.current.isFocused();
      },

      setNativeProps(nativeProps) {
        selectRef.current.setNativeProps(nativeProps);
      },
    }),
    []
  );

  const options = employees.map((it) => ({
    value: it.employeeId,
    label: it.nameSurname,
  }));

  return <Select ref={selectRef} loading={loading} {...options} {...props} />;
});
