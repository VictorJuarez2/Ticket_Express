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

/*
getDocs(flightsCitiesRef).then((snapshot) => {
    snapshot.docs.forEach((document) => {
        if (!servicedCities.includes(document.data().CityName)) {

            const city = fixCityName(document.data().CityName);

            let card = '<div class="col-xs-12 col-sm-6 col-md-4" style="height: 400px;">' +
                '<div class="team-single">' +
                '<div class="content-area">' +
                '<div class="side-one">' +
                '<div class="card shadow">' +
                '<div class="card-body text-center">' +
                `<div class="img-area"><img src="${document.data().Image}" alt="${city}"></div>` +
                `<h4><b>${city}</b></h4>` +
                `<p><i>${document.data().Country}</i></p>` +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="side-two">' +
                '<div class="card shadow">' +
                '<div class="card-body text-center mt-4">' +
                `<h4><b>${city}</b></h4>` +
                `<p>${document.data().Description}</p>` +
                `<br><i>Population: ${document.data().Population}</i><br>` +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';

            cards.innerHTML += card
            servicedCities.push(document.data().CityName.toLowerCase());
        }
    })
})


/* Method Functionality: Display each flight inforamtion and how much money made on each flight in card fashion.
*  Purpose: the admin or the manager can see how much money each flight has made and how many reamininig seats on each flight.
*  Output: HTML block containing the flight cards and their information.
*/
/*
function createFlightInfoCards() {
    getDocs(flightsRef).then((snapshot) => {
        snapshot.docs.forEach((document) => {
            let eco_money_made = document.data()['Economy init Capacity'] - document.data()['Economy Capacity'];
            eco_money_made = eco_money_made * document.data()['Economy Price'];

            let first_class_money_made = document.data()['First Class init Capacity'] - document.data()['First Class Capacity'];
            first_class_money_made = first_class_money_made * document.data()['First Class Price'];

            let card = `<div class="col-xs-12 col-sm-6 col-md-4" style="height: 550px;">
        <div class="team-single">
            <div class="content-area">
                <div class="side-one">
                    <div class="card shadow">
                        <div class="card-body text-center">
                            <img src="assets/Agile_Airlines_Logo_Attempt1.png" style="max-width: 50px; max-height: 50px;" class="d-inline-block align-text-top"> <b>Agile Airlines - AAR${document.data()['Airplane Id']}</b>
                            <hr>
                            <p><i><b>From</b>: ${document.data().From}</i></p>
                            <p><i><b>To</b>: ${document.data().To}</i></p>
                            <p><i><b>Economy Price</b>: $${document.data()['Economy Price']}</i></p>
                            <p><i><b>First Class Price</b>: $${document.data()['First Class Price']}</i></p>
                            <p><i><b>Economy Remaining Seats</b>: ${document.data()['Economy Capacity']}</i></p>
                            <p><i><b>First Class Remainig Seats</b>: ${document.data()['First Class Capacity']}</i></p>
                            <p><i><b>Economy Booked Seats</b>: ${document.data()['Economy init Capacity'] - document.data()['Economy Capacity']}</i></p>
                            <p><i><b>First Class Booked Seats</b>: ${document.data()['First Class init Capacity'] - document.data()['First Class Capacity']}</i></p>
                    </div>
                    </div>
                </div>
                <div class="side-two">
                    <div class="card shadow">
                        <div class="card-body text-center mt-4">
                          <img src="assets/Agile_Airlines_Logo_Attempt1.png" style="max-width: 50px; max-height: 50px;" class="d-inline-block align-text-top"> <b>Agile Airlines - AAR${document.data()['Airplane Id']}</b>
                            <hr>
                          <p><i><b>Economy Ticket Revenue</b>: $${eco_money_made}</i></p>
                          <p><i><b>First Class Ticket Revenue</b>: $${first_class_money_made}</i></p>
                          <b>Economy Ticket Capacity:<br><i>(Seats Remaining)</i></b><br>${(parseInt(document.data()['Economy init Capacity'] - document.data()['Economy Capacity']) / parseInt(document.data()['Economy init Capacity'])) * 100}%
                          <div class="progress">
                            <div class="progress-bar bg-success" role="progressbar" aria-valuenow="70"
                            aria-valuemin="0" aria-valuemax="100" style="width:${(parseInt(document.data()['Economy init Capacity'] - document.data()['Economy Capacity']) / parseInt(document.data()['Economy init Capacity'])) * 100}%">
                              <span class="sr-only">70% Complete</span>
                            </div>
                          </div><br><br>
                          <b>First Class Ticket Capacity:<br><i>(Seats Remaining)</i></b><br>${(parseInt(document.data()['First Class init Capacity'] - document.data()['First Class Capacity']) / parseInt(document.data()['First Class init Capacity'])) * 100}%
                          <div class="progress">
                            <div class="progress-bar bg-warning" role="progressbar" aria-valuenow="70"
                            aria-valuemin="0" aria-valuemax="100" style="width:${(parseInt(document.data()['First Class init Capacity'] - document.data()['First Class Capacity']) / parseInt(document.data()['First Class init Capacity'])) * 100}%">
                              <span class="sr-only">70% Complete</span>
                            </div>
                          </div>
                          <br><br>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </div>`;

            cardsForFlights.innerHTML += card;

        })
    })
}

function fixCityName(city) {
    const newCity = city.split(" ");
    for (var i = 0; i < newCity.length; i++) {
        newCity[i] = newCity[i].charAt(0).toUpperCase() + newCity[i].slice(1);
    }
    const cityName = newCity.join(" ");
    return cityName
}

let map;
window.onload = function initMap() {
    var options = {
        zoom: 2,
        center: { lat: 20, lng: -10 }
    }

    map = new google.maps.Map(document.getElementById('map'), options);

    getDocs(flightsCitiesRef).then((snapshot) => {
        snapshot.docs.forEach((document) => {
            addMarker({ lat: parseFloat(document.data().Latitude), lng: parseFloat(document.data().Longitude) });
        })
    })

    function addMarker(coords) {
        var marker = new google.maps.Marker({
            position: coords,
            map: map
        });
    }
}*/