// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, getDocs, collection, connectFirestoreEmulator, getDoc, doc,updateDoc, arrayUnion, Timestamp, addDoc} from "firebase/firestore";
import firebaseConfig from "./firebaseConfig";
import { getAuth, onAuthStateChanged } from "firebase/auth";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();
const flightsRef = collection(db, 'Airline Flights');
const usersRef = collection(db, 'Airline Users');

//Retrieve Information (id of flight and number amount of tickets wanted to purchase) From 'flights.html' Page
let id_int = JSON.parse(localStorage.getItem('id'));
let ticket = JSON.parse(localStorage.getItem('tickets'));

console.log(id_int);
console.log(ticket);

//Grabbing fields with admin
const admin = document.querySelectorAll('.admin');
const userUI = document.querySelectorAll('.user');

//Initializing global variables to use
let promocode = false;          //Boolean sed to determine state of promotion code card
const promotionCode = "AGILE"   //Global used to determine promo code
let economyActive = true;       //Used to determine the state of economy price button (green) and cart prices
let firstClassActive = false;   //Used to determine the state of the first class price button (yellow) and cart prices
let userIdPurchase = "";        //Used to determine if normal user is logged in, otherwise it will stay empty -> used in purchase button event listener to verify user state
let currPrice = 0;              //Used to keep track of current price, this will change depending on econmy/first class state

//Grabbing fields for all buttons in page
const purchaseButton = document.getElementById('purchase');
var today = new Date();
let yyyy = today.getFullYear();
let dd = String(today.getDate()).padStart(2, '0');
let mm = String(today.getMonth() + 1).padStart(2, '0');
today = yyyy + '-' + mm + '-' + dd;

console.log(today)


//ON AUTH STATE CHANGE USED TO DETERMINE STATE OF THE PAGE
const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  if (user) {
    getCartInfo("economy");
    user.getIdTokenResult()
      .then((idTokenResult) => {
        admin.forEach(item => item.style.display = 'None');
        userIdPurchase = user.uid;
        changeUserMessage(user.uid);
        showUserNames(user.uid);
      })
  } else {
    // Show no user UI
    showNoUserNames();
    getCartInfo("economy");
  }
});


/************************************CHANGE PERSONALIED HEADER MESSAGE*************************************************************/

/* Method Functionality: function called by #onAuthStateChange authentication
*  Purpose: On "user" state, regular bookHeader personalMessage style is hidden and personalMessage style is displayed
*  Output: Personalized message for users is displayed
*/
async function changeUserMessage(id){
  const bookHeader = document.getElementById('finalizeBooking');
  const personalMessage = document.getElementById('normalBookingDesc');
  const userDoc = doc(db, 'Account', id);
  const docSnap = await getDoc(userDoc);

  bookHeader.innerHTML = "";
  personalMessage.style.display = 'none';
  bookHeader.innerHTML += `<h1 class="text-black align-items-center" style="text-align: center;" id="normalBookingDesc">${docSnap.data().Name}, Let's Finalize Your Booking</h1>`
}

/* Method Functionality: function called by #onAuthStateChange authentication
*  Purpose: On "admin/manager" state, regular bookHeader personalMessage style is hidden and personalMessage style is displayed
*  Output: Personalized message for admin/managers is displayed
*/
async function changeManagerMessage(id){
  const bookHeader = document.getElementById('finalizeBooking');
  const personalMessage = document.getElementById('normalBookingDesc');
  const userDoc = doc(db, 'Airline Users', id);
  const docSnap = await getDoc(userDoc);

  bookHeader.innerHTML = "";
  personalMessage.style.display = 'none';
  bookHeader.innerHTML += `<h1 class="text-black align-items-center" style="text-align: center;" id="normalBookingDesc">Welcome back ${docSnap.data().Name}</h1>`;
  bookHeader.innerHTML += `<h3 class="text-black align-items-center" style="text-align: center;"><i>Let's book a flight for someone</i></h3>`;
}

