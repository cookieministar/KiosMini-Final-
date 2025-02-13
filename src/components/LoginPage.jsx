import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import GoogleIcon from "../assets/Googlereal.png";
import { signInWithGoogle } from "../firebase";
import FacebookIcon from "../assets/facebookreal.png";
import { getFirestore, doc, getDoc, collection, query, where, getDocs } from "firebase/firestore"; // Firestore


function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");



const handleGoogleSignIn = async () => {
  try {
    const result = await signInWithGoogle(); // Fungsi untuk login dengan Google
    console.log("Google User:", result.user);

    alert("Signed in successfully with Google!");

    // Arahkan ke halaman profil setelah login berhasil
    navigate("/profile");
  } catch (error) {
    console.error("Google Sign-In Error:", error.message);
    alert("Failed to sign in with Google: " + error.message);
  }
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userDocRef = doc(db, "users", user.uid);

      console.log("User logged in:", user);
      alert("Successfully logged in!");

      const userData = (await getDoc(userDocRef)).data();
      if (userData.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/profile");
      }
      // Arahkan ke halaman utama/dashboard setelah login berhasil
    } catch (error) {
      console.error("Login Error:", error.message);
      alert("Failed to login: " + error.message);
    }
  };

  return (
    <div className="h-screen flex justify-center items-center ">
      <div className="bg-white p-8 shadow-lg w-full max-w-md rounded-lg">
        <h2 className="text-3xl font-bold text-gray-700 mb-4">Login to Your Account</h2>
        <form onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-amber-500"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Input */}
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-amber-500"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-amber-600 text-white py-2 rounded-lg hover:bg-amber-700 transition"
          >
            Login
          </button>
        </form>

        {/* Social Login Buttons */}
        <div className="flex justify-center mt-4 gap-4">
          <button className="p-2 bg-amber-600 text-white rounded-full" onClick={handleGoogleSignIn}>
            <img src={GoogleIcon} alt="Google" className="w-6 h-6" />
          </button>
        </div>

        {/* Navigasi ke Halaman Register */}
        <div className="flex items-center justify-center mt-4">
          <span className="text-gray-700 mr-2">Belum Punya Akun?</span>
          <button
            onClick={() => navigate("/register")} // Arahkan ke halaman Register
            className="text-amber-600 underline hover:text-amber-700 transition"
          >
            Daftar
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
