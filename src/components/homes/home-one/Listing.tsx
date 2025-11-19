"use client";
import { useEffect, useState } from "react";
import { addToWishlist } from "@/redux/features/wishlistSlice";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Wishlist from "@/svg/home-one/Wishlist";
import shape_1 from "@/assets/img/listing/su/shape-2.png";
import shape_2 from "@/assets/img/listing/su/shape-1.png";
import Loading from "@/components/loading/Loading";
import Location from "@/svg/home-one/Location";
import ReactPaginate from "react-paginate";

const Listing = ({ listing }: { listing: any[] }) => {
  const dispatch = useDispatch();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const handleAddToWishlist = (item: any) => {
    dispatch(addToWishlist(item));
  };

  useEffect(() => {
    if (listing && listing.length > 0) {
      setData(listing);
      setLoading(false);
    } else {
      setData([]);
      setLoading(false);
    }
  }, [listing]);

  const router = useRouter();
  const redirectUser = (item: any) => {
    router.push(`/detail/${item.url}/${item.project_id}`);
  };

  const handlePageClick = ()=>{

  }

  const totalPages = 12


  return (
    <div className="tg-listing-area pb-80 tg-grey-bg-2 pt-120 p-relative">
      <Image
        className="tg-listing-su-shape d-none d-xl-block"
        src={shape_1}
        alt=""
      />
      <Image
        className="tg-listing-su-shape-2 d-none d-xxl-block"
        src={shape_2}
        alt=""
      />

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <div className="tg-listing-section-title-wrap text-center mb-40">
              <h5 className="tg-section-su-subtitle su-subtitle-2 mb-15">
                Premium Listings
              </h5>
              <h2 className="tg-section-su-title text-capitalize mb-15">
                Explore our exclusive portfolio of premium listings at Magnate
                Hub
              </h2>
            </div>
          </div>
        </div>

        <div className="row">
          {/* Loading State */}
          {loading ? (
            <Loading loadingText={"Loading..."} />
          ) : data.length > 0 ? (
            data.map((item) => (
              <div key={item.id} className="col-xl-4 col-lg-4 col-md-6">
                <div
                  className="tg-listing-card-item tg-listing-su-card-item mb-25"
                  style={{ cursor: "pointer" }}
                >
                  <div className="tg-listing-card-thumb fix mb-25 p-relative">
                    <Image
                      className="tg-card-border w-100"
                      src={`http://magnatehub.au/uploads/project/card/${item.card}`}
                      alt={item?.name || "Project listing image"}
                      width={250}
                      height={250}
                      unoptimized
                      onError={(e) => {
                        e.currentTarget.src =
                          "http://magnatehub.au/uploads/project/card/67-1759918312-87531328.jpg";
                      }}
                    />

                    {item.tag && (
                      <span className="tg-listing-item-price-discount">
                        {item.tag}
                      </span>
                    )}
                    <div className="tg-listing-item-wishlist">
                      <a
                        onClick={() => handleAddToWishlist(item)}
                        style={{ cursor: "pointer" }}
                      >
                        <Wishlist />
                      </a>
                    </div>
                  </div>

                  <div className="tg-listing-card-content">
                    {/* <div className="tg-listing-card-duration-tour d-flex align-items-center gap-3">
                      <span className="tg-listing-card-duration-map mb-5">
                        <Clock /> {item.time}
                      </span>
                      <span className="tg-listing-card-duration-time mb-5">
                        <User /> {item.guest}
                      </span>
                    </div> */}

                    <h4
                      className="tg-listing-card-title mb-10"
                      onClick={() => redirectUser(item)}
                    >
                      <Link href="tour-details.html">
                        {item.name.length > 30
                          ? item.name.slice(0, 20) + "..."
                          : item.name}
                      </Link>
                    </h4>

                    <div className="tg-listing-card-duration-tour mb-20">
                      <span className="tg-listing-card-duration-map">
                        <Location /> {item.location_name}
                      </span>
                    </div>

                    <div className="tg-listing-card-price d-flex align-items-end justify-content-between">
                      <div>
                        <span className="tg-listing-card-currency-amount d-flex align-items-center">
                          <span className="currency-symbol mr-5"></span>$
                          {item.price}
                        </span>
                      </div>
                      <div>
                        <span className="tg-listing-rating-icon">
                          {item?.franchise === "1" ? (
                            <i className="fa-sharp fa-solid fa-star"></i>
                          ) : item?.premium === "1" ? (
                            <i className="fa-sharp fa-solid fa-crown"></i>
                          ) : null}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-5">
              <p>No listings found.</p>
            </div>
          )}

            <div className="tg-pagenation-wrap text-center mt-50 mb-30">
                  <nav>
                    <ReactPaginate
                      breakLabel="..."
                      nextLabel={<i className="p-btn">{">"}</i>}
                      onPageChange={handlePageClick}
                      pageRangeDisplayed={3}
                      pageCount={totalPages}
                      previousLabel={<i className="p-btn">{"<"}</i>}
                      renderOnZeroPageCount={null}
                    />
                  </nav>
                </div>
        </div>
      </div>
    </div>
  );
};

export default Listing;