/************************************SHOW USER CARDS IN BILLING*************************************************************/

/* Method Functionality: function called by #onAuthStateChange authentication
*  Purpose: On "user" state, 1 special user card and rest of regular cards are displayed, calling "getCardUser" and "getCardNotUser", for the number of tickets ordered-1, error is displayed if ticket number != (<5)
*  Output: All n-cards-1 to fill-in are displayed for a user.
*/
async function showUserNames(id){
  document.getElementById('errorMessage').style.display = "none";
  document.getElementById('billing').style.display = "block";
  const userCards = document.getElementById('cards');

  if((Number.isInteger(parseInt(ticket)) || ticket == "") && parseInt(ticket) <= 5){
    userCards.innerHTML = "";
    const userDoc = doc(db, 'Account', id);
    const docSnap = await getDoc(userDoc);

    if(ticket != ""){
      userCards.innerHTML += getCardUser(docSnap.data().Name, docSnap.data().Email, 123, docSnap.data());
      for(let i = 0; i < parseInt(ticket)-1; i++){
        userCards.innerHTML += getCardNotUser(i+1);
      }
    }else{
      userCards.innerHTML += getCardUser(docSnap.data().Name, docSnap.data().Email, 123, docSnap.data());
    }

  }else{ //Gives error if no integer number is inputed
    userCards.innerHTML = ""
    userCards.innerHTML += getCardError();
  }
}

/* Method Functionality: function called by #showNoUserNames and #showUserName
*  Purpose: Depending on the user state, a singular regular card is displayed with required inputs
*  Output: A regular fill-in card is added and displayed on billing section of the page
*/
function getCardNotUser(num){
  return `<div class="col-lg-12">`+
  `<b>Person ${num}</b>`+
  `<div class="card mb-4">`+
    `<div class="card-body">`+
      `<div class="row">`+
        `<div class="col-sm-3">`+
          `<p class="mb-0 text-primary">First Name</p>`+
        `</div>`+
        `<div class="col-sm-9">`+
          `<input type="text" class="form-control" id="firstName" placeholder="Enter first name" required>`+
        `</div>`+
      `</div>`+
      `<hr>`+
      `<div class="row">`+
        `<div class="col-sm-3">`+
          `<p class="mb-0 text-primary">Last Name</p>`+
        `</div>`+
        `<div class="col-sm-9">`+
          `<input type="text" class="form-control" id="lastName" placeholder="Enter last name" required>`+
        `</div>`+
      `</div>`+
      `<hr>`+
      `<div class="row">`+
        `<div class="col-sm-3">`+
          `<p class="mb-0 text-primary">Email</p>`+
        `</div>`+
        `<div class="col-sm-9">`+
          `<input type="email" class="form-control" id="email" placeholder="Enter email" required>`+
        `</div>`+
      `</div>`+
      `<hr>`+
      `<div class="row">`+
        `<div class="col-sm-3">`+
          `<p class="mb-0 text-primary">Phone</p>`+
        `</div>`+
        `<div class="col-sm-9">`+
          `<input type="text" class="form-control" id="phone" placeholder="Enter phone number" required>`+
        `</div>`+
      `</div>`+
    `</div>`+
  `</div>`+
`</div>`;
}

