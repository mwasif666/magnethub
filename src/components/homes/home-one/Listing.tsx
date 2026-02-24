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
    if (typeof window !== "undefined" && item?.category_name) {
      window.localStorage.removeItem("categoryName");
      window.localStorage.setItem("categoryName", item.category_name);
    }
    let imageUrl = showImageAccordingToCategory(item?.category_name);
    if (typeof window !== "undefined" && item?.category_name) {
      window.localStorage.setItem("categoryName", item.category_name);
    }
    router.push(
      `/detail?url=${item.url}&id=${item.project_id}&category=${encodeURIComponent(imageUrl)}`,
    );
  };

  const totalPages = pagination?.totalPage || 1;
  const currentPage =
    activePage !== undefined ? activePage : pagination?.currentPage || 1;

  const isInWishlist = (id: number) => {
    return wishlist.some((item: any) => item.id === id);
  };

  const getCompanyLogoUrl = (logo: string) => {
    if (!logo) return "";
    if (logo.startsWith("http://") || logo.startsWith("https://")) return logo;
    return `https://dash.magnatehub.au/uploads/raising/company_logo/${logo}`;
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
            data.map((item) => {
              const isFranchiseBooker = String(item?.user_type) === "4";

              return (
                <div
                  key={item.id}
                  className="col-xl-4 col-lg-4 col-md-6 d-flex"
                  style={{ marginTop: "12px" }}
                >
                  <div
                    className="tg-listing-card-item tg-listing-su-card-item mb-25"
                    style={{
                      cursor: "pointer",
                      height: "100%",
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: "16px",
                      overflow: "hidden",
                      position: "relative",
                      background: "#fff",
                      border: "1px solid rgba(0,0,0,0.06)",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
                      transition: "transform .18s ease, box-shadow .18s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-3px)";
                      e.currentTarget.style.boxShadow =
                        "0 14px 40px rgba(0,0,0,0.10)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0px)";
                      e.currentTarget.style.boxShadow =
                        "0 10px 30px rgba(0,0,0,0.06)";
                    }}
                    onClick={() => redirectUser(item)}
                  >
                    <div
                      style={{
                        position: "relative",
                        width: "100%",
                        height: "230px",
                        overflow: "hidden",
                        background: "#f6f6f6",
                      }}
                    >
                      <Image
                        className="tg-card-border w-100"
                        src={`https://dash.magnatehub.au/uploads/project/card/${item.card}`}
                        alt={item?.name || "Project listing image"}
                        width={250}
                        height={250}
                        style={{
                          objectFit: "cover",
                          width: "100%",
                          height: "230px",
                          transform: "scale(1.02)",
                        }}
                        unoptimized
                        onError={(e) => {
                          e.currentTarget.src =
                            "assets/img/notfound/image_notfound.png";
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          background:
                            "linear-gradient(to bottom, rgba(0,0,0,0.25), rgba(0,0,0,0) 55%, rgba(0,0,0,0.18))",
                          pointerEvents: "none",
                        }}
                      />
                      {item.tag && (
                        <span
                          className="tg-listing-item-price-discount"
                          style={{
                            position: "absolute",
                            left: "12px",
                            top: "12px",
                            zIndex: 6,
                            background: "rgba(255,255,255,0.92)",
                            border: "1px solid rgba(0,0,0,0.08)",
                            color: "#111",
                            padding: "6px 10px",
                            borderRadius: "999px",
                            fontSize: "12px",
                            fontWeight: 700,
                            backdropFilter: "blur(6px)",
                          }}
                        >
                          {item.tag}
                        </span>
                      )}
                      <div
                        className="tg-listing-item-wishlist"
                        style={{
                          top: "3px",
                          right: "2px",
                          position: "absolute",
                          zIndex: 7,
                        }}
                      >
                        <a
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToWishlist(item);
                          }}
                          style={{
                            cursor: "pointer",
                            width: "40px",
                            height: "40px",
                            display: "grid",
                            placeItems: "center",
                            borderRadius: "999px",
                            background: "rgba(255,255,255,0.92)",
                            border: "1px solid rgba(0,0,0,0.10)",
                            boxShadow: "0 10px 22px rgba(0,0,0,0.12)",
                            backdropFilter: "blur(8px)",
                          }}
                          aria-label="Add to wishlist"
                        >
                          <Wishlist
                            filled={isInWishlist(item.id)}
                            style={{
                              color: isInWishlist(item.id) ? "#e11d48" : "#444",
                            }}
                          />
                        </a>
                      </div>
                    </div>
                    {isFranchiseBooker && (
                      <div
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "10px 14px",
                          background:
                            "linear-gradient(90deg, rgba(86,12,227,0.10), rgba(255,255,255,1))",
                          gap: "10px",
                          borderBottom: "1px solid rgba(0,0,0,0.06)",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            minWidth: 0,
                          }}
                        >
                          <span
                            style={{
                              fontSize: "12px",
                              fontWeight: 800,
                              color: "#560CE3",
                              background: "rgba(86,12,227,0.12)",
                              padding: "5px 10px",
                              borderRadius: "999px",
                              border: "1px solid rgba(86,12,227,0.22)",
                              whiteSpace: "nowrap",
                            }}
                          >
                            Verified Partner
                          </span>

                          <span
                            style={{
                              fontSize: "13px",
                              fontWeight: 700,
                              color: "#560CE3",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {item?.user_company_name ||
                              "Verified Franchise Partner"}
                          </span>
                        </div>

                        {item?.user_company_logo ? (
                          <Image
                            src={getCompanyLogoUrl(item.user_company_logo)}
                            alt={item?.user_company_name || "Company Logo"}
                            width={34}
                            height={34}
                            unoptimized
                            style={{
                              borderRadius: "999px",
                              objectFit: "cover",
                              border: "1px solid rgba(86,12,227,0.25)",
                              boxShadow: "0 8px 16px rgba(86,12,227,0.16)",
                              flex: "0 0 auto",
                            }}
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        ) : (
                          <div style={{ width: 34, height: 34 }} />
                        )}
                      </div>
                    )}
                    <div
                      className="tg-listing-card-content"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        flex: 1,
                        padding: "14px 15px 16px 15px",
                      }}
                    >
                      <h4
                        className="tg-listing-card-title mb-10"
                        style={{ margin: 0 }}
                      >
                        <Link
                          href={`/detail?url=${item.url}&id=${item.project_id}`}
                        >
                          <span
                            style={{
                              fontWeight: 800,
                              fontSize: "18px",
                              color: "#111",
                              letterSpacing: "-0.2px",
                              lineHeight: 1.25,
                              display: "block",
                            }}
                          >
                            {item.name.length > 30
                              ? item.name.slice(0, 28) + "..."
                              : item.name}
                          </span>
                        </Link>
                      </h4>

                      <p
                        style={{
                          fontSize: "12.5px",
                          color: "#6b7280",
                          marginTop: "8px",
                          marginBottom: "10px",
                        }}
                      >
                        MGH-{new Date().getFullYear()}-{item.project_id}
                      </p>

                      <div className="mb-15" style={{ marginBottom: 12 }}>
                        <span
                          style={{
                            padding: "6px 10px",
                            background: "rgba(37,99,235,0.08)",
                            border: "1px solid rgba(37,99,235,0.14)",
                            borderRadius: "10px",
                            fontSize: "13px",
                            color: "#1d4ed8",
                            fontWeight: 700,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                        >
                          {item.category_name}
                        </span>
                      </div>

                      <div
                        className="mb-20 d-flex align-items-center"
                        style={{
                          color: "#6b7280",
                          marginBottom: 14,
                          fontSize: "13px",
                        }}
                      >
                        <Location />
                        <span
                          style={{
                            marginLeft: "6px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {item.location_name}
                        </span>
                      </div>

                      <div style={{ marginTop: "auto" }}>
                        <div
                          className="d-flex align-items-end justify-content-between mt-10 pt-20 border-top"
                          style={{
                            paddingTop: 14,
                            borderTop: "1px solid rgba(0,0,0,0.06)",
                          }}
                        >
                          <div>
                            <span
                              className="d-flex align-items-center"
                              style={{
                                fontSize: "20px",
                                fontWeight: 600,
                                color: "#0f172a",
                              }}
                            >
                              <span className="mr-5" style={{ marginRight: 6 }}>
                                $
                              </span>
                              {item.price}
                            </span>
                          </div>

                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 10,
                            }}
                          >
                            {item?.premium === "1" && (
                              <i
                                className="fa-sharp fa-solid fa-crown"
                                style={{ color: "#d7263d", fontSize: "20px" }}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
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
