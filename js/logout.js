import { getAuth, signOut } from "firebase/auth";
import { firebaseConfig } from "../js/config.js";
const auth = getAuth();

// Add event listener to the logout button
document.addEventListener("DOMContentLoaded", function () {
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      // Sign out the user
      firebase
        .auth()
        .signOut()
        .then(() => {
          // Sign-out successful.
          localStorage.removeItem("loggedInUser"); // Remove loggedInUser from localStorage
          alert("Logout successful.");
          window.location.href = "login.html"; // Redirect to login page
        })
        .catch((error) => {
          // An error happened.
          console.error("Logout error:", error);
          alert("Logout error. Please try again.");
        });
    });
  } else {
    console.error("Logout button not found");
  }
});
