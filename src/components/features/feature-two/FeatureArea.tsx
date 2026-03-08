/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToWishlist } from "@/redux/features/wishlistSlice";
import { useRouter } from "next/navigation";
import FeatureTop from "./FeatureTop";
import UseProducts from "@/hooks/UseProducts";
import Pagination from "@/components/pagination/Pagination";
import Wishlist from "@/svg/home-one/Wishlist";
import Loading from "@/components/loading/Loading";
import Image from "next/image";
import Location from "@/svg/home-one/Location";
import Link from "next/link";
import { apiRequest } from "@/api/axiosInstance";

type FeatureAreaProps = {
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

const formatListingPrice = (price?: string | number) => {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(Number(price || 0));
};

const truncateText = (value: string, limit: number) => {
  if (value.length <= limit) {
    return value;
  }

  return `${value.slice(0, Math.max(limit - 3, 0)).trimEnd()}...`;
};

type ListingCardSharedProps = {
  item: any;
  detailHref: string;
  isInWishlist: boolean;
  handleAddToWishlist: (item: any) => void;
  redirectUser: (item: any) => void;
};

const HomeStyleListingCard = ({
  item,
  detailHref,
  isInWishlist,
  handleAddToWishlist,
  redirectUser,
}: ListingCardSharedProps) => {
  const isFranchiseBooker = String(item?.user_type) === "4";
  const verificationSource = item?.user_company_name?.trim() || "partner";
  const verificationBadgeText = `verified by ${truncateText(verificationSource, 15)}`;
  const verificationBadgeTitle = `verified by ${verificationSource}`;
  const listingCode = `MGH-${new Date().getFullYear()}-${item.project_id}`;

  return (
    <div
      className="tg-listing-card-item tg-listing-su-card-item listing-page-home-card mb-25"
      style={{
        cursor: "pointer",
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: "28px",
        overflow: "hidden",
        position: "relative",
        background: "linear-gradient(180deg, #ffffff 0%, #fcfbff 100%)",
        border: "1px solid rgba(100, 91, 255, 0.08)",
        boxShadow: "0 18px 50px rgba(50, 38, 120, 0.10)",
        padding: "16px",
        transition: "transform .18s ease, box-shadow .18s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = "0 24px 60px rgba(50, 38, 120, 0.14)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0px)";
        e.currentTarget.style.boxShadow = "0 18px 50px rgba(50, 38, 120, 0.10)";
      }}
      onClick={() => redirectUser(item)}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "250px",
          overflow: "hidden",
          background: "#f6f6f6",
          borderRadius: "24px",
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
            height: "250px",
            transform: "scale(1.02)",
          }}
          unoptimized
          onError={(e) => {
            e.currentTarget.src = "assets/img/notfound/image_notfound.png";
          }}
        />

        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(32,24,68,0.10), rgba(32,24,68,0) 52%, rgba(32,24,68,0.10))",
            pointerEvents: "none",
          }}
        />

        <div
          className="tg-listing-item-wishlist listing-page-home-wishlist"
          style={{
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
              width: "52px",
              height: "52px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              lineHeight: 0,
              borderRadius: "999px",
              background: "rgba(255,255,255,0.96)",
              border: "1px solid rgba(0,0,0,0.06)",
              boxShadow: "0 12px 24px rgba(0,0,0,0.12)",
              backdropFilter: "blur(8px)",
            }}
            aria-label="Add to wishlist"
          >
            <Wishlist
              filled={isInWishlist}
              style={{
                color: isInWishlist ? "#e11d48" : "#444",
                display: "block",
                flex: "0 0 auto",
              }}
            />
          </a>
        </div>

        <span
          title={item.category_name}
          style={{
            position: "absolute",
            left: "16px",
            bottom: "16px",
            zIndex: 6,
            maxWidth: "calc(100% - 32px)",
            padding: "7px 12px",
            borderRadius: "999px",
            background: "rgba(255,255,255,0.94)",
            border: "1px solid rgba(90,69,181,0.08)",
            color: "#5a45b5",
            fontSize: "11px",
            fontWeight: 600,
            lineHeight: 1.1,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            backdropFilter: "blur(8px)",
          }}
        >
          {item.category_name}
        </span>
      </div>

      <div
        className="tg-listing-card-content"
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          padding: "20px 8px 16px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "8px",
            marginBottom: "10px",
            flexWrap: "wrap",
          }}
        >
          <p
            style={{
              fontSize: "12px",
              color: "#7b8397",
              margin: 0,
              letterSpacing: "-0.01em",
              lineHeight: 1.2,
            }}
          >
            {listingCode}
          </p>

          {isFranchiseBooker && (
            <span
              title={verificationBadgeTitle}
              style={{
                color: "#16a34a",
                background: "rgba(22, 163, 74, 0.10)",
                border: "1px solid rgba(22, 163, 74, 0.18)",
                borderRadius: "999px",
                fontSize: "11px",
                fontWeight: 600,
                lineHeight: 1,
                whiteSpace: "nowrap",
                padding: "6px 10px",
                flex: "0 0 auto",
                cursor: "default",
              }}
            >
              {verificationBadgeText}
            </span>
          )}
        </div>

        <h4
          className="tg-listing-card-title"
          style={{
            margin: "0 0 16px",
            minWidth: 0,
          }}
        >
          <Link href={detailHref} onClick={(e) => e.stopPropagation()}>
            <span
              style={{
                fontWeight: 800,
                fontSize: "17px",
                color: "#111827",
                letterSpacing: "-0.04em",
                lineHeight: 1.22,
                display: "block",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              title={item.name}
            >
              {item.name}
            </span>
          </Link>
        </h4>

        <div style={{ marginTop: "auto" }}>
          <div
            className="mt-10 pt-20 border-top"
            style={{
              paddingTop: 18,
              borderTop: "1px solid rgba(201,204,220,0.7)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  fontSize: "24px",
                  fontWeight: 700,
                  color: "#101827",
                  letterSpacing: "-0.05em",
                  lineHeight: 0.95,
                }}
              >
                ${formatListingPrice(item.price)}
              </span>

              {item.location_name && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    gap: "4px",
                    minWidth: 0,
                    flex: "0 1 52%",
                  }}
                >
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "flex-start",
                      gap: "6px",
                      color: "#7d8497",
                      fontSize: "12px",
                      fontWeight: 500,
                      minWidth: 0,
                      maxWidth: "100%",
                      alignSelf: "flex-end",
                    }}
                  >
                    <span
                      style={{
                        display: "inline-flex",
                        color: "#7d8497",
                        flex: "0 0 auto",
                      }}
                    >
                      <Location />
                    </span>
                    <span
                      style={{
                        minWidth: 0,
                        flex: "0 1 auto",
                        lineHeight: 1.35,
                        overflowWrap: "anywhere",
                        textAlign: "right",
                      }}
                    >
                      {item.location_name}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ListViewListingCard = ({
  item,
  detailHref,
  isInWishlist,
  handleAddToWishlist,
  redirectUser,
}: ListingCardSharedProps) => {
  return (
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
          unoptimized
          onError={(e) => {
            e.currentTarget.src = "assets/img/notfound/image_notfound.png";
          }}
        />

        {item.tag && (
          <span className="tg-listing-item-price-discount">{item.tag}</span>
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
              filled={isInWishlist}
              style={{
                color: isInWishlist ? "red" : "#444",
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
          <Link href={detailHref} onClick={(e) => e.stopPropagation()}>
            <span
              style={{
                fontWeight: 600,
                fontSize: "18px",
                color: "#1a1a1a",
              }}
            >
              {item.name.length > 30 ? item.name.slice(0, 25) + "..." : item.name}
            </span>
          </Link>
        </h4>

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
          <span style={{ marginLeft: "6px" }}>{item.location_name}</span>
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
              {formatListingPrice(item.price)}
            </span>
          </div>
          <div>
            {item?.franchise === "1" ? (
              <i
                className="fa-sharp fa-solid fa-star"
                style={{
                  color: "#ffb703",
                  fontSize: "20px",
                }}
              ></i>
            ) : item?.premium === "1" ? (
              <i
                className="fa-sharp fa-solid fa-crown"
                style={{
                  color: "#d7263d",
                  fontSize: "20px",
                }}
              ></i>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureArea = ({
  listing,
  pagination,
  onPageChange,
  activePage,
}: FeatureAreaProps) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { setProducts } = UseProducts();
  const [isListView, setIsListView] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const wishlist = useSelector((state: any) => state.wishlist.wishlist);

  const totalPages = pagination?.totalPage || 1;
  const currentPage =
    activePage !== undefined ? activePage : pagination?.currentPage || 1;
  const totalItems = pagination?.total || 0;
  const perPage = pagination?.perPage || 12;
  const startOffset = totalItems > 0 ? (currentPage - 1) * perPage + 1 : 0;
  const endOffset = Math.min(currentPage * perPage, totalItems);

  const handleAddToWishlist = useCallback(
    (item: any) => {
      dispatch(addToWishlist(item));
    },
    [dispatch],
  );

  const handleListViewClick = () => {
    setIsListView(true);
  };
  const handleGridViewClick = () => {
    setIsListView(false);
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
    const imageUrl = showImageAccordingToCategory(item?.category_name);
    router.push(
      `/detail?url=${item.url}&id=${item.project_id}&category=${imageUrl}`,
    );
  };

  const isInWishlist = (id: number) => {
    return wishlist.some((item: any) => item.id === id);
  };

  return (
    <div id="listing-results" className="tg-listing-grid-area mb-85">
      <div className="container">
        <div className="row">
          {/* <FeatureSidebar setProducts={setProducts} /> */}
          <div className="col-12">
            <div className="tg-listing-item-box-wrap ml-10">
              <FeatureTop
                startOffset={startOffset}
                endOffset={endOffset}
                totalItems={totalItems}
                setProducts={setProducts}
                isListView={isListView}
                handleListViewClick={handleListViewClick}
                handleGridViewClick={handleGridViewClick}
              />
              <div className="tg-listing-grid-item">
                <div
                  className={`row list-card ${
                    isListView ? "list-card-open" : ""
                  }`}
                >
                  {loading ? (
                    <Loading />
                  ) : (
                    data?.map((item) => (
                      <div
                        key={item.id}
                        className="col-xl-4 col-lg-4 col-md-6 listing-page-grid-col"
                      >
                        {isListView ? (
                          <ListViewListingCard
                            item={item}
                            detailHref={`/detail?url=${item.url}&id=${item.project_id}&category=${encodeURIComponent(
                              showImageAccordingToCategory(item.category_name) || "",
                            )}`}
                            isInWishlist={isInWishlist(item.id)}
                            handleAddToWishlist={handleAddToWishlist}
                            redirectUser={redirectUser}
                          />
                        ) : (
                          <HomeStyleListingCard
                            item={item}
                            detailHref={`/detail?url=${item.url}&id=${item.project_id}&category=${encodeURIComponent(
                              showImageAccordingToCategory(item.category_name) || "",
                            )}`}
                            isInWishlist={isInWishlist(item.id)}
                            handleAddToWishlist={handleAddToWishlist}
                            redirectUser={redirectUser}
                          />
                        )}
                      </div>
                    ))
                  )}
                </div>
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
        </div>

        <style jsx global>{`
          .list-card:not(.list-card-open) {
            row-gap: 34px;
          }

          .list-card:not(.list-card-open) > .listing-page-grid-col {
            display: flex;
          }

          .list-card:not(.list-card-open)
            > .listing-page-grid-col
            .listing-page-home-card {
            margin-bottom: 0 !important;
            width: 100%;
          }

          .listing-page-home-wishlist {
            top: 0;
            right: 0;
            transition:
              opacity 0.2s ease,
              visibility 0.2s ease,
              transform 0.2s ease;
          }

          @media (hover: hover) and (pointer: fine) {
            .listing-page-home-wishlist {
              opacity: 0;
              visibility: hidden;
              pointer-events: none;
              transform: translate(-10px, 10px);
            }

            .listing-page-home-card:hover .listing-page-home-wishlist {
              opacity: 1;
              visibility: visible;
              pointer-events: auto;
              transform: translate(0, 0);
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default FeatureArea;
