import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA6gqTNPG50pSE0d7GzmFFeFrU1AcS76Ww",
  authDomain: "catalogo-sr.firebaseapp.com",
  projectId: "catalogo-sr",
  storageBucket: "catalogo-sr.firebasestorage.app",
  messagingSenderId: "364515030445",
  appId: "1:364515030445:web:6464eafad7865b5ae01d24",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function seedAdmin() {
  console.log("Criando superusuário...");

  const credential = await createUserWithEmailAndPassword(
    auth,
    "izaelle@srcatalogo.com",
    "123456T&ste"
  );

  await setDoc(doc(db, "adminUsers", credential.user.uid), {
    email: "izaelle@srcatalogo.com",
    name: "Izaelle",
    role: "super",
    createdAt: new Date().toISOString(),
  });

  console.log(`  ✓ Superusuário criado: izaelle@srcatalogo.com`);
  console.log(`  UID: ${credential.user.uid}`);
  console.log("\nPronto! Agora você pode fazer login em /admin");
}

seedAdmin().catch((err) => {
  console.error("Erro:", err.message);
});