/* Method Functionality: function called by #showUserName
*  Purpose: Specific to only user state, a singular regular card is displayed with already filled-in inputs
*  Output: A single user-specific filled-in card is added and displayed on billing section of the page
*/
function getCardUser(fullName, email, phoneNum){
  return `<div class="col-lg-12">`+
  `<b>${fullName}</b>`+
  `<div class="card mb-4">`+
    `<div class="card-body">`+
      `<div class="row">`+
        `<div class="col-sm-3">`+
          `<p class="mb-0 text-primary">Full Name</p>`+
        `</div>`+
        `<div class="col-sm-9">`+
         `<p class="text-black mb-0">${fullName}</p>`+
        `</div>`+
      `</div>`+
      `<hr>`+
      `<div class="row">`+
        `<div class="col-sm-3">`+
          `<p class="mb-0 text-primary">Email</p>`+
        `</div>`+
        `<div class="col-sm-9">`+
          `<p class="text-black mb-0">${email}</p>`+
        `</div>`+
      `</div>`+
      `<hr>`+
      `<div class="row">`+
        `<div class="col-sm-3">`+
          `<p class="mb-0 text-primary">Phone</p>`+
        `</div>`+
        `<div class="col-sm-9">`+
          `<p class="text-black mb-0">PhoneNum</p>`+
        `</div>`+
      `</div>`+
    `</div>`+
  `</div>`+
`</div>`;
}

/************************************DISPLAY CART INFORMATION*************************************************************/

/* Method Functionality: function called by #onAuthStateChange authentication
*  Purpose: Depending on the state of the "flightsClass", the cart information is displayed with the proper prices of the class (also adds promotion card if corrct promo code in inputed)
*  Output: The 'cartInfo' cart section is initially cleaned and updated depending on state if it is an economy or first class ticket
*/
async function getCartInfo(flightClass){
  const cart = document.getElementById('cartInfo');
  const eventDoc = doc(db, 'event', id_int);
  const docSnap = await getDoc(eventDoc);
  let price = 0;
  let promoChange = "";
  cart.innerHTML = "";
  let promoState = "";

  if(ticket == ""){
    ticket = "1";
  }

  price = docSnap.data()['price'];

  cart.innerHTML += `<h4 class="d-flex justify-content-between align-items-center mb-3">
  <span class="text-muted">Your cart</span>
  <span class="badge badge-secondary badge-pill">${ticket}</span>
</h4>
<ul class="list-group mb-3">
  <li class="list-group-item d-flex justify-content-between lh-condensed">
    <div>
      <h6 class="my-0">${docSnap.data()['eventName']}</h6>
      <small class="text-muted"><b>Artist: </b>${docSnap.data().artistName}</small><br>
      <small class="text-muted"><b>Location: </b>${docSnap.data().eventLocation}</small><br>
      <small class="text-muted"><b>Time: </b>${docSnap.data().eventTime}</small><br>
      <small class="text-muted"><b>Capacity: </b>${docSnap.data()['maxCapacity']}</small><br>
      <small class="text-muted"><b>Description: </b>${docSnap.data()['eventDescription']}</small><br><br>
      <small class="text-muted"><b>Price: </b>$${docSnap.data()['price']}</small>
    </div>
    <span class="text-muted">$${price}x${ticket}</span>
  </li>
  <li class="list-group-item d-flex justify-content-between bg-light" id="promo">`+
  `</li>
  <li class="list-group-item d-flex justify-content-between">
    <span>Total (USD)</span>
    <strong>$${parseInt(price*ticket)}</strong>
  </li>
</ul>`;
  currPrice = price;
}

/************************************PURCHASE BUTTON METHODS*************************************************************/

/* Method Functionality: purchaseButton -> addEventListener
*  Purpose: On "submit", it will call buyTicketNonUse if user state says a user is not logged in, else, it calls butTicketUser if user is logged in
*  Output: Depending on the state, if user or non user is not able to buy a ticket a FAIL message is displayed, else a SUCESS message is displayed
*/
purchaseButton.addEventListener('submit', (event)=>{
  event.preventDefault();

  if(userIdPurchase != ""){
    buyTicketUser(userIdPurchase);
  }else{
    let mainUserEmail = purchaseButton.email[purchaseButton.email.length - 1].value

    purchaseButton.email.forEach(element => {
      if(mainUserEmail == element.value){
        buyTicketNonUser(element.value, true);
      }else{
        buyTicketNonUser(element.value, false);
      }
    });
  }
});


