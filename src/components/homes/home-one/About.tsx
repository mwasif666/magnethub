import Image, { StaticImageData } from "next/image";
import Link from "next/link";

import shape_1 from "@/assets/img/about/su/right-shape.png";
import shape_2 from "@/assets/img/about/su/shape.png";
import shape_3 from "@/assets/img/about/su/shape-2.png";
import about_thumb from "@/assets/img/about/su/thumb.png";
import icon_1 from "@/assets/img/about/su/fun-3.png";
import icon_2 from "@/assets/img/about/su/fun-2.png";
import icon_3 from "@/assets/img/about/su/fun-1.png";
import author from "@/assets/img/about/su/author.jpg";

interface DataType {
  id: number;
  icon: StaticImageData;
  title: string;
  count: number;
}

const feature_data: DataType[] = [
  {
    id: 1,
    icon: icon_1,
    title: "Top Destination",
    count: 5000,
  },
  {
    id: 2,
    icon: icon_2,
    title: "Booking Completed",
    count: 3000,
  },
  {
    id: 3,
    icon: icon_3,
    title: "Top Destination",
    count: 5000,
  },
];

const About = () => {
  return (
    <div className="tg-about-area p-relative z-index-1 pb-80">
      <Image
        className="tg-about-su-right-shape d-none d-xl-block"
        src={shape_1}
        alt=""
      />
      <div className="container">
        <div className="row align-items-end">
          <div className="col-lg-5">
            <div
              className="tg-about-su-thumb p-relative mb-40 wow fadeInLeft"
              data-wow-delay=".4s"
              data-wow-duration=".6s"
            >
              <div className="tg-about-su-shape-2">
                <Image src={shape_2} alt="" />
              </div>
              <div className="tg-about-su-shape">
                <Image src={shape_3} alt="" />
              </div>
              <Image src={about_thumb} alt="" />
            </div>
          </div>
          <div className="col-lg-7">
            <div
              className="tg-about-su-content-wrap ml-80 mb-30 wow fadeInRight"
              data-wow-delay=".4s"
              data-wow-duration=".6s"
            >
              <div className="tg-location-section-title mb-30">
                <h5 className="tg-section-su-subtitle mb-15">Who we are</h5>
                <h2 className="tg-section-su-title text-capitalize mb-15">
                  The Hub Of All Hubs
                </h2>
                <p className="tg-section-su-para mb-10">
                  Magnate Hub is the ultimate platform for entrepreneurs and
                  business owners. Whether you're looking to buy or sell a
                  business, find investors, or raise capital, we've got you
                  covered.
                  <br />
                  With a user-friendly interface and a vast network of potential
                  buyers, sellers, investors, and lenders, Magnate Hub makes it
                  easy to take your business to the next level.
                </p>
              </div>
              <div className="tg-about-su-author-wrap">
                <div className="mr-30 mb-10">
                  <Link className="tg-btn tg-btn-hover" href="/about">
                    More About Us
                  </Link>
                </div>
                <div className="tg-about-su-author d-flex align-items-center mb-10">
                  <div className="tg-about-su-author-avatar mr-10">
                    <Image src={author} alt="" />
                  </div>
                  <div className="tg-about-su-author-info">
                    <h5>Richard Kemel</h5>
                    <span>Ceo & Founder</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
