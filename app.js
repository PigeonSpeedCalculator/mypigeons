
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, collection, addDoc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBwUPjfjjjfRneRk6plUB3CV9U6K4eTZ1w",
  authDomain: "my-pigeons-a5a09.firebaseapp.com",
  projectId: "my-pigeons-a5a09",
  storageBucket: "my-pigeons-a5a09.firebasestorage.app",
  messagingSenderId: "390860839141",
  appId: "1:390860839141:web:e8bed527f8fb9e6a745c0c",
  measurementId: "G-YD0DVFY9BS"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const loginBtn = document.getElementById("login");
const logoutBtn = document.getElementById("logout");
const formSection = document.getElementById("formSection");
const saveBtn = document.getElementById("saveBtn");

const nameInput = document.getElementById("name");
const ringInput = document.getElementById("ring");
const fatherSelect = document.getElementById("fatherSelect");
const motherSelect = document.getElementById("motherSelect");
const myBirdsList = document.getElementById("myBirds");

let userId = null;

loginBtn.onclick = () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider);
};

logoutBtn.onclick = () => signOut(auth);

onAuthStateChanged(auth, async (user) => {
  if (user) {
    userId = user.uid;
    formSection.classList.remove("hidden");
    loginBtn.classList.add("hidden");
    logoutBtn.classList.remove("hidden");
    loadBirds();
  } else {
    formSection.classList.add("hidden");
    loginBtn.classList.remove("hidden");
    logoutBtn.classList.add("hidden");
    userId = null;
  }
});

saveBtn.onclick = async () => {
  const bird = {
    name: nameInput.value,
    ring: ringInput.value,
    father: fatherSelect.value || null,
    mother: motherSelect.value || null,
    userId: userId
  };

  await addDoc(collection(db, "birds"), bird);
  nameInput.value = "";
  ringInput.value = "";
  loadBirds();
};

async function loadBirds() {
  const birdsRef = collection(db, "birds");
  const q = query(birdsRef, where("userId", "==", userId));
  const querySnapshot = await getDocs(q);

  myBirdsList.innerHTML = "";
  fatherSelect.innerHTML = '<option value="">اختر الأب</option>';
  motherSelect.innerHTML = '<option value="">اختر الأم</option>';

  querySnapshot.forEach((doc) => {
    const b = doc.data();
    myBirdsList.innerHTML += `<li>${b.name} (${b.ring})</li>`;
    fatherSelect.innerHTML += `<option value="${b.name}">${b.name}</option>`;
    motherSelect.innerHTML += `<option value="${b.name}">${b.name}</option>`;
  });
}
