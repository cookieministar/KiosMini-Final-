
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const navigate = useNavigate();

  // State untuk menyimpan data profil
  const [formData, setFormData] = useState({
    name: "Tegar Adytia",
    email: "tegaradytia@example.com",
    phone: "0812345678933",
    storeName: "Toko Tegar",
    gender: "Laki-laki"
  });

  // Fungsi untuk menangani perubahan input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Fungsi untuk menyimpan perubahan
  const handleSave = () => {
    alert("Profil berhasil diperbarui!");
    navigate("/profileuser"); // Kembali ke halaman profil setelah menyimpan
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Profil</h1>

      {/* Username Section */}
      <div className="mb-6">
        <label className="block text-gray-600 mb-2">Username</label>
        <div className="font-medium text-gray-800">tegaradytia</div>
        <p className="text-sm text-gray-500 mt-1">
          Username hanya dapat diubah satu (1) kali.
        </p>
      </div>

      {/* Nama Section */}
      <div className="mb-6">
        <label className="block text-gray-600 mb-2">Nama</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Email Section */}
      <div className="mb-6">
        <label className="block text-gray-600 mb-2">Email</label>
        <div className="flex items-center justify-between">
          <span className="text-gray-800">{formData.email}</span>
          <button className="text-blue-600 hover:text-blue-800 font-medium px-3 py-1">
            Ubah
          </button>
        </div>
      </div>

      {/* Nomor Telepon Section */}
      <div className="mb-6">
        <label className="block text-gray-600 mb-2">Nomor Telepon</label>
        <div className="flex items-center justify-between">
          <span className="text-gray-800">********33</span>
          <button className="text-blue-600 hover:text-blue-800 font-medium px-3 py-1">
            Ubah
          </button>
        </div>
      </div>

      {/* Nama Toko Section */}
      <div className="mb-6">
        <label className="block text-gray-600 mb-2">Nama Toko</label>
        <input
          type="text"
          name="storeName"
          value={formData.storeName}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Jenis Kelamin Section */}
      <div className="mb-6">
        <label className="block text-gray-600 mb-2">Jenis Kelamin</label>
        <div className="flex gap-6">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="gender"
              value="Laki-laki"
              checked={formData.gender === "Laki-laki"}
              onChange={handleChange}
              className="w-4 h-4"
            />
            Laki-laki
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="gender"
              value="Perempuan"
              checked={formData.gender === "Perempuan"}
              onChange={handleChange}
              className="w-4 h-4"
            />
            Perempuan
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="gender"
              value="Lainnya"
              checked={formData.gender === "Lainnya"}
              onChange={handleChange}
              className="w-4 h-4"
            />
            Lainnya
          </label>
        </div>
      </div>

      {/* Tombol Simpan */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
        >
          Simpan
        </button>
      </div>
    </div>
  );
};

export default EditProfile;
