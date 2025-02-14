import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';

// Impor Navbar
import Navbar from './components/Navbar';
import MobileNavbar from './components/MobileNavbar';


// Impor Halaman
import HomePage from './components/Home';
import MobileHomePage from './components/MobileHomePage'; // Halaman khusus mobile
import CategoryPage from './components/category';
import About from './components/About';
import CheckoutPage from './components/checkout';
import AddProduct from './components/UploadAdmin';
import AdminProductPage from './components/AdminListProduct';
import EditProduct from './components/EditProdukAdmin';
import ProductDetail from './components/productdetail';
import Wishlist from './components/wishlist'; 
import Notification from './components/notification';// Import Wishlist
import Profile from './components/profileuser';
import RegisterPage from './components/registerpage';
import LoginPage from './components/loginpage';
import Lapormasalah from './components/laporkanmasalah';
import AdminDashboard from "./components/AdminPage";
import Profileuser from "./components/profileuser";
import ProfilePage from './components/ProfilePage';
import EditProfileUser from "./components/editprofile";
import AkunSetting from './components/akunsetting';
import ArsipPesanan from './components/arsippesanan';


// Komponen ResponsiveNavbar
const ResponsiveNavbar = () => {
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  return isMobile ? <MobileNavbar /> : <Navbar />;
};

// Komponen Layout untuk margin dinamis
const Layout = ({ children }) => {
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  return <div className={isMobile ? 'mt-16' : 'mt-24'}>{children}</div>;
};

const App = () => {
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  

  return (
    <Router>
      {/* Navbar responsif */}
      <ResponsiveNavbar />

      {/* Layout untuk margin dinamis */}
      <Layout>
        <Routes>
          {/* Rute untuk halaman utama */}
          <Route path="/" element={isMobile ? <MobileHomePage /> : <HomePage />} />

          {/* Rute untuk halaman lainnya */}
          <Route path="/category" element={<CategoryPage />} />         
          <Route path="/about" element={<About />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/addproduct" element={<AddProduct />} />
          <Route path="/adminproduct" element={<AdminProductPage />} />
          <Route path="/editproduct/:id" element={<EditProduct />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/profileuser" element={<ProfilePage />} />
          <Route path="/product-detail/:productId" element={<ProductDetail />} />
          <Route path="/laporkanmasalah" element={<Lapormasalah />} />
          <Route path="/profile" element={<Profile />} />
          {/* Route untuk halaman Wishlist */}
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/notification" element={<Notification />} />
          <Route path="/arsippesanan" element={<ArsipPesanan />} />
          <Route path="/editprofile/:userId" element={<EditProfileUser />} />
          <Route path="/akunsetting" element={<AkunSetting />} /> {/* Tambahkan rute untuk EditProfile */}
          {/* Tambahkan rute untuk EditProfile */}
             
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
