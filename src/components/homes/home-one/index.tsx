"use client";
import HeaderOne from "@/layouts/headers/HeaderOne";
import Banner from "./Banner";
import FooterOne from "@/layouts/footers/FooterOne";
import Location from "./Location";
import Listing from "./Listing";
import Process from "./Process";
import Testimonial from "./Testimonial";
import Blog from "./Blog";
// import Cta from "./Cta";
import Choose from "../home-three/Choose";
import ChooseArea from "../home-seven/ChooseArea";
import Features from "@/components/pages/about/Features";
import OurLocation from "./ourLocations";
import Pricing from "../home-two/Pricing";
import { useEffect, useState } from "react";

const HomeOne = () => {
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

  useEffect(() => {
    if (localPagination.currentPage && localPagination.currentPage !== currentPage) {
      setCurrentPage(localPagination.currentPage);
    }
  }, [localPagination.currentPage]);

  return (
    <>
      <HeaderOne />
      <main>
        <Banner 
         setListing={setListing} 
          setLocalPagination={setLocalPagination}
          onPageChange={handlePageChange}
          currentPage={currentPage}
        />
        <Listing
          listing={listing} 
          pagination={localPagination}
          onPageChange={handlePageChange}
          activePage={currentPage} />
        <Choose />
        <Location />
        <ChooseArea />
        <Features />
        <OurLocation />
        <Pricing />
        <Process />
        <Testimonial />
        <Blog style={false} />
      </main>
      <FooterOne />
    </>
  );
};

export default HomeOne;
