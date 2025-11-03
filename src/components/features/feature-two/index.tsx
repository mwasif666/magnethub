"use client";
import FeatureArea from "./FeatureArea";
import BreadCrumb from "./BreadCrumb";
import BannerForm from "./BannerForm";
import HeaderOne from "@/layouts/headers/HeaderOne";
import { useState } from "react";

const FeatureTwo = () => {
  const breadCrumbsTitle = "Let`s explore the listing";
  const crums = "Listing";
  const [listing, setListing] = useState<any[]>([]);

  return (
    <>
      <HeaderOne />
      <main>
        <BreadCrumb breadCrumbsTitle={breadCrumbsTitle} crums={crums} />
        <BannerForm setListing={setListing} />
        <FeatureArea listing={listing} />
      </main>
    </>
  );
};

export default FeatureTwo;
