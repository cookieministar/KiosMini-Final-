import React, { useState } from "react";
import { 
  getAuth, updateEmail, updatePassword, signOut, GoogleAuthProvider, 
  signInWithPopup, EmailAuthProvider, reauthenticateWithCredential 
} from "firebase/auth";

const AkunSetting = () => {
  const auth = getAuth();
  const user = auth.currentUser;

  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState(""); // ✅ Tambahkan state untuk password lama
  const [error, setError] = useState("");
  const [googleConnected, setGoogleConnected] = useState(false);

  // ✅ Fungsi Re-Authentication (Wajib sebelum update email/password)
  const reauthenticate = async () => {
    try {
      if (!user) throw new Error("User not logged in.");
      if (!currentPassword) throw new Error("Please enter your current password.");
      
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      console.log("User re-authenticated successfully.");
    } catch (error) {
      setError(error.message);
      throw new Error("Re-authentication failed. Please check your password.");
    }
  };

  // ✅ Update Email
  const handleUpdateEmail = async () => {
    try {
      await reauthenticate(); // Wajib Re-Auth sebelum update
      await updateEmail(user, email);
      alert("Email updated successfully!");
    } catch (error) {
      setError(error.message);
    }
  };

  // ✅ Update Password
  const handleUpdatePassword = async () => {
    try {
      await reauthenticate(); // Wajib Re-Auth sebelum update
      if (password.length < 6) throw new Error("Password must be at least 6 characters.");
      await updatePassword(user, password);
      alert("Password updated successfully!");
    } catch (error) {
      setError(error.message);
    }
  };

  // ✅ Google Login
  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      setGoogleConnected(true);
      alert("Google account linked successfully!");
    } catch (error) {
      setError(error.message);
    }
  };

  // ✅ Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("Logout successful!");
      window.location.href = "/login"; // Redirect ke login
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Background Header */}
      <div className="absolute top-0 left-0 w-full h-1/3 bg-[#E7D0BC]"></div>

      {/* Konten */}
      <div className="flex-1 flex items-center justify-center relative p-6">
        {/* Container Sidebar & Form */}
        <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white shadow-lg rounded-xl overflow-hidden">
          {/* Sidebar */}
          <div className="w-full md:w-1/4 bg-[#FAFAFA] p-6 border-r">
            <div className="flex flex-col items-center mb-6">
              <div className="w-20 h-20 bg-gray-300 rounded-full mb-2"></div>
              <p className="font-semibold text-lg text-gray-800">{user?.displayName || "User"}</p>
            </div>
            <div className="space-y-2">
              <button className="w-full text-left p-3 bg-gray-200 rounded-lg font-semibold text-gray-900 hover:bg-gray-300 transition">
                Personal Information
              </button>
              <button className="w-full text-left p-3 bg-white border rounded-lg font-semibold text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                <span role="img" aria-label="lock">🔒</span> Account Setting
              </button>
            </div>
            {/* Tombol Logout */}
            <button 
              onClick={handleLogout}
              className="hidden md:block w-full mt-6 bg-red-600 text-white p-3 rounded-lg font-semibold hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>

          {/* Main Content */}
          <div className="w-full md:flex-1 p-6 pb-24">
            <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
              Account Setting
            </h2>

            {error && <p className="text-red-500 text-center">{error}</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Input Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 border border-gray-300 p-3 rounded-lg w-full focus:ring focus:ring-gray-300" 
                />
                <button
                  onClick={handleUpdateEmail}
                  className="mt-2 bg-blue-600 text-white p-2 rounded-lg w-full"
                >
                  Update Email
                </button>
              </div>

              {/* Input Password Lama (Re-Auth) */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Current Password</label>
                <input 
                  type="password" 
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="mt-1 border border-gray-300 p-3 rounded-lg w-full focus:ring focus:ring-gray-300" 
                />
              </div>

              {/* Input Password Baru */}
              <div>
                <label className="block text-sm font-medium text-gray-700">New Password</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 border border-gray-300 p-3 rounded-lg w-full focus:ring focus:ring-gray-300" 
                />
                <button
                  onClick={handleUpdatePassword}
                  className="mt-2 bg-blue-600 text-white p-2 rounded-lg w-full"
                >
                  Update Password
                </button>
              </div>
            </div>

            {/* Akun Terkait */}
            <h3 className="mt-6 text-center font-semibold text-gray-800">Akun Terkait</h3>
            <div className="flex justify-center gap-4 mt-2">
              {/* Google Button */}
              <button
                onClick={handleGoogleLogin}
                className="flex items-center gap-2 bg-green-900 text-white p-3 rounded-lg px-4 hover:bg-green-700 transition"
              >
                <span className="text-lg">🇬</span> {googleConnected ? "Terkoneksi" : "Tidak Terkoneksi"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AkunSetting;
