"use client";
import FeatureArea from "./FeatureArea";
import BreadCrumb from "@/components/common/BreadCrumb";
import BannerForm from "./BannerForm";
import HeaderOne from "@/layouts/headers/HeaderOne";
import FooterSix from "@/layouts/footers/FooterTwo";
import FooterTwo from "@/layouts/footers/FooterTwo";
import { useState } from "react";

const FeatureTwo = () => {
  const breadCrumbsTitle = "Let`s explore the listing";
  const crums = "Listing";
  const [listing, setListing] = useState<any[]>([]);
  return (
    <>
      <HeaderOne />
      <main>
        <BreadCrumb title="Listings" sub_title="" />
        <BannerForm setListing={setListing} />
        <FeatureArea listing={listing} />
      </main>
      <FooterTwo />
    </>
  );
};

export default FeatureTwo;
