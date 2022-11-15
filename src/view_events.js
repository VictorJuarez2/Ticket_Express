// imports
import {initializeApp} from 'firebase/app';
import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore';
import firebaseConfig from './firebaseConfig';

// Initialize firebase
const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);
const eventCards = document.getElementById('eventCards');

let cardCount = 0;

const eventsRef = collection(db, "event");

getDocs(eventsRef)
    .then(events => {
        events.forEach(event =>{
            const eventData = event.data()
            let card = `<div class="card">`+
                        `<div class="card-body">`+
                            `${eventData['eventName']}`+
                            `<div class="card-group">`+
                                `<div class="card bg-white" style="border:none;">`+
                                    `<div class="card-body text-center">`+
                                        `<p class="card-text">`+
                                            `<b>Description</b><br><br>`+
                                                `${eventData['eventDescription']}<br>`+
                                        `</p>`+
                                    `</div>`+
                                `</div>`+
                                `<div class="card bg-white" style="border:none;">`+
                                    `<div class="card-body text-center">`+
                                        `<p class="card-text">`+
                                            `<b>Time</b><br><br>`+
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
        });
    });
