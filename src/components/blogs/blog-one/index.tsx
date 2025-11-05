import BreadCrumb from "@/components/common/BreadCrumb"
import BlogArea from "./BlogArea"
import HeaderOne from "@/layouts/headers/HeaderOne"
import FooterOne from "@/layouts/footers/FooterOne"

const BlogOne = () => {
   return (
      <>
         <HeaderOne />
         <main>
            <BreadCrumb title="Blogs" sub_title="" />
            <BlogArea />
         </main>
         <FooterOne />
      </>
   )
}

export default BlogOne
