import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // ✅ Gunakan useParams & useNavigate
import { db } from "../firebase"; // Pastikan path sesuai dengan konfigurasi Firebase Anda
import { doc, getDoc, updateDoc } from "firebase/firestore";

const EditProfileUser = () => {
  const { userId } = useParams(); // ✅ Ambil userId dari URL
  const navigate = useNavigate(); // ✅ Untuk navigasi setelah update

  const [userData, setUserData] = useState({
    name: "",
    phone: "",
    gender: "",
    birthDate: "",
  });

  // ✅ Ambil data user berdasarkan userId
  useEffect(() => {
    console.log("Fetching user data for userId:", userId); // Debugging
    if (!userId) {
       console.error("Error: userId is undefined or empty.");
       navigate("/profile"); // Redirect ke profile jika userId tidak valid
       return;
    }
 
    const fetchUserData = async () => {
       try {
          const userRef = doc(db, "users", userId);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
             setUserData(userSnap.data());
          } else {
             console.error("User not found!");
          }
       } catch (error) {
          console.error("Error fetching user data:", error);
       }
    };
    fetchUserData();
 }, [userId, navigate]);
 

  // ✅ Handle perubahan input
  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  // ✅ Handle update data ke Firestore
  const handleUpdate = async () => {
    if (!userId || !userData.name) {
      alert("Mohon lengkapi data sebelum menyimpan.");
      return;
    }
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, userData);
      alert("Profile updated successfully!");
      navigate("/profile"); // ✅ Arahkan kembali ke halaman profile
    } catch (error) {
      console.error("Error updating profile:", error);
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
              <p className="font-semibold text-lg text-gray-800">{userData.firstName} {userData.lastName}</p>
            </div>
            <div className="space-y-2">
              <button className="w-full text-left p-3 bg-gray-200 rounded-lg font-semibold text-gray-900 hover:bg-gray-300 transition">
                Personal Information
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="w-full md:flex-1 p-6 pb-24">
            <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={userData.name}
                  onChange={handleChange}
                  className="mt-1 border border-gray-300 p-3 rounded-lg w-full focus:ring focus:ring-gray-300" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input 
                  type="tel" 
                  name="phone"
                  value={userData.phone}
                  onChange={handleChange}
                  className="mt-1 border border-gray-300 p-3 rounded-lg w-full focus:ring focus:ring-gray-300" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Gender</label>
                <select 
                  name="gender"
                  value={userData.gender}
                  onChange={handleChange}
                  className="mt-1 border border-gray-300 p-3 rounded-lg w-full bg-white focus:ring focus:ring-gray-300"
                >
                  <option value="Pria">Pria</option>
                  <option value="Wanita">Wanita</option>
                </select>
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Date Of Birth</label>
                <input 
                  type="date" 
                  name="birthDate"
                  value={userData.birthDate}
                  onChange={handleChange}
                  className="mt-1 border border-gray-300 p-3 rounded-lg w-full focus:ring focus:ring-gray-300" 
                />
              </div>
            </div>

            {/* Tombol Save Changes */}
            <button 
              onClick={handleUpdate}
              className="block w-full mt-6 bg-green-600 text-white p-3 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfileUser;
