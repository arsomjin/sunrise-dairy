import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  signOut,
  updateProfile,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  addDoc,
  setDoc,
  updateDoc,
  getDoc,
  deleteDoc,
  getDocs,
  collection,
  query,
  where,
  orderBy,
  limit,
} from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';
import { getMessaging } from 'firebase/messaging';
import { showLog } from 'utils/functions/common';
import { appendArgumentsByArray } from 'utils/functions/common';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const database = getDatabase(app);
export const storage = getStorage(app);
export const messaging = getMessaging(app); // (messaging/unsupported-browser) Supports only localhost and https

export const firebaseSignIn = (email, password) =>
  new Promise(async (r, j) => {
    try {
      let res = await signInWithEmailAndPassword(auth, email, password);
      r(res);
    } catch (e) {
      j(e);
    }
  });

export const firebaseSignUp = (email, password) =>
  new Promise(async (r, j) => {
    try {
      let res = await createUserWithEmailAndPassword(auth, email, password);
      r(res);
    } catch (e) {
      j(e);
    }
  });

export const firebaseResetPassword = (email) =>
  new Promise(async (r, j) => {
    try {
      let res = await sendPasswordResetEmail(auth, email);
      r(res);
    } catch (e) {
      j(e);
    }
  });

export const sendVerifyEmail = () =>
  new Promise(async (r, j) => {
    try {
      let res = await sendEmailVerification(auth.currentUser);
      r(res);
    } catch (e) {
      j(e);
    }
  });

export const firebaseSignOut = () =>
  new Promise(async (r, j) => {
    try {
      let res = await signOut(auth);
      r(res);
    } catch (e) {
      j(e);
    }
  });

export const firebaseSignInWithPhoneNumber = (phoneNumber, appVerifier) =>
  new Promise(async (r, j) => {
    try {
      let confirmationResult = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        appVerifier
      );
      // window.confirmationResult = confirmationResult;
      r(confirmationResult);
    } catch (e) {
      j(e);
    }
  });

export const firebaseSignInWithGoogle = () =>
  new Promise(async (r, j) => {
    try {
      const provider = new GoogleAuthProvider();
      auth.languageCode = 'th';

      const result = await signInWithPopup(auth, provider);
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      r({ user, credential, token });
      // ...
    } catch (error) {
      j(error);
    }
  });

export const firebaseUpdateProfile = (
  profile // profile: { displayName, photoURL }
) =>
  new Promise(async (r, j) => {
    try {
      await updateProfile(auth.currentUser, profile);
      r(true);
    } catch (e) {
      j(e);
    }
  });

export const setFirestore = (col, docId, data) =>
  new Promise(async (r, j) => {
    try {
      let res = await setDoc(doc(firestore, col, docId), data);
      r(res);
    } catch (e) {
      j(e);
    }
  });

export const addFirestore = (col, data) =>
  new Promise(async (r, j) => {
    try {
      let res = await addDoc(collection(firestore, col), data);
      r(res);
    } catch (e) {
      j(e);
    }
  });

export const updateFirestore = (col, docId, data) =>
  new Promise(async (r, j) => {
    try {
      let res = await updateDoc(doc(firestore, col, docId), data);
      r(res);
    } catch (e) {
      j(e);
    }
  });

export const deleteFirestore = (col, docId) =>
  new Promise(async (r, j) => {
    try {
      let res = await deleteDoc(doc(firestore, col, docId));
      r(res);
    } catch (e) {
      j(e);
    }
  });

export const getFirestoreDoc = (col, docId) =>
  new Promise(async (r, j) => {
    try {
      const docRef = doc(firestore, col, docId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        r(docSnap.data());
      } else {
        // doc.data() will be undefined in this case
        console.log('No such document!');
        r(null);
      }
    } catch (e) {
      j(e);
    }
  });

export const getFirestoreCollection = (col, wheresArr, order, limited, isDec) =>
  new Promise(async (r, j) => {
    try {
      let colRef = collection(firestore, col);
      let args_arr = [colRef];
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
      let result = {};
      const querySnapshot = await getDocs(q);
      // showLog('empty', querySnapshot.empty);
      if (querySnapshot.empty) return r(null);
      querySnapshot.forEach((doc) => {
        console.log(doc.id, ' => ', doc.data());
        result[doc.id] = doc.data();
      });
      r(result);
    } catch (e) {
      j(e);
    }
  });

export const currentUser = () => {
  // Need to implement the onAuthStateChange, otherwise it will return null.
  return auth.currentUser;
};
