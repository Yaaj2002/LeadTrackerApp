// index.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";
import { firebaseConfig } from "./firebaseConfig.js"; // Import the config

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const referenceInDB = ref(database, "leads");

// DOM Elements
const inputEl = document.getElementById("input-el");
const inputBtn = document.getElementById("input-btn");
const ulEl = document.getElementById("ul-el");
const deleteBtn = document.getElementById("delete-btn");

// Function to render leads
function render(leads) {
  let listItems = "";
  for (let i = 0; i < leads.length; i++) {
    listItems += `
            <li>
                <a target='_blank' href='${leads[i]}'>
                    ${leads[i]}
                </a>
            </li>
        `;
  }
  ulEl.innerHTML = listItems;
}

// Listen for changes in the database
onValue(referenceInDB, (snapshot) => {
  if (snapshot.exists()) {
    const snapshotValues = snapshot.val();
    const leads = Object.values(snapshotValues);
    render(leads);
  } else {
    ulEl.innerHTML = ""; // Clear the list if no data exists
  }
});

// Delete all leads on double-click
deleteBtn.addEventListener("dblclick", () => {
  remove(referenceInDB);
  ulEl.innerHTML = "";
});

// Save input to the database
inputBtn.addEventListener("click", () => {
  const inputValue = inputEl.value.trim();
  if (inputValue) {
    push(referenceInDB, inputValue);
    inputEl.value = ""; // Clear the input field
  } else {
    alert("Please enter a valid URL.");
  }
});
