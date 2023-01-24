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
import dayjs from 'dayjs';
import { store } from 'store';

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

export const firebaseSignIn = async (email, password) => {
  try {
    let res = await signInWithEmailAndPassword(auth, email, password);
    return res;
  } catch (e) {
    throw e;
  }
};

export const firebaseSignUp = async (email, password) => {
  try {
    let res = await createUserWithEmailAndPassword(auth, email, password);
    return res;
  } catch (e) {
    throw e;
  }
};

export const firebaseResetPassword = async (email) => {
  try {
    let res = await sendPasswordResetEmail(auth, email);
    return res;
  } catch (e) {
    throw e;
  }
};

export const sendVerifyEmail = async () => {
  try {
    let res = await sendEmailVerification(auth.currentUser);
    return res;
  } catch (e) {
    throw e;
  }
};

export const firebaseSignOut = async () => {
  try {
    let res = await signOut(auth);
    return res;
  } catch (e) {
    throw e;
  }
};

export const firebaseSignInWithPhoneNumber = async (
  phoneNumber,
  appVerifier
) => {
  try {
    let confirmationResult = await signInWithPhoneNumber(
      auth,
      phoneNumber,
      appVerifier
    );
    // window.confirmationResult = confirmationResult;
    return confirmationResult;
  } catch (e) {
    throw e;
  }
};

export const firebaseSignInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    auth.languageCode = 'th';

    const result = await signInWithPopup(auth, provider);
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;
    return { user, credential, token };
    // ...
  } catch (error) {
    throw error;
  }
};

export const firebaseUpdateProfile = async (profile) => {
  // profile: { displayName, photoURL }
  try {
    await updateProfile(auth.currentUser, profile);
    return true;
  } catch (e) {
    throw e;
  }
};

export const setFirestore = async (col, docId, data) => {
  try {
    let res = await setDoc(doc(firestore, col, docId), data);
    return res;
  } catch (e) {
    throw e;
  }
};

export const addFirestore = async (col, data) => {
  try {
    let res = await addDoc(collection(firestore, col), data);
    return res;
  } catch (e) {
    throw e;
  }
};

export const updateFirestore = async (col, docId, data) => {
  try {
    let res = await updateDoc(doc(firestore, col, docId), data);
    return res;
  } catch (e) {
    throw e;
  }
};

export const addLogs = async (log) => {
  try {
    // log = { action, module, command, ts, date, by, docId, snap }
    const states = store.getState();
    const USER = states.user.USER;
    let res = await addFirestore('logs', {
      ...log,
      ts: Date.now(),
      date: dayjs().format('YYYY-MM-DD'),
      by: USER.uid,
    });
    return res;
  } catch (e) {
    throw e;
  }
};

export const deleteFirestore = async (col, docId) => {
  try {
    let res = await deleteDoc(doc(firestore, col, docId));
    return res;
  } catch (e) {
    throw e;
  }
};

export const getFirestoreDoc = async (col, docId) => {
  try {
    const docRef = doc(firestore, col, docId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  } catch (e) {
    throw e;
  }
};

export const getFirestoreCollection = async (
  col,
  wheresArr,
  order,
  limited,
  isDec
) => {
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
    if (querySnapshot.empty) return null;
    querySnapshot.forEach((doc) => {
      // console.log(doc.id, ' => ', doc.data());
      result[doc.id] = doc.data();
    });
    return result;
  } catch (e) {
    throw e;
  }
};

export const checkDuplicatedDoc = async (col, docSnap) => {
  try {
    const wheres = Object.keys(docSnap).map((k) => [k, '==', docSnap[k]]);
    const dupSnap = await getFirestoreCollection(col, wheres);
    return dupSnap;
  } catch (e) {
    throw e;
  }
};

export const currentUser = () => {
  // Need to implement the onAuthStateChange, otherwise it will return null.
  return auth.currentUser;
};
