"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import pricing_data from "@/data/PricingData";

type PricingItem = {
  id: number;
  title: string;
  slug?: string;
  price: number | string;
  desc: string;
  list: string[];
  suitable?: string;
};

const Pricing = () => {
  return (
    <div className="tg-pricing-area tg-pricing-su-wrap pb-100 pt-130 p-relative z-index-1">
      <div className="container-fluid px-5">
        <div className="row">
          <div className="col-lg-12">
            <div className="tg-pricing-section-title-wrap text-center mb-40">
              <h5
                className="tg-section-su-subtitle su-subtitle-2 mb-15 wow fadeInUp"
                data-wow-delay=".4s"
                data-wow-duration=".9s"
              >
                Popular packages
              </h5>
              <h2
                className="tg-section-su-title text-capitalize wow fadeInUp mb-15"
                data-wow-delay=".5s"
                data-wow-duration=".9s"
              >
                Magnate Hub
                <br />
                Pricing
              </h2>
            </div>
          </div>

          {pricing_data.map((item: PricingItem) => (
            <PricingCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

type PricingCardProps = {
  item: PricingItem;
};

const PricingCard: React.FC<PricingCardProps> = ({ item }) => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [showFullText, setShowFullText] = useState(false);

  const truncatedText =
    item.desc.length > 100 ? item.desc.slice(0, 100) + "..." : item.desc;

  const buyNow = (slug: string) => {
    if (isAuthenticated) {
      router.push(`/plan/${slug}`);
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="col-lg-3 col-md-6">
      <div
        className="tg-pricing-wrap mb-30 wow fadeInUp"
        data-wow-delay=".3s"
        data-wow-duration=".9s"
        style={{ height: "129vh" }}
      >
        <div className="tg-pricing-head">
          <h4 className="tg-pricing-title mb-15">{item.title}</h4>
        </div>

        <div className="tg-pricing-price mb-25">
          <h2>
            <span>$</span>
            {item.price}
          </h2>
          <span className="dates">/month *</span>
        </div>

        <div className="tg-pricing-btns mb-40">
          <span
            className="tg-btn text-center w-100"
            style={{ cursor: "pointer" }}
            onClick={() => buyNow(item?.slug || "essentials")}
          >
            Buy Now
          </span>
        </div>

        <div className="tg-pricing-list">
          <p className="mb-25 pricing list-desc">
            {showFullText ? item.desc : truncatedText}
            {item.desc.length > 100 && (
              <button
                onClick={() => setShowFullText(!showFullText)}
                className="see-more-btn ms-2 border-0 bg-transparent p-0"
              >
                {showFullText ? "See Less" : "See More"}
              </button>
            )}
          </p>

          <ul>
            {item.list.map((list, i) => (
              <li key={i}>
                <span className="icon">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M17 8.26858V9.00458C16.999 10.7297 16.4404 12.4083 15.4075 13.79C14.3745 15.1718 12.9226 16.1826 11.2683 16.6717C9.61394 17.1608 7.8458 17.1021 6.22757 16.5042C4.60934 15.9064 3.22772 14.8015 2.28877 13.3542C1.34981 11.907 0.903833 10.195 1.01734 8.47363C1.13085 6.75223 1.79777 5.11364 2.91862 3.80224C4.03948 2.49083 5.55423 1.57688 7.23695 1.1967C8.91967 0.816507 10.6802 0.990449 12.256 1.69258M17 2.60458L9 10.6126L6.6 8.21258"
                      stroke="#560CE3"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span>{list}</span>
              </li>
            ))}
          </ul>
          {/* <div className="tg-pricing-head">
          <h4 className="tg-pricing-title mb-15">{item.suitable}</h4>
        </div> */}
        </div>
      </div>
    </div>
  );
};

export default Pricing;
