import React, { useState, useEffect } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase"; // Pastikan sudah diinisialisasi
import { useNavigate } from "react-router-dom";
import EditProduct from "./EditProdukAdmin";
import { faHeart, faShoppingCart, faBars, faTimes, faBell } from "@fortawesome/free-solid-svg-icons";

const AdminProductPage = () => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Fetch data from Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      const productsCollection = collection(db, "products");
      const productSnapshot = await getDocs(productsCollection);
      const productList = productSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productList);

      // Extract unique categories
      const uniqueCategories = [
        "Semua",
        ...new Set(productList.map((product) => product.category)),
      ];
      setCategories(uniqueCategories);
    };

    fetchProducts();
  }, []);

  // Filter products by category
  const filteredProducts =
    selectedCategory === "Semua"
      ? products
      : products.filter((product) => product.category === selectedCategory);

        // Fungsi untuk membuka popup konfirmasi
  const handleDeleteClick = (id) => {
    setSelectedProductId(id);
    setShowConfirm(true);
  };

  // Fungsi untuk membatalkan penghapusan
  const handleCancel = () => {
    setShowConfirm(false);
    setSelectedProductId(null);
  };

  // Fungsi untuk menghapus produk
  const handleDelete = async () => {
    if (!selectedProductId) return;

    try {
      const docRef = doc(db, "products", selectedProductId);
      await deleteDoc(docRef);
      console.log("Produk berhasil dihapus");

      // Refresh halaman atau update state untuk menghapus produk dari UI
      window.location.reload(); // Atau gunakan logika state untuk pembaruan
    } catch (error) {
      console.error("Gagal menghapus produk:", error);
    } finally {
      setShowConfirm(false);
      setSelectedProductId(null);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      
      <aside
        className={`fixed inset-y-0 left-0 w-[250px] bg-[#dedcdb] p-4 shadow-md transition-transform transform ${
    sidebarOpen ? "translate-x-0" : "-translate-x-full"
  } md:relative md:translate-x-0 md:w-[317px] rounded-lg`}
      >
        <h2 className="text-2xl font-bold mb-4">Category</h2>
        <ul>
          {categories.map((category) => (
            <li
              key={category}
              className={`cursor-pointer mb-4 text-lg font-semibold transition-all duration-300 ${
    selectedCategory === category
      ? "bg-[#955530ae] text-white px-4 py-2 rounded-lg"
      : "text-black hover:text-[#955530] hover:font-bold"
  }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </li>
          ))}
        </ul>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-100">
        <div className="flex justify-between items-center mb-4">
          {/* Hamburger Menu & Add Product Button */}
          <div className="flex items-center gap-4">
            <button
              className="md:hidden text-2xl"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <faBars />
            </button>
            <h2 className="text-2xl font-bold">Produk Anda</h2>
          </div>
          <button
            onClick={() => navigate("/addproduct")}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Tambah Produk
          </button>
        </div>

        {/* Produk Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white p-4 rounded shadow">
              <img
                src={product.uploadFoto || "https://via.placeholder.com/150"}
                alt={product.namaProduk}
                className="w-full h-32 object-cover rounded mb-2"
              />
              <h3 className="text-lg font-bold">{product.namaProduk}</h3>
              <p className="text-gray-600">Rp {product.harga}</p>
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => navigate(`/editproduct/${product.id}`)}
                  className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                >
                  Edit Produk
                </button>
                <button
                  onClick={() => handleDeleteClick(product.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Hapus Produk
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AdminProductPage;
