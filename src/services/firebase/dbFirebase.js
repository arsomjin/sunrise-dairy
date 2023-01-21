import {
  getFirestoreDoc,
  getFirestoreCollection,
  addFirestore,
  setFirestore,
  deleteFirestore,
  updateFirestore,
} from '.';
import { errorHandler } from 'utils/functions/common';
import { useLoading } from 'hooks/useLoading';
import { showLog } from 'utils/functions/common';

const FirebaseDB = () => {
  const { loading, setLoading } = useLoading();

  const setDocument = async (col, docId, data) => {
    try {
      setLoading(true);
      let res = await setFirestore(col, docId, data);
      setLoading(false);
      Promise.resolve(res);
    } catch (err) {
      setLoading(false);
      Promise.reject(err);
      errorHandler(
        {
          code: err?.code || null,
          message: err?.message || null,
          snap: {
            col,
            docId,
            data,
            module: 'setDocument',
          },
        },
        'setDocument'
      );
    }
  };

  const getCollection = async (col, wheresArr, order, limited, isDec) => {
    try {
      setLoading(true);
      let res = await getFirestoreCollection(
        col,
        wheresArr,
        order,
        limited,
        isDec
      );
      setLoading(false);
      Promise.resolve(res);
    } catch (err) {
      setLoading(false);
      Promise.reject(err);
      errorHandler(
        {
          code: err?.code || null,
          message: err?.message || null,
          snap: {
            col,
            wheresArr,
            order,
            limited,
            isDec,
            module: 'getCollection',
          },
        },
        'getCollection'
      );
    }
  };

  return {
    loading,
    setDocument,
    getCollection,
  };
};

export default FirebaseDB;
