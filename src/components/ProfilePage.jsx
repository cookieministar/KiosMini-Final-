import React, { useState, useEffect } from "react";
import LogoutIcon from "../assets/logout.png";
import FavoriteIcon from "../assets/favorite.png";
import AddressIcon from "../assets/address.png";
import AddIcon from "../assets/add.png";
import WarningIcon from "../assets/warning.png";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { db } from "../firebase";

import { getFirestore, doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import DefaultProfile from "../assets/profile.png";

function ProfilePage() {
  const navigate = useNavigate();
  const auth = getAuth();
  

  const [userData, setUserData] = useState(null);
  const [userId, setUserId] = useState(""); // State untuk menyimpan UserID
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserData = async (userId) => {
    try {
      const userDoc = doc(db, "users", userId);
      const userSnapshot = await getDoc(userDoc);

      if (userSnapshot.exists()) {
        setUserData(userSnapshot.data());
      } else {
        console.error("Data pengguna tidak ditemukan");
      }
    } catch (error) {
      console.error("Gagal mengambil data pengguna:", error);
    }
  };

  const fetchTransactions = async (userId) => {
    try {
      const transactionQuery = query(
        collection(db, "orders"),
        where("userid", "==", userId)
      );
      const transactionSnapshot = await getDocs(transactionQuery);

      const transactionsList = transactionSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTransactions(transactionsList);
    } catch (error) {
      console.error("Gagal mengambil data transaksi:", error);
    }
  };

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      fetchUserData(currentUser.uid);
      fetchTransactions(currentUser.uid);
    } else {
      navigate("/login");
    }
    setIsLoading(false);
  }, [auth, navigate]);

  const handleLogout = () => {
    toast.info(
      <div>
        <p>Anda yakin ingin keluar?</p>
        <button 
          onClick={() => console.log("User logged out")} 
          className="bg-white text-green-600 px-3 py-1 rounded-md font-semibold mt-2"
        >
          Keluar Sekarang
        </button>
      </div>,
      { position: "top-right", autoClose: false }
    );
  };

  if (isLoading) {
    return <div className="text-center">Memuat data pengguna...</div>;
  }

  if (!userData) {
    return <div className="text-center">Data pengguna tidak tersedia</div>;
  }

  return (
    <div className=" flex flex-col items-center p-6">
      {/* Container */}
      <div className="w-full max-w-5xl bg-white shadow-lg rounded-lg flex flex-col lg:flex-row overflow-hidden">
        {/* Sidebar */}
        <div className="w-full lg:w-1/3 bg-gray-800 text-white flex flex-col items-center p-6">
          <img
            src={userData.profilePicture || DefaultProfile}
            alt="User Avatar"
            className="w-28 h-28 rounded-full border-4 border-gray-700 mb-4"
          />
          <h3 className="text-xl font-semibold">{userData.name}</h3>
          <p className="text-sm text-gray-300">@{userData.username}</p>
          <p className="text-sm text-gray-300">{userData.phone}</p>
          <button 
          onClick={() => navigate("/editprofile")}
          className="bg-green-500 text-white px-4 py-2 mt-4 rounded hover:bg-green-600">
            Edit Profil
          </button>

          {/* Menu */}
          <div className="grid grid-cols-2 gap-4 mt-6 w-full">
            {[
              { label: "Laporkan Masalah", icon: WarningIcon },
              { label: "Belanja", icon: AddIcon },
              { label: "Alamat Saya", icon: AddressIcon },
              { label: "Keluar", icon: LogoutIcon, action: handleLogout },
            ].map((menu, index) => (
              <div
                key={index}
                className="flex flex-col items-center cursor-pointer"
                onClick={menu.action || null}
              >
                <div className="w-16 h-16 bg-gray-700 rounded-lg flex justify-center items-center">
                  <img src={menu.icon} alt={menu.label} className="w-8 h-8" />
                </div>
                <p className="text-sm font-medium mt-2 text-center">{menu.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full lg:w-2/3 bg-gray-100 p-6">
          <h3 className="text-2xl font-bold mb-4 text-gray-800">History Transaksi</h3>
          <p className="text-sm mb-4 text-gray-500">UserID: {userData.userId}</p>

          {transactions.length > 0 ? (
            transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="bg-white rounded-lg shadow p-4 mb-4 flex justify-between items-center"
              >
                <div className="flex items-center">
                  <img
                    src={transaction.productImage || DefaultProfile}
                    alt="Produk"
                    className="w-16 h-16 rounded-md mr-4"
                  />
                  <div>
                    <p className="font-semibold text-gray-800">{transaction.productName}</p>
                    <p className="text-sm text-gray-500">
                      {transaction.quantity} x Rp. {transaction.price}
                    </p>
                    <p className="text-sm text-gray-400">{transaction.details}</p>
                  </div>
                </div>
                <p className="text-sm font-bold text-green-600">{transaction.status}</p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">Tidak ada transaksi ditemukan</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
