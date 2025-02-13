import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import homeImage from '../assets/ihome.png';
import tasImage from '../assets/Tas.png';
import contactImage from '../assets/Contact.png';
import userImage from '../assets/user.png';

const MobileNavbar = () => {
  const [role, setRole] = useState(null);
  const auth = getAuth();
  const db = getFirestore();
  const navigate = useNavigate();

   useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          // Ambil role dari Firestore
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setRole(userDoc.data().role);
          } else {
            console.error('Role tidak ditemukan.');
          }
        } else {
          setRole(null); // Tidak login
        }
      });
  
      return () => unsubscribe();
    }, [auth, db]);
  
    const handleUserClick = () => {
      if (!role) {
        navigate('/login');
      } else if (role === 'user') {
        navigate('/profile');
      } else if (role === 'admin') {
        navigate('/admin');
      }
    };

  return (
    <div className="fixed bottom-3 left-0 right-0 bg-[#111B33] h-[80px] flex items-center justify-between px-6 z-50 rounded-[40px] shadow-lg mx-4">
      <Link to="/" className="flex flex-col items-center gap-2 w-1/4">
        <img src={homeImage} alt="Home" className="w-8 h-8 object-contain" />
        <span className="text-white text-sm font-semibold">Home</span>
      </Link>
      <Link to="/category" className="flex flex-col items-center gap-2 w-1/4">
        <img src={tasImage} alt="Category" className="w-8 h-8 object-contain" />
        <span className="text-white text-sm font-semibold">Category</span>
      </Link>
      <Link to="/about" className="flex flex-col items-center gap-2 w-1/4">
        <img src={contactImage} alt="Contact" className="w-8 h-8 object-contain" />
        <span className="text-white text-sm font-semibold">About</span>
      </Link>
      <button onClick={handleUserClick} className="flex flex-col items-center gap-2 w-1/4">
          <img src={userImage} alt="Login" className="w-8 h-8 object-contain" />
          <span className="text-white text-sm font-semibold">Profile</span>
        </button>
    </div>
  );
};

export default MobileNavbar;
