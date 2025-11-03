import FooterFive from "@/layouts/footers/FooterFive";
import BreadCrumb from "@/components/common/BreadCrumb";

import Image, { StaticImageData } from "next/image";
import { JSX } from "react";
import Link from "next/link";
import Process7 from "@/svg/home-one/Process7";
import Process8 from "@/svg/home-one/Process8";
import Process9 from "@/svg/home-one/Process9";

import process_1 from "@/assets/img/chose/chose-2/thumb-1.jpg"
import process_2 from "@/assets/img/chose/chose-2/thumb-2.jpg"
import process_3 from "@/assets/img/chose/chose-2/thumb-3.jpg"
import shape from "@/assets/img/chose/chose-2/shape.png"
import HeaderOne from "@/layouts/headers/HeaderOne";
import FooterTwo from "@/layouts/footers/FooterTwo";

interface DataType {
   id: number;
   thumb?: StaticImageData;
   icon?: JSX.Element;
   title?: string;
   desc?: string;
}

const process_data: DataType[] = [
   { id: 1, icon: <Process7 />, title: "High-quality opportunities", desc: "Magnate Hub is home to a diverse range of high-quality businesses and startups. Our rigorous vetting process ensures that only the best opportunities are listed on our platform, giving investors the confidence that they are making a sound investment.", thumb: process_1 },
   { id: 2, icon: <Process8 />, title: "Wide range of industries", desc: "Magnate Hub offers a wide range of investment opportunities across different industries. From technology and healthcare to food and fashion, our platform has something for every investor.", thumb: process_2 },
   { id: 3, icon: <Process9 />, title: "Customizable filters", desc: "Our platform allows investors to customize their search for investment opportunities based on factors such as industry, location, and stage of development. This makes it easy for investors to find the right opportunity to match their investment criteria.", thumb: process_3 },
   { id: 4, icon: <Process7 />, title: "Direct communication", desc: "Magnate Hub offers a built-in messaging system that allows investors to directly communicate with entrepreneurs and startups. This makes it easy for investors to ask questions, request additional information, and negotiate deals.", thumb: process_1 },
   { id: 5, icon: <Process8 />, title: "Investment tracking", desc: "Our platform includes a statistics dashboard that allows investors to track the performance of their investments and see how their portfolio is growing over time.", thumb: process_2 },
   { id: 6, icon: <Process9 />, title: "No commissions", desc: "Unlike other platforms, Magnate Hub does not charge any commission on investment deals. This means that investors can keep more of their returns for themselves.", thumb: process_3 },
];

const Process = () => {
   return (
      <>
      <HeaderOne />

      <main>
         <BreadCrumb title="Investment Opportunities" sub_title="" />

         <div className="tg-chose-area p-relative z-index-9 pt-135 pb-35">
            <Image className="tg-chose-2-shape d-none d-lg-block" src={shape} alt="shape" />

            <div className="container">

               <div className="col-12 text-center mb-60">
                  <h1 className="tg-section-subtitle">Investor</h1>
                  <p className="tg-section-su-para">
                       Welcome to Magnate Hub, the premier platform for connecting entrepreneurs and startups with investors. Our platform offers a wide range of benefits for investors looking to grow their portfolios and find the next big opportunity. Here are just a few reasons why Magnate Hub is great for investors.</p>
               </div>

                 {process_data.map((item, i) => (
                <div key={item.id} className="row align-items-center mb-60">
              
                  {/* Card */}
                  <div className={`col-lg-6 col-md-12 mb-4 d-flex ${i % 2 !== 0 ? "order-lg-2" : ""}`}>
                    <div className="w-100 border rounded-3 shadow-sm d-flex flex-column justify-content-center text-center"
                      style={{ height: "350px" }}>
                      <div className="mb-3 fs-1">{item.icon}</div>
                      <h3 className="mb-2">{item.title}</h3>
                      <p className="mb-0">{item.desc}</p>
                    </div>
                  </div>
              
                  {/* Image */}
                  <div className={`col-lg-6 col-md-12 d-flex ${i % 2 !== 0 ? "order-lg-1" : ""}`}>
                    <div className="w-100">
                      <Image
                        src={item.thumb!}
                        alt="investor image"
                        className="w-100 rounded-3 shadow"
                        style={{ height: "350px", width: "100%", objectFit: "cover" }}
                      />
                    </div>
                  </div>
              
                </div>
                ))}

            </div>
         </div>
      </main>

      <FooterTwo />
      </>
   )
}

export default Process;
