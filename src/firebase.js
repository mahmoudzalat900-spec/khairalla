import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAc9hxQDHG5JjrU79bIMNjtCi8TS4rt_MQ",
  authDomain: "tulip-27520.firebaseapp.com",
  projectId: "tulip-27520",
  storageBucket: "tulip-27520.firebasestorage.app",
  messagingSenderId: "76697575499",
  appId: "1:76697575499:web:fe5b68d9a212172383adce"
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
    const ref = await addDoc(collection(db, "units"), { ...data, createdAt: Date.now() });
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

// Cloudinary upload
const CLOUD_NAME = "g35uhpoc";
const UPLOAD_PRESET = "ml_default";

export async function uploadImage(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("folder", "khairalla");

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: "POST",
    body: formData,
  });
  const data = await res.json();
  if (data.secure_url) return data.secure_url;
  throw new Error(data.error?.message || "Upload failed");
}
