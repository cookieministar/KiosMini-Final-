import React from "react";
import Footer from "./footer"; 

const About = () => {
  return (
    <div>
      {/* <Navbar /> */}
      <main className="about-content pt-32 pb-10 flex flex-col items-center relative">
        <img
          src="https://res.cloudinary.com/ddl4sxrb3/image/upload/v1735308689/Group_427320498_imd6v3.png"
          alt="Deskripsi Gambar"
          className="my-4"
          style={{ width: "70%", height: "auto" }}
        />
        <h1 className="text-5xl text-white font-bold absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          ABOUT
        </h1>
      </main>

      {/* GetWaves */}
      <div className="wave-container relative">
        <svg viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path
            fill="#933804c9"
            fill-opacity="1"
            d="M0,192L14.1,186.7C28.2,181,56,171,85,160C112.9,149,141,139,169,122.7C197.6,107,226,85,254,96C282.4,107,311,149,339,160C367.1,171,395,149,424,128C451.8,107,480,85,508,80C536.5,75,565,85,593,106.7C621.2,128,649,160,678,160C705.9,160,734,128,762,133.3C790.6,139,819,181,847,181.3C875.3,181,904,139,932,128C960,117,988,139,1016,170.7C1044.7,203,1073,245,1101,229.3C1129.4,213,1158,139,1186,133.3C1214.1,128,1242,192,1271,197.3C1298.8,203,1327,149,1355,128C1383.5,107,1412,117,1426,122.7L1440,128L1440,320L1425.9,320C1411.8,320,1384,320,1355,320C1327.1,320,1299,320,1271,320C1242.4,320,1214,320,1186,320C1157.6,320,1129,320,1101,320C1072.9,320,1045,320,1016,320C988.2,320,960,320,932,320C903.5,320,875,320,847,320C818.8,320,791,320,762,320C734.1,320,706,320,678,320C649.4,320,621,320,593,320C564.7,320,536,320,508,320C480,320,452,320,424,320C395.3,320,367,320,339,320C310.6,320, 282,320,254,320C225.9,320,198,320,169,320C141.2,320,113,320,85,320C56.5,320,28,320,14,320L0,320Z"
          ></path>
        </svg>
      </div>

      <section className="bg-[#933804c9] relative p-20 flex items-center">
  <div className="content flex-1">
    <p className="mt-0 text-3xl text-white" style={{ marginTop: '-20px' }}>
      Di era digital, perkembangan <br/> teknologi mempermudah <br/> UMKM seperti toko bangunan <br/> dan perlengkapan sepeda <br/> untuk mengembangkan usaha mereka.
    </p>
    <p className="mt-4 text-3xl text-white">
      Namun, keterbatasan pengetahuan dan infrastruktur sering menjadi hambatan. Dengan menggandeng mitra "Kios Mini," diusulkan pembuatan website untuk memperluas jangkauan pemasaran dan mempermudah penerimaan pesanan secara digital demi meningkatkan keuntungan dan stabilitas ekonomi UMKM.
    </p>
  </div>
  <div className="image-box ml-4 mt-0" style={{ paddingTop: "10px" }}>
  <img
    src="https://res.cloudinary.com/ddl4sxrb3/image/upload/v1735373341/IMG-20241213-WA0016_p0cddb.jpg"
    alt="Deskripsi Gambar"
    className="rounded-[20px]"
    style={{ width: "380px", height: "auto", position: "relative", top: "-30px" }} // Menggunakan position dan top
  />
</div>
</section>

      <div className="wave-container relative">
        <svg viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path
            fill="#933804c9"
            fill-opacity="1"
            d="M0,96L26.7,101.3C53.3,107,107,117,160,128C213.3,139,267,149,320,144C373.3,139,427,117,480,133.3C533.3,149,587,203,640,218.7C693.3,235,747,213,800,181.3C853.3,149,907,107,960,117.3C1013.3,128,1067,192,1120,218.7C1173.3,245,1227,235,1280,224C1333.3,213,1387,203,1413,197.3L1440,192L1440,0L1413.3,0C1386.7,0,1333,0,1280,0C1226.7,0,1173,0,1120,0C1066.7,0,1013,0,960,0C906.7,0,853,0,800,0C746.7,0,693,0,640,0C586.7,0,533,0,480,0C426.7,0,373,0,320,0C266.7,0,213,0,160,0C106.7,0,53,0,27,0L0,0Z"
          ></path>
        </svg>
      </div>

      <section className="bg-white relative p-20 flex flex-col items-center justify-center">
  {/* Box Image 1 (Atas) */}
  <div className="image-box mb-8">
    <img
      src="https://res.cloudinary.com/ddl4sxrb3/image/upload/v1735373341/IMG-20241213-WA0016_p0cddb.jpg"
      alt="Deskripsi Gambar 1"
      className="rounded-[25px]"
      style={{ width: "400px", height: "auto" }}
    />
  </div>

  {/* Box Image 2 dan 3 (Bawah) */}
  <div className="flex gap-8">
    {/* Box Image 2 */}
    <div className="image-box">
      <img
        src="https://res.cloudinary.com/ddl4sxrb3/image/upload/v1735373341/IMG-20241213-WA0016_p0cddb.jpg"
        alt="Deskripsi Gambar 2"
        className="rounded-[25px]"
        style={{ width: "400px", height: "auto" }}
      />
    </div>

    {/* Box Image 3 */}
    <div className="image-box">
      <img
        src="https://res.cloudinary.com/ddl4sxrb3/image/upload/v1735373341/IMG-20241213-WA0016_p0cddb.jpg"
        alt="Deskripsi Gambar 3"
        className="rounded-[25px]"
        style={{ width: "400px", height: "auto" }}
      />
    </div>
  </div>
</section>

      <Footer />
    </div>
  );
};

export default About;
