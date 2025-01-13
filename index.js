/* === Imports === */
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js"

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

const postContainerEl = document.getElementById("user-posts")
const fetchPostButtonEl = document.getElementById("fetch-post-btn")

/* == UI - Event Listeners == */

signInWithGoogleButtonEl.addEventListener("click", authSignInWithGoogle)

signInButtonEl.addEventListener("click", authSignInWithEmail)
createAccountButtonEl.addEventListener("click", authCreateAccountWithEmail)

signOutButtonEl.addEventListener("click", authSignOut);

postButtonEl.addEventListener("click", postButtonPressed)
fetchPostButtonEl.addEventListener("click", fetchPost)

/* === Main Code === */
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

async function fetchPost() {
  const postsCollection = collection(db, "Posts")
  getDocs(postsCollection)
    .then((snapshot) => {
      const postsDocumentations = snapshot.docs
      postContainerEl.innerHTML = ""
      postsDocumentations.forEach((doc) => {
        const user = auth.currentUser
        if (doc.data().uid === user.uid) {
            try {
            /* the post div */
            const postDiv = document.createElement("div");
            postDiv.className = "post";
            
            /* post's text content */
            const bodyParagraph = document.createElement("p")
            bodyParagraph.innerText = 
            `${doc.data().createAt.toDate().toLocaleDateString()} - ${doc.data().createAt.toDate().toLocaleTimeString()}
            
            ${doc.data().body}
            `
            /* appending the post to post container */
            postDiv.append(bodyParagraph)
            postContainerEl.append(postDiv)
            } catch (e) {
                console.error("Error fetching posts: ", e)
            }
        }
        console.log(doc.id, '=>', doc.data());
      })
    })
    .catch((error) => {
      console.error("Error getting documents: ", error);
    });
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