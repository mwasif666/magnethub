import BreadCrumb from "@/components/common/BreadCrumb";
import BlogDetailsArea from "./BlogDetailsArea";
import HeaderOne from "@/layouts/headers/HeaderOne";
import FooterOne from "@/layouts/footers/FooterOne";

type BlogDetailsProps = {
  id: string | null;
  url: string | null;
};

const BlogDetails = ({ id, url }: BlogDetailsProps) => {
  return (
    <>
      <HeaderOne />
      <main>
        <BreadCrumb
          title="Blog Details"
          sub_title="Exploring The Green Spac Realar Residence Area Harmony"
        />
        <BlogDetailsArea id={id} url={url} />
      </main>
      <FooterOne />
    </>
  );
};

export default BlogDetails;
