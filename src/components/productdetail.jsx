import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { collection, getDocs, doc, getDoc, query, where } from "firebase/firestore";
import { db } from "../firebase";

const ProductDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { product, similarProducts } = location.state || {};

  const handleProductClick = async (productId, category) => {
    try {
      const productRef = doc(db, "products", productId);
      const productSnap = await getDoc(productRef);

      if (!productSnap.exists()) {
        console.error("Produk tidak ditemukan!");
        return;
      }

      const product = { id: productId, ...productSnap.data() };

      const q = query(collection(db, "products"), where("category", "==", category));
      const querySnapshot = await getDocs(q);
      const similarProducts = querySnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((item) => item.id !== productId);

      navigate(`/product-detail/${productId}`, { state: { product, similarProducts } });
    } catch (error) {
      console.error("Error fetching product data:", error);
    }
  };

  if (!product) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold">Produk tidak ditemukan.</p>
      </div>
    );
  }

  const handleBuyNow = () => {
    if (!product || !product.namaProduk || !product.harga || !product.uploadFoto) {
      console.error("Data produk tidak lengkap:", product);
      return;
    }
  
    console.log("Navigating to checkout with:", product); // Debugging
  
    navigate("/checkout", {
      state: { cartItems: [{ 
        id: product.id, 
        name: product.namaProduk, 
        image: product.uploadFoto, 
        price: Number(product.harga) || 0 
      }], quantities: { 0: 1 } },
    });
  };
  

  const handleAddToCart = () => {
    // Pastikan harga produk valid
    const hargaProduk = Number(product.harga);
    if (isNaN(hargaProduk) || hargaProduk <= 0) {
      console.error("Harga produk tidak valid:", product.harga);
      return;
    }
  
    // Format data produk yang akan dikirim ke keranjang
    const productToAdd = {
      id: product.id, // ID produk
      name: product.namaProduk, // Nama produk
      image: product.uploadFoto, // Gambar produk
      price: hargaProduk, // Harga produk (pastikan sudah berupa angka)
    };
  
    // Navigasi ke Home dengan state berisi produk yang akan ditambahkan ke keranjang
    navigate("/", {
      state: { addToCart: productToAdd },
      replace: true, // Untuk menghindari history stack menumpuk
    });
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto p-4">
        <div className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col md:flex-row">
          <div className="md:w-1/2 p-4 flex justify-center items-center border-r border-gray-200">
            <div className="w-full max-w-md aspect-square overflow-hidden flex justify-center items-center bg-gray-100 rounded-md">
              <img
                src={product.uploadFoto}
                alt={product.namaProduk}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="md:w-1/2 p-6">
            <h1 className="text-2xl font-bold mb-2">{product.namaProduk}</h1>
            <p className="text-red-500 text-3xl font-semibold mb-4">
              Rp. {product.harga !== undefined && product.harga !== null ? Number(product.harga).toLocaleString("id-ID") : "0"}
            </p>

            <div className="bg-gray-100 p-4 rounded-lg mb-4">
              <p className="text-gray-700">{product.deskripsi}</p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mt-6">
              <button
                className="w-full bg-[#d0765b] hover:bg-[#aa5b43] text-white font-semibold py-3 rounded-lg"
                onClick={handleBuyNow}
              >
                Beli Sekarang
              </button>
              <button
                className="w-full bg-[#fe9655] hover:bg-[#FFB300] text-gray-800 font-semibold py-3 rounded-lg"
                onClick={handleAddToCart}
              >
                Tambah ke Keranjang
              </button>
            </div>

            <div className="mt-6">
              <h2 className="text-lg font-bold mb-2">Detail Produk</h2>
              <ul className="text-gray-700 space-y-2">
                <li>Kategori: {product.category || "Tidak ada kategori"}</li>
                <li>Stok: {product.stock || "Tidak tersedia"}</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-bold mb-4">Produk Serupa</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {similarProducts.map((item, index) => (
              <div
                key={index}
                className="bg-white shadow-md rounded-lg p-4 text-center cursor-pointer"
                onClick={() => handleProductClick(item.id, item.category)}
              >
                <div className="w-full aspect-square overflow-hidden flex justify-center items-center bg-gray-100 rounded-md">
                  <img
                    src={item.uploadFoto}
                    alt={item.namaProduk}
                    className="w-full h-full object-cover"
                  />
                </div>

                <p className="text-sm font-semibold mt-2">{item.namaProduk}</p>

                <p className="text-red-500 text-sm font-bold">
                  Rp. {item.harga !== undefined && item.harga !== null ? Number(item.harga).toLocaleString("id-ID") : "0"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
