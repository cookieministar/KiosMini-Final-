import React, { useState, useEffect } from "react";
import { faHeart, faShoppingCart, faBars, faTimes, faBell, faExclamationTriangle, faSignOutAlt, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth"; // Tambahkan useEffect
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { db } from "../firebase";
import { getFirestore, doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";

const Profile = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State untuk hamburger menu
  const navigate = useNavigate();
  const auth = getAuth();
 
  const [userData, setUserData] = useState(null);
  const [userId, setUserId] = useState(""); // State untuk menyimpan UserID
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const { currentUser } = getAuth(); // Ambil user yang sedang login
  
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
  
  
   useEffect(() => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        fetchUserData(currentUser.uid);

      } else {
        navigate("/login");
      }
      setIsLoading(false);
    }, [auth, navigate]);
  
    const handleLogout = () => {
      signOut(auth)
        .then(() => navigate("/login"))
        .catch((error) => console.error("Gagal logout:", error));
    };

    useEffect(() => {
      if (!currentUser) return; // Pastikan user sudah login sebelum mengambil data
  
 
      const fetchOrders = async () => {
        try {
          const ordersRef = collection(db, "orders");
          const q = query(ordersRef, where("userId", "==", currentUser.uid)); // Hanya pesanan milik user
          const querySnapshot = await getDocs(q);
          
          const ordersList = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
  
          setOrders(ordersList);
        } catch (error) {
          console.error("Error mengambil pesanan:", error);
        }
      };
  
      fetchOrders();
    }, [currentUser]);
    const HandleLaporkanMasalah = () => {
      navigate("/laporkanmasalah"); // Sesuaikan dengan path yang benar
    };

  const fetchProducts = async () => {
       try {
         const productsCollection = collection(db, "products");
         const productSnapshot = await getDocs(productsCollection);
 
         const productsList = productSnapshot.docs.map((doc) => ({
           id: doc.id,
           ...doc.data(),
         }))
         
         const categoriesList = [
           ...new Set(productsList.map((product) => product.category)),
         ];
 
         setProducts(productsList);
         setCategories(categoriesList);
       } catch (error) {
         console.error("Error fetching products from Firestore:", error);
       }
     };

     
     
     if (isLoading) {
      return <div className="text-center">Memuat data pengguna...</div>;
    }
  
    if (!userData) {
      return <div className="text-center">Data pengguna tidak tersedia</div>;
    }
 
    const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  
  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
    {/* Hamburger Menu Button */}
      {/* Hamburger Menu Button (Mobile Only) */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        <button onClick={toggleMenu} className="p-2 bg-[#955530ae] rounded-lg">
          <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} className="text-white text-2xl" />
        </button>
      </div>
    
    {/* Sidebar */}
    <div className={`absolute md:relative w-full md:w-64 bg-[#8B4513] p-5 text-white md:h-full transition-transform transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0` }>
      <h2 className="text-lg font-bold">HISTORY TRANSAKSI</h2>
      <ul className="mt-5 space-y-2">
        {['Semua', 'Menunggu', 'Disetujui', 'Selesai', 'Dibatalkan', 'Arsip'].map((item) => (
          <li key={item} className="cursor-pointer p-3 rounded-md hover:bg-white hover:text-black transition">
            {item}
          </li>
        ))}
      </ul>
    </div>
      
      {/* Main Content */}
      <div className="flex-1 p-5 md:p-10">
        {/* Profile Card */}
        <div className="flex flex-col md:flex-row items-center bg-white p-6 rounded-lg shadow-lg">
          <div className="w-24 h-24 bg-gray-400 rounded-full"></div>
          <div className="mt-3 md:ml-5 text-center md:text-left">
            <h2 className="text-2xl font-bold">{userData.name}</h2>
            <p className="text-gray-500 text-lg">@{userData.username}</p>
          </div>
          <button className="mt-3 md:mt-0 md:ml-auto bg-green-600 text-white px-6 py-2 rounded-lg">Edit</button>
        </div>
        
        {/* Action Buttons */}
 {/* Action Buttons */}
 <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { text: 'Laporkan Masalah', color: 'bg-red-600', icon: faExclamationTriangle, action: HandleLaporkanMasalah },
            { text: 'Keluar', color: 'bg-green-600', icon: faSignOutAlt, action: handleLogout  },
            // { text: 'Alamat Saya', color: 'bg-orange-500', icon: faMapMarkerAlt }
          ].map((btn, index) => (
            <button 
              key={index} 
              className={`${btn.color} text-white px-4 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 text-center`}
              onClick={btn.action || null}
            >
              <FontAwesomeIcon icon={btn.icon} />
              {btn.text}
            </button>
          ))}
        </div>
        
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
  {orders.length > 0 ? (
    orders.map((order) => (
      <div
        key={order.id}
        className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 flex flex-col justify-between h-auto w-auto"
      >
        <h3 className="font-bold text-xl text-gray-900 truncate">{order.id}</h3>

        <div className="text-gray-700 text-base space-y-2">
          <p className="truncate"><span className="font-medium">Nama:</span> {order.customer?.name}</p>
          <p className="truncate"><span className="font-medium">Alamat:</span> {order.customer?.address}</p>
          <p className="truncate"><span className="font-medium">No. HP:</span> {order.customer?.phone}</p>
        </div>

        <p className="font-bold text-gray-800 mt-2 text-base">
          Metode Pembayaran: {order.paymentMethod}
        </p>

        <div className="mt-2 text-gray-700 text-base space-y-2">
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between items-center">
              <p className="truncate font-medium">{item.name}</p>
              <p>{item.quantity} x Rp {item.price.toLocaleString()}</p>
            </div>
          ))}
        </div>

        <p className="mt-4 font-bold text-gray-800 text-lg">
          Total Harga: Rp {order.total?.toLocaleString()}
        </p>

        <p className="mt-2 text-gray-600">{order.OnProgress}</p>
      </div>
    ))
  ) : (
    <p className="text-gray-500 text-center col-span-full">Belum ada pesanan.</p>
  )}
</div>

      </div>
    </div>
  );
};

export default Profile;
