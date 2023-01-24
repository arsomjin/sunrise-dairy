import { useEffect, useMemo, useState } from 'react';

import { collection, query, onSnapshot } from 'firebase/firestore';
import { firestore } from 'services/firebase';

export const useFirestoreListener = (col) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const q = query(collection(firestore, col));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const arr = [];
      querySnapshot.forEach((doc) => {
        arr.push({ ...doc.data(), id: doc.id, key: doc.id });
      });
      setData(arr);
    });
    return () => unsubscribe?.();
  }, [col]);
  return useMemo(() => data, [data]);
};
