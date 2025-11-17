import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDpZ1O_OqZo57u1y7pIQ-6pvPvoB2Pp5tA",
  authDomain: "phone-login-demo-d7b05.firebaseapp.com",
  projectId: "phone-login-demo-d7b05",
  storageBucket: "phone-login-demo-d7b05.appspot.com",
  messagingSenderId: "579129626967",
  appId: "1:579129626967:web:6dc3215c2455e08bfd2e12",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

export const loginWithGoogle = () => signInWithPopup(auth, provider);
