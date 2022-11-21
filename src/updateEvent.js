import firebaseConfig from './firebaseConfig'
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import {
    getFirestore, collection, getDocs, getDoc, deleteDoc, doc, updateDoc, FieldValue, onSnapshotsInSync
} from 'firebase/firestore';

// Initializing firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore()

// Getting portions of the page
const tab = document.getElementById("title")
const body = document.getElementById("profile-page")
const update_info = document.getElementById("update_form")
const change_booking = document.querySelector(".Change")
let flightCards = document.getElementById('flightCards');
let PrevflightCards = document.getElementById('PrevflightCards');
var uid;
/*
var today = new Date();
let yyyy = today.getFullYear();
let dd = String(today.getDate()).padStart(2, '0');
let mm = String(today.getMonth() + 1).padStart(2, '0');
today = yyyy + '-' + mm + '-' + dd;
const dob = document.getElementById("DOB")
dob.max = today;*/

const d = new Date();


onAuthStateChanged(auth, (user) => {
    if (user) {
        uid = user.uid;
        id = //whatever button we press
        create_page_logged_in(id)
        // This is done within the auth State Change due to the fact that we need the uid whenever this is called
        const update_Profile_Form = document.getElementById("update_form")
        update_Profile_Form.addEventListener('submit', (event) => {
            event.preventDefault();
            let ref = doc(db, 'event', );
            if (update_Profile_Form.eventName.value) { updateDoc(ref, { eventName: update_Profile_Form.eventName.value }); }
            if (update_Profile_Form.eventLocation.value) { updateDoc(ref, { eventLocation: update_Profile_Form.eventLocation.value }) }
            if (update_Profile_Form.eventDate.value) { updateDoc(ref, { eventDate: update_Profile_Form.eventDate.value }) }
            if (update_Profile_Form.eventArtist.value) { updateDoc(ref, { artistName: update_Profile_Form.eventArtist.value }) }
            if (update_Profile_Form.eventTime.value) { updateDoc(ref, { eventTime: update_Profile_Form.eventTime.value }) }
            if (update_Profile_Form.eventCapacity.value) { updateDoc(ref, { maxCapacity: parseInt(update_Profile_Form.eventCapacity.value) }) }
            if (update_Profile_Form.eventCost.value) { updateDoc(ref, { price: parseInt(update_Profile_Form.eventCost.value) }) }
            if (update_Profile_Form.eventDesc.value) { updateDoc(ref, { eventDescription: parseInt(update_Profile_Form.eventDesc.value) }) }
            update_Profile_Form.reset()
            create_page_logged_in(uid)
        })
    } else {
        create_page_logged_out();
    }
});

//Page set Up
function create_page_logged_in(userID) {
    getDoc(doc(db, 'Account', userID)).then((snapshot) => {

        tab.innerHTML = "Ticket Express - " + snapshot.data().userName + "'s Profile"
        body.innerHTML = `<div class="row justify-content-center" >
    <div class="col-xl-6 col-lg-7 col-md-12">
      <div class="card profile-header">
        <div class="body">
          <div class="row">
            <div class="col-lg-8 col-md-8 col-12">
              <h4 class="m-t-0 m-b-0"><strong>${snapshot.data().Name}</strong></h4>
              <h6> Balance: ${snapshot.data().Balance}</h6>
              <div>
                <button type = "submit" value = "submit" class="btn btn-primary btn-round edit_profile">Edit Profile</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>`
    })
}

function create_page_logged_out() {
    body.innerHTML = "Sign in or Create an account to view account summary"
}


