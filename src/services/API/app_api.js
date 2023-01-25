import { PERMISSIONS } from 'constants/Permissions';
import { updateFirestore } from 'services/firebase';
import { setFirestore } from 'services/firebase';
import { getFirestoreDoc } from 'services/firebase';

export const updateUserProfile = async (mValues, uid) => {
  try {
    let profileCol = `users/${uid}/info`;
    let prev = await getFirestoreDoc(profileCol, 'profile');
    // showLog({ prev });
    if (!prev) {
      let profile = { ...mValues, permissions: PERMISSIONS };
      await setFirestore(profileCol, 'profile', profile);
    } else {
      await updateFirestore(profileCol, 'profile', mValues);
    }
    return true;
  } catch (e) {
    throw e;
  }
};
