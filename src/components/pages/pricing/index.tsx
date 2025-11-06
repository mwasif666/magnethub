import BreadCrumb from "@/components/common/BreadCrumb";
import PricingArea from "./PricingArea";
import HeaderOne from "@/layouts/headers/HeaderOne";
import FooterOne from "@/layouts/footers/FooterOne";
import Pricing2 from "../../homes/home-two/Pricing";

const Pricing = () => {
  return (
    <>
      <HeaderOne />
      <main>
        <BreadCrumb title="Pricing Plan" sub_title="Pricing Plan" />
        <PricingArea />
        <Pricing2 />
      </main>
      <FooterOne />
    </>
  );
};

export default Pricing;
