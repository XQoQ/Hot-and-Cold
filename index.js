// Firebase Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

// Firebase Setup
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
const auth = getAuth(app);
const db = getFirestore(app);
console.log(auth);
console.log(db);

// UI Elements
const viewLoggedOut = document.getElementById("logged-out-view");
const viewLoggedIn = document.getElementById("logged-in-view");
const signInWithGoogleButtonEl = document.getElementById("sign-in-with-google-btn");
const emailInputEl = document.getElementById("email-input");
const passwordInputEl = document.getElementById("password-input");
const signInButtonEl = document.getElementById("sign-in-btn");
const createAccountButtonEl = document.getElementById("create-account-btn");
const signOutButtonEl = document.getElementById("sign-out-btn");
const userProfilePictureEl = document.getElementById("user-profile-picture");
const userGreetingEl = document.getElementById("user-greeting");
const textareaEl = document.getElementById("post-input");
const postButtonEl = document.getElementById("post-btn");
const postContainerEl = document.getElementById("user-posts");
const fetchPostButtonEl = document.getElementById("fetch-post-btn");

// Emoji Picker Elements
const emojiIcon = document.getElementById("emoji-icon");
const emojiPopup = document.getElementById("emoji-popup");

// Event Listeners
signInWithGoogleButtonEl.addEventListener("click", authSignInWithGoogle);
signInButtonEl.addEventListener("click", authSignInWithEmail);
createAccountButtonEl.addEventListener("click", authCreateAccountWithEmail);
signOutButtonEl.addEventListener("click", authSignOut);
postButtonEl.addEventListener("click", postButtonPressed);
fetchPostButtonEl.addEventListener("click", fetchPost);
emojiIcon.addEventListener("click", toggleEmojiPopup);
document.addEventListener("click", (event) => {
    // Close the emoji popup if clicked outside the emoji icon or the popup
    if (!emojiIcon.contains(event.target) && !emojiPopup.contains(event.target)) {
        emojiPopup.style.display = "none";
    }
});

// Functions

// Firebase - Authentication
function authSignInWithGoogle() {
    console.log("Sign in with Google");
}

function authSignInWithEmail() {
    const email = emailInputEl.value;
    const password = passwordInputEl.value;
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            showLoggedInView();
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error(errorMessage);
        });
}

function authCreateAccountWithEmail() {
    const email = emailInputEl.value;
    const password = passwordInputEl.value;
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            showLoggedInView();
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error(errorMessage);
        });
}

function authSignOut() {
    signOut(auth)
        .then(() => {
            showLoggedOutView();
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error(errorMessage);
        });
}

// UI - Show/Hide Views
function showProfilePicture(imgElement, user) {
    if (user !== null) {
        const photoURL = user.photoURL;
        if (photoURL != null) {
            imgElement.src = photoURL;
        } else {
            imgElement.src = "assets/images/defaultPic.jpg";
        }
    }
}

function showUserGreeting(element, user) {
    const displayName = user.displayName;
    if (displayName != null) {
        element.innerHTML = `Hi ${displayName}`;
    } else {
        element.innerHTML = `Hey friend, how are you?`;
    }
}

function showLoggedOutView() {
    hideView(viewLoggedIn);
    showView(viewLoggedOut);
}

function showLoggedInView() {
    hideView(viewLoggedOut);
    showView(viewLoggedIn);
}

function showView(view) {
    view.style.display = "flex";
}

function hideView(view) {
    view.style.display = "none";
}

// Post Functionality
function postButtonPressed() {
    const postBody = textareaEl.value;
    const user = auth.currentUser;

    if (postBody) {
        addPostToDB(postBody, user);
        clearInputField(textareaEl);
    }
}

function clearInputField(textareaEl) {
    textareaEl.value = "";  // Use .value to clear the input
}

// Firebase - Cloud Firestore
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
    const postsCollection = collection(db, "Posts");
    getDocs(postsCollection)
        .then((snapshot) => {
            const postsDocumentations = snapshot.docs;
            postContainerEl.innerHTML = "";
            postsDocumentations.forEach((doc) => {
                const user = auth.currentUser;
                if (doc.data().uid === user.uid) {
                    try {
                        const postDiv = document.createElement("div");
                        postDiv.className = "post";

                        const bodyParagraph = document.createElement("p");
                        bodyParagraph.innerText = 
                            `${doc.data().createAt.toDate().toLocaleDateString()} - ${doc.data().createAt.toDate().toLocaleTimeString()}
                            ${doc.data().body}`;
                        
                        postDiv.append(bodyParagraph);
                        postContainerEl.append(postDiv);
                    } catch (e) {
                        console.error("Error fetching posts: ", e);
                    }
                }
            });
        })
        .catch((error) => {
            console.error("Error getting documents: ", error);
        });
}

// Emoji Picker Logic
function toggleEmojiPopup() {
    emojiPopup.style.display = emojiPopup.style.display === "block" ? "none" : "block";
}

// Function to handle emoji selection
function addEmoji(emoji) {
    textareaEl.value += emoji;  // Add the emoji to the textarea
    emojiPopup.style.display = "none";  // Hide the emoji popup after the emoji is added
}

// Add event listeners to emoji elements after rendering
function setupEmojiListeners() {
    const emojiElements = document.querySelectorAll(".emoji");
    emojiElements.forEach((emojiElement) => {
        emojiElement.addEventListener("click", (event) => {
            addEmoji(event.target.innerText);  // Add selected emoji to textarea
        });
    });
}

// Emoji Popup Content
emojiPopup.innerHTML = `
    <span class="emoji">😀</span>
    <span class="emoji">😃</span>
    <span class="emoji">😎</span>
    <span class="emoji">😢</span>
    <span class="emoji">❤️</span>
`;

// Initialize emoji listeners
setupEmojiListeners();

// Firebase Auth State Change
onAuthStateChanged(auth, (user) => {
    if (user) {
        const uid = user.uid;
        showLoggedInView();
        showProfilePicture(userProfilePictureEl, user);
        showUserGreeting(userGreetingEl, user);
    } else {
        showLoggedOutView();
    }
});

console.log(app.options.projectId);
