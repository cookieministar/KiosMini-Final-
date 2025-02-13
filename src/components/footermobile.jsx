import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

const FooterDesktop = () => {
  return (
    <div className="bg-[#955530] text-white py-6 mt-24 rounded-t-[50px]">
      <div className="container mx-auto px-4 flex flex-col items-center md:items-start text-center md:text-left">
        
        {/* Judul */}
        <h2 className="text-3xl font-bold md:text-4xl">Kios Mini</h2>

        {/* Deskripsi */}
        <p className="mt-3 text-sm md:text-lg max-w-lg">
          KINI atau Kios Mini adalah website yang menjual berbagai peralatan pertukangan.
        </p>

        {/* Grid untuk About & Contact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5 w-full max-w-4xl">
          
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold">About</h3>
            <ul className="mt-2 space-y-1">
              <li><a href="#" className="text-white hover:underline">Our Team</a></li>
              <li><a href="#" className="text-white hover:underline">Client</a></li>
              <li><a href="#" className="text-white hover:underline">Press</a></li>
              <li><a href="#" className="text-white hover:underline">Blog</a></li>
            </ul>
          </div>

          {/* Contact Us Section */}
          <div>
            <h3 className="text-xl font-bold">Contact Us</h3>
            <ul className="mt-2 space-y-1">
              <li className="flex justify-center md:justify-start items-center">
                <FontAwesomeIcon icon={faPhone} />
                <span className="ml-2">+62 882-3272-0276</span>
              </li>
              <li className="flex justify-center md:justify-start items-center">
                <FontAwesomeIcon icon={faEnvelope} />
                <span className="ml-2">kiosmini@gmail.com</span>
              </li>
              <li className="flex justify-center md:justify-start items-center">
                <FontAwesomeIcon icon={faMapMarkerAlt} />
                <a href="https://maps.app.goo.gl/mkmc7nMVmBr3GraT6" className="ml-2 hover:underline">
                  Jalan. Peterongan Tengah Raya
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Garis Bawah */}
        <hr className="w-full border-white border-t-2 mt-6" />
      </div>
    </div>
  );
};

export default FooterDesktop;