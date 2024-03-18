import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  FacebookAuthProvider,
  GoogleAuthProvider,
  GithubAuthProvider,
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

import { firebaseConfig } from "../js/config.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const userEmail = document.getElementById("useremail");
const userPassword = document.getElementById("userpassword");
const btnSignUp = document.querySelector("#signup");
btnSignUp.addEventListener("click", signUp);

function signUp(e) {
  e.preventDefault();
  const email = userEmail.value;
  const password = userPassword.value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      alert("Logged in successfully!");
      localStorage.setItem("loggedInUser", JSON.stringify(user));
      window.location.replace("products.html");
    })
    .catch((error) => {
      alert("Login failed: " + error.message);
      console.error(error);
    });
}

// Function to handle Facebook login
function loginWithFacebook() {
  const provider = new FacebookAuthProvider();
  signInWithPopup(auth, provider)
    .then((result) => {
      // User signed in with Facebook
      const user = result.user;
      console.log(user);
    })
    .catch((error) => {
      // Handle errors
      console.error(error);
    });
}

// Function to handle Google login
function loginWithGoogle() {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
    .then((result) => {
      // User signed in with Google
      const user = result.user;
      console.log(user);
    })
    .catch((error) => {
      // Handle errors
      console.error(error);
    });
}

// Function to handle GitHub login
function loginWithGitHub() {
  const provider = new GithubAuthProvider();
  signInWithPopup(auth, provider)
    .then((result) => {
      // User signed in with GitHub
      const user = result.user;
      console.log(user);
    })
    .catch((error) => {
      // Handle errors
      console.error(error);
    });
}
