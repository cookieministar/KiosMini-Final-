import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import imageCompression from "browser-image-compression";
import { useLocation } from "react-router-dom";
import { auth, db } from "../firebase"; // Sesuaikan path file konfigurasi Firebase Anda
import { collection, addDoc, doc, getDoc} from "firebase/firestore";
import { getAuth,} from "firebase/auth"; // Contoh penggunaan context untuk auth
import Navbar from "./Navbar";
import QrisImage from "../assets/qris.jpg"

const Checkout = () => {
  const location = useLocation();
  const [isQRISPopupVisible, setIsQRISPopupVisible] = useState(false);
  const [proofImage, setProofImage] = useState(""); // Untuk menyimpan bukti transaksi dalam Base64
  const [paymentMethod, setPaymentMethod] = useState("");
  const cartItems = location.state?.cartItems || []; // Ambil data keranjang dari state
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  

  // Hitung total harga
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * (item.quantity || 1),0);
   // Ambil data pengguna dari AuthContext
   const auth = getAuth();
   const currentUser = auth.currentUser; // Pastikan Anda memiliki provider untuk AuthContext
   


   const fetchUserData = async (userId) => {
    try {
      const userRef = doc(db, "users", userId);
      const userSnapshot = await getDoc(userRef);
  
      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        console.log("Data Pengguna:", userData); // Log data yang diambil
        setUserData(userData); // Simpan ke state
      } else {
        console.error("Data pengguna tidak ditemukan di Firestore.");
      }
    } catch (error) {
      console.error("Error mengambil data pengguna:", error);
    }
  };


  useEffect(() => {
    if (auth.currentUser) {
      fetchUserData(auth.currentUser.uid);
    } else {
      console.error("Pengguna tidak ditemukan. Pastikan pengguna sudah login.");
    }
  }, [auth.currentUser]);

   const handlePaymentChange = (e) => {
    const selectedValue = e.target.value;

    // Jika checkbox yang sama dipilih, hilangkan pilihan
    if (selectedValue === "QRIS") {
      setPaymentMethod(selectedValue); // Tetapkan metode pembayaran QRIS
      setIsQRISPopupVisible(true); // Tampilkan pop-up QRIS
    } else {
      setPaymentMethod(selectedValue); // Tetapkan metode pembayaran lainnya
      setIsQRISPopupVisible(false); // Sembunyikan pop-up jika ada
    }
    console.log("Metode Pembayaran Dipilih:", selectedValue);    
  };

  const handleProofUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // Konfigurasi opsi kompresi
        const options = {
          maxSizeMB: 1, // Ukuran maksimum file dalam MB
          maxWidthOrHeight: 800, // Ukuran maksimum dimensi gambar
          useWebWorker: true, // Gunakan web worker untuk kinerja lebih baik
        };
  
        // Kompres file
        const compressedFile = await imageCompression(file, options);
  
        // Konversi ke Base64
        const reader = new FileReader();
        reader.onloadend = () => {
          setProofImage(reader.result); // Simpan gambar dalam Base64
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.error("Error saat mengompresi gambar:", error);
        alert("Terjadi kesalahan saat mengunggah gambar. Coba gunakan gambar lain.");
      }
    }
  };
 
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    paymentMethod: "",
  });

    // Fungsi untuk menangani perubahan input
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    };
  
    // Fungsi untuk menyimpan data ke Firestore
   // Fungsi untuk menyimpan data ke Firestore
   const handleCheckout = async () => {
    try {
      // Validasi data form sebelum disimpan
      if (!formData.name || !formData.address || !formData.phone) {
        alert("Mohon lengkapi semua informasi sebelum melanjutkan!");
        return;
      }
  
      const orderData = {
        items: cartItems,
        total: totalPrice,
        userId: auth.currentUser?.uid || "Unknown",
        proofImage: paymentMethod === "QRIS" ? proofImage : null,
        customer: {
          name: formData.name,
          address: formData.address,
          phone: formData.phone,
        },
        paymentMethod: paymentMethod,
        createdAt: new Date(),
        OnProgress: "Menunggu Konfirmasi",
        user: {
          username: userData?.username || "Unknown", // Pastikan diambil dari Firestore
          name: userData?.name || "Unknown", // Pastikan diambil dari Firestore
        },
      };
  
      if (paymentMethod === "QRIS" && !proofImage) {
        alert("Mohon unggah bukti transaksi sebelum melanjutkan!");
        return;
      }

      
      // Simpan ke Firestore
      const docRef = await addDoc(collection(db, "orders"), orderData);
      alert(`Checkout berhasil! Order ID: ${docRef.id}`);
      setIsQRISPopupVisible(false);
      // Arahkan ke halaman beranda
      navigate("/"); // "/" adalah path untuk halaman home, sesuaikan dengan konfigurasi Anda
    } catch (error) {
      console.error("Error saat menyimpan pesanan: ", error);
      alert("Terjadi kesalahan saat checkout. Silakan coba lagi.");
    }
  };
    return (
      <div className="flex flex-col min-h-screen">
      <div className="flex-1 p-4 pt-32 pb-20 flex flex-col lg:flex-row">
        {/* Kolom kiri untuk form */}
        <div className="w-full lg:w-1/2 lg:pr-4">
          <h1 className="text-2xl font-bold text-gray-800 text-left">
            KONFIRMASI <br /> PEMESANAN
          </h1>
  
          {/* Form Penerima */}
          <form className="mt-6 space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Nama Penerima
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Masukkan nama penerima"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#955530] bg-gray-200 text-sm"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Alamat Penerima
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Masukkan alamat penerima"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#955530] bg-gray-200 text-sm"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Nomor Tujuan Penerima
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Masukkan nomor tujuan penerima"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#955530] bg-gray-200 text-sm"
              />
            </div>
            {/* Dropdown Metode Pembayaran */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Metode Pembayaran
              </label>
              <select
                value={paymentMethod}
                onChange={handlePaymentChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="" disabled>
                  Pilih Metode Pembayaran
                </option>
                <option value="Bayar di Toko">Bayar di Toko</option>
                <option value="QRIS">QRIS</option>
              </select>
            </div>
          </form>
        </div>
  
        {/* Kolom kanan untuk box container */}
        <div className="w-full lg:w-1/2 lg:pl-4 mt-6 lg:mt-0">
          <div className="bg-[#933804] rounded-lg p-6 shadow-md">
            <h2 className="text-lg font-bold text-white mb-4">Pesanan Anda</h2>
            <div className="space-y-4">
              {cartItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 flex-wrap gap-2">
                  <div className="bg-white rounded-[20px] p-2 shadow-md w-16 h-16 flex items-center justify-center">
                    <img src={item.image} alt={item.name} className="w-14 h-14 object-contain" />
                  </div>
                  <span className="text-white font-medium text-sm">{item.name}</span>
                  <span className="text-white font-bold text-sm">
                    Rp {item.price.toLocaleString()}
                  </span>
                </div>
              ))}
              <div className="w-full h-[1px] bg-gray-300 my-4"></div>
              <div className="flex justify-between text-sm">
                <span className="text-white font-bold">Total</span>
                <span className="text-white font-bold">
                  {cartItems.length > 0
                    ? `Rp. ${cartItems.reduce((total, item) => total + item.price * (item.quantity || 1), 0)}`
                    : "Keranjang kosong"}
                </span>
              </div>
  
              {/* Popup QRIS */}
              {isQRISPopupVisible && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 shadow-lg w-96">
                    <h2 className="text-lg font-bold mb-4">Metode Pembayaran QRIS</h2>
                    <p>Silakan pindai barcode di bawah ini:</p>
                    <div className="my-4 flex justify-center">
                      <img src={QrisImage} alt="QRIS Barcode" className="w-60 h-60 object-contain" />
                    </div>
                    <div className="mt-4">
                      <label className="block font-medium mb-2">Unggah Bukti Transaksi</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProofUpload}
                        className="w-full"
                      />
                    </div>
                    <button
                      className="mt-4 py-2 px-4 bg-green-500 text-white font-bold rounded hover:bg-green-600"
                      onClick={handleCheckout}
                      disabled={!proofImage}
                    >
                      Kirim Bukti
                    </button>
                    <button
                      className="mt-2 py-2 px-4 bg-red-500 text-white font-bold rounded hover:bg-red-600"
                      onClick={() => setIsQRISPopupVisible(false)}
                    >
                      Batalkan
                    </button>
                  </div>
                </div>
              )}
  
              {/* Tombol Checkout */}
              <button
                className="w-full mt-4 py-2 bg-white text-[#933804] font-bold text-lg rounded-lg shadow-md hover:bg-gray-100 transition relative z-10"
                onClick={handleCheckout}
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>
    );
  };
  
  export default Checkout;
  