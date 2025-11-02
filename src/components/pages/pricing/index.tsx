import BreadCrumb from "@/components/common/BreadCrumb"
import HeaderThree from "@/layouts/headers/HeaderThree"
import PricingArea from "./PricingArea"
import FooterThree from "@/layouts/footers/FooterThree"
import Cta from "./Cta"
import HeaderOne from "@/layouts/headers/HeaderOne"

const Pricing = () => {
  return (
    <>
      <HeaderOne />
      <main>
        <BreadCrumb title="Pricing Plan" sub_title="Pricing Plan" />
        <PricingArea />
        <Cta />
      </main>
      <FooterThree />
    </>
  )
}

export default Pricing
