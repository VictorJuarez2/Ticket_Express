// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
    getFirestore
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import firebaseConfig from "./firebaseConfig"

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore();

//ON AUTH STATE CHANGE USED TO DETERMINE STATE OF THE PAGE
const auth = getAuth();

/************************************DISPLAY USER INTERFACE*************************************************************/

/* Method Functionality: function called by #onAuthStateChange authentication
*  Purpose: Depending on the state of the state of the user they will only be able to access certain pages through this method.
*  Output: Change in display of html however, no output.
*/
onAuthStateChanged(auth, (user) => {
    if (user) {
        user.getIdTokenResult()
            .then((idTokenResult) => {
                if (idTokenResult.claims.role == 'manager' || idTokenResult.claims.role == 'admin') {
                    userUI.forEach(item => item.style.display = 'none');
                    managerUI.forEach(item => item.style.display = 'block');
                    createFlightInfoCards();
                } else {
                    userUI.forEach(item => item.style.display = 'block');
                    managerUI.forEach(item => item.style.display = 'none');
                }
            })
        console.log("Logged in");
    } else {
        console.log("Not an admin")
    }
})