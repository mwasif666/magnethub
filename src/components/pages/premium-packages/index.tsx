import BreadCrumb from "@/components/common/BreadCrumb";
import Image, { StaticImageData } from "next/image";
import {
  FaStore,
  FaUserCheck,
  FaMoneyBillTrendUp,
  FaRocket,
} from "react-icons/fa6";

import process_1 from "@/assets/img/imgs/14.gif";
import process_4 from "@/assets/img/imgs/13.gif";
import process_5 from "@/assets/img/imgs/16.jpg";
import process_2 from "@/assets/img/imgs/7.gif";
import process_3 from "@/assets/img/imgs/12.gif";

import HeaderOne from "@/layouts/headers/HeaderOne";
import FooterOne from "@/layouts/footers/FooterOne";
import { JSX } from "react";

interface DataType {
  id: number;
  thumb?: StaticImageData;
  icon?: JSX.Element;
  title?: string;
  desc?: string;
}

const process_data: DataType[] = [
  { id: 1, thumb: process_1 },
  {
    id: 2,
    icon: <FaStore size={50} color="#631ee5" />,
    title: "Increased Visibility",
    desc: "With our premium package, your business listing/advert will be prominently displayed in our directory, increasing the chances of it being seen by potential buyers.",
  },
  { id: 3, thumb: process_2 },
  {
    id: 4,
    icon: <FaUserCheck size={50} color="#631ee5" />,
    title: "Targeted Audience",
    desc: "Our directory is specifically designed to reach Private Equity Firms, Venture Capitalists, Investors, and elite business personnel, ensuring that your listing is seen by the right people.",
  },
  { id: 5, thumb: process_3 },
  {
    id: 6,
    icon: <FaMoneyBillTrendUp size={50} color="#631ee5" />,
    title: "Faster Sales",
    desc: "By reaching a targeted audience, you'll increase the chances of a swift and successful sale. Our premium package will help you get your business in front of the right people at the right time.",
  },
  { id: 7, thumb: process_4 },
  {
    id: 8,
    icon: <FaRocket size={50} color="#631ee5" />,
    title: "Greater Exposure",
    desc: "With our premium package, you'll have the opportunity to reach a wider audience than with a standard listing. This will help you reach more potential buyers and increase your chances of a successful sale. ",
  },
];

const ProcessPage = () => {
  return (
    <>
      <HeaderOne />

      <main>
        <BreadCrumb title="Premium Packages" sub_title="" />

        <div className="tg-chose-area tg-chose-su-wrap pt-100 pb-105 p-relative z-index-9">
          <div className="container">
            {/* Introduction Section */}
            <div className="container py-5">
              {/* Row 1: Image + Intro Text */}
              <div className="row align-items-center justify-content-center pb-60">
                <div className="col-lg-6 mb-4 mb-lg-0">
                  <Image
                    className="img-fluid rounded-3 shadow-sm"
                    src={process_5}
                    alt="Premium Package"
                  />
                </div>
                <div className="col-lg-6">
                  <div className="tg-chose-section-title">
                    <h2 className="tg-section-su-title text-capitalize mb-4">
                      Introducing Magnate Hub's Premium Package
                    </h2>
                    <p className="tg-section-su-para">
                      The ultimate solution for business owners looking to sell
                      their business. With this package, your business listing
                      will be directly sent to a curated list of Private Equity
                      Firms, Venture Capitalists, Investors, and elite business
                      personnel actively searching for new investment
                      opportunities.
                    </p>
                    <p className="tg-section-su-para">
                      This means that if your business aligns with their
                      interests, you could receive a purchase offer swiftly and
                      efficiently. Our premium package provides maximum exposure
                      for your business and accelerates the buying and selling
                      process.
                    </p>
                  </div>
                </div>
              </div>

              {/* Row 2: Cards Section */}
              <div className="text-center mb-4">
                <h2 className="tg-section-su-title text-capitalize pb-40">
                  4 Great Reasons Why You Should Purchase the Premium Package
                </h2>
              </div>

              <div className="row g-4 justify-content-center">
                <div className="col-md-6 col-lg-3">
                  <div className="card h-100 text-center border-0 shadow-sm p-4 rounded-4">
                    <h5 className="fw-bold mb-3">Maximum Exposure</h5>
                    <p className="tg-section-su-para mb-0">
                      Your business gets visibility among elite investors, PE
                      firms, and VCs actively seeking opportunities.
                    </p>
                  </div>
                </div>

                <div className="col-md-6 col-lg-3">
                  <div className="card h-100 text-center border-0 shadow-sm p-4 rounded-4">
                    <h5 className="fw-bold mb-3">No Commissions</h5>
                    <p className="tg-section-su-para mb-0">
                      Keep 100% of your profit. Magnate Hub doesn’t take any
                      commission from your sale listings.
                    </p>
                  </div>
                </div>

                <div className="col-md-6 col-lg-3">
                  <div className="card h-100 text-center border-0 shadow-sm p-4 rounded-4">
                    <h5 className="fw-bold mb-3">Dedicated Consultation</h5>
                    <p className="tg-section-su-para mb-0">
                      Get expert support to evaluate your business and optimize
                      your listing for maximum engagement.
                    </p>
                  </div>
                </div>

                <div className="col-md-6 col-lg-3">
                  <div className="card h-100 text-center border-0 shadow-sm p-4 rounded-4">
                    <h5 className="fw-bold mb-3">Powerful Tools</h5>
                    <p className="tg-section-su-para mb-0">
                      Access a stats dashboard, free NDA, and chat tools to
                      connect with potential buyers and investors.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Blocks */}
            <div className="row pt-100 g-5">
              {process_data.map((item, i) => {
                // Only process pairs of two (image + text)
                if (
                  item.thumb &&
                  process_data[i + 1] &&
                  process_data[i + 1].icon
                ) {
                  const content = process_data[i + 1];
                  return (
                    <div
                      key={item.id}
                      className="row align-items-center py-5 mb-60 border rounded-3 shadow-sm overflow-hidden"
                    >
                      {/* Alternate left/right */}
                      <div
                        className={`col-lg-6 col-md-12 ${
                          i % 4 === 0 ? "order-lg-1" : "order-lg-2"
                        }`}
                      >
                        <Image
                          src={item.thumb}
                          alt={`process-${item.id}`}
                          className="w-100 rounded-3 shadow"
                          style={{
                            height: "350px",
                            width: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </div>

                      <div
                        className={`col-lg-6 col-md-12 ${
                          i % 4 === 0 ? "order-lg-2" : "order-lg-1"
                        }`}
                      >
                        <div className="w-100 d-flex flex-column justify-content-center text-start p-4">
                          {content.icon && (
                            <div className="mb-3 fs-1">{content.icon}</div>
                          )}
                          {content.title && (
                            <h3 className="mb-2 text-capitalize">
                              {content.title}
                            </h3>
                          )}
                          {content.desc && (
                            <p className="mb-0">{content.desc}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                }
              })}
            </div>
          </div>
        </div>
      </main>

      <FooterOne />
    </>
  );
};

export default ProcessPage;
