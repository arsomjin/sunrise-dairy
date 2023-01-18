import { updateFirestore } from 'services/firebase';
import { setFirestore } from 'services/firebase';
import { getFirestoreDoc } from 'services/firebase';
import { updateProfile } from 'store/slices/userSlice';

export const updateUserProfile = async (mValues, uid, dispatch) => {
  try {
    let profileCol = `users/${uid}/info`;
    let prev = await getFirestoreDoc(profileCol, 'profile');
    // showLog({ prev });
    if (!prev) {
      await setFirestore(profileCol, 'profile', mValues);
    } else {
      await updateFirestore(profileCol, 'profile', mValues);
    }
    dispatch(updateProfile({ profile: mValues }));
    Promise.resolve(true);
  } catch (e) {
    Promise.reject(e);
  }
};
