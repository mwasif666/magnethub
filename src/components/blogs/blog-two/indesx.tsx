import BreadCrumb from "@/components/common/BreadCrumb"
import HeaderThree from "@/layouts/headers/HeaderThree"
import BlogArea from "./BlogArea"
import FooterSix from "@/layouts/footers/FooterSix"
import HeaderOne from "@/layouts/headers/HeaderOne"
import FooterTwo from "@/layouts/footers/FooterTwo"

const BlogTwo = () => {
  return (
    <>
      <HeaderOne />
      <main>
        <BreadCrumb title="Blog-Detail" sub_title="" />
        <BlogArea />
      </main>
      <FooterTwo />
    </>
  )
}

export default BlogTwo
