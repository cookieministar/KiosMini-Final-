import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faShoppingCart, faHeart } from "@fortawesome/free-solid-svg-icons";
import { db } from "../firebase";
import settingImage from "../assets/setting.png";
import Footer from "./footer";
import kuasImage from "../assets/Kuas.png";
import hammerImage from "../assets/Hammer.png";
import pakuImage from "../assets/Paku.png";
import emberImage from "../assets/ember.png";
import { collection, getDocs, doc, getDoc, query, where } from "firebase/firestore";


const MobileHomePage = () => {
  const [liked, setLiked] = useState([]);
  const [showCartContainer, setShowCartContainer] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [products, setProducts] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const navigate = useNavigate();

  const handleLikeClick = (index) => {
      const updatedLikes = [...liked];
      updatedLikes[index] = !updatedLikes[index];
      setLiked(updatedLikes);
    };
  
    const handleCheckout = () => {
      navigate("/checkout", { state: { cartItems } }); // Kirim data keranjang
    };
    
    const handleSelectAll = () => {
      if (!selectAll) {
        setSelectedItems(cartItems.map((item, index) => index));
      } else {
        setSelectedItems([]);
      }
      setSelectAll(!selectAll);
    };
  
    const handleItemSelect = (index) => {
      if (selectedItems.includes(index)) {
        setSelectedItems(selectedItems.filter((item) => item !== index));
      } else {
        setSelectedItems([...selectedItems, index]);
      }
    };
  
  
      const handleProductClick = async (productId, category) => {
      try {
        // Ambil detail produk berdasarkan ID
        const productRef = doc(db, "products", productId);
        const productSnap = await getDoc(productRef);
  
        if (!productSnap.exists()) {
          console.error("Produk tidak ditemukan!");
          return;
        }
  
        const product = { id: productId, ...productSnap.data() };
  
        // Ambil produk serupa berdasarkan kategori
        const q = query(collection(db, "products"), where("category", "==", category));
        const querySnapshot = await getDocs(q);
        const similarProducts = querySnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(item => item.id !== productId);
  
        // Navigasi ke halaman detail dengan data yang diambil dari Firestore
        navigate(`/product-detail/${productId}`, { state: { product, similarProducts } });
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };
  
  
    const handleHeartClick = (index) => {
      const updatedLikes = [...liked];
      updatedLikes[index] = !updatedLikes[index]; // Toggle like state
      setLiked(updatedLikes);
  
      if (updatedLikes[index]) {
        navigate("/wishlist"); // Pindah ke halaman wishlist jika produk disukai
      }
    };
  
    const handleAddToCart = (product) => {
      if (!product || !product.id) {
        console.error("Produk tidak valid");
        return;
      }
    
      // Format data item keranjang
      const newItem = {
        id: product.id,
        name: product.namaProduk || "Produk Tanpa Nama",
        image: product.uploadFoto || "",
        price: product.harga ? Number(product.harga) : 0,
      };
    
      setCartItems((prevItems) => {
        // Cek apakah item sudah ada di keranjang
        const existingItem = prevItems.find((item) => item.id === newItem.id);
        
        if (existingItem) {
          // Jika sudah ada, tingkatkan jumlah
          return prevItems.map((item) =>
            item.id === newItem.id
              ? { ...item, quantity: (item.quantity || 1) + 1 }
              : item
          );
        } else {
          // Jika baru, tambahkan ke keranjang
          return [...prevItems, { ...newItem, quantity: 1 }];
        }
      });
    
      setShowCartContainer(true); // Tampilkan keranjang
    };
  
    // ✅ Memastikan harga valid
    const getValidPrice = (price) => {
      return !isNaN(price) && price > 0 ? price : 0;
    };
  
    // ✅ Menangani navigasi dari halaman lain yang menambahkan produk ke keranjang
    useEffect(() => {
      if (location.state?.addToCart) {
        const productToAdd = location.state.addToCart;
    
        console.log("Produk diterima di Home:", productToAdd);
    
        setCartItems((prevItems) => {
          const itemExists = prevItems.find((item) => item.id === productToAdd.id);
          if (itemExists) {
            return prevItems.map((item) =>
              item.id === productToAdd.id
                ? { ...item, quantity: (item.quantity || 1) + 1 }
                : item
            );
          } else {
            return [...prevItems, { ...productToAdd, price: Number(productToAdd.price) }];
          }
        });
    
        setShowCartContainer(true);
        navigate(".", { state: {}, replace: true });
      }
    }, [location.state]);
    
  
    const handleSearch = (query) => {
      console.log("Searching for:", query); 
      const results = productNames.filter((name) =>
        name.toLowerCase().includes(query.toLowerCase())
      );
      console.log("Results found:", results); 
      setSearchResults(results);
    };

  
    useEffect(() => {
      const fetchProducts = async () => {
        const querySnapshot = await getDocs(collection(db, "products"));
        const productList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(productList);
      };
      fetchProducts();
    }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="flex-1 p-3">
        {/* Header */}
        <div className="flex items-center justify-between w-full mt-2 relative">
          <img
            src="https://res.cloudinary.com/ddl4sxrb3/image/upload/v1735230561/IMG_20241220_063824-removebg-preview_1_1_q92ntf.png"
            alt="Logo"
            className="w-10 h-10"
          />
          <div className="flex items-center space-x-3">
            <FontAwesomeIcon icon={faShoppingCart} className="text-black text-lg cursor-pointer" onClick={() => setShowCartContainer(!showCartContainer)} />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <FontAwesomeIcon icon={faMapMarkerAlt} className="text-black text-base" />
          <a href="https://maps.app.goo.gl/mkmc7nMVmBr3GraT6" className="text-sm">Jalan. Peterongan Tengah Raya</a>
        </div>

        {/* Section Kategori */}
        <h2 className="text-lg font-bold text-gray-800 mt-5">Category</h2>
        <div className="grid grid-cols-4 gap-3 mt-4">
          {[{ img: kuasImage, label: "Brush" }, { img: hammerImage, label: "Hammer" }, { img: pakuImage, label: "Nails" }, { img: emberImage, label: "Paint" }].map((item, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="w-14 h-14 bg-[#955530ae] rounded-full flex justify-center items-center">
                <img src={item.img} alt={item.label} className="w-10 h-10" />
              </div>
              <span className="text-xs font-semibold text-gray-800 mt-1">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Produk */}
        <h2 className="text-lg font-bold text-gray-800 mt-6">Product Kini</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
          {products.map((product) => (
            <div key={product.id} className="flex flex-col items-center w-full">
              <div className="relative bg-[#955530ae] rounded-lg p-4 shadow-md w-full flex flex-col items-center justify-between">
                <FontAwesomeIcon
                  icon={faShoppingCart}
                  className="absolute top-2 left-2 text-lg text-white cursor-pointer"
                  onClick={() => handleAddToCart(product)}
                />
                <img src={product.uploadFoto} alt={product.namaProduk} className="object-contain rounded-lg w-24 h-24 cursor-pointer" onClick={() => handleProductClick(product.id, product.category )} />
              </div>
              <div className="text-center mt-2 w-full">
                <div className="text-sm font-bold text-gray-800 truncate">{product.namaProduk}</div>
                <div className="text-red-500 text-sm font-bold">Rp. {Number(product.harga).toLocaleString("id-ID")}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showCartContainer && (
  <div className="absolute top-20 right-4 left-4 md:left-20 md:w-[400px] md:h-[500px] w-[90%] h-auto p-3 bg-[#933804ed] shadow-md z-50 rounded-[15px] flex flex-col">
    {/* Judul Keranjang */}
    <div className="flex items-center justify-center mb-3">
      <h2 className="text-xl font-bold text-white">PEMESANAN</h2>
    </div>

    {/* Daftar Produk dalam Keranjang */}
    <div className="mt-3 flex-grow flex flex-col max-h-[350px] overflow-y-auto">
      {cartItems.length > 0 ? (
        cartItems.map((product) => (
          <div key={product.id} className="flex items-center mb-3 flex-wrap">
            {/* Checkbox untuk memilih produk */}
            <input
              type="checkbox"
              className="mr-2"
              checked={selectedItems.includes(product.id)}
              onChange={() => handleItemSelect(product.id)}
            />

            {/* Gambar Produk */}
            <div className="bg-white rounded-[10px] p-2 flex items-center">
              <img
                src={product.image}
                alt={product.name}
                className="w-[40px] h-[40px] object-contain"
              />
            </div>

            {/* Nama dan Harga Produk */}
            <div className="ml-2 flex flex-col">
              <span className="text-white text-sm font-bold">{product.name}</span>
              <span className="text-red-500 text-sm font-bold mt-1">
                Rp. {product.price.toLocaleString("id-ID")}
              </span>
            </div>

            {/* Tombol untuk Mengatur Kuantitas */}
            <div className="ml-auto flex items-center">
              <button
                className="bg-gray-300 text-black px-1 py-1 rounded-l hover:bg-gray-400 transition duration-200"
                onClick={() => {
                  setQuantities((prevQuantities) => ({
                    ...prevQuantities,
                    [product.id]: Math.max((prevQuantities[product.id] || 1) - 1, 1),
                  }));
                }}
              >
                -
              </button>
              <input
                type="number"
                min="1"
                value={quantities[product.id] || 1}
                className="w-[35px] text-center border border-gray-300 rounded mx-1"
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 1;
                  setQuantities((prevQuantities) => ({
                    ...prevQuantities,
                    [product.id]: value,
                  }));
                }}
              />
              <button
                className="bg-gray-300 text-black px-1 py-1 rounded-r hover:bg-gray-400 transition duration-200"
                onClick={() => {
                  setQuantities((prevQuantities) => ({
                    ...prevQuantities,
                    [product.id]: (prevQuantities[product.id] || 1) + 1,
                  }));
                }}
              >
                +
              </button>
            </div>
          </div>
        ))
      ) : (
        <span className="text-white text-center">Tidak ada produk dalam pemesanan.</span>
      )}
    </div>

    {/* Footer */}
    <div className="flex items-center justify-between mt-3 bg-white rounded-[10px] p-2 flex-wrap">
      <div className="flex items-center">
        <input type="checkbox" className="mr-2" checked={selectAll} onChange={handleSelectAll} />
        <span className="text-gray-800 font-bold text-sm">Semua</span>
      </div>
      <span className="text-red-500 font-bold text-sm md:text-md">
        Total: Rp. {" "}
        {cartItems
          .filter((item) => selectedItems.includes(item.id))
          .reduce((total, item) => total + getValidPrice(item.price) * (quantities[item.id] || 1), 0)
          .toLocaleString("id-ID")}
      </span>
      <button
        className="bg-[#955530] text-white px-3 py-2 rounded-[10px] mt-3 hover:bg-[#7a4722] transition duration-300 w-full md:w-auto text-sm"
        onClick={handleCheckout}
      >
        Booking Pembelian
      </button>
    </div>
  </div>
)}


      <Footer />
    </div>
  )
};

export default MobileHomePage;
