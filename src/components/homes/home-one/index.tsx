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
import { useState } from "react";

const HomeOne = () => {

  const [listing, setListing] = useState<any[]>([]);
  return (
    <>
      <HeaderOne />
      <main>
        <Banner setListing={setListing}/>
        <Listing listing={listing} />
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
