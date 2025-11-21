"use client";
import BlogDetails from "@/components/blogs/blog-details";
import Wrapper from "@/layouts/Wrapper";
import { useSearchParams } from "next/navigation";

// export const metadata = {
//   title:
//     "Blog Details Magnet Hub - Tour & Travel Booking React Next js Template",
// };
const page = () => {
  const params = useSearchParams();
  const id = params.get("id");
  const  url = params.get("url");
  return (
    <Wrapper>
      <BlogDetails id={id} url={url}/>
    </Wrapper>
  );
};

export default page;
