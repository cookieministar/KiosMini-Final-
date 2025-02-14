import React, { useEffect, useState } from "react";
import { useNavigate,  } from "react-router-dom";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";

import { db } from "../firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faShoppingCart, faBars, faTimes, faBell } from "@fortawesome/free-solid-svg-icons";


const CategoryPage = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [liked, setLiked] = useState({});
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State untuk hamburger menu
  const [showCartContainer, setShowCartContainer] = useState(false); // State untuk cart container
  const [quantities, setQuantities] = useState({});
  const [selectedItems, setSelectedItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
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

    fetchProducts();
  }, []);



  const [selectAll, setSelectAll] = useState(false);

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
  
  
    navigate("/product-detail", {
      state: {
        product: { ...product, price: cleanPrice }, // Oper harga yang sudah diubah ke angka
        similarProducts: similarProducts.map((p) => ({
          ...p,
          price: parseInt(p.price.replace(/[Rp. ]/g, ""), 10),
        })), // Bersihkan harga untuk produk serupa juga
      },
    });
  };

  const handleSelectAll = () => {
    setSelectAll((prev) => !prev);
    // Update selectedItems based on the new selectAll state
    if (!selectAll) {
      // If selectAll is true, select all items
      setSelectedItems(cartItems.map((_, index) => index));
    } else {
      // If selectAll is false, clear selection
      setSelectedItems([]);
    }
  };

  const handleLikeClick = (productName) => {
    setLiked((prevLiked) => ({
      ...prevLiked,
      [productName]: !prevLiked[productName],
    }));
  };

  const handleCheckout = () => {
    navigate("/checkout", { state: { cartItems } });
  };

  const handleItemSelect = (index) => {
    if (selectedItems.includes(index)) {
      setSelectedItems(selectedItems.filter((item) => item !== index));
    } else {
      setSelectedItems([...selectedItems, index]);
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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    
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

  const filteredProducts = selectedCategory
  ? products.filter((product) => product.category === selectedCategory)
  : products;
  
  

  return (
    <div className="flex flex-col md:flex-row mt-[100px]">
      {/* Hamburger Menu Button (Mobile Only) */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        <button onClick={toggleMenu} className="p-2 bg-[#955530ae] rounded-lg">
          <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} className="text-white text-2xl" />
        </button>
      </div>

      {/* Ikon Cart, Heart, dan Bell */}
      <div className="flex items-center ml-auto">
        <div className="fixed top-24 right-4 flex items-center space-x-4 z-50">
          {/* Icon Cart */}
          <div className="relative group p-2">
            <div className="absolute inset-0 w-9 h-9 bg-[#933804bf] ml-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <FontAwesomeIcon
              icon={faShoppingCart}
              className="text-black text-2xl mx-2 cursor-pointer relative"
              onClick={() => setShowCartContainer(!showCartContainer)}
            />
          </div>
        </div>
      </div>

      {showCartContainer && (
  <div className="absolute top-40 right-4 left-4 md:left-20 md:w-[400px] md:h-[500px] w-[90%] h-auto p-3 bg-[#933804ed] shadow-md z-50 rounded-[15px] flex flex-col">
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


      {/* Overlay untuk mencegah klik di luar hamburger menu */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleMenu}
        ></div>
      )}

      {/* Sidebar (Mobile dan Desktop) */}
      <div
        className={`md:w-[317px] md:h-[669px] bg-[#c6bbb6] rounded-lg shadow-md p-4 md:relative md:mt-[-50px] md:block ${
          isMenuOpen ? "fixed top-0 left-0 w-[250px] h-full z-50 transform translate-x-0" : "hidden"
        } md:translate-x-0`}
      >
        <h1 className="text-black text-2xl font-bold mb-4 mt-10">Category</h1>
        <div className="mt-8">
          <div
            className={`mb-3 cursor-pointer p-2 rounded-lg ${
              selectedCategory === null ? "bg-[#955530ae] text-white" : "text-black"
            }`}
            onClick={() => {
              setSelectedCategory(null)
              setIsMenuOpen(false); // Tutup menu setelah memilih kategori
            }}
          >
            <p className="text-lg font-medium ml-2">All Product</p>
          </div>
          {categories.map((category, index) => (
            <div
              key={index}
              className={`mb-3 cursor-pointer p-2 rounded-lg ${
                selectedCategory === category ? "bg-[#955530ae] text-white" : "text-black"
              }`}
              onClick={() => {
                setSelectedCategory( category );
                setIsMenuOpen(false); // Tutup menu setelah memilih kategori
              }}
            >
              <p className="text-lg font-medium ml-2"> {category}</p>
            </div>
          ))}
        </div>
      </div>

{/* Product List */}
<div className="flex-1 p-5 mt-14">
  <div className="overflow-y-auto h-[calc(100vh-200px)]">
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {filteredProducts.map((product) => (
        <div key={product.id} className="relative w-full">
          
          {/* Kotak Produk 1:1 (Keseluruhan Produk) */}
          <div className="w-full aspect-square bg-[#955530ae] rounded-lg shadow-md flex flex-col items-center p-4 relative">
            
            {/* Ikon Favorite */}
            <div className="absolute top-2 right-2 z-10">
              <FontAwesomeIcon
                icon={faHeart}
                className={`text-lg cursor-pointer ${
                  liked[product.id] ? "text-red-500" : "text-gray-400"
                } like-button`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleLikeClick(product.id);
                }}
              />
            </div>

            {/* Ikon Keranjang */}
            <div className="absolute top-2 left-2 z-10">
              <FontAwesomeIcon
                icon={faShoppingCart}
                className="text-lg cursor-pointer text-gray-400 hover:text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart(product);
                }}
              />
            </div>

            {/* Gambar Produk (Selalu 1:1) */}
            <div className="w-full aspect-square bg-white rounded-md overflow-hidden flex justify-center items-center">
              <img
                src={product.uploadFoto}
                alt={product.namaProduk}
                className="w-full h-full object-contain"
                onClick={() => handleProductClick(product.id, product.category)}
              />
            </div>

            {/* Nama Produk */}
            <div className="text-sm md:text-base font-bold text-gray-800 text-center mt-2">
              {product.namaProduk}
            </div>

            {/* Harga Produk */}
            <div className="text-red-500 text-sm md:text-lg font-bold mt-1">
              Rp. {Number(product.harga || 0).toLocaleString("id-ID")}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>

    </div>
  );
};

export default CategoryPage;