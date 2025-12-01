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

const FeatureArea = ({
  listing,
  pagination,
  onPageChange,
  activePage,
}: FeatureAreaProps) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { products, setProducts } = UseProducts();
  const [isListView, setIsListView] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
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
    [dispatch]
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

  const redirectUser = (item: any) => {
    router.push(`/detail?url=${item.url}&id=${item.project_id}`);
  };

  const isInWishlist = (id: number) => {
    return wishlist.some((item: any) => item.id === id);
  };

  return (
    <div className="tg-listing-grid-area mb-85">
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
                                onClick={() => handleAddToWishlist(item)}
                                style={{ cursor: "pointer" }}
                              >
                                <Wishlist
                                  filled={isInWishlist(item.id)}
                                  style={{
                                    color: isInWishlist(item.id)
                                      ? "red"
                                      : "#444",
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
                                href={`/detail?url=${item.url}&id=${item.project_id}`}
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
      </div>
    </div>
  );
};

export default FeatureArea;
