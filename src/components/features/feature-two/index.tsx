"use client";
import FeatureArea from "./FeatureArea";
import BreadCrumb from "@/components/common/BreadCrumb";
import BannerForm from "./BannerForm";
import HeaderOne from "@/layouts/headers/HeaderOne";
import { useState } from "react";
import FooterOne from "@/layouts/footers/FooterOne";

const FeatureTwo = () => {
  const [listing, setListing] = useState<any[]>([]);
  return (
    <>
      <HeaderOne />
      <main>
        <BreadCrumb title="Listings" sub_title="" />
        <BannerForm setListing={setListing} />
        <FeatureArea listing={listing} />
      </main>
      <FooterOne />
    </>
  );
};

export default FeatureTwo;
