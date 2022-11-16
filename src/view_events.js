// imports
import {initializeApp} from 'firebase/app';
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
let eventDataSorted = [];
let eventDataOriginal = [];

const eventsRef = collection(db, "event");

findEvent.addEventListener('submit', event=>{
    let cardCount = 0;
    event.preventDefault();
    eventCards.innerHTML = '';
    eventDataOriginal = [];
    buttonSorting.style.display = 'none';

    let eventArtist = findEvent.artist.value;
    let eventLocation = findEvent.location.value;
    let priceRange = findEvent.price.value;
    let found = false;
    let priceInRange = true;

    getDocs(eventsRef)
        .then(events => {
            events.forEach(event =>{
                const eventData = event.data()                
                var allEmpty = (eventArtist == "" && eventLocation == "" && priceRange == "");
                
                if(!(priceRange == "")){
                    priceInRange = isPriceInRange(priceRange, eventData['price']);
                }
                if(priceInRange && !allEmpty && 
                    (eventData.artistName.toLowerCase().trim().includes(eventArtist.toLowerCase().trim()) || eventArtist == "") &&
                    (eventData.eventLocation.toLowerCase().trim().includes(eventLocation.toLowerCase().trim()) || eventLocation == "")){
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
                                        `<div class="form-group card" style="border:none;">`+
                                            `<label for="inputTickets"><b>Quantity</b></label>`+
                                            `<input class="form-control" list="ticketOptions" id="ticketNum${cardCount}" placeholder="" name="price">`+
                                            `<datalist id="ticketOptions">`+
                                                        `<option value="1">`+
                                                        `<option value="2">`+
                                                        `<option value="3">`+
                                                        `<option value="4">`+
                                                        `<option value="5">`+
                                            `</datalist>`+
                                        `</div>`+
                                        `<div class="card bg-white" style="border:none;">`+
                        `<div class="card-body text-center">`+
                        `<button type="button" class="btn bg-primary btn-lg text-white" onclick="click_on_row_button('${event.id}', ${cardCount})">Book Event</button>`+ //value="${id}"
                        `</div>`+
                    `</div>`+
                                    `</div>`+
                                `</div>`+
                            `</div>&nbsp;`;
                eventCards.innerHTML += card;
                cardCount+=1;
            }
        });
        if(found){
            buttonSorting.style.display = 'block';
        }
        if(cardCount == 0){
            document.getElementById('addEventError').innerHTML += `<div class="alert alert-danger alert-dismissible d-flex align-items-center fade show">
            <i class="bi-exclamation-octagon-fill"></i>
            <strong class="mx-2">Sorry!</strong> There are no Events available with this input.</i>
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
          </div>`;
          findEvent.reset();
        }
    });
});

//artist drop down
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

//location drop down
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

// View all Events
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

/**** Helper Functions ****/

/* Method Functionality: function called by #findEvent eventListener
*  Purpose: Determines if the price range selected fits with the price of a event
*  Output: Returns true if it fits with the given range input, else false
*/
function isPriceInRange(rangeIn, eventPrice){
    if(rangeIn != ""){
      if(rangeIn.toLowerCase().includes("low") && eventPrice < 100){
        return true
      }else if(rangeIn.toLowerCase().includes("medium") && eventPrice >= 100 && eventPrice < 250){
        return true;
      }else if(rangeIn.toLowerCase().includes("high") && eventPrice >= 250){
        return true;
      }
    }
    return false;
  }