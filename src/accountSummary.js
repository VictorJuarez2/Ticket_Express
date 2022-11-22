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
        //snapshot = getDoc(doc(db, 'Airline Users', user.uid)).then(()=>{
        create_Ticket_Table(uid)
        create_page_logged_in(uid)
        // This is done within the auth State Change due to the fact that we need the uid whenever this is called
        const update_Profile_launcher = document.querySelector(".profile-page")
        const update_Profile_Form = document.getElementById("update")
        update_Profile_launcher.addEventListener('submit', (event) => {
            event.preventDefault();
            update_Profile_launcher.hidden = true;
            update_info.hidden = false;
            update_Profile_Form.addEventListener('submit', (event) => {
                event.preventDefault();
                let ref = doc(db, 'Account', uid);
                if (update_Profile_Form.Name.value) { updateDoc(ref, { Name: update_Profile_Form.Name.value }); }
                if (update_Profile_Form.Balance.value) { updateDoc(ref, { Balance: parseInt(update_Profile_Form.Balance.value) }) }
                /*
                if (update_Profile_Form.Phone_Number.value) { updateDoc(ref, { Phone_Number: update_Profile_Form.Phone_Number.value }) }
                if (update_Profile_Form.Image.value) { updateDoc(ref, { image: update_Profile_Form.Image.value }) }*/
                update_Profile_Form.reset()
                update_Profile_launcher.hidden = false;
                update_info.hidden = true;
                create_page_logged_in(uid)
            })
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

//Getting Flights collection
const ticketsRef = collection(db, 'Ticket');

async function create_Ticket_Table(userId) {
    (async () => {
        const mainRef = await doc(db, 'Account', userId);
        const main = await getDoc(mainRef)
        getDocs(ticketsRef)
            .then((snapshot) => {
                snapshot.docs.forEach((ticket) => {
                    (async () => {
                        let dest = main.data().Tickets_Purchased
                        let eventDoc = doc(db, "event", ticket.data().eventID)
                        let event = await getDoc(eventDoc)
                        if (dest.includes(ticket.id) && event.exists()) {
                            let departure = event.data()['eventDate']
                            let strDate = new Date(departure)
                            if (strDate < d) {
                                let card = `<div class="card">` +
                                    `<div class="card-body">` +
                                    `Ticket Express - ${ticket.data()['ticketType']}` +
                                    `<div class="card-group">` +
                                    `<div class="card bg-white" style="border:none;">` +
                                    `<div class="card-body text-center">` +
                                    `<p class="card-text">` +
                                    `<b>Event Name / Date</b><br><br>` +
                                    `${event.data()['eventName']}<br>` +
                                    `${event.data()['eventDate']}` +
                                    `</p>` +
                                    `</div>` +
                                    `</div>` +
                                    `<div class="card bg-white" style="border:none;">` +
                                    `<div class="card-body text-center">` +
                                    `<p class="card-text">` +
                                    `<b>Event Location / Time</b><br><br>` +
                                    `${event.data()['eventLocation']}<br>` +
                                    `${event.data()['eventTime']}` +
                                    `</p>` +
                                    `</div>` +
                                    `</div>` +
                                    `<div class="card bg-white" style="border:none;">` +
                                    `<div class="card-body text-center">` +
                                    `<p class="card-text">` +
                                    `<b>Artist</b><br><br>` +
                                    `${event.data()['artistName']}` +
                                    `</p>` +
                                    `</div>` +
                                    `</div>` +
                                    `<div class="card bg-white" style="border:none;">` +
                                    `<div class="card-body text-center">` +
                                    `<b>Date Purchased</b><br><br>` +
                                    `${ticket.data()['DateCreated']}` +
                                    `</div>` +
                                    `</div>` +
                                    `<div class="card bg-white" style="border:none;">` +
                                    `<div class="card-body text-center">` +
                                    `<b>Price</b><br><br>` +
                                    `$${ticket.data()['cost']}` +
                                    `</div>` +
                                    `</div>` +
                                    `</div>` +
                                    `</div>` +
                                    `</div>&nbsp;`;

                                PrevflightCards.innerHTML += card;
                            } else {
                                let card = `<div class="card">` +
                                    `<div class="card-body">` +
                                    `Ticket Express - ${ticket.data()['ticketType']} Admission`  +
                                    `<div class="card-group">` +
                                    `<div class="card bg-white" style="border:none;">` +
                                    `<div class="card-body text-center">` +
                                    `<p class="card-text">` +
                                    `<b>Event Name / Date</b><br><br>` +
                                    `${event.data()['eventName']}<br>` +
                                    `${event.data()['eventDate']}` +
                                    `</p>` +
                                    `</div>` +
                                    `</div>` +
                                    `<div class="card bg-white" style="border:none;">` +
                                    `<div class="card-body text-center">` +
                                    `<p class="card-text">` +
                                    `<b>Event Location / Time</b><br><br>` +
                                    `${event.data()['eventLocation']}<br>` +
                                    `${event.data()['eventTime']}` +
                                    `</p>` +
                                    `</div>` +
                                    `</div>` +
                                    `<div class="card bg-white" style="border:none;">` +
                                    `<div class="card-body text-center">` +
                                    `<p class="card-text">` +
                                    `<b>Artist</b><br><br>` +
                                    `${event.data()['artistName']}` +
                                    `</p>` +
                                    `</div>` +
                                    `</div>` +
                                    `<div class="card bg-white" style="border:none;">` +
                                    `<div class="card-body text-center">` +
                                    `<b>Date Purchased</b><br><br>` +
                                    `${ticket.data()['DateCreated']}` +
                                    `</div>` +
                                    `</div>` +
                                    `<div class="card bg-white" style="border:none;">` +
                                    `<div class="card-body text-center">` +
                                    `<b>Price</b><br><br>` +
                                    `$${ticket.data()['cost']}` +
                                    `</div>` +
                                    `</div>` +
                                    `<div class="card bg-white" style="border:none;">` +
                                    `<div class="card-body">` +
                                    `<br><button type="submit" class="btn bg-primary btn-lg text-white" form = "flightCards" value = "${ticket.id}">Remove</button></br>` + //value="${id}"
                                    `</div>` +
                                    `</div>` +
                                    `</div>` +
                                    `</div>` +
                                    `</div>&nbsp;`;

                                flightCards.innerHTML += card;
                            }
                        }
                    })();
                });
            });
    })();
}

//Remove and Refund
flightCards.addEventListener('submit', remove_ticket)
function remove_ticket(event) {
    event.preventDefault()
    getDoc(doc(db, 'Ticket', event.submitter.value)).then((ticket_snapshot) => {
        getDoc(doc(db, 'event', ticket_snapshot.data()['eventID'])).then((event_snapshot) => {
            let curr_seats = parseInt(event_snapshot.data()['maxCapacity'])
            curr_seats = parseInt(curr_seats) + 1
            updateDoc(doc(db, 'event', ticket_snapshot.data()['eventID']), { ['maxCapacity']: parseInt(curr_seats) })
        })
        issue_Refund(ticket_snapshot)
        create_Ticket_Table(uid)
        deleteDoc(doc(db, 'Ticket', event.submitter.value))

        getDoc(doc(db, 'Account', uid)).then((user_snapshot) => {
            var user_tickets = user_snapshot.data().Tickets_Purchased
            for (var i = 0; i < user_tickets.length; i++) {
                if (user_tickets[i] == event.submitter.value) {
                    user_tickets.splice(i, 1)
                }
            }
            updateDoc(doc(db, 'Account', uid), { Tickets_Purchased: user_tickets })
            create_page_logged_in(uid)
        })
        flightCards.innerHTML = ''
        PrevflightCards.innerHTML = ''
    })
}

function issue_Refund(ticket) {
    (async () =>{
        getDoc(doc(db, 'Account', uid)).then((snapshot) => {
            let past_Balance = snapshot.data().Balance
            let newBalance = parseInt(past_Balance) + parseInt(ticket.data()['cost'])
            console.log(newBalance)
            updateDoc(doc(db, 'Account', uid), { Balance: newBalance })
        })
    })();
}

