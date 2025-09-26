import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

// Your Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyB-LR9hkn7K_BBK51ZqQa6ZOORoY8hrJ98",
  authDomain: "train-site.firebaseapp.com",
  databaseURL: "https://train-site-default-rtdb.firebaseio.com",
  projectId: "train-site",
  storageBucket: "train-site.appspot.com",
  messagingSenderId: "79077593679",
  appId: "1:79077593679:web:0de72f03eaa3fac94d903a",
  measurementId: "G-2CCZK19V3P",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const storage = getStorage(app);

// Create providers for Google, GitHub, and Discord

export { auth, database, storage };
