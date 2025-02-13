import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import Navbar from "./Navbar";
import axios from "axios";

const AddProduct = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore();
  // State untuk Form
  const [formData, setFormData] = useState({
    namaProduk: "",
    harga: "",
    category: "",
    deskripsi: "",
    uploadFoto: null,
  });
  const [isUploading, setIsUploading] = useState(false);

  // Handle Input Perubahan
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle Upload File
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    // Validasi tipe file (opsional)
    if (file && !file.type.startsWith("image/")) {
      alert("Mohon unggah file gambar!");
      return;
    }

    setFormData({ ...formData, uploadFoto: file });
  };

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi Form
    if (!formData.namaProduk || !formData.harga || !formData.category || !formData.deskripsi) {
      alert("Mohon isi semua field!");
      return;
    }

    if (!formData.uploadFoto) {
      alert("Mohon unggah foto produk!");
      return;
    }

    try {
      setIsUploading(true);

      const cloudinaryUrl = "https://api.cloudinary.com/v1_1/ddftfkmnf/image/upload";
      const cloudinaryPreset = "kiosmini";
       //LOUDINARY_URL=cloudinary://346129437342179:mXdPdqFx1b8tsds3v-cB71MuIgA@ddftfkmnf
      const formDataUpload = new FormData();
      formDataUpload.append("file", formData.uploadFoto);
      formDataUpload.append("upload_preset", cloudinaryPreset);

      const uploadResponse = await axios.post(cloudinaryUrl, formDataUpload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const fileUrl = uploadResponse.data.secure_url;

      // Simpan data ke Firestore
      const productsCollection = collection(db, "products");
      await addDoc(productsCollection, {
        namaProduk: formData.namaProduk,
        harga: formData.harga,
        category: formData.category.charAt(0).toUpperCase() + formData.category.slice(1),
        deskripsi: formData.deskripsi,
        uploadFoto: fileUrl,
        createdAt: new Date().toISOString(),
      });

      alert("Produk berhasil diunggah!");
      setFormData({
        namaProduk: "",
        harga: "",
        category: "",
        deskripsi: "",
        uploadFoto: null,
      });

      navigate("/adminproduct"); // Navigasi ke halaman lain jika diperlukan
    } catch (error) {
      console.error("Error uploading product:", error);
      alert("Terjadi kesalahan saat mengunggah produk. Silakan coba lagi.");
    } finally {
      setIsUploading(false);
    }
  };


  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <div className="flex-1 p-4 pt-16 flex flex-col items-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-8 text-center">
          Upload Produk Anda
        </h1>

        <div
  className="w-full max-w-xl border bg-[#933804] rounded-[15px] p-4 mb-8 flex flex-col items-center justify-center"
  style={{ height: "22rem" }} // Custom height: 22rem (352px)
>
  {/* Teks atau Placeholder Jika Foto Belum Diunggah */}
  <p className="text-white mb-4 text-center">
    Unggah foto produk Anda di sini (Max 1MB)
  </p>

  {/* Input untuk Upload File */}
  <input
    type="file"
    id="uploadFoto"
    name="uploadFoto"
    accept="image/*" // Hanya menerima file gambar
    onChange={handleFileChange} // Hubungkan handler file upload
    className="block w-full max-w-xs text-sm text-gray-100
               file:mr-4 file:py-2 file:px-4
               file:rounded-full file:border-0
               file:text-sm file:font-semibold
               file:bg-[#7a2e03] file:text-white
               hover:file:bg-[#5e2102]"
  />
</div>

        {/* Form Upload Produk */}
        <div className="w-full max-w-xl flex flex-col sm:flex-row gap-6">
          {/* Kolom Kiri */}
          <div className="flex-1 flex flex-col space-y-4">
            {/* Nama Produk */}
            <div>
              <label htmlFor="namaProduk" className="block text-gray-700 font-bold mb-2">
                Nama Produk
              </label>
              <input
                type="text"
                id="namaProduk"
                name="namaProduk"
                value={formData.namaProduk}
                onChange={handleChange}
                placeholder="Masukkan nama produk"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#933804] bg-gray-100"
                required
              />
            </div>

            {/* Harga */}
            <div>
              <label htmlFor="harga" className="block text-gray-700 font-bold mb-2">
                Harga
              </label>
              <input
                type="number"
                id="harga"
                name="harga"
                value={formData.harga}
                onChange={handleChange}
                placeholder="Masukkan harga produk"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#933804] bg-gray-100"
                required
              />
            </div>
          </div>

          {/* Kolom Kanan */}
          <div className="flex-1 flex flex-col space-y-4">
            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-gray-700 font-bold mb-2">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#933804] bg-gray-100"
                required
              >
                <option value="">Pilih Kategori</option>
                <option value="sekop">Sekop</option>
                <option value="cangkul">Cangkul</option>
                <option value="linggis">Linggis</option>
                <option value="palu">Palu</option>
                <option value="paku">Paku</option>
                <option value="kuas">Kuas</option>
                <option value="cat">Cat</option>
                <option value="lainnya">Lainnya</option>
              </select>
            </div>

            {/* Deskripsi Produk */}
            <div>
              <label htmlFor="deskripsi" className="block text-gray-700 font-bold mb-2">
                Deskripsi Produk
              </label>
              <textarea
                id="deskripsi"
                name="deskripsi"
                value={formData.deskripsi}
                onChange={handleChange}
                placeholder="Masukkan deskripsi produk"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#933804] bg-gray-100"
                rows="6"
                required
              ></textarea>
            </div>
          </div>
        </div>

        {/* Tombol Upload */}
        <div className="w-full max-w-xl mt-6">
          <button
            type="submit"
            className="w-full sm:w-1/2 mx-auto bg-[#933804] text-white py-2 px-4 rounded-lg hover:bg-[#7a2e03] transition duration-300 text-sm"
            onClick={handleSubmit}
          >
            Upload Produk
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
