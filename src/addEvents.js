import firebaseConfig from "./firebaseConfig";
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, doc, addDoc, updateDoc, arrayUnion } from 'firebase/firestore';
// Start up the Firebase App
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const db = getFirestore();
const eventsRef = collection(db, 'event');

/************************************DISPLAY ADD EVENTS FORM*************************************************************/

/* Method Functionality: function called by #onAuthStateChange authentication
*  Purpose: If we have a user it will allow for the input boxes to go and push data into our database.
*  Output: There will be a change within out database and a success message.
*/
onAuthStateChanged(auth, (user) => {
    if (user) {
        //User is signed in 
        const userID = user.uid;

        // Create Collections Reference from Firestore
        const addFlightForm = document.querySelector(".inputBoxes");

        addFlightForm.addEventListener('submit', (event) => {
            event.preventDefault();
            addDoc(eventsRef, {
                ['artistName']: addFlightForm.eventArtist.value,
                ['creatorID']: userID, //Do this 
                ['eventDate']: addFlightForm.eventDate.value,
                ['eventDescription']: addFlightForm.eventDesc.value,
                ['eventLocation']: addFlightForm.eventLocation.value,
                ['eventName']: addFlightForm.eventName.value,
                ['eventTime']: addFlightForm.eventTime.value,
                ['maxCapacity']: addFlightForm.eventCapacity.value,
                ['price']: addFlightForm.eventCost.value
            })
                .then(() => {
                    addFlightForm.reset();
                    alert("Event successfully added!");
                })
        });
    } else {
        //User is signed out
    }
})
