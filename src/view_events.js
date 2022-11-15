// imports
import {initializeApp} from 'firebase/app';
import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore';
import firebaseConfig from './firebaseConfig';

// Initialize firebase
const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);
const eventCards = document.getElementById('eventCards');

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
                                            `<b>When?</b><br><br>`+
                                            `${eventData['eventDate']}<br>`+
                                            `${eventData['eventLocation']}`+
                                        `</p>`+
                                    `</div>`+
                                `</div>`+
                                //Button for viewing event (please make it look better i dont know how to)
                                '<button type="submit" class="btn btn-primary my-2 my-sm-0 btn-lg btn-block">View Event</button>'+
                                `<div class="form-group card" style="border:none;">`+
                                `</div>`+
                            `</div>`+
                        `</div>`+
                    `</div>&nbsp;`;
            eventCards.innerHTML += card;
        });
    });
