// Import the functions you need from the SDKs you need
import { initializeApp } from "@firebase/app";
import { getStorage } from "@firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAgM-0al5gO8y3eB05DmQ-EwZtPT0risCw",
  authDomain: "wpzdcm-firebase.firebaseapp.com",
  projectId: "wpzdcm-firebase",
  storageBucket: "wpzdcm-firebase.appspot.com",
  messagingSenderId: "629783818156",
  appId: "1:629783818156:web:a5212550afeffd47665409"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
