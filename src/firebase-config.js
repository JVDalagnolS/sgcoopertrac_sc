import { initializeApp } from "firebase/app";
import {
  getAuth,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
} from "firebase/firestore";

//adicionar configurações do banco de dados do Firestore. Sem essas configurações o CRUDE não irá funcionar.
//Favor criar próprio banco de dados e prencher essas configurações a seguir.
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset link sent!");
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const logout = () => {
  signOut(auth);
};

export {
  auth,
  db,
  sendPasswordReset,
  logout,
};