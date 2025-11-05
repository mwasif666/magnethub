import BreadCrumb from "@/components/common/BreadCrumb"
import PricingArea from "./PricingArea"
import Cta from "./Cta"
import HeaderOne from "@/layouts/headers/HeaderOne"
import FooterOne from "@/layouts/footers/FooterOne"

const Pricing = () => {
  return (
    <>
      <HeaderOne />
      <main>
        <BreadCrumb title="Pricing Plan" sub_title="Pricing Plan" />
        <PricingArea />
        <Cta />
      </main>
      <FooterOne />
    </>
  )
}

export default Pricing
