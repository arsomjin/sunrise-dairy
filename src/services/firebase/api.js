import {
  isMobile,
  browserName,
  browserVersion,
  osName,
  osVersion,
} from 'react-device-detect';

import { currentUser, setFirestore } from './index';
import dayjs from 'dayjs';
import { store } from 'store';
import { showLog } from 'utils/functions/common';
import { cleanValuesBeforeSave } from 'utils/functions/common';

class Firebase {
  checkVerified = async () => {
    try {
      const curUser = currentUser();
      if (curUser) {
        await curUser.reload();
        let nUser = currentUser();
        let mUser = this.getFirebaseUserFromObject(nUser);
        if (
          mUser?.providerData &&
          mUser.providerData[0]?.providerId === 'phone'
        ) {
          return { verified: true, user: mUser };
        }
        return { verified: mUser?.emailVerified, user: mUser };
      }
      return null;
    } catch (e) {
      return null;
    }
  };

  getFirebaseUserFromObject = (userObject) => {
    return !!userObject.User && !!userObject.User.uid
      ? userObject.User
      : !!userObject?.User &&
        !!userObject.User?._user &&
        !!userObject.User._user?.uid
      ? userObject.User._user
      : !!userObject?._user && !!userObject._user?.uid
      ? userObject._user
      : !!userObject?.user &&
        !!userObject.user?._user &&
        !!userObject.user._user?.uid
      ? userObject.user._user
      : !!userObject?.user && !!userObject.user?.uid
      ? userObject.user
      : !!userObject?.user &&
        !!userObject.user?.User &&
        !!userObject.user.User?.uid
      ? userObject.user.User
      : !!userObject?.user &&
        !!userObject.user?.User &&
        !!userObject.user.User?._user
      ? userObject.user.User._user
      : userObject?.uid
      ? userObject
      : userObject;
  };

  addErrorLogs = (error) =>
    new Promise(async (r, j) => {
      try {
        if (!error) {
          r(false);
        }
        const { USER } = store.getState().user;
        let eYear = dayjs().format('YYYY');
        let eMonth = dayjs().format('YYYY-MM');
        let eTime = dayjs().format('YYYYMMDDHHmm');
        let collection = 'errors/no_auth/handler';
        if (!!USER?.uid && !!currentUser()) {
          collection = 'errors/auth/handler';
        }
        showLog('addErrorLogs', error);
        const errorData = cleanValuesBeforeSave({
          ts: Date.now(),
          ...(!!USER?.uid &&
            !!currentUser() && {
              by: `${USER.firstName || ''} ${USER.lastName || ''}`,
              uid: USER.uid,
              email: USER.email,
            }),
          error: error || null,
          device: { isMobile, browserName, browserVersion, osName, osVersion },
          ...(error?.snap && { snap: error.snap }),
          ...(error?.module && { module: error.module }),
        });
        const res = await setFirestore(collection, eTime, errorData);
        r(res);
      } catch (e) {
        console.warn(e);
        j(e);
      }
    });
}

export default new Firebase();
