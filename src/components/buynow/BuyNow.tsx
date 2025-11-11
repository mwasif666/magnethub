"use client";
import React, { useEffect, useState } from "react";
import pricing_data from "@/data/PricingData";

interface BuyNowProps {
  slug: string;
}

interface PricingItem {
  title: string;
  price: number;
  slug?: string;
  desc: string;
  list: string[];
}

const BuyNow: React.FC<BuyNowProps> = ({ slug }) => {
  const [item, setItem] = useState<PricingItem | null>(null);
  const [showFullText, setShowFullText] = useState(false);

const getPackageDetails = (slug: string) => {
  const data = pricing_data.find((plan) => plan.slug === slug);
  if (data && data.slug) setItem(data); 
  else setItem(null);
};


  useEffect(() => {
    getPackageDetails(slug);
  }, [slug]);

  if (!item) return <div>Loading...</div>;


  const truncatedText =
    item.desc.length > 100 ? item.desc.slice(0, 100) + "..." : item.desc;

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

        <div className="tg-pricing-list">
          <p className="mb-25 pricing list-desc">{item.desc}</p>

          <ul>
            {item.list.map((list, i) => (
              <li key={i}>
                <span className="icon">✔</span>
                <span>{list}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BuyNow;
