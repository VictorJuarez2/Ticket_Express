// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
    getFirestore, getDocs, collection, doc, QuerySnapshot, query, getDoc
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import firebaseConfig from "./firebaseConfig"

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

const db = getFirestore();
/*
const flightsCitiesRef = collection(db, 'Airline Flights Cities');
const flightsRef = collection(db, 'Airline Flights');


const cards = document.getElementById('cards');
const cardsForFlights = document.getElementById('cardsForFlights');
const userUI = document.querySelectorAll('#nonManager');
const managerUI = document.querySelectorAll('#manager');
let servicedCities = [];
*/
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