import { useEffect, useMemo, useState } from 'react';

import {
  collection,
  query,
  onSnapshot,
  orderBy,
  limit,
  where,
} from 'firebase/firestore';
import { firestore } from 'services/firebase';
import { appendArgumentsByArray } from 'utils/functions/common';
import { showWarn } from 'utils/functions/common';

export const useFirestoreListener = (col, wheresArr, order, limited, isDec) => {
  // Can use only static parameters
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let args_arr = [collection(firestore, col)];
    if (!!wheresArr) {
      wheresArr.map((wh) => {
        args_arr = [...args_arr, where(wh[0], wh[1], wh[2])];
        return wh;
      });
    }
    if (!!order) {
      args_arr = [...args_arr, orderBy(order, isDec ? 'desc' : 'asc')];
    }
    if (!!limited) {
      args_arr = [...args_arr, limit(limited)];
    }
    let lFnc = appendArgumentsByArray(query, args_arr);
    let q = lFnc();
    const handleUpdates = (querySnapshot) => {
      setLoading(true);
      const arr = [];
      querySnapshot.forEach((doc) => {
        arr.push({ ...doc.data(), id: doc.id, key: doc.id });
      });
      setData(arr);
      setLoading(false);
    };

    const unsubscribe = onSnapshot(q, handleUpdates, (err) => showWarn(err));

    return () => unsubscribe?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return useMemo(
    () => ({
      loading,
      data,
    }),
    [data, loading]
  );
};
