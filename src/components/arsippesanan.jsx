import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

const ArsipPesanan = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "archiveproduct"));
        const fetchedOrders = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(fetchedOrders);
      } catch (error) {
        console.error("Error fetching archive orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  if (orders.length === 0) {
    return <p className="text-center text-gray-500">Tidak ada pesanan arsip</p>;
  }

  return (
    <div className="p-4">
      {/* Judul Arsip Pesanan */}
      <h1 className="text-2xl font-bold text-center mb-6">Arsip Pesanan</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white shadow-md p-4 rounded-lg border w-full sm:w-80 md:w-96 h-auto flex flex-col justify-between mx-auto overflow-hidden"
          >
            {/* Customer Details */}
            <div>
              <h2 className="font-bold text-base sm:text-lg">Pesanan ID: {order.id}</h2>
              <p className="text-sm text-gray-700">Nama: {order.customer?.name}</p>
              <p className="text-sm text-gray-700">Alamat: {order.customer?.address}</p>
              <p className="text-sm text-gray-700">No. HP: {order.customer?.phone}</p>
              <p className="text-sm text-gray-700">Total: Rp {order.total?.toLocaleString()}</p>
              <p className="text-sm text-gray-700">Metode Pembayaran: {order.paymentMethod}</p>
              <p className="text-sm text-gray-700">
                Tanggal Pemesanan:{" "}
                {order.createdAt
                  ? new Date(order.createdAt.seconds * 1000).toLocaleDateString()
                  : "Tidak tersedia"}
              </p>
              <p className="text-sm text-gray-700">Status: {order.OnProgress}</p>
            </div>

            {/* Order Items */}
            <div className="mt-2 overflow-auto max-h-28">
              <h3 className="font-bold text-sm sm:text-base">Item:</h3>
              {order.items?.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between text-xs sm:text-sm text-gray-700"
                >
                  <p>{item.name}</p>
                  <p>{item.quantity} x Rp {item.price?.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArsipPesanan;
