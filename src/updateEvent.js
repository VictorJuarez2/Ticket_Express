import firebaseConfig from './firebaseConfig'
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import {
    getFirestore, getDoc, doc, updateDoc
} from 'firebase/firestore';

// Initializing firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore()



// Getting portions of the page
const tab = document.getElementById("title")
const body = document.getElementById("event-page")
const update_info = document.getElementById("update_form")
const change_booking = document.querySelector(".Change")

const d = new Date();

/************************************DISPLAY EVENT FORM + INFORMATION*************************************************************/

/* Method Functionality: function called by #onAuthStateChange authentication
*  Purpose: Assuming a user is logged in this will allow for the user to view an event and alter information of the event.
*  Output: The change in UI specifically the create page however, there is no output.
*/
onAuthStateChanged(auth, (user) => {
    if (user) {
        let id_int = JSON.parse(localStorage.getItem('id'));
        create_page_logged_in(id_int)
        // This is done within the auth State Change due to the fact that we need the uid whenever this is called
        const update_Profile_Form = document.getElementById("update_form")
        update_Profile_Form.addEventListener('submit', (event) => {
            event.preventDefault()
            let ref = doc(db, 'event', id_int);
            if (update_Profile_Form.eventName.value) { updateDoc(ref, { eventName: update_Profile_Form.eventName.value }); }
            if (update_Profile_Form.eventLocation.value) { updateDoc(ref, { eventLocation: update_Profile_Form.eventLocation.value }) }
            if (update_Profile_Form.eventDate.value) { updateDoc(ref, { eventDate: update_Profile_Form.eventDate.value }) }
            if (update_Profile_Form.eventArtist.value) { updateDoc(ref, { artistName: update_Profile_Form.eventArtist.value }) }
            if (update_Profile_Form.eventTime.value) { updateDoc(ref, { eventTime: update_Profile_Form.eventTime.value }) }
            if (update_Profile_Form.eventCapacity.value) { updateDoc(ref, { maxCapacity: parseInt(update_Profile_Form.eventCapacity.value) }) }
            if (update_Profile_Form.eventCost.value) {
              console.log(update_Profile_Form.eventCost.value)
              updateDoc(ref, { price: parseInt(update_Profile_Form.eventCost.value) })
            }
            if (update_Profile_Form.eventDesc.value) {updateDoc(ref, { eventDescription: update_Profile_Form.eventDesc.value }) }
            update_Profile_Form.reset()
            create_page_logged_in(id_int)
        })
    } else {
        create_page_logged_out();
    }
});

/************************************DISPLAY EVENT INFORMATION*************************************************************/

/* Method Functionality: function called by #onAuthStateChange authentication
*  Purpose: This is how we grab the information giving within the form and use it to alter our current information on the database.
*  Output: This will change the database however, there is no output.
*/
function create_page_logged_in(id_int) {
    getDoc(doc(db, 'event', id_int)).then((snapshot) => {
        tab.innerHTML = "Ticket Express - " + snapshot.data().eventName + "'s Profile"
        body.innerHTML = `<div class="row justify-content-center" >
    <div class="col-xl-6 col-lg-7 col-md-12">
      <div class="card profile-header">
        <div class="body">
          <div class="row">
            <div class="col-lg-8 col-md-8 col-12">
              <h4 class="m-t-0 m-b-0"><strong>${snapshot.data().eventName}</strong></h4>
              <h6> Date: ${snapshot.data().eventDate}</h6>
              <h6> Location: ${snapshot.data().eventLocation}</h6>
              <h6> Time: ${snapshot.data().eventTime}</h6>
              <h6> Artist Preforming: ${snapshot.data().artistName}</h6>
              <h6> Capacity: ${snapshot.data().maxCapacity}</h6>
              <h6> Cost: ${snapshot.data().price}</h6>
              <h6> Description: ${snapshot.data().eventDescription}</h6>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>`
    })
}

/************************************Create PAGE FAIL*************************************************************/

/* Method Functionality: function called by #onAuthStateChange authentication
*  Purpose: If no user is logged in this message will display
*  Output: This will change the body's html
*/
function create_page_logged_out() {
    body.innerHTML = "Sign in or Create an account to view account summary"
}


