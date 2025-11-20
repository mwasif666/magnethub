"use client";
import FeatureArea from "./FeatureArea";
import BreadCrumb from "@/components/common/BreadCrumb";
import BannerForm from "./BannerForm";
import HeaderOne from "@/layouts/headers/HeaderOne";
import { useState, useEffect } from "react";
import FooterOne from "@/layouts/footers/FooterOne";

const FeatureTwo = () => {
  const [listing, setListing] = useState<any[]>([]);
  const [localPagination, setLocalPagination] = useState<{
    totalPage: number;
    currentPage: number;
    perPage: number;
    total: number;
    nextPageUrl?: string | null;
    prevPageUrl?: string | null;
  }>({ 
    totalPage: 1, 
    currentPage: 1, 
    perPage: 12, 
    total: 0 
  });
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Sync currentPage with pagination state when API response comes back
  // This ensures the active page stays in sync with the server response
  useEffect(() => {
    if (localPagination.currentPage && localPagination.currentPage !== currentPage) {
      setCurrentPage(localPagination.currentPage);
    }
  }, [localPagination.currentPage]);
  return (
    <>
      <HeaderOne />
      <main>
        <BreadCrumb title="Listings" sub_title="" />
        <BannerForm 
          setListing={setListing} 
          setLocalPagination={setLocalPagination}
          onPageChange={handlePageChange}
          currentPage={currentPage}
        />
        <FeatureArea 
          listing={listing} 
          pagination={localPagination}
          onPageChange={handlePageChange}
          activePage={currentPage}
        />
      </main>
      <FooterOne />
    </>
  );
};

export default FeatureTwo;
