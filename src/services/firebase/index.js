import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  signOut,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  setDoc,
} from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';
import { getMessaging } from 'firebase/messaging';
import { showLog } from 'utils/functions/common';

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

const auth = getAuth();
export const firestore = getFirestore(app);
export const database = getDatabase(app);
export const storage = getStorage(app);
export const messaging = getMessaging(app);

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

export const setFirestore = (col, docId, data) =>
  new Promise(async (r, j) => {
    let setRef = firestore;
    try {
      // collection.split('/').map((txt, n) => {
      //   if (n % 2 === 0) {
      //     setRef = setRef.collection(txt);
      //   } else {
      //     setRef = setRef.doc(txt);
      //   }
      //   return txt;
      // });
      let res = await setDoc(doc(firestore, col, docId), data);
      r(res);
    } catch (e) {
      j(e);
    }
  });

export const addFirestore = (col, data) =>
  new Promise(async (r, j) => {
    try {
      // let addRef = firestore;
      // collection.split('/').map((txt, n) => {
      //   if (n % 2 === 0) {
      //     addRef = addRef.collection(txt);
      //   } else {
      //     addRef = addRef.doc(txt);
      //   }
      //   return txt;
      // });
      // let res = await addRef.add(data);
      let res = await addDoc(collection(firestore, col), data);
      r(res);
    } catch (e) {
      j(e);
    }
  });

export const currentUser = () => {
  // Need to implement the onAuthStateChange, otherwise it will return null.
  return auth.currentUser;
};
