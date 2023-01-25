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
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  const selectRef = useRef();

  const getMembers = useCallback(
    async (sDate) => {
      try {
        setLoading(true);
        const res = await getFirestoreCollection('sections/personal/members');
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
        setMembers(arr);
      } catch (e) {
        showWarn(e);
        setLoading(false);
      }
    },
    [setLoading]
  );

  useEffect(() => {
    getMembers();
  }, [getMembers]);

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

  const options = members.map((it) => ({
    value: it.memberId,
    label: `${it.bucketNo} - ${it.nameSurname}`,
  }));

  return <Select ref={selectRef} loading={loading} {...options} {...props} />;
});
