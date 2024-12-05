import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getFirestore, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD5IjelZ0j1vm3PjNSsQKcWsExX7lMAlYI",
  authDomain: "doctor-web-506c7.firebaseapp.com",
  projectId: "doctor-web-506c7",
  storageBucket: "doctor-web-506c7.appspot.com",
  messagingSenderId: "200013685408",
  appId: "1:200013685408:web:557c287be4a2666ad4dfc5",
  measurementId: "G-C17JHZSPG9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Fetch user data from local storage
const loggedInUser = JSON.parse(localStorage.getItem("user"));

if (!loggedInUser) {
  alert("You must log in first!");
  window.location.href = "./index.html";
}

// Determine the opposite role
const roleToFetch = loggedInUser.role === "doctor" ? "user" : "doctor";

// Fetch data and display it
async function fetchAndDisplayData() {
  const q = query(collection(db, "users"), where("role", "==", roleToFetch));
  const querySnapshot = await getDocs(q);

  const dataContainer = document.getElementById("data-container");
  if (querySnapshot.empty) {
    dataContainer.innerHTML = `<p class="text-center">No ${roleToFetch}s found.</p>`;
    return;
  }

  querySnapshot.forEach((doc) => {
    const { name, email } = doc.data();
    const card = document.createElement("div");
    card.className = "col-md-4 mb-3";
    card.innerHTML = `
      <div class="card shadow-sm">
        <div class="card-body">
          <h5 class="card-title">${name}</h5>
          <p class="card-text">Email: ${email}</p>
        </div>
      </div>
    `;
    dataContainer.appendChild(card);
  });
}

// Load data
fetchAndDisplayData();
