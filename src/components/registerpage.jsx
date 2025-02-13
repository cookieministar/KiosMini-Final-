import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "../App.css";
import HomeIcon from "../assets/home.png";
import ContactIcon from "../assets/contact.png";
import ProfileIcon from "../assets/profile.png";
import CheckoutIcon from "../assets/checkout.png";
import GoogleIcon from "../assets/Googlereal.png";
import { useNavigate } from "react-router-dom"; // Import useNavigate

import { createUserWithEmailAndPassword } from "firebase/auth";
import { signInWithGoogle, signInWithFacebook } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore"; // Tambahkan Firestore
import { auth, db } from "../firebase"; // Import konfigurasi Firebase
import { FacebookAuthProvider } from "firebase/auth/web-extension";

function RegisterPage() {
  const navigate = useNavigate(); // Buat fungsi navigasi
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

const handleGoogleSignIn = async () => {
  try {
    const result = await signInWithGoogle(auth);
    const user = result.user;

    console.log("Google User:", user);

    // Periksa apakah pengguna sudah ada di Firestore
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      // Jika pengguna belum ada, buat data pengguna baru di Firestore
      await setDoc(userDocRef, {
        uid: user.uid,
        name: user.displayName || "Anonymous",
        email: user.email,
        profilePicture: user.photoURL || "",
        phone: "", // Tambahkan default value jika diperlukan
        role: "user", // Tambahkan default value jika diperlukan
        createdAt: new Date().toISOString(),
      });
      console.log("Pengguna baru berhasil disimpan di Firestore!");
    } else {
      console.log("Pengguna sudah ada di Firestore.");
    }

    alert("Signed in successfully with Google!");

    // Arahkan ke halaman profil setelah login berhasil
    navigate("/profile");
  } catch (error) {
    console.error("Google Sign-In Error:", error.message);
    alert("Failed to sign in with Google: " + error.message);
  }
};


  const saveUserDataToFirestore = async (uid, name, email, gender) => {
    const userDocRef = doc(db, "users", uid); // Buat referensi dokumen
    await setDoc(userDocRef, {
      name: name,
      email: email,
      gender: gender,
      role: "user",
      createdAt: new Date(),
    });
    console.log("User data saved to Firestore");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Daftarkan pengguna ke Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Simpan data tambahan ke Firestore
      await saveUserDataToFirestore(user.uid, name, email, gender);

      console.log("User registered:", user);
      alert("Akun berhasil dibuat!", { position: "top-right", autoClose: 3000 });
      
      navigate("/profile"); // Navigasi ke halaman profil
    } catch (error) {
      console.error("Error creating account:", error.message);
      alert(`Gagal membuat akun: ${error.message}`, { position: "top-right", autoClose: 5000 });
    }
  };
  return (
    <>
{/* Main Content */}
<div className="h-screen w-screen flex  justify-center items-center">
  <div className="bg-white p-8 w-full  mr-12 max-w-md sm:p-6 rounded-lg shadow-lg">
    <div className="w-full">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-700 text-center sm:text-left mb-4">
        Create Account
      </h2>
      <p className="text-gray-500 text-center sm:text-left mb-2">
        Don’t worry, only you can see your personal data. No one else will be able to see it.
      </p>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700  text-left font-medium mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="gender" className="block text-gray-700 text-left font-medium mb-2">
            Gender
          </label>
          <select
            id="gender"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none text-left focus:ring-2 focus:ring-amber-500"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
          >
            <option value="">Select your gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 text-left font-medium mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 text-left font-medium mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="flex items-center mb-2">
          <input
            type="checkbox"
            id="terms"
            className="mr-2 focus:ring-2 focus:ring-amber-500"
            required
          />
          <label htmlFor="terms" className="text-gray-700 mb-2 text-sm">
            Agree with Terms & Conditions
          </label>
        </div>
        <button
          type="submit"
          className="w-full bg-amber-600 text-white py-2 px-4 rounded-lg hover:bg-amber-700 transition duration-300"
        >
          Sign Up
        </button>
        <div className="flex items-center justify-center sm:justify-start mt-4 gap-4">
          <button
            className="p-2 bg-amber-600 text-white rounded-full hover:bg-amber-700"
            onClick={handleGoogleSignIn}
          >
            <img src={GoogleIcon} alt="Google" className="w-6 h-6" />
          </button>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center mt-4">
          <span className="text-gray-700 text-center sm:text-left mr-2">Sudah Punya Akun?</span>
          <button
            onClick={() => navigate("/login")}
            className="text-amber-600 underline hover:text-amber-700 transition"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  </div>
</div>
    </>
  );
}

export default RegisterPage;
