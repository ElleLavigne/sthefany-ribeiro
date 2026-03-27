import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import products from "../data/products.json";
import collections from "../data/collections.json";

const firebaseConfig = {
  apiKey: "AIzaSyA6gqTNPG50pSE0d7GzmFFeFrU1AcS76Ww",
  authDomain: "catalogo-sr.firebaseapp.com",
  projectId: "catalogo-sr",
  storageBucket: "catalogo-sr.firebasestorage.app",
  messagingSenderId: "364515030445",
  appId: "1:364515030445:web:6464eafad7865b5ae01d24",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seed() {
  console.log("Populando coleções...");
  for (const collection of collections) {
    await setDoc(doc(db, "collections", collection.slug), collection);
    console.log(`  ✓ ${collection.name}`);
  }

  console.log("\nPopulando produtos...");
  for (const product of products) {
    await setDoc(doc(db, "products", product.slug), product);
    console.log(`  ✓ ${product.name}`);
  }

  console.log("\nFirestore populado com sucesso!");
}

seed().catch(console.error);
