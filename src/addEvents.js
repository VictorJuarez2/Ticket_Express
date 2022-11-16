import firebaseConfig from "./firebaseConfig";
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, doc, addDoc, updateDoc, arrayUnion } from 'firebase/firestore';
// Start up the Firebase App
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {
    if (user) {
        //User is signed in 
        const userID = user.uid;
        // Initialize Function
        const db = getFirestore();

        // Create Collections Reference from Firestore
        const usersRef = doc(db, 'Account', userID);

        const postRef = collection(db, 'event');

        //Add a document
        const addPostsForm = document.querySelector(".add");
        addPostsForm.addEventListener("submit", (event) => {
            event.preventDefault();
            (async () => {
                const docRef = await addDoc(postRef, {
                    title: addPostsForm.title.value,
                    image: addPostsForm.image.value,
                    text: addPostsForm.text.value,
                    postedBy: userID,
                    liked: []
                })
                updateDoc(usersRef, {
                    Posts: arrayUnion(docRef.id)
                })
                    .then(() => {
                        addPostsForm.reset();
                    })
            })();
        })
    } else {
        //User is signed out
    }
})