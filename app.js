/*// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword , signInWithEmailAndPassword  } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

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
const auth = getAuth(app);
const db = getFirestore(app);




// Signup function
async function signup(event) {
  event.preventDefault(); // Prevent form refresh
  const name = document.getElementById("firstname-input").value;
  const email = document.getElementById("email-input").value;
  const password = document.getElementById("password").value;
  const role = document.querySelector("input[name='role']:checked")?.value;

  if (!email || !password || !role) {
    alert("Please fill all fields and select a role.");
    return;
  }

  if (password.length < 6) {
    alert("Password should be at least 6 characters long.");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("User signed up:", userCredential.user);
  
    // Save user details in Firestore
    await addDoc(collection(db, "users"), { name, email, role });
    alert("Signup successful!");

    // Redirect user based on role
    if (role === "user") {
      window.location.href = "./doctor.html";
    } else if (role === "doctor") {
      window.location.href = "./user.html";
    } else {
      alert("Unknown role! Unable to redirect.");
    }
  } catch (error) {
    console.error("Error signing up:", error.message);
    alert("Signup failed: " + error.message);
  }
}

// Event listener
document.getElementById("signupButton")?.addEventListener("click", signup);



// Login function
async function login() {
  const email = document.getElementById("email-input").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Please fill out both email and password fields.");
    return;
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("Signed in successfully:", user);

    // Fetch additional user data
    const userData = await getUserByEmail(email);
    console.log("Fetched user data:", userData);
    if (userData.role === 'doctor') {
          window.location.pathname = "./doctor.html";
    } else {
          window.location.pathname = "./users.html";
    }

    // Save to session storage and redirect
    sessionStorage.setItem("user", JSON.stringify(userData));
    alert("Logged in successfully!");
    // window.location.pathname = "./welcome.html";
  } catch (error) {
    console.error("Login error:", error.message);
    alert("Error: " + error.message);
  }
}

// Attach event listener to login button
document.getElementById("loginButton")?.addEventListener("click", login);*/
// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

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
const auth = getAuth(app);
const db = getFirestore(app);

// Signup function
async function signup(event) {
  event.preventDefault();
  const name = document.getElementById("firstname-input").value;
  const email = document.getElementById("email-input").value;
  const password = document.getElementById("password").value;
  const role = document.querySelector("input[name='role']:checked")?.value;

  if (!email || !password || !role) {
    alert("Please fill all fields and select a role.");
    return;
  }

  if (password.length < 6) {
    alert("Password should be at least 6 characters long.");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("User signed up:", user);

    // Save user details in Firestore
    const userData = { name, email, role };
    await addDoc(collection(db, "users"), userData);

    // Save to local storage
    localStorage.setItem("user", JSON.stringify(userData));

    alert("Signup successful!");
    // Redirect based on role
    if (role === "user") {
      window.location.href = "./doctor.html";
    } else if (role === "doctor") {
      window.location.href = "./users.html";
    }
  } catch (error) {
    console.error("Error signing up:", error.message);
    alert("Signup failed: " + error.message);
  }
}

// Login function
async function login(event) {
  event.preventDefault();
  const email = document.getElementById("email-input").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Please fill out both email and password fields.");
    return;
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("Signed in successfully:", user);

    // Fetch user data from Firestore
    const q = query(collection(db, "users"), where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userData = querySnapshot.docs[0].data();

      // Save to local storage
      localStorage.setItem("user", JSON.stringify(userData));

      // Fetch role-specific data
      const otherRole = userData.role === "doctor" ? "user" : "doctor";
      const otherRoleData = await fetchRoleData(otherRole);

      console.log(`${otherRole}s data:`, otherRoleData);
      alert("Login successful!");

      // Redirect based on role
      if (userData.role === "doctor") {
        window.location.href = "./users.html";
      } else if (userData.role === "user") {
        window.location.href = "./doctor.html";
      }
    } else {
      alert("User data not found in Firestore.");
    }
  } catch (error) {
    console.error("Login error:", error.message);
    alert("Login failed: " + error.message);
  }
}

// Fetch role-specific data (users for doctors, doctors for users)
async function fetchRoleData(role) {
  const q = query(collection(db, "users"), where("role", "==", role));
  const querySnapshot = await getDocs(q);
  const data = querySnapshot.docs.map((doc) => doc.data());
  return data;
}

// Event listeners
document.getElementById("signupButton")?.addEventListener("click", signup);
document.getElementById("loginButton")?.addEventListener("click", login);










