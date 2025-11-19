"use client";
import React, { useEffect, useState } from "react";
import { apiRequest } from "@/api/axiosInstance";
import { useDispatch } from "react-redux";
import { addToWishlist } from "@/redux/features/wishlistSlice";
import { ToastContainer } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import Wishlist from "@/svg/home-one/Wishlist";
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
  const { role, isAuthenticated } = useAuth();
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
    if(Image){
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
                          <span>Hosted By:</span>{" "}
                          {listing.user_first_name +
                            " " +
                            listing.user_last_name || "N/A"}
                        </h5>
                      </div>

                      <div
                        className="text-end cursor-pointer"
                        onClick={() => handleAddToWishlist(listing)}
                      >
                        <a style={{ cursor: "pointer" }}>
                          <Wishlist />
                        </a>
                        <p className="mt-2 mb-0 fw-semibold">Add To Favorite</p>
                      </div>
                    </div>
                  </div>

                  <div className={`card p-3 mb-3 ${styles.hero_img}`}>
                    <Image
                      className={`w-100 rounded ${styles.listingImage}`}
                      src={`http://magnatehub.au/uploads/project/card/${listing?.card}`}
                      alt="Project Image"
                      width={500}
                      height={500}
                      unoptimized
                      onError={(e) => {
                        e.currentTarget.src =
                          "http://magnatehub.au/uploads/project/card/67-1759918312-87531328.jpg";
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
                              src={`http://magnatehub.au/uploads/project/card/${img}`}
                              alt="Sub Image"
                              width={150}
                              height={120}
                              className="rounded"
                              unoptimized
                              style={{ objectFit: "cover" }}
                              onError={(e) => {
                                e.currentTarget.src =
                                  "http://magnatehub.au/uploads/project/card/67-1759918312-87531328.jpg";
                              }}
                            />
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  <div className={`card p-4 mb-4 ${styles.infoCard}`}>
                    <h3 className="mb-3">Business Overview</h3>

                    <div className="row g-4">
                      {[
                        { label: "Location", value: listing?.location_name },
                        { label: "Category", value: listing?.category_name },
                        { label: "Price", value: listing?.price },
                        { label: "Yearly Trading", value: listing?.trading },
                        { label: "Earning Type", value: listing?.earning_type },
                        { label: "Stock Level", value: listing?.stock_level },
                      ].map((item, i) => (
                        <div className="col-6 col-md-4" key={i}>
                          <p className={styles.infoLabel}>{item.label}</p>
                          <h6 className={styles.infoValue}>{item.value}</h6>
                        </div>
                      ))}
                    </div>
                  </div>

                  {[
                    { label: "Summary", value: listing.summary },
                    { label: "Skills", value: listing.skills },
                    { label: "Potential", value: listing.potential },
                    { label: "Hours", value: listing.hours },
                    { label: "Staff", value: listing.staff },
                    { label: "Lease", value: listing.lease },
                    { label: "Business", value: listing.business_established },
                    { label: "Training", value: listing.training },
                    { label: "Awards", value: listing.awards },
                    { label: "Selling Reason", value: listing.reason_for_sale },
                  ].map((section, index) => (
                    <div
                      key={index}
                      className={`card p-4 mb-3 ${styles.sectionCard}`}
                    >
                      <h3 className={styles.sectionTitle}>{section.label}</h3>
                      <p className={styles.sectionText}>{section.value}</p>
                    </div>
                  ))}
                </>
              ) : (
                <Loading loadingText={"Loading Detail Page"} />
              )}
            </div>
            <div className="col-lg-4 col-md-12">
              <div className="card p-3 mb-3">
                <h4>Chat</h4>
                <div>Chat component goes here...</div>
              </div>
              <div className="card p-3">
                <h2>Similar Listings</h2>
                {similarLoading ? (
                  <Loading loadingText={"Loading..."} />
                ) : similarListing && similarListing.length === 0 ? (
                  <div>
                    <h2>No Similar Product found</h2>
                  </div>
                ) : (
                  similarListing.map((item: any, index:number) => (
                    <div key={item.id || index} className={`${styles.similar_img}`}>
                      <Image
                        className={`w-100 rounded ${styles.listingImage}`}
                        src={`http://magnatehub.au/uploads/project/card/${item?.title_images}`}
                        alt="Project Image"
                        width={100}
                        height={200}
                        unoptimized
                        onError={(e) => {
                          e.currentTarget.src =
                            "http://magnatehub.au/uploads/project/card/67-1759918312-87531328.jpg";
                        }}
                      />
                      <div>
                        <h4 onClick={() => redirectUser(item)}>
                          {item.name.length > 15
                            ? item.name.slice(0, 15) + "..."
                            : item.name}
                        </h4>
                        <h6>{item.date}</h6>
                      </div>
                    </div>
                  ))
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
