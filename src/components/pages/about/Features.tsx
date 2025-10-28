import Choose6 from "@/svg/home-one/Choose6";
import Choose7 from "@/svg/home-one/Choose7";
import Choose8 from "@/svg/home-one/Choose8";
import Image from "next/image";
import { JSX } from "react";

import shape from "@/assets/img/banner/banner-2/shape.png";

interface DataType {
  id: number;
  icon: JSX.Element;
  title: string;
  desc: string;
}

const choose_data: DataType[] = [
  {
    id: 1,
    icon: (
      <>
        <Choose6 />
      </>
    ),
    title: "Extensive Listings",
    desc: "A comprehensive selection of businesses for sale, including detailed information about the company, financials, and industry trends.",
  },
  {
    id: 2,
    icon: (
      <>
        <Choose7 />
      </>
    ),
    title: "Search and Filter",
    desc: "Advanced search and filtering options that allow users to easily find businesses that meet their specific criteria.",
  },
  {
    id: 3,
    icon: (
      <>
        <Choose8 />
      </>
    ),
    title: "Network of Buyers and Sellers",
    desc: "A large network of buyers, sellers, investors, and capital raisers, providing a wide range of opportunities for business transactions.",
  },
  {
    id: 4,
    icon: (
      <>
        <Choose7 />
      </>
    ),
    title: "Support and Guidance",
    desc: "Access to a team of experts who can provide guidance and support throughout the buying and selling process, from initial negotiations to closing the deal.",
  },
];

const Features = () => {
  return (
    <div className="tg-chose-area tg-grey-bg pt-140 pb-70 p-relative z-index-1">
      <Image
        className="tg-chose-6-shape d-none d-md-block"
        src={shape}
        alt="decorative shape"
      />
      <div className="container">
        {/* Section Title */}
        <div className="row justify-content-center">
          <div className="col-xl-6 col-lg-7 col-md-9">
            <div className="tg-chose-section-title text-center mb-35">
              <h5
                className="tg-section-subtitle mb-15 wow fadeInUp"
                data-wow-delay=".3s"
                data-wow-duration=".1s"
              >
                Our Features
              </h5>
              <h2
                className="mb-15 text-capitalize wow fadeInUp"
                data-wow-delay=".4s"
                data-wow-duration=".9s"
              >
                There are so many features of <br /> Magnate Hub, here are a
                few.
              </h2>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="row">
          {choose_data.map((item) => (
            <div key={item.id} className="col-lg-3 col-md-6">
              <div className="tg-chose-6-wrap h-100 mb-30 text-center">
                <span className="icon mb-20 d-inline-block">{item.icon}</span>
                <h4 className="tg-chose-6-title mb-15">{item.title}</h4>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
