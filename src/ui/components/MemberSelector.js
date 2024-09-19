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

  const getMembers = useCallback(
    async (sDate) => {
      try {
        setLoading(true);
        const res = await getFirestoreCollection('sections/personal/members');
        const arr = res
          ? Object.keys(res).map((k, id) => ({
              ...res[k],
              id,
              key: k,
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

  const options = members.map((it) => ({
    value: it.memberId,
    label: `${it.bucketNo} - ${it.nameSurname}`,
  }));

  return <Select loading={loading} options={options} {...props} />;
});
