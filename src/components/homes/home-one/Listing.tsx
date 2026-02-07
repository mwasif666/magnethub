"use client";
import { useEffect, useState } from "react";
import { addToWishlist } from "@/redux/features/wishlistSlice";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/api/axiosInstance";
import Image from "next/image";
import Link from "next/link";
import Wishlist from "@/svg/home-one/Wishlist";
import Loading from "@/components/loading/Loading";
import Location from "@/svg/home-one/Location";
import Pagination from "@/components/pagination/Pagination";

type listingProps = {
  listing: any[];
  pagination?: {
    totalPage: number;
    currentPage: number;
    perPage: number;
    total: number;
    nextPageUrl?: string | null;
    prevPageUrl?: string | null;
  };
  onPageChange?: (page: number) => void;
  activePage?: number;
};

const Listing = ({
  listing,
  pagination,
  onPageChange,
  activePage,
}: listingProps) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const wishlist = useSelector((state: any) => state.wishlist.wishlist);

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

  const getCategoryData = async () => {
    try {
      setLoading(true);
      const response = await apiRequest({
        method: "GET",
        url: "GetAllProjectCategories",
      });
      setCategoryData(response?.data || []);
    } catch (error) {
      console.error("Error fetching location data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCategoryData();
  }, []);

  const showImageAccordingToCategory = (category: string) => {
    const getImage = categoryData?.find((x) => x.name === category);
    if (getImage?.card) {
      return getImage?.card;
    }
  };

  const redirectUser = (item: any) => {
    let imageUrl = showImageAccordingToCategory(item?.category_name);
    router.push(
      `/detail?url=${item.url}&id=${item.project_id}&category=${encodeURIComponent(imageUrl)}`
    );
  };

  const totalPages = pagination?.totalPage || 1;
  const currentPage =
    activePage !== undefined ? activePage : pagination?.currentPage || 1;

  const isInWishlist = (id: number) => {
    return wishlist.some((item: any) => item.id === id);
  };

  return (
    <div className="tg-listing-area pb-80 tg-grey-bg-2 pt-120 p-relative">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <div className="tg-listing-section-title-wrap text-center mb-40">
              <h5 className="tg-section-su-subtitle su-subtitle-2 mb-15">
                Premium Listings
              </h5>
              <h2 className="tg-section-su-title mb-15">
                Explore our exclusive portfolio of premium listings at Magnate
                Hub
              </h2>
            </div>
          </div>
        </div>

        <div className="row">
          {loading ? (
            <Loading loadingText={"Loading..."} />
          ) : data.length > 0 ? (
            data.map((item) => (
              <div key={item.id} className="col-xl-4 col-lg-4 col-md-6">
                <div
                  className="tg-listing-card-item tg-listing-su-card-item mb-25"
                  style={{ cursor: "pointer" }}
                  onClick={() => redirectUser(item)}
                >
                  <div className="tg-listing-card-thumb fix mb-25 p-relative">
                    <Image
                      className="tg-card-border w-100"
                      src={`https://dash.magnatehub.au/uploads/project/card/${item.card}`}
                      alt={item?.name || "Project listing image"}
                      width={250}
                      height={250}
                      style={{
                        objectFit: "cover",
                      }}
                      unoptimized
                      onError={(e) => {
                        e.currentTarget.src =
                          "assets/img/notfound/image_notfound.png";
                      }}
                    />

                    {item.tag && (
                      <span className="tg-listing-item-price-discount">
                        {item.tag}
                      </span>
                    )}
                    <div className="tg-listing-item-wishlist">
                      <a
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToWishlist(item);
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        <Wishlist
                          filled={isInWishlist(item.id)}
                          style={{
                            color: isInWishlist(item.id) ? "red" : "#444",
                          }}
                        />
                      </a>
                    </div>
                  </div>

                  <div className="tg-listing-card-content">
                    <h4
                      className="tg-listing-card-title mb-10"
                      onClick={() => redirectUser(item)}
                      style={{ cursor: "pointer" }}
                    >
                      <Link
                        href={`/detail?url=${item.url}&id=${
                          item.project_id
                        }&category=${showImageAccordingToCategory(
                          item.category_name
                        )}`}
                      >
                        <span
                          style={{
                            fontWeight: 600,
                            fontSize: "18px",
                            color: "#1a1a1a",
                          }}
                        >
                          {item.name.length > 30
                            ? item.name.slice(0, 25) + "..."
                            : item.name}
                        </span>
                      </Link>
                    </h4>
                    <p
                      style={{
                        fontSize: "13px",
                        color: "#777",
                        marginTop: "10px",
                      }}
                    >
                      MGH-{new Date().getFullYear()}-{item.project_id}
                    </p>
                    <div className="mb-15">
                      <span
                        style={{
                          padding: "4px 10px",
                          background: "#eef4ff",
                          borderRadius: "6px",
                          fontSize: "13px",
                          color: "#2a5bd7",
                          fontWeight: 500,
                        }}
                      >
                        {item.category_name}
                      </span>
                    </div>

                    <div
                      className="mb-20 d-flex align-items-center"
                      style={{ color: "#666" }}
                    >
                      <Location />
                      <span style={{ marginLeft: "6px" }}>
                        {item.location_name}
                      </span>
                    </div>

                    <div className="d-flex align-items-end justify-content-between mt-10 pt-20 border-top">
                      <div>
                        <span
                          className="d-flex align-items-center"
                          style={{
                            fontSize: "20px",
                            fontWeight: 700,
                            color: "#111",
                          }}
                        >
                          <span className="mr-5">$</span>
                          {item.price}
                        </span>
                      </div>

                      <div>
                        {item?.franchise === "1" ? (
                          <i
                            className="fa-sharp fa-solid fa-star"
                            style={{ color: "#ffb703", fontSize: "20px" }}
                          ></i>
                        ) : item?.premium === "1" ? (
                          <i
                            className="fa-sharp fa-solid fa-crown"
                            style={{ color: "#d7263d", fontSize: "20px" }}
                          ></i>
                        ) : null}
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

          {totalPages > 1 && (
            <div className="text-center mt-50 mb-30">
              <nav>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => {
                    if (onPageChange) onPageChange(page);
                  }}
                />
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Listing;
