import HeaderThree from "@/layouts/headers/HeaderThree"
import BreadCrumb from "../common/BreadCrumb"
import ContactArea from "./ContactArea"
import FooterFive from "@/layouts/footers/FooterFive"
import HeaderOne from "@/layouts/headers/HeaderOne"
import FooterTwo from "@/layouts/footers/FooterTwo"

const Contact = () => {
   return (
      <>
         <HeaderOne />
         <main>
            <BreadCrumb title="Contact Us" sub_title="Contact" />
            <ContactArea />
         </main>
         <FooterTwo />
      </>
   )
}

export default Contact
