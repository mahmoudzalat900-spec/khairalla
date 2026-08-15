import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAc9hxQDHG5JjrU79bIMNjtCi8TS4rt_MQ",
  authDomain: "tulip-27520.firebaseapp.com",
  projectId: "tulip-27520",
  storageBucket: "tulip-27520.firebasestorage.app",
  messagingSenderId: "76697575499",
  appId: "1:76697575499:web:fe5b68d9a212172383adce",
  measurementId: "G-1ZBPZ8G6FG"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export async function loadUnits() {
  try {
    const snap = await getDocs(collection(db, "units"));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch { return []; }
}

export async function saveUnit(unit) {
  if (unit.id && typeof unit.id === "string" && unit.id.length > 5) {
    const { id, ...data } = unit;
    await updateDoc(doc(db, "units", id), data);
    return unit;
  } else {
    const { id: _id, ...data } = unit;
    const ref = await addDoc(collection(db, "units"), data);
    return { ...unit, id: ref.id };
  }
}

export async function deleteUnit(id) {
  await deleteDoc(doc(db, "units", id));
}

export async function loadSettings() {
  try {
    const snap = await getDocs(collection(db, "settings"));
    if (!snap.empty) return snap.docs[0].data();
    return { whatsapp: "" };
  } catch { return { whatsapp: "" }; }
}

export async function saveSettings(settings) {
  const snap = await getDocs(collection(db, "settings"));
  if (!snap.empty) {
    await updateDoc(doc(db, "settings", snap.docs[0].id), settings);
  } else {
    await addDoc(collection(db, "settings"), settings);
  }
}
