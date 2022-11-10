// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyA17s7Y0ztfud9K1hk2ErQsneIuLh2gty0",
    authDomain: "ticket-master-c2e65.firebaseapp.com",
    databaseURL: "https://ticket-master-c2e65-default-rtdb.firebaseio.com",
    projectId: "ticket-master-c2e65",
    storageBucket: "ticket-master-c2e65.appspot.com",
    messagingSenderId: "829735972939",
    appId: "1:829735972939:web:61a60797716e28ff475dce",
    measurementId: "G-CRDM6F632P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);