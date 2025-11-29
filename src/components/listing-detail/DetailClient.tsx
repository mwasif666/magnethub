"use client";
import BreadCrumb from "@/components/common/BreadCrumb";
import FooterOne from "@/layouts/footers/FooterOne";
import HeaderOne from "@/layouts/headers/HeaderOne";
import React from "react";
import ListingDetail from "./ListingDetail";

interface DetailClientProps {
  url: string;
  id: string;
}

const DetailClient: React.FC<DetailClientProps> = ({ url, id }) => {
  return (
      <>
      <HeaderOne />
      <main>
        <BreadCrumb title="Listing Detail" sub_title="" />
        <div className="tg-chose-area p-relative z-index-9 pt-135 pb-140">
          <ListingDetail url={url} id={id}></ListingDetail>
        </div>
      </main>
      <FooterOne />
    </>
  );
};

export default DetailClient;
