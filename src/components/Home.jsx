import React, { useState, useEffect } from "react"; // Tambahkan useEffect
import { useNavigate, useLocation } from "react-router-dom"; // Tambahkan useLocation
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faShoppingCart,
  faInfoCircle,
  faHeart,
  faStar,
  faBell,
} from "@fortawesome/free-solid-svg-icons";

import {db} from "../firebase";
import { collection, getDocs, doc, getDoc, query, where } from "firebase/firestore";
import kapakImage from "../assets/Kapak.png";
import kuasImage from "../assets/Kuas.png";
import pakuImage from "../assets/Paku.png";
import hammerImage from "../assets/Hammer.png";
import emberImage from "../assets/ember.png";
import pompaImage from "../assets/Pompa.png";
import LinggisImage from "../assets/Linggis.png";
import KuasCatImage from "../assets/KuasCat.png";
import MeteranImage from "../assets/Meteran.png";
import SekopImage from "../assets/Sekop.png";
import settingImage from "../assets/setting.png";
import Footer from "./footer";
import Navbar from "./Navbar";

const HomePage = () => {
  const [liked, setLiked] = useState([false, false, false, false, false]);
  const [showCartContainer, setShowCartContainer] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [products, setProducts] = useState([]);

  const [quantities, setQuantities] = useState({});
  const [selectedItems, setSelectedItems] = useState([]);


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

  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselImages = [kapakImage, MeteranImage, SekopImage]; // Gunakan 3 gambar berbeda


  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, "products"));
      const productList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(productList);
    };
    fetchProducts();
  }, []);



  return (
    <div className="flex flex-col min-h-screen mt-8">
      <div className="flex-1 p-4">
        <div className="flex flex-col text-lg text-gray-800 mt-2">
          <div className="flex items-center mt-4 ml-24 pt-2">
            <FontAwesomeIcon
              icon={faMapMarkerAlt}
              className="text-black text-2xl ml-7 mr-3"
            />
            <a
              href="https://maps.app.goo.gl/mkmc7nMVmBr3GraT6"
              className="ml-4"
            >
              Jalan. Peterongan Tengah Raya
            </a>
          </div>
          <div className="flex items-center ml-auto">
            {/* Icon Cart */}
            <div className="relative group p-2 ">
            <div className="absolute inset-0 w-9 h-9 bg-[#933804bf] ml-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <FontAwesomeIcon
                icon={faShoppingCart}
                className="text-black text-2xl mx-2 cursor-pointer relative"
                onClick={() => setShowCartContainer(!showCartContainer)}
              />
            </div>

            {/* Icon Heart */}
            <div className="relative group p-2">
              <div className="absolute inset-0 w-9 h-9 bg-[#933804bf] ml-3 translate-y-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <svg
                className="w-[32px] h-[32px] mx-2 text-red-500 relative"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                onClick={handleHeartClick} // Menambahkan event klik untuk navigasi
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
              </svg>
            </div>

            {/* Icon Bell */}
            <div className="relative group p-2">
              <div className="absolute inset-0 w-9 h-9 bg-[#933804bf] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:translate-x-2"></div>

              <FontAwesomeIcon
                icon={faBell}
                className="text-black text-2xl mx-2 relative cursor-pointer"
                onClick={() => navigate("/notification")} // Menambahkan onClick untuk navigasi
              />
            </div>
          </div>
        </div>

        {showCartContainer && (
  <div className="absolute top-30 right-0 bg-[#933804ed] left-25 w-[499px] h-[603px] p-4 shadow-md z-50 rounded-[19px] flex flex-col">
    {/* Judul Keranjang */}
    <div className="flex items-start justify-center mb-4">
      <h2 className="text-2xl font-bold text-white">PEMESANAN</h2>
    </div>

    {/* Daftar Produk dalam Keranjang */}
    <div className="mt-4 flex-grow flex flex-col">
      {cartItems.length > 0 ? (
        cartItems.map((product) => (
          <div key={product.id} className="flex items-center mb-4">
            {/* Checkbox untuk memilih produk */}
            <input
              type="checkbox"
              className="mr-2"
              checked={selectedItems.includes(product.id)}
              onChange={() => handleItemSelect(product.id)}
            />

            {/* Gambar Produk */}
            <div className="bg-white rounded-[15px] p-3 flex items-center">
              <img
                src={product.image}
                alt={product.name}
                className="w-[60px] h-[60px] object-contain"
              />
            </div>

            {/* Nama dan Harga Produk */}
            <div className="ml-3 flex flex-col justify-center">
              <span className="text-white text-xl font-bold">{product.name}</span>
              <span className="text-red-500 text-lg font-bold mt-1">
                Rp. {product.price.toLocaleString("id-ID")}
              </span>
            </div>

            {/* Tombol untuk Mengatur Kuantitas */}
            <div className="ml-4 flex items-center">
              <button
                className="bg-gray-300 text-black px-2 py-1 rounded-l hover:bg-gray-400 transition duration-200"
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
                className="w-[50px] text-center border border-gray-300 rounded mx-1"
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 1;
                  setQuantities((prevQuantities) => ({
                    ...prevQuantities,
                    [product.id]: value,
                  }));
                }}
              />
              <button
                className="bg-gray-300 text-black px-2 py-1 rounded-r hover:bg-gray-400 transition duration-200"
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
        <span className="text-white">Tidak ada produk dalam pemesanan.</span>
      )}
    </div>
    <div className="flex items-center justify-between mt-4 bg-white rounded-[15px] p-3">
      <div className="flex items-center">
        <input type="checkbox" className="mr-2" checked={selectAll} onChange={handleSelectAll} />
        <span className="text-gray-800 font-bold">Semua</span>
      </div>
      <span className="text-red-500 font-bold">
        Total: Rp. {" "}
        {cartItems
          .filter((item) => selectedItems.includes(item.id))
          .reduce((total, item) => total + getValidPrice(item.price) * (quantities[item.id] || 1), 0)
          .toLocaleString("id-ID")}
      </span>
      <button
                className="bg-[#955530] text-white px-4 py-2 rounded-[15px] mt-4 hover:bg-[#7a4722] transition duration-300"
                onClick={handleCheckout}
              >
                Booking Pembelian
              </button>
    </div>
  </div>
)}


        {/* Kategori - produk */}
        <div className="flex flex-col md:flex-row md:space-x-4 box-container-wrapper mr-60">
          <div className="w-[610px] h-[280px] bg-[#95553031] rounded-lg mx-auto my-5 p-4 shadow-md flex flex-row-reverse items-start relative">
            {/* Carousel Container */}
            <div className="w-[275px] h-[180px] ml-4 relative overflow-hidden rounded-lg">
              <div
                className="flex transition-transform duration-300 ease-in-out h-full"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {carouselImages.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Slide ${index + 1}`}
                    className="min-w-full h-full object-cover"
                  />
                ))}
              </div>

              {/* Dot Indicators */}
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {carouselImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      currentSlide === index
                        ? "bg-white scale-125"
                        : "bg-gray-400 hover:bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Bagian teks tetap sama */}
            <div className="flex flex-col justify-start items-start w-full mr-4 mb-12">
              <h2 className="font-bold text-lg text-gray-800">
                New Collection
              </h2>
              <p className="font-bold text-xl text-gray-800">
                Recommendations, <br /> from our shop!
              </p>
            </div>
            <button className="absolute bottom-5 left-4 min-w-[150px] px-2 py-2 bg-[#955530] text-white rounded-lg text-sm font-bold cursor-pointer transition duration-300 hover:bg-[#7a4722]">
              Shop Now
            </button>
          </div>

          <div className="welcome-text mt-4 ml m md:ml-12">
            <p
              className="text-2xl text-gray-800 font-bold"
              style={{ marginTop: "16px", marginLeft: "-75px" }}
            >
              Hallo, User!
            </p>
            <p style={{ marginTop: "10px", marginLeft: "-75px" }}>
              Selamat Datang di Website UMKM
            </p>
            <p style={{ marginTop: "10px", marginLeft: "-75px" }}>
              “KIOS MINI”
            </p>
            <div
              className="category-title text-2xl font-bold text-gray-800 mt-5"
              style={{ marginLeft: "-75px" }}
            >
              Category
            </div>
            <div className="flex justify-center items-center gap-x-8 mt-4 category-container ml-auto">
  {[kuasImage, hammerImage, pakuImage, emberImage].map((imgSrc, index) => (
    <div
      key={index}
      className="w-[80px] h-[75px] bg-[#955530ae] rounded-full flex justify-center items-center"
    >
      <img src={imgSrc} alt={`Image ${index}`} className="w-12 h-12" />
    </div>
  ))}
</div>
          </div>
        </div>

        {/* Product - footer */}
        <div className="w-1/3 h-[2px] bg-black mx-auto mb-2 mt-[25px]"></div>
        <div className="w-1/4 h-[2px] bg-black mx-auto mb-5 mt-[25px]"></div>

        <div className="flex items-center justify-between mb-5 mt-10">
          <div className="product-text text-lg font-bold text-left">
            Product Kini
          </div>
          <div className="flex gap-5">
            <div className="cursor-pointer text-lg font-bold py-2 px-4 rounded-full hover:bg-[#955530ae] hover:text-white transition duration-300">
              All
            </div>
            <div className="cursor-pointer text-lg font-bold py-2 px-4 rounded-full hover:bg-[#955530ae] hover:text-white transition duration-300">
              Newest
            </div>
            <div className="cursor-pointer text-lg font-bold py-2 px-4 rounded-full hover:bg-[#955530ae] hover:text-white transition duration-300">
              Popular
            </div>
          </div>
        </div>

             <div className="boxes-wrapper grid grid-cols-5 gap-3 mt-8">
  {products.map((product, index) => (
    <div key={product.id} className="flex flex-col items-center w-full">
      <div className="box-container-like relative bg-[#955530ae] rounded-lg p-4 shadow-md w-[200px] h-[200px] flex flex-col items-center justify-between">
        {/* Ikon */}
<FontAwesomeIcon
  icon={faShoppingCart}
  className="absolute top-2 left-2 text-lg text-white cursor-pointer"
  onClick={(e) => {
    e.stopPropagation(); // Mencegah event bubbling ke parent
    handleAddToCart(product); // Kirim objek produk lengkap
  }}
/>
        <FontAwesomeIcon
          icon={faHeart}
          className={`absolute top-2 right-2 text-lg cursor-pointer ${
            liked[index] ? "text-red-500" : "text-gray-400"
          } like-button`}
          onClick={() => handleLikeClick(index)}
        />
        
        {/* Gambar Produk */}
        <div className="flex justify-center items-center w-[150px] h-[150px]">
          <img
            src={product.uploadFoto}
            alt={product.namaProduk}
            className="object-contain rounded-lg w-[150px] h-[150px]"
            onClick={() => handleProductClick(product.id, product.category)}
          />
        </div>
      </div>

      {/* Nama dan Harga di Luar Kotak */}
      <div className="text-center mt-2 w-[220px]">
        <div className="text-lg font-bold text-gray-800 truncate">{product.namaProduk}</div>
        <div className="text-red-500 text-lg font-bold">Rp. {Number(product.harga).toLocaleString("id-ID")}</div>
      </div>
    </div>
  ))}
</div> 
      </div>

      <Footer />
    </div>
  );
};

export default HomePage;
