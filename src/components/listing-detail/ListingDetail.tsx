"use client";
import React, { useEffect, useState } from "react";
import { apiRequest } from "@/api/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import { addToWishlist } from "@/redux/features/wishlistSlice";
import { ToastContainer } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import styles from "./ListingDetail.module.css";
import Loading from "../loading/Loading";
import { useRouter } from "next/navigation";

interface ListingDetailProps {
  url: string;
  id: string;
}

const ListingDetail: React.FC<ListingDetailProps> = ({ url, id }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const wishlist = useSelector((state: any) => state.wishlist.wishlist);
  const [listing, setListing] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [similarListing, setSimilarListing] = useState<any>([]);
  const [similarLoading, setSimilarLoading] = useState<boolean>(true);

  const getProductDetails = async () => {
    try {
      setLoading(true);
      const response = await apiRequest({
        url: `GetAllProjects?id=${id}`,
        method: "GET",
      });
      setListing(response.data?.data[0]);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getSimilarListing = async () => {
    try {
      setSimilarLoading(true);
      const response = await apiRequest({
        url: `GetAllProjects/similar?project_id=${id}`,
        method: "GET",
      });
      setSimilarListing(response.data);
    } catch (error) {
      throw error;
    } finally {
      setSimilarLoading(false);
    }
  };

  useEffect(() => {
    getProductDetails();
    getSimilarListing();
  }, []);

  const parseImage = (Image: string) => {
    if (Image) {
      return JSON.parse(Image);
    }

    return [];
  };

  const handleAddToWishlist = (item: any) => {
    dispatch(addToWishlist(item));
  };

  const redirectUser = (item: any) => {
    router.push(`/detail/${item.url}/${item.project_id}`);
  };

  const openChatWithSeller = (userId: string, projectId: string) => {
    // const url = `/chat?user_id=${userId}&project_id=${projectId}`;
    const url = "http://magnatehub.au/dashboard/professionals/chat";
    window.open(url, "_blank");
  };

  const isInWishlist = (id: number) => {
    return wishlist.some((item: any) => item.id === id);
  };

  return (
    <>
      <ToastContainer position="top-center" />
      <div className={styles._listingContainer}>
        <div className="container">
          <div className="row">
            <div className="col-lg-8 col-md-12">
              {!loading ? (
                <>
                  <div className={`card p-4 mb-3 ${styles.headerCard}`}>
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h2 className={styles.title}>
                          {listing?.name
                            ? listing.name.length > 30
                              ? listing.name.slice(0, 30) + "..."
                              : listing.name
                            : ""}
                        </h2>
                        <h5 className={styles.host}>
                          <i className="fa-solid fa-user me-2"></i>
                          <span>Hosted By:</span>{" "}
                          {listing.user_first_name +
                            " " +
                            listing.user_last_name || "N/A"}
                        </h5>
                      </div>

                      <div
                        className={styles.wishlistContainer}
                        onClick={() => handleAddToWishlist(listing)}
                      >
                        <p className={styles.wishlistText}>
                          <i
                            className={`fa-heart me-1 ${
                              isInWishlist(listing.id)
                                ? "fa-solid text-danger"
                                : "fa-regular"
                            }`}
                            style={{ cursor: "pointer" }}
                          ></i>
                          {isInWishlist(listing.id)
                            ? "Added to Favorite"
                            : "Add To Favorite"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className={`card p-3 mb-3 ${styles.hero_img}`}>
                    <Image
                      className={`w-100 rounded ${styles.listingImage}`}
                      src={`https://dash.magnatehub.au/uploads/project/card/${listing?.card}`}
                      alt="Project Image"
                      width={500}
                      height={500}
                      unoptimized
                      onError={(e) => {
                        e.currentTarget.src =
                          "assets/img/notfound/image_notfound.png";
                      }}
                    />

                    <div className="d-flex gap-2 mt-3 flex-wrap">
                      {parseImage(listing?.images || "").map(
                        (img: string, i: number) => (
                          <div
                            key={i}
                            style={{
                              width: "150px",
                              height: "120px",
                              overflow: "hidden",
                              borderRadius: "10px",
                              border: "1px solid #eee",
                            }}
                          >
                            <Image
                              src={`https://dash.magnatehub.au/uploads/project/card/${img}`}
                              alt="Sub Image"
                              width={150}
                              height={120}
                              className="rounded"
                              unoptimized
                              style={{ objectFit: "cover" }}
                      onError={(e) => {
                        e.currentTarget.src =
                          "assets/img/notfound/image_notfound.png";
                      }}
                            />
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  <div className={`card p-4 mb-4 ${styles.infoCard}`}>
                    <h3 className={`mb-4 ${styles.sectionTitle}`}>
                      <i className="fa-solid fa-chart-line me-2"></i>
                      Business Overview
                    </h3>

                    <div className="row g-4">
                      {[
                        {
                          label: "Location",
                          value: listing?.location_name || "N/A",
                          icon: "fa-solid fa-location-dot",
                          color: "#ef4444",
                        },
                        {
                          label: "Category",
                          value: listing?.category_name || "N/A",
                          icon: "fa-solid fa-tags",
                          color: "#3b82f6",
                        },
                        {
                          label: "Price",
                          value: listing?.price ? `$${listing.price}` : "N/A",
                          icon: "fa-solid fa-dollar-sign",
                          color: "#10b981",
                        },
                        {
                          label: "Yearly Trading",
                          value: listing?.trading || "N/A",
                          icon: "fa-solid fa-chart-line",
                          color: "#f59e0b",
                        },
                        {
                          label: "Earning Type",
                          value: listing?.earning_type || "N/A",
                          icon: "fa-solid fa-money-bill-wave",
                          color: "#8b5cf6",
                        },
                        {
                          label: "Stock Level",
                          value: listing?.stock_level || "N/A",
                          icon: "fa-solid fa-boxes-stacked",
                          color: "#06b6d4",
                        },
                      ].map((item, i) => (
                        <div className="col-6 col-md-4" key={i}>
                          <div className={styles.infoItem}>
                            <div
                              className={styles.infoIcon}
                              style={{
                                backgroundColor: `${item.color}15`,
                                color: item.color,
                              }}
                            >
                              <i className={item.icon}></i>
                            </div>
                            <p className={styles.infoLabel}>{item.label}</p>
                            <h6 className={styles.infoValue}>{item.value}</h6>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {[
                    {
                      label: "Summary",
                      value: listing.summary,
                      icon: "fa-solid fa-file-lines",
                    },
                    {
                      label: "Skills",
                      value: listing.skills,
                      icon: "fa-solid fa-lightbulb",
                    },
                    {
                      label: "Potential",
                      value: listing.potential,
                      icon: "fa-solid fa-rocket",
                    },
                    {
                      label: "Hours",
                      value: listing.hours,
                      icon: "fa-solid fa-clock",
                    },
                    {
                      label: "Staff",
                      value: listing.staff,
                      icon: "fa-solid fa-users",
                    },
                    {
                      label: "Lease",
                      value: listing.lease,
                      icon: "fa-solid fa-file-contract",
                    },
                    {
                      label: "Business",
                      value: listing.business_established,
                      icon: "fa-solid fa-building",
                    },
                    {
                      label: "Training",
                      value: listing.training,
                      icon: "fa-solid fa-graduation-cap",
                    },
                    {
                      label: "Awards",
                      value: listing.awards,
                      icon: "fa-solid fa-trophy",
                    },
                    {
                      label: "Selling Reason",
                      value: listing.reason_for_sale,
                      icon: "fa-solid fa-info-circle",
                    },
                  ].map(
                    (section, index) =>
                      section.value && (
                        <div
                          key={index}
                          className={`card p-4 mb-3 ${styles.sectionCard}`}
                        >
                          <h3 className={styles.sectionTitle}>
                            <i className={`${section.icon} me-2`}></i>
                            {section.label}
                          </h3>
                          <p className={styles.sectionText}>{section.value}</p>
                        </div>
                      )
                  )}
                </>
              ) : (
                <Loading loadingText={"Loading Detail Page"} />
              )}
            </div>
            <div className="col-lg-4 col-md-12">
              <div className={`card p-4 mb-3 ${styles.chatCard}`}>
                <div className={styles.chatHeader}>
                  <i className="fa-solid fa-comments me-2"></i>
                  <h4 className="mb-0">Chat with Seller</h4>
                </div>
                <p className={styles.chatDescription}>
                  Have questions about this listing? Start a conversation with
                  the seller.
                </p>
                {!isAuthenticated ? (
                  <button
                    className={styles.chatButton}
                    onClick={() => router.push(`/login`)}
                  >
                    <i className="fa-solid fa-right-to-bracket me-2"></i>
                    Login to Chat
                  </button>
                ) : (
                  <button
                    className={styles.chatButton}
                    onClick={() =>
                      openChatWithSeller(listing.user_id, listing.project_id)
                    }
                  >
                    <i className="fa-solid fa-message me-2"></i>
                    Start Chat
                  </button>
                )}
              </div>
              <div className={`card p-4 ${styles.similarCard}`}>
                <h3 className={styles.similarTitle}>
                  <i className="fa-solid fa-list me-2"></i>
                  Similar Listings
                </h3>
                {similarLoading ? (
                  <Loading loadingText={"Loading..."} />
                ) : similarListing && similarListing.length === 0 ? (
                  <div className={styles.noSimilar}>
                    <i className="fa-solid fa-inbox mb-3"></i>
                    <p>No Similar Listings Found</p>
                  </div>
                ) : (
                  <div className={styles.similarList}>
                    {similarListing.map((item: any, index: number) => (
                      <div
                        key={item.id || index}
                        className={styles.similarItem}
                        onClick={() => redirectUser(item)}
                      >
                        <div className={styles.similarImageWrapper}>
                          <Image
                            className={styles.similarImage}
                            src={`https://dash.magnatehub.au/uploads/project/card/${item?.title_images}`}
                            alt="Project Image"
                            width={120}
                            height={100}
                            unoptimized
                      onError={(e) => {
                        e.currentTarget.src =
                          "assets/img/notfound/image_notfound.png";
                      }}
                          />
                        </div>
                        <div className={styles.similarContent}>
                          <h5 className={styles.similarName}>
                            {item.name && item.name.length > 20
                              ? item.name.slice(0, 20) + "..."
                              : item.name || "Untitled"}
                          </h5>
                          {item.date && (
                            <p className={styles.similarDate}>
                              <i className="fa-solid fa-calendar me-1"></i>
                              {item.date}
                            </p>
                          )}
                          {item.price && (
                            <p className={styles.similarPrice}>
                              <i className="fa-solid fa-dollar-sign me-1"></i>$
                              {item.price}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ListingDetail;
