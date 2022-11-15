// Import the functions you need from the SDKs you need
import firebaseConfig from "./firebaseConfig";
import { initializeApp } from 'firebase/app';
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, getDisplayName } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);



// Selecting fields from html to alter what is seen.
const loggedOut = document.querySelectorAll('.logged-out'); // Grabbing logged out fields which can be seen when a user is logged out
const loggedIn = document.querySelectorAll('.logged-in'); // Grabbing logged in fields which uses can only see when logged in

/************************************ Check user state once logged *************************************************************/

// Altering the navbar based on if a user is passed through.
const navBarUI = (user) => {
    if (user) {
        loggedIn.forEach(item => item.style.display = 'block'); // Here if the user is logged in we will hide the loggedin portions
        loggedOut.forEach(item => item.style.display = 'none'); // Here if the user is logged in we will display the logged in divs
    } else {
        loggedIn.forEach(item => item.style.display = 'none'); // Here we check if the user is not logged in and will hide login divs
        loggedOut.forEach(item => item.style.display = 'block'); // Here we check if the user is not logged in and will show logged out divs
    }
}

//Current State of user in/out
onAuthStateChanged(auth, (user) => {
    if (user) {
        //User is signed in 
        navBarUI(user);
    } else {
        navBarUI();
    }
})


/************************************ Sign Up *************************************************************/
const signUpForm = document.getElementById('signUpForm') // Here we gather out signUp form
signUpForm.addEventListener('submit', (event) => {
    event.preventDefault() // We then prevent the default loading of the webpage.
    const email = signUpForm.email.value //This grabs the email div value
    const pw = signUpForm.floatingPassword.value //This grabs the password value div
    createUserWithEmailAndPassword(auth, email, pw) // Here we create the user in our database.
        .then((userCred) => {
            //Created & signed in 
            const user = userCred.user;
            const db = getFirestore();
            console.log("It got in here");
            setDoc(doc(db, "Account", user.uid), { // We then set the default user credentials into our Airline Users collection
                Email: user.email,
                Name: "",
                Balance: 500.00,
                Tickets_Purchased: []
            })
        })
        .catch((error) => {
            console.log(error.message); // If this is not completed we will issue an error in the console
        })
})

/************************************Login*************************************************************/
const loginForm = document.getElementById('loginForm'); //Here we grab the login form
loginForm.addEventListener('submit', (event) => {
    event.preventDefault() // We then prevent the default loading of the webpage.
    const email = loginForm.floatingInput.value //This grabs the email div value
    const pw = loginForm.floatingPassword.value //This grabs the password value div
    signInWithEmailAndPassword(auth, email, pw) //We then attempt to login the user
        .then((userCred) => { // If completed we hide the login form content
            const user = userCred.user;// Here we hide the input boxes
        })
        .catch((error) => {
            console.log(error) //If this does not work we send an error message to the console
        })
})

/************************************Sign Out*************************************************************/
const signOutForm = document.getElementById("logout"); // Here we grab the logout button
signOutForm.addEventListener('click', (event) => {
    event.preventDefault(); // We then prevent the default loading of the webpage
    signOut(auth) // Here the user is logged out
        .then(() => {
            window.location.href = 'index.html'; //The user is redirected to the home page
        })
        .catch((err) => {
            console.log(error); //If this does not work we send an error message to the console
        })
})
