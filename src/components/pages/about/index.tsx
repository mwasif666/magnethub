import BreadCrumb from "@/components/common/BreadCrumb";
import AboutArea from "./AboutArea";
import Cta from "./Cta";
import HeaderOne from "@/layouts/headers/HeaderOne";
import FooterTwo from "@/layouts/footers/FooterTwo";
import Features from "./Features";
import FooterOne from "@/layouts/footers/FooterOne";

const About = () => {
  return (
    <>
      <HeaderOne />
      <main>
        <BreadCrumb title="About Us" sub_title="About Us" />
        <AboutArea />
        <Features />

        <Cta />
      </main>
      <FooterOne />
    </>
  );
};

export default About;
