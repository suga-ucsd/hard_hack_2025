import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {

  apiKey: "AIzaSyCA9uaSgpjacgf5vrTe1vjp21FKBD4Bw3A",

  authDomain: "hardhack-56e3c.firebaseapp.com",

  projectId: "hardhack-56e3c",

  storageBucket: "hardhack-56e3c.firebasestorage.app",

  messagingSenderId: "976842010144",

  appId: "1:976842010144:web:94c21bd41c2d5ab6e51645",

};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
