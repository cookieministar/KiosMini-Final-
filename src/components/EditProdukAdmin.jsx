import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import Navbar from "./Navbar";
import axios from "axios";

const EditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Ambil ID produk dari URL
  const auth = getAuth();
  const db = getFirestore();

  const [formData, setFormData] = useState({
    namaProduk: "",
    harga: "",
    category: "",
    deskripsi: "",
    uploadFoto: null,

  });
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productDoc = doc(db, "products", id);
        const productSnapshot = await getDoc(productDoc);

        if (productSnapshot.exists()) {
          const productData = productSnapshot.data();
          setFormData({
            namaProduk: productData.namaProduk,
            harga: productData.harga,
            category: productData.category,
            deskripsi: productData.deskripsi,
            uploadFoto: productData.uploadFoto, // URL gambar lama
          });
        } else {
          alert("Produk tidak ditemukan!");
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        alert("Terjadi kesalahan saat mengambil data produk.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id, db, navigate]);

  // Handle perubahan input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle perubahan file
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && !file.type.startsWith("image/")) {
      alert("Mohon unggah file gambar!");
      return;
    }
    setFormData({ ...formData, uploadFoto: file });
  };

  // Handle submit untuk update produk
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi form
    if (!formData.namaProduk || !formData.harga || !formData.category || !formData.deskripsi) {
      alert("Mohon isi semua field!");
      return;
    }

    try {
      setIsUploading(true);

      let fileUrl = formData.uploadFoto; // Gunakan URL sebelumnya jika gambar tidak diubah

      if (formData.uploadFoto instanceof File) {
        const cloudinaryUrl = "https://api.cloudinary.com/v1_1/ddftfkmnf/image/upload";
        const cloudinaryPreset = "kiosmini";

        const formDataUpload = new FormData();
        formDataUpload.append("file", formData.uploadFoto);
        formDataUpload.append("upload_preset", cloudinaryPreset);

        const uploadResponse = await axios.post(cloudinaryUrl, formDataUpload, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        fileUrl = uploadResponse.data.secure_url;
      }

      // Update data di Firestore
      const docRef = doc(db, "products", id);
      await updateDoc(docRef, {
        namaProduk: formData.namaProduk,
        harga: formData.harga,
        category: formData.category.charAt(0).toUpperCase() + formData.category.slice(1),
        deskripsi: formData.deskripsi,
        uploadFoto: fileUrl,
        updatedAt: new Date().toISOString(),
      });

      alert("Produk berhasil diperbarui!");
      navigate("/adminproduct");
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Terjadi kesalahan saat memperbarui produk. Silakan coba lagi.");
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return <p className="text-center mt-8">Memuat data produk...</p>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <div className="flex-1 p-4 pt-16 flex flex-col items-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-8 text-center">
          Edit Produk Anda
        </h1>

        <form onSubmit={handleSubmit} className="w-full max-w-xl">
          <div
            className="w-full border bg-[#933804] rounded-[15px] p-4 mb-8 flex flex-col items-center justify-center"
            style={{ height: "22rem" }}
          >
            <p className="text-white mb-4 text-center">
              {formData.uploadFoto instanceof File
                ? "Gambar baru akan diunggah"
                : "Gunakan gambar lama jika tidak diubah"}
            </p>
            <input
              type="file"
              id="uploadFoto"
              name="uploadFoto"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full max-w-xs text-sm text-gray-100 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#7a2e03] file:text-white hover:file:bg-[#5e2102]"
            />
          </div>

          <div className="flex flex-col space-y-4">
            <div>
              <label className="block text-gray-700 font-bold mb-2">Nama Produk</label>
              <input
                type="text"
                name="namaProduk"
                value={formData.namaProduk}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2">Harga</label>
              <input
                type="number"
                name="harga"
                value={formData.harga}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg bg-gray-100"
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
            <div>
              <label className="block text-gray-700 font-bold mb-2">Deskripsi</label>
              <textarea
                name="deskripsi"
                value={formData.deskripsi}
                onChange={handleChange}
                rows="4"
                className="w-full px-3 py-2 border rounded-lg bg-gray-100"
              ></textarea>
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-6 bg-[#933804] text-white py-2 px-4 rounded-lg hover:bg-[#7a2e03]"
          >
            {isUploading ? "Memperbarui..." : "Simpan Perubahan"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
