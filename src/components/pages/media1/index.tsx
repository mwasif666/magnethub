import BreadCrumb from "@/components/common/BreadCrumb"
import HeaderThree from "@/layouts/headers/HeaderThree"
import BlogDetailsArea from "./BlogDetailsArea"
import FooterFive from "@/layouts/footers/FooterFive"
import HeaderOne from "@/layouts/headers/HeaderOne"
import FooterTwo from "@/layouts/footers/FooterTwo"

const Media1 = () => {
  return (
    <>
      <HeaderOne />
      <main>
        <BreadCrumb title="Media" sub_title="Exploring The Green Spac Realar Residence Area Harmony" />
        <BlogDetailsArea />
      </main>
      <FooterTwo />
    </>
  )
}

export default Media1