/* Method Functionality: function called by #purchaseButton eventListener
*  Purpose: Grabs UID from global variable, finds the document in collection, and updates firebase if user is able to buy a ticket
*  Output: Depending on the state, if user or non user is not able to buy a ticket a FAIL message is displayed, else a SUCESS message is displayed
*/
async function buyTicketUser(id){
  const userDoc = doc(db, 'Account', id);
  const docSnapUser = await getDoc(userDoc);

  const eventDoc = doc(db, 'event', id_int); //events
  const docSnapEvent = await getDoc(eventDoc);
  
  if(docSnapUser.data().Balance > currPrice){
    //Create new ticket document
    (async() => {
      const docRef = await addDoc(collection(db, "Ticket"), { //Ticket
        ticketType: "gen",
        eventID: id_int,
        cost: currPrice,
        DateCreated: today
      });

      updateDoc(docSnapUser.ref, {Tickets_Purchased: arrayUnion(docRef.id), Balance: docSnapUser.data().Balance - currPrice*ticket}); //Update user document
      updateDoc(docSnapEvent.ref, {['maxCapacity']: docSnapEvent.data()['maxCapacity'] - 1});
                                        
      })();
      displaySuccess();
      purchaseButton.reset();
      var top = document.getElementById("top");
      top.scrollIntoView();
      let timer = setTimeout(function () {
        window.location.href = 'viewEvents.html'
      }, 5000);
  }else{
    displayFundingError()
    purchaseButton.reset();
    var top = document.getElementById("top");
    top.scrollIntoView();
  }
  
}

/* Method Functionality: function called by #purchaseButton eventListener
*  Purpose: Grabs UID from last email submitted on the form, finds the document in collection, and updates firebase ELSE if doc doesn't exist, directly buy the tickets
*  Output: Depending on the state, if user or non user is not able to buy a ticket a FAIL message is displayed, else a SUCESS message is displayed
*/
async function buyTicketNonUser(email, isMainUser){
  const userDoc = doc(db, 'event', id_int);
  const docSnapEvent = await getDoc(userDoc);

  var mainUserFound = false;

  getDocs(usersRef)
  .then((snapshot)=>{
    snapshot.docs.forEach((user) => {
      if(user.data().Email.toLowerCase() == email.toLowerCase() && isMainUser){
        buyTicketUser(user.id);
        mainUserFound = true;
    }else if(user.data().Email.toLowerCase() == email.toLowerCase()){
      console.log("Non main user");
      (async() => {
        const docRef = await addDoc(collection(db, "Ticket"), {
            ticketType: "gen",
            eventID: id_int,
            cost: currPrice,
            DateCreated: today
        });
        updateDoc(user.ref, {Tickets_Purchased: arrayUnion(docRef.id)}); //Update user document
        updateDoc(docSnapEvent.ref, {['maxCapacity']: docSnapEvent.data()['maxCapacity'] - 1});  
        })();
    }
    });
  });

  if(!mainUserFound){
    displaySuccess();
    purchaseButton.reset();
    var top = document.getElementById("top");
    top.scrollIntoView();
  }
}

/************************************ERROR/SUCESS MESSAGE METHODS*************************************************************/

/* Method Functionality: function called by #showNoUserNames and #showUserNames
*  Purpose: Changes billing information by hiding its display and unblocks the errorMessage display
*  Output: Fail message alert occurs on top of the page
*/
function getCardError(){
  document.getElementById('errorMessage').style.display = "block";
  document.getElementById('billing').style.display = "none";
}

/* Method Functionality: function called by #buyTicketUser
*  Purpose: Unblocks the displaySuccess display
*  Output: Success message alert occurs on top of the page, saying the purchase was successful
*/
function displaySuccess(){
  document.getElementById('displaySuccess').style.display = "block";
}

/* Method Functionality: function called by #buyTicketUser
*  Purpose: Unblocks the displayFundingError display
*  Output: Fail message alert occurs on top of the page, saying the purchase was unsuccessful
*/
function displayFundingError(){
  document.getElementById('displayFundingError').style.display = "block";
}