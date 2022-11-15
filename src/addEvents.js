// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
    getFirestore, getDocs, collection, connectFirestoreEmulator, addDoc, doc
} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import firebaseConfig from "./firebaseConfig"


// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

const db = getFirestore();

const eventRef = collection(db, 'Ticket');

// Appending Airline Flights Cities to drop down inputs
getDocs(eventRef)
    .then((snapshot) => {
        snapshot.docs.forEach((Event) => {
            let toCities = document.getElementById("toList");
            let fromCities = document.getElementById("fromList");
            var option1 = document.createElement("option");
            var option2 = document.createElement("option");

            let city_name = City.data()['CityName'];

            if (city_name.includes(",")) {
                option1.value = city_name.concat(" - " + City.data()['Code']);
                option1.text = city_name.concat(" - " + City.data()['Code']);
                option2.value = city_name.concat(" - " + City.data()['Code']);
                option2.text = city_name.concat(" - " + City.data()['Code']);
                toCities.appendChild(option1);
                fromCities.appendChild(option2);
            } else {
                option1.value = city_name.concat(", " + City.data()['Country'] + " - " + City.data()['Code']);
                option1.text = city_name.concat(", " + City.data()['Country'] + " - " + City.data()['Code']);
                option2.value = city_name.concat(", " + City.data()['Country'] + " - " + City.data()['Code']);
                option2.text = city_name.concat(", " + City.data()['Country'] + " - " + City.data()['Code']);
                toCities.appendChild(option1);
                fromCities.appendChild(option2);
            }
        })
    });


// Depart and Arrival Filter
// Obtains todays current date
var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0');
var yyyy = today.getFullYear();
today = yyyy + '-' + mm + '-' + dd;

// Sets the min value of both the arrive and depart calenders to todays date by default
var depart_id = document.getElementById("depart");
var arrive_id = document.getElementById("arrive");
depart_id.min = today;
arrive_id.min = today;


depart_id.onchange = function () {
    var input = document.getElementById("arrive");
    input.min = this.value;
}

arrive_id.onchange = function () {
    var input = document.getElementById("depart");
    input.max = this.value;
}

// Add a Flight
const addFlightForm = document.querySelector(".inputBoxes");

addFlightForm.addEventListener('submit', (event) => {
    event.preventDefault();
    addDoc(flightsRef, {
        ['Airplane Id']: addFlightForm.airline_id.value,
        ['Arrival Date']: addFlightForm.arrival_date.value,
        ['Arrival Time']: addFlightForm.arrival_time.value,
        ['Economy Capacity']: addFlightForm.economy_capacity.value,
        ['First Class Capacity']: addFlightForm.firstClass_capacity.value,
        ['Economy init Capacity']: addFlightForm.economy_capacity.value,
        ['First Class init Capacity']: addFlightForm.firstClass_capacity.value,
        ['Departure Date']: addFlightForm.departure_date.value,
        ['Departure Time']: addFlightForm.departure_time.value,
        Distance: addFlightForm.distance.value,
        From: addFlightForm.from.value,
        Make: addFlightForm.make.value,
        Model: addFlightForm.model.value,
        ['Economy Price']: addFlightForm.economy_price.value,
        ['First Class Price']: addFlightForm.firstClass_price.value,
        ['Flight Cost']: addFlightForm.flight_cost.value,
        To: addFlightForm.to.value
    })
        .then(() => {
            addFlightForm.reset();
            depart_id.max = "";
            arrive_id.min = today;
            alert("Flight successfully added!");
        })
});

// Add a City 
const addCityForm = document.querySelector(".addCity");
addCityForm.addEventListener('submit', (event) => {
    event.preventDefault();
    addDoc(citiesRef, {
        CityName: addCityForm.city_name.value,
        Code: addCityForm.code.value,
        Country: addCityForm.country.value,
        Description: document.getElementById("description").value,
        Image: addCityForm.image.value,
        Latitude: addCityForm.latitude.value,
        Longitude: addCityForm.longitude.value,
        Population: addCityForm.population.value
    })
        .then(() => {
            addCityForm.reset();
            alert("City successfully added!");
            location.reload();
            depart_id.max = "";
            depart_id.min = today;
            arrive_id.min = today;
            arrive_id.max = "";
        })
});
