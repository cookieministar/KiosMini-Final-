import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logout from "../assets/logout.png";
import Favorite from "../assets/favorite.png";
import Address from "../assets/address.png";
import Add from "../assets/add.png";
import Warning from "../assets/warning.png";
import ProfileIcon from "../assets/profile.png"; // Placeholder untuk foto profil
import UserIcon from "../assets/user.png"; // Placeholder untuk icon user
import { getAuth, signOut } from "firebase/auth";
import AdminProductPage from "./AdminListProduct";
import { getFirestore, collection, getDocs, doc, updateDoc, setDoc, deleteDoc } from "firebase/firestore";


const AdminDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore();

  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data orders dari Firestore
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersCollection = collection(db, "orders");
        const orderSnapshot = await getDocs(ordersCollection);
        const orderList = orderSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(orderList);
      } catch (error) {
        console.error("Gagal mengambil data pesanan:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);


  const viewProofImage = (proofImage) => {
    if (proofImage) {
      setModalImage(proofImage);
      setIsModalOpen(true);
    } else {
      alert("Bukti transaksi tidak tersedia.");
    }
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setModalImage(null);
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      // Referensi dokumen yang akan dihapus
      const orderDocRef = doc(db, "orders", orderId);
  
      // Hapus dokumen dari Firestore
      await deleteDoc(orderDocRef);
  
      // Opsional: Tampilkan notifikasi atau lakukan tindakan setelah berhasil menghapus
      alert("Pesanan berhasil dihapus!");
      window.location.reload();
    } catch (error) {
      console.error("Gagal menghapus pesanan:", error);
      alert("Terjadi kesalahan saat menghapus pesanan.");
    }
  };

  const handleArchiveOrder = async (order) => {
    try {
      // Pindahkan data ke koleksi "archiveproduct"
      const archiveRef = doc(db, "archiveproduct", order.id);
      await setDoc(archiveRef, order);
  
      // Hapus data dari koleksi "orders"
      const orderRef = doc(db, "orders", order.id);
      await deleteDoc(orderRef);
  
      console.log("Pesanan berhasil diarsipkan");
      window.location.reload(); // Perbarui UI atau gunakan logika state
    } catch (error) {
      console.error("Gagal mengarsipkan pesanan:", error);
    }
  };

  // Fungsi untuk mengupdate status order
  const handleOrderStatus = async (id, status) => {
    try {
      const orderRef = doc(db, "orders", id);
      await updateDoc(orderRef, { OnProgress: status });
      alert(`Pesanan ${id} berhasil diperbarui menjadi ${status}`);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === id ? { ...order, OnProgress: status } : order
        )
      );
    } catch (error) {
      console.error("Gagal memperbarui status pesanan:", error);
    }
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => navigate("/login"))
      .catch((error) => console.error("Gagal logout:", error));
  };

  if (isLoading) {
    return <div className="text-center">Memuat data pesanan...</div>;
  }

  return (
    
<div className="min-h-screen flex flex-col">
  {/* Header */}
  <header className="bg-white shadow-md p-8 sm:p-8">
    <h1 className="text-xl sm:text-2xl font-bold">Halo, Admin!</h1>
    <p className="text-gray-600 text-sm sm:text-base">
      Hari Ini, Laporan Pesanan Produk Kamu
    </p>
  </header>

  <main className="flex-1 p-4 gap-6 flex flex-col md:flex-row">
    {/* Sidebar */}
    <aside className="bg-white shadow-md rounded-lg p-4 mb-4 md:mb-0 w-full md:w-1/4">
      {/* Order Status */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-8">
        <div className="flex flex-col items-center">
          <div className="bg-green-500 text-white rounded-full w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center text-lg">
            {orders.filter((order) => order.OnProgress === "Menunggu Konfirmasi").length}
          </div>
          <p className="text-xs sm:text-sm mt-2 text-center">Belum Dikonfirmasi</p>
        </div>
        <div className="flex flex-col items-center">
          <div className="bg-gray-500 text-white rounded-full w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center text-lg">
            {orders.filter((order) => order.OnProgress === "Sudah Dikonfirmasi").length}
          </div>
          <p className="text-xs sm:text-sm mt-2 text-center">Sudah Dikonfirmasi</p>
        </div>
        <div className="flex flex-col items-center">
          <div className="bg-red-500 text-white rounded-full w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center text-lg">
            {orders.filter((order) => order.OnProgress === "Dibatalkan").length}
          </div>
          <p className="text-xs sm:text-sm mt-2 text-center">Dibatalkan</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="grid grid-cols-2 gap-2 sm:gap-4">
      <button
      className="bg-amber-700 text-white rounded-lg p-2 sm:p-4 flex flex-col items-center"
      onClick={() => navigate("/adminproduct")}
    >
      <img src={Add} alt="Tambah Produk" className="w-6 h-6 sm:w-8 sm:h-8" />
      <p className="text-xs sm:text-sm mt-2 text-center">Tambah Produk</p>
    </button>
        <button className="bg-amber-700 text-white rounded-lg p-2 sm:p-4 flex flex-col items-center">
          <img src={Address} alt="Daftar Pesanan" className="w-6 h-6 sm:w-8 sm:h-8" />
          <p className="text-xs sm:text-sm mt-2 text-center">Arsip Pemesanan</p>
        </button>
        <button
          className="bg-amber-700 text-white rounded-lg p-2 sm:p-4 flex flex-col items-center"
          onClick={handleLogout}
        >
          <img src={Logout} alt="Keluar" className="w-6 h-6 sm:w-8 sm:h-8" />
          <p className="text-xs sm:text-sm mt-2 text-center">Keluar</p>
        </button>
      </div>
    </aside>

    <section className="flex-1">
    {orders.length === 0 ? (
      <p className="text-center text-gray-500">Belum ada pesanan</p>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white shadow-md rounded-lg p-4 sm:p-6 flex flex-col justify-between"
          >
            {/* Customer Details */}
            <div>
              <h2 className="font-bold text-base sm:text-lg">
                Pesanan ID: {order.id}
              </h2>
              <p className="text-sm text-gray-700">Nama: {order.customer?.name}</p>
              <p className="text-sm text-gray-700">
                Alamat: {order.customer?.address}
              </p>
              <p className="text-sm text-gray-700">
                No. HP: {order.customer?.phone}
              </p>
              <p className="text-sm text-gray-700">
                Total: Rp {order.total?.toLocaleString()}
              </p>
              <p className="text-sm text-gray-700">
                Metode Pembayaran: {order.paymentMethod}
              </p>
              <p
                className={`text-sm font-bold ${
                  order.OnProgress === "Menunggu Konfirmasi"
                    ? "text-yellow-500"
                    : order.OnProgress === "Sudah Dikonfirmasi"
                    ? "text-green-500"
                    : order.OnProgress === "Dibatalkan"
                    ? "text-red-500"
                    : "text-gray-700"
                }`}
              >
                Status: {order.OnProgress}
              </p>
            </div>

            {/* Order Items */}
            <div className="mt-4">
              <h3 className="font-bold text-sm sm:text-base">Item:</h3>
              {order.items?.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between text-xs sm:text-sm text-gray-700"
                >
                  <p>{item.name}</p>
                  <p>
                    {item.quantity} x Rp {item.price?.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 sm:gap-4 mt-4 sm:mt-6">
              {order.OnProgress === "Pesanan Selesai" ? (
                // Tombol Arsipkan Pesanan
                <button
                  className="bg-blue-500 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm"
                  onClick={() => handleArchiveOrder(order)}
                >
                  Arsipkan Pesanan
                </button>
              ) : (
                <>
                  {/* Tombol Setujui atau Pesanan Selesai */}
                  {order.OnProgress !== "Dibatalkan" && (
                    <button
                      className={`${
                        order.OnProgress === "Sudah Dikonfirmasi"
                          ? "bg-green-500"
                          : "bg-green-500"
                      } text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm`}
                      onClick={() =>
                        order.OnProgress === "Sudah Dikonfirmasi"
                          ? handleOrderStatus(order.id, "Pesanan Selesai") // Fungsi untuk menyelesaikan pesanan
                          : handleOrderStatus(order.id, "Sudah Dikonfirmasi") // Fungsi untuk mengonfirmasi pesanan
                      }
                    >
                      {order.OnProgress === "Sudah Dikonfirmasi"
                        ? "Pesanan Selesai"
                        : "Setujui"}
                    </button>
                  )}

                  {/* Tombol Tolak atau Pesanan Dibatalkan */}
                  <button
                    className={`${
                      order.OnProgress === "Dibatalkan"
                        ? "bg-red-500"
                        : order.OnProgress === "Sudah Dikonfirmasi"
                        ? "bg-red-500"
                        : "bg-red-500"
                    } text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm`}
                    onClick={() =>
                      order.OnProgress === "Dibatalkan"
                        ? handleDeleteOrder(order.id) // Fungsi untuk menghapus pesanan
                        : order.OnProgress === "Sudah Dikonfirmasi"
                        ? handleOrderStatus(order.id, "Dibatalkan") // Fungsi untuk membatalkan pesanan setelah dikonfirmasi
                        : handleOrderStatus(order.id, "Dibatalkan") // Fungsi untuk membatalkan pesanan
                    }
                  >
                    {order.OnProgress === "Dibatalkan"
                      ? "Hapus Pesanan"
                      : order.OnProgress === "Sudah Dikonfirmasi"
                      ? "Pesanan Dibatalkan"
                      : "Tolak"}
                  </button>

                   {/* Tombol Bukti Transaksi (hanya untuk QRIS) */}
  {order.paymentMethod === "QRIS" && (
    <button
      className="bg-blue-500 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm"
      onClick={() => viewProofImage(order.proofImage)} // Fungsi untuk melihat bukti transaksi
    >
      Bukti Transaksi
    </button>
  )}
                </>
              )}
            </div>


{isModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h2 className="text-lg font-bold mb-4">Bukti Transaksi</h2>
      <img src={modalImage} alt="Bukti Transaksi" className="w-60 h-80" />
      <button
        className="mt-4 py-2 px-4 bg-red-500 text-white font-bold rounded"
        onClick={closeModal}
      >
        Tutup
      </button>
    </div>
  </div>
)}

            </div>
          ))}
        </div>
      )}
    </section>
  </main>
</div>
  );
};

export default AdminDashboard;
