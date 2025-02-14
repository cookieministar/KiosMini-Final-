import React, { useState } from "react";
import emailjs from "@emailjs/browser";

const Lapormasalah = () => {
  const [formData, setFormData] = useState({
    nama: "",
    noHp: "",
    kategori: "Masalah",
    deskripsi: ""
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs.send(
      "service_tgmr9lb",
      "template_69o7qmj",
      formData,
      "Rco4ccpo0GhefZkco"
    )
    .then((response) => {
      alert("Laporan berhasil dikirim!");
      setFormData({ nama: "", noHp: "", kategori: "Masalah", deskripsi: "" });
    })
    .catch((error) => {
      alert("Terjadi kesalahan. Silakan coba lagi.");
      console.error("Error: ", error);
    });
  };

  return (
    <div className="p-10 bg-white min-h-screen">
      <h2 className="text-2xl font-bold mb-5">Laporkan Masalah</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-5">
        <div className="bg-[#D1B89F] p-5 rounded-md">
          <label className="block font-bold mb-2">Nama Lengkap</label>
          <input
            type="text"
            name="nama"
            value={formData.nama}
            onChange={handleChange}
            className="w-full p-2 rounded-md bg-[#F5EDE0] outline-none"
            required
          />
          <label className="block font-bold mt-3 mb-2">Nomor Handphone</label>
          <input
            type="text"
            name="noHp"
            value={formData.noHp}
            onChange={handleChange}
            className="w-full p-2 rounded-md bg-[#F5EDE0] outline-none"
            required
          />
        </div>

        <div className="bg-[#D1B89F] p-5 rounded-md">
          <label className="block font-bold mb-2">Kategori Masalah</label>
          <select
            name="kategori"
            value={formData.kategori}
            onChange={handleChange}
            className="w-full p-2 rounded-md bg-[#F5EDE0] outline-none"
          >
            <option>Masalah</option>

          </select>
          <label className="block font-bold mt-3 mb-2">Deskripsi Masalah</label>
          <textarea
            name="deskripsi"
            value={formData.deskripsi}
            onChange={handleChange}
            className="w-full p-2 rounded-md bg-[#F5EDE0] outline-none"
            placeholder="Tuliskan apa yang ingin disampaikan"
            required
          ></textarea>
        </div>
      </form>

      <div className="mt-5 flex space-x-4">
        <button
          type="submit"
          onClick={handleSubmit}
          className="bg-green-600 text-white px-6 py-2 rounded-md text-lg font-semibold"
        >
          KIRIM
        </button>
        <button
          type="reset"
          onClick={() => setFormData({ nama: "", noHp: "", kategori: "Masalah", deskripsi: "" })}
          className="bg-red-600 text-white px-6 py-2 rounded-md text-lg font-semibold"
        >
          Batal
        </button>
      </div>
    </div>
  );
};

export default Lapormasalah;
