// imports
import {initializeApp} from 'firebase/app';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore';
import firebaseConfig from './firebaseConfig';

// Initialize firebase
const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);

//Grabbing fields for all buttons in page
const findEvent = document.getElementById('findEvent');
const buttonSorting = document.getElementById('buttons');

//Initializing flight cards and global array to manipulate them
const eventCards = document.getElementById('eventCards');

const eventsRef = collection(db, "event");

const auth = getAuth(app)
let creatorID = ""
onAuthStateChanged(auth, (user) => {
    if(user){
        creatorID = user.uid
    }
    else{
        creatorID = ""
    }
})

/************************************DISPLAY EVENTS INFORMATION*************************************************************/

/* Method Functionality: function is automatically run and allows for us to keep the card info.
*  Purpose: This allows for us to generate each card and based on which we find necessary done in filter.
*  Output: HTML which contains all cards as well as their count.
*/
let cardCount = 0
getDocs(eventsRef)
    .then(events => {
        events.forEach(event =>{
            console.log("event");
            const eventData = event.data();
            console.log(`creator ID: ${eventData.creatorId}`);         
            if(eventData.creatorID == creatorID){
                    let card = `<div class="card">`+
                            `<div class="card-body">`+
                                `<h3><b>${eventData['eventName']}</b></h3>`+
                                `<div class="card-group">`+
                                    `<div class="card bg-white" style="border:none;">`+
                                        `<div class="card-body text-center">`+
                                            `<p class="card-text">`+
                                                `<b>Description</b><br>`+
                                                    `${eventData['eventDescription']}<br>`+
                                            `</p>`+
                                        `</div>`+
                                    `</div>`+
                                    `<div class="card bg-white" style="border:none;">`+
                                        `<div class="card-body text-center">`+
                                            `<p class="card-text">`+
                                                `<b>Time</b><br>`+
                                                `${eventData["eventTime"]}<br>`+
                                                `${eventData['eventDate']}<br>`+
                                                `${eventData['eventLocation']}`+
                                            `</p>`+
                                        `</div>`+
                                    `</div>`+
                                    `<div class="card bg-white" style="border:none;">`+
                    `<div class="card-body text-center">`+
                    `<button type="button" class="btn bg-primary btn-lg text-white" onclick="click_on_row_button('${event.id}')">Edit Event</button>`+ //value="${id}"
                    `</div>`+
                `</div>`+
                                `</div>`+
                            `</div>`+
                        `</div>&nbsp;`;
            eventCards.innerHTML += card;
            cardCount+=1;
        }
    });
});


/************************************Show Dropdown*************************************************************/

/* Method Functionality: Function automatically ran by code to show dropdown
*  Purpose: Display the possible options
*  Output: This will change the HTML to display information based on available events there is no output.
*/
getDocs(eventsRef)
    .then((events)=>{
        events.docs.forEach(event =>{
            let artist = document.getElementById("artistList");
            var option1 = document.createElement("option");

            let artist_name = event.data()['artistName'];

            option1.value = artist_name
            option1.text = artist_name
            artist.appendChild(option1);
        })
    });

/************************************Show Dropdown*************************************************************/

/* Method Functionality: Function automatically ran by code to show dropdown
*  Purpose: Display the possible options
*  Output: This will change the HTML to display information based on available events there is no output.
*/
getDocs(eventsRef)
    .then((events)=>{
        events.docs.forEach(event =>{
            let artist = document.getElementById("locationList");
            var option1 = document.createElement("option");

            let artist_name = event.data()['eventLocation'];

            option1.value = artist_name
            option1.text = artist_name
            artist.appendChild(option1);
        })
    });

/************************************View All Events*************************************************************/

/* Method Functionality: Function ran which viewEvents listener is clicked.
*  Purpose: Display all possible events.
*  Output: This will change the HTML to display information based on available events there is no output.
*/
const viewEvent = document.getElementById('modal_view_right');
const addEventInfo = document.getElementById('addEvent');
viewEvent.addEventListener('click', (event)=>{
    getDocs(eventsRef)
    .then((events)=>{
        addEventInfo.innerHTML = ''
        events.docs.forEach((event) => {
        const eventData = event.data()
        let card = `<div class="card center" style="width: 25rem; border:none;">
        <div class="card-header">
            <b>${eventData.eventDescription}</b>
        </div>
        <ul class="list-group list-group-flush">
          <li class="list-group-item" style="border:none;"><b>Artist: </b>${eventData.artistName}</li>
          <li class="list-group-item" style="border:none;"><b>Event Name: </b>${eventData.eventName}</li>
          <li class="list-group-item" style="border:none;"><b>Date: </b>${eventData.eventDate}</li>
          <li class="list-group-item" style="border:none;"><b>Time: </b>${eventData.eventTime}</li>
          <li class="list-group-item" style="border:none;"><b>Price: </b>${eventData.price}</li>
        </ul>
      </div><div>&nbsp;</div>`;
      addEventInfo.innerHTML += card
  
      });
    });
  })