"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { apiRequest } from "@/api/axiosInstance";
import Loading from "@/components/loading/Loading";
import { useRouter } from "next/navigation";

interface PropTypes {
  style: boolean;
}

type BlogType = {
  id: string;
  name: string;
  card: string;
  title: string;
  thumb: string;
  tag: string;
  date: string;
  time: string;
  page: string;
};

const Blog = ({ style }: PropTypes) => {
  const [blogs, setBlogs] = useState<BlogType[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const getAllBlogs = async () => {
    try {
      setLoading(true);
      const res = await apiRequest({
        url: "GetAllBlogs",
        method: "GET",
      });

      setBlogs(res?.data?.data || []);
    } catch (error) {
      console.error(error);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllBlogs();
  }, []);

  const redirectToBlogDetail = (item: any) => {
    router.push(`/blog-details?url=${item.url}&id=${item.id}`);
  };

  return (
    <div
      className={`tg-blog-area pt-130 p-relative z-index-1 ${
        style
          ? "tg-blog-su-2-wrapper pb-100"
          : "tg-blog-space-2 tg-blog-su-wrapper"
      }`}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-8">
            <div className="tg-location-section-title text-center mb-30">
              <h5
                className="tg-section-su-subtitle su-subtitle-2 mb-20 wow fadeInUp"
                data-wow-delay=".4s"
                data-wow-duration=".9s"
              >
                Tips and Inspiration
              </h5>
              <h2
                className="tg-section-su-title text-capitalize wow fadeInUp mb-15"
                data-wow-delay=".5s"
                data-wow-duration=".9s"
              >
                Latest News & Articles
              </h2>
            </div>
          </div>
        </div>

        {loading && <Loading loadingText={"Loading Blogs..."} />}

        {!loading && blogs.length === 0 && (
          <div className="text-center py-5">
            <h4>No Blog Data Found</h4>
          </div>
        )}

        <div className="row">
          {!loading &&
            blogs.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="col-xl-4 col-lg-6 col-md-6 wow fadeInLeft"
                data-wow-delay=".4s"
                data-wow-duration=".9s"
              >
                <div className="tg-blog-item tg-blog-2-item mb-25">
                  <div className="tg-blog-thumb p-relative fix mb-25">
                    <span onClick={() => redirectToBlogDetail(item)} style={{cursor: 'pointer'}}>
                      <Image
                        className="w-100"
                        width={150}
                        height={300}
                        src={`http://magnatehub.au/uploads/blog/card/${item.card}`}
                        alt={item?.name || "blog"}
                      />
                    </span>
                    {/* <span className="tg-blog-tag p-absolute">{item.tag}</span> */}
                  </div>

                  <div className="tg-blog-content p-relative">
                    <h3 className="tg-blog-title mb-15">
                      <span onClick={() => redirectToBlogDetail(item)} style={{cursor: 'pointer'}}>
                        {item.name.length > 30
                          ? `${item.name.slice(0, 30)}...`
                          : item.name}
                      </span>
                    </h3>

                    <div className="tg-blog-date">
                      <span className="mr-20">
                        <i className="fa-light fa-calendar" style={{color: '#560ce3'}}></i> {item.date}
                      </span>
                      <span>
                        <i className="fa-regular fa-clock" style={{color: '#560ce3'}}></i> {item.time}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;
