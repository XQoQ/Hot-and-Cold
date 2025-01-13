/* === Imports === */
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js"

/* === Firebase Setup === */

// Web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD8uJslWwfDudxqUrFNPLc2j8S6YTQ-okc",
    authDomain: "hot-and-cold-b04e4.firebaseapp.com",
    projectId: "hot-and-cold-b04e4",
    storageBucket: "hot-and-cold-b04e4.firebasestorage.app",
    messagingSenderId: "50792191618",
    appId: "1:50792191618:web:91e2cae9cbefa663f4469b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore(app);
console.log(auth)
console.log(db)

/* === UI === */

/* == UI - Elements == */

const viewLoggedOut = document.getElementById("logged-out-view")
const viewLoggedIn = document.getElementById("logged-in-view")

const signInWithGoogleButtonEl = document.getElementById("sign-in-with-google-btn")

const emailInputEl = document.getElementById("email-input")
const passwordInputEl = document.getElementById("password-input")

const signInButtonEl = document.getElementById("sign-in-btn")
const createAccountButtonEl = document.getElementById("create-account-btn")

const signOutButtonEl = document.getElementById("sign-out-btn")

const userProfilePictureEl = document.getElementById("user-profile-picture")
const userGreetingEl = document.getElementById("user-greeting")

const textareaEl = document.getElementById("post-input")
const postButtonEl = document.getElementById("post-btn")

/* == UI - Event Listeners == */

signInWithGoogleButtonEl.addEventListener("click", authSignInWithGoogle)

signInButtonEl.addEventListener("click", authSignInWithEmail)
createAccountButtonEl.addEventListener("click", authCreateAccountWithEmail)

signOutButtonEl.addEventListener("click", authSignOut);

postButtonEl.addEventListener("click", postButtonPressed)

/* === Main Code === */

/*  Challenge:
    Import the onAuthStateChanged function from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js"
    Use the code from the documentation to make this work.
    Use onAuthStateChanged to:
    Show the logged in view when the user is logged in using showLoggedInView()
    Show the logged out view when the user is logged out using showLoggedOutView()
*/
onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/auth.user
      const uid = user.uid;
      showLoggedInView()
      showProfilePicture(userProfilePictureEl, user)
      showUserGreeting(userGreetingEl, user)
    } else {
      // User is signed out
      showLoggedOutView()
    }
  });

console.log(app.options.projectId);

/* === Functions === */

/* = Functions - Firebase - Authentication = */

function authSignInWithGoogle() {
    console.log("Sign in with Google")
}

function authSignInWithEmail() {
    console.log("Sign in with email and password")
    /*  Challenge:
    1  Import the signInWithEmailAndPassword function from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js"
    2 Use the code from the documentation to make this function work.
    3  Make sure to first create two consts, 'email' and 'password', to fetch the values from the input fields emailInputEl and passwordInputEl.
    4 If the login is successful then you should show the logged in view using showLoggedInView()
    5   If something went wrong, then you should log the error message using console.error.
    */

    const email = emailInputEl.value
    const password = passwordInputEl.value
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        showLoggedInView()
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(errorMessage)
      });
}

function authCreateAccountWithEmail() {
    console.log("Sign up with email and password")
    /*  Challenge:
    1 Import the createUserWithEmailAndPassword function from from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
    2 Use the code from the documentation to make this function work.
    3 Make sure to first create two consts, 'email' and 'password', to fetch the values from the input fields emailInputEl and passwordInputEl.
    4 If the creation of user is successful then you should show the logged in view using showLoggedInView()
    5 If something went wrong, then you should log the error message using console.error.
    */
   
    const email = emailInputEl.value
    const password = passwordInputEl.value
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up 
        const user = userCredential.user;
        showLoggedInView()
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(errorMessage)
      });
}

function authSignOut() {
    /*  Challenge:
        Import the signOut function from 'firebase/auth'
        Use the code from the documentation to make this function work.
   
        If the log out is successful then you should show the logged out view using showLoggedOutView()
        If something went wrong, then you should log the error message using console.error.
    */

    signOut(auth)
    .then(() => {
        // Sign-out successful.
        showLoggedOutView()
    })
    .catch((error) => {
        // An error happened.
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(errorMessage)
    });
}
 

/* == Functions - UI Functions == */

function showProfilePicture(imgElement, user) {
    /*  Challenge:
        Use the documentation to make this function work.
       
        This function has two parameters: imgElement and user
       
        We will call this function inside of onAuthStateChanged when the user is logged in.
       
        The function will be called with the following arguments:
        showProfilePicture(userProfilePictureEl, user)
       
        If the user has a profile picture URL, set the src of imgElement to that URL.
       
        Otherwise, you should set the src of imgElement to "assets/images/default-profile-picture.jpeg"
    */

    if (user !== null) {
        // The user object has basic properties such as display name, email, etc.
        const displayName = user.displayName;
        const email = user.email;
        const photoURL = user.photoURL;
        const emailVerified = user.emailVerified;
        
        if (photoURL != null) {
          imgElement.src = photoURL
        } else {
          imgElement.src = "assets/images/defaultPic.jpg"
        }

        // The user's ID, unique to the Firebase project. Do NOT use
        // this value to authenticate with your backend server, if
        // you have one. Use User.getToken() instead.
        const uid = user.uid;
    }
}
 

function showUserGreeting(element, user) {
  /*  Challenge:
      Use the documentation to make this function work.
     
      This function has two parameters: element and user
     
      We will call this function inside of onAuthStateChanged when the user is logged in.
     
      The function will be called with the following arguments:
      showUserGreeting(userGreetingEl, user)
     
      If the user has a display name, then set the textContent of element to:
      "Hi ___ ( your first name)"
      Where __ is replaced with the actual first name of the user
     
      Otherwise, set the textContent of element to:
      "Hey friend, how are you?"
  */

  const displayName = user.displayName;
  const email = user.email;
  const photoURL = user.photoURL;
  const emailVerified = user.emailVerified;

  if (displayName != null) {
    element.innerHTML = `Hi ${displayName}`
  } else {
    element.innerHTML = `Hey friend, how are you?`
  }
}

function postButtonPressed() {
  const postBody = textareaEl.value
  const user = auth.currentUser
 
  if (postBody) {
      addPostToDB(postBody, user)
      clearInputField(textareaEl)
  }
}

function clearInputField(textareaEl) {
  textareaEl.innerTEXT = ""
}

/* = Functions - Firebase - Cloud Firestore = */
async function addPostToDB(postBody, user) {
  /*  Challenge:
      Import collection and addDoc from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js"
      Use the code from the documentation to make this function work.
     
      The function should add a new document to the "posts" collection in Firestore.
     
      The document should contain a field called 'body' of type "string" with a value of
      postBody (from function parameter)
     
      If the document was written successfully, then console log
      "Document written with ID: {documentID}"
      Where documentID is the actual ID of the newly created document.
     
      If something went wrong, then you should log the error message using console.error
  */

  try {
    const docRef = await addDoc(collection(db, "Posts"), {
      body: postBody,
      uid: user.uid,
      createAt: serverTimestamp()
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}


/* == Functions - UI Functions == */


function showLoggedOutView() {
    hideView(viewLoggedIn)
    showView(viewLoggedOut)
 }
 
 function showLoggedInView() {
    hideView(viewLoggedOut)
    showView(viewLoggedIn)
 }
 
 function showView(view) {
    view.style.display = "flex"
 }
 
 function hideView(view) {
    view.style.display = "none"
 }

//credit: coursera