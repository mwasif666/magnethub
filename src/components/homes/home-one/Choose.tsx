import Image from "next/image";
import Button from "@/components/common/Button";
import choose_shape from "@/assets/img/chose/chose-shape-2.png";
import choose_thumb2 from "@/assets/img/about/bussines.png";
import Link from "next/link";

const Choose = () => {
  return (
    <div className="tg-chose-area p-relative pt-135 pb-100">
      <Image
        className="tg-chose-shape p-absolute"
        src={choose_shape}
        alt="shape"
      />
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-5">
            <div className="tg-chose-content mb-25">
              <div className="tg-chose-section-title mb-30">
                <h5
                  className="tg-section-subtitle mb-15 wow fadeInUp"
                  data-wow-delay=".3s"
                  data-wow-duration=".1s"
                >
                  About us
                </h5>
                <h2
                  className="mb-15 text-capitalize wow fadeInUp"
                  data-wow-delay=".4s"
                  data-wow-duration=".9s"
                >
                  The Hub Of All Hubs
                </h2>
                <p
                  className="text-capitalize wow fadeInUp"
                  data-wow-delay=".5s"
                  data-wow-duration=".9s"
                >
                  Magnate Hub is the ultimate platform for entrepreneurs and
                  business owners. Whether you&apos;re looking to buy or sell a
                  business, find investors, or raise capital, we&apos;ve got you
                  covered.
                </p>
                <p
                  className="text-capitalize wow fadeInUp"
                  data-wow-delay=".5s"
                  data-wow-duration=".9s"
                >
                  With a user-friendly interface and a vast network of potential
                  buyers, sellers, investors, and lenders, Magnate Hub makes it
                  easy to take your business to the next level.
                </p>
              </div>
              <div className="tg-chose-list-wrap">
                <div
                  className="tg-chose-btn wow fadeInUp"
                  data-wow-delay=".8s"
                  data-wow-duration=".9s"
                >
                  <Link
                    href="/contact"
                    className="tg-btn tg-btn-switch-animation"
                  >
                    <Button text="More About us" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-7">
            <div className="tg-chose-right mb-25">
              <div className="row">
                {/* <div className="col-lg-3 col-md-6">
                  <div className="tg-chose-thumb">
                    <Image
                      className="tg-chose-shape-2 mb-30 ml-15 d-none d-lg-block"
                      src={choose_shape2}
                      alt="shape"
                    />
                    <Image
                      className="w-100 wow fadeInRight"
                      data-wow-delay=".4s"
                      data-wow-duration=".9s"
                      src={choose_thumb}
                      alt="chose"
                    />
                  </div>
                </div> */}
                <div className="col-lg-10 col-md-6">
                  <div className="tg-chose-thumb-inner p-relative">
                    <div
                      className="tg-chose-thumb-2 wow fadeInRight"
                      data-wow-delay=".5s"
                      data-wow-duration=".9s"
                    >
                      <Image
                        className="w-100 tg-round-15"
                        src={choose_thumb2}
                        alt="chose"
                      />
                    </div>
                  </div>
                </div>
                <div className="col-lg-2">
                  <div className="tg-chose-big-text d-none d-xl-block">
                    <h2 data-text="ABOUT">ABOUT</h2>
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

export default Choose;
