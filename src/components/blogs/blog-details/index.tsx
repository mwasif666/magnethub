import BreadCrumb from "@/components/common/BreadCrumb"
import BlogDetailsArea from "./BlogDetailsArea"
import FooterFive from "@/layouts/footers/FooterFive"
import HeaderOne from "@/layouts/headers/HeaderOne"

type BlogDetailsProps = {
  id: string | null;
  slug: string | null;
};

const BlogDetails = ({ id, slug }: BlogDetailsProps) => {
  return (
    <>
      <HeaderOne />
      <main>
        <BreadCrumb title="Blog Details" sub_title="Exploring The Green Spac Realar Residence Area Harmony" />
        <BlogDetailsArea id={id} slug={slug}/>
      </main>
      <FooterFive />
    </>
  )
}

export default BlogDetails
