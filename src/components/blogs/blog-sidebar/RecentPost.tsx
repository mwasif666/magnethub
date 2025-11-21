import { useEffect, useState } from "react";
import { apiRequest } from "@/api/axiosInstance";
import Image from "next/image";
import Link from "next/link";
import Loading from "@/components/loading/Loading";

const RecentPost = () => {
  const [blogsLoading, setBlogsLoading] = useState<boolean>(true);
  const [recentBlogs, setRecentBlogs] = useState<any>([]);

  const getRecentBlogs = async () => {
    try {
      setBlogsLoading(true);
      const response = await apiRequest({
        url: `GetAllBlogs/recent`,
        method: "GET",
      });
      setRecentBlogs(response.data?.blog || {});
    } catch (error) {
      throw error;
    } finally {
      setBlogsLoading(false);
    }
  };

  useEffect(() => {
    getRecentBlogs();
  }, []);

  return (
    <div className="tg-blog-post tg-blog-sidebar-box mb-40">
      <h5 className="tg-blog-sidebar-title mb-25">Recent Blogs</h5>
      {blogsLoading ? <Loading/> : recentBlogs.length === 0 ? <div>Blogs not found</div> : recentBlogs.map((item: any) => (
        <div
          key={item.id}
          className="tg-blog-post-item d-flex align-items-center"
        >
          <div className="tg-blog-post-thumb mr-15">
            <Image
              src={`http://magnatehub.au/uploads/blog/card/${item.card}`}
              width={100}
              height={100}
              alt="blog"
            />
          </div>
          <div className="tg-blog-post-content w-100">
            <h4 className="tg-blog-post-title mb-5">
              <Link href={`/blog-details?url=${item.url}&id=${item.id}`}>{item.name}</Link>
            </h4>
            <span className="tg-blog-post-date">
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.76501 0.777832V3.26675M4.23413 0.777832V3.26675M0.777344 5.75554H13.2218M2.16006 2.02217H11.8391C12.6027 2.02217 13.2218 2.57933 13.2218 3.26662V11.9778C13.2218 12.6651 12.6027 13.2223 11.8391 13.2223H2.16006C1.39641 13.2223 0.777344 12.6651 0.777344 11.9778V3.26662C0.777344 2.57933 1.39641 2.02217 2.16006 2.02217Z"
                  stroke="#560CE3"
                  strokeWidth="0.977778"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {item.date}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentPost;
