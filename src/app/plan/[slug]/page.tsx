"use client";
import BreadCrumb from "@/components/common/BreadCrumb";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useParams } from "next/navigation";
import FooterOne from "@/layouts/footers/FooterOne";
import HeaderOne from "@/layouts/headers/HeaderOne";
import BuyNow from "@/components/buynow/BuyNow";

const Pricing = () => {
  const { isAuthenticated } = useAuth();
  const { slug } = useParams();
  const slugParam = Array.isArray(slug) ? slug[0] : slug || "essentials";

  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = "/login";
    }
  }, [isAuthenticated]);

  return (
    <>
      <HeaderOne />
      <main>
        <BreadCrumb title="Buy Now" sub_title="" />
        <div className="tg-chose-area p-relative z-index-9 pt-135 pb-140">
          <BuyNow slug={slugParam} />
        </div>
      </main>
      <FooterOne />
    </>
  );
};

export default Pricing;
