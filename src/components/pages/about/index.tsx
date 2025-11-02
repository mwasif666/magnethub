import BreadCrumb from "@/components/common/BreadCrumb"
import FooterSix from "@/layouts/footers/FooterSix"
import HeaderThree from "@/layouts/headers/HeaderThree"
import AboutArea from "./AboutArea"
import Choose from "./Choose"
import Cta from "./Cta"
import HeaderOne from "@/layouts/headers/HeaderOne"

const About = () => {
   return (
      <>
         <HeaderOne />
         <main>
            <BreadCrumb title="About Us" sub_title="About Us" />
            <AboutArea />
            <Choose />
            <Cta />
         </main>
         <FooterSix />
      </>
   )
}

export default About
