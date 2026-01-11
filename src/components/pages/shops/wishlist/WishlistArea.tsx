/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Link from "next/link";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import {
  getWhistlistFromLocalStorage,
  removeFromWishlist,
} from "@/redux/features/wishlistSlice";
import { useEffect } from "react";
import { RootState } from "@/redux/store";
import { useCategoryNavigation } from "@/hooks/UseCategoryNavigation";

const WishlistArea = () => {
  const dispatch = useDispatch();
  const wishlist = useSelector(
    (state: RootState) => state.wishlist.wishlist
  );
  const { redirectUser } = useCategoryNavigation();

  useEffect(() => {
    dispatch(getWhistlistFromLocalStorage());
  }, [dispatch]);


  const redirectToDetail = (item: any) => {
    redirectUser(item)
  } 

  return (
    <>
      <div className="cart-area pb-100 pt-105">
        <div className="container">
          <div className="row">
            <div className="col-12">

              {wishlist.length === 0 ? (
                <div className="empty">
                  <h4>Your Wishlist is Empty</h4>
                  <p>Save your favorite listings to see them here.</p>
                  <Link href="/listings" className="tg-btn">
                    Browse Listings
                  </Link>
                </div>
              ) : (
                <div className="wishlist-card">
                  <table className="table wishlist-table">
                    <thead>
                      <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Location</th>
                        <th className="right">Price</th>
                        <th className="center">Remove</th>
                      </tr>
                    </thead>

                    <tbody>
                      {wishlist.map((item, i) => (
                        <tr key={item.id ?? i} onClick={() => redirectToDetail(item)} style={{cursor:'pointer'}}>
                          <td>
                            <Image
                              src={`https://dash.magnatehub.au/uploads/project/card/${item.card}`}
                              alt={item?.name || "Project image"}
                              width={70}
                              height={70}
                              className="thumb"
                              unoptimized
                              onError={(e) => {
                                e.currentTarget.src =
                                  "/assets/img/notfound/image_notfound.png";
                              }}
                            />
                          </td>

                          <td className="name">{item.name}</td>

                          <td>
                            <span className="badge">
                              {item.location_name ?? '-'}
                            </span>
                          </td>

                          <td className="price">${item.price}.00</td>

                          <td className="center">
                            <button
                              className="remove"
                              onClick={() => dispatch(removeFromWishlist(item))}
                            >
                              ✕
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .wishlist-card {
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.05);
          overflow: hidden;
        }

        .wishlist-table {
          width: 100%;
          margin-bottom: 0;
        }

        .wishlist-table thead th {
          background: #f8f9fa;
          padding: 16px;
          font-weight: 600;
          border-bottom: none;
        }

        .wishlist-table tbody tr {
          transition: background 0.2s ease;
        }

        .wishlist-table tbody tr:hover {
          background: #fafafa;
        }

        .wishlist-table td {
          padding: 14px 16px;
          vertical-align: middle;
        }

        .thumb {
          border-radius: 8px;
          object-fit: cover;
        }

        .name {
          font-weight: 600;
          color: #222;
          text-decoration: underline;
        }

        .badge {
          background: #eef2ff;
          color: #3730a3;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 13px;
        }

        .price {
          text-align: right;
          font-weight: 600;
          color: #2563eb;
        }

        .right {
          text-align: right;
        }

        .center {
          text-align: center;
        }

        .remove {
          border: none;
          background: transparent;
          font-size: 18px;
          cursor: pointer;
          color: #dc2626;
          transition: transform 0.2s ease, color 0.2s ease;
        }

        .remove:hover {
          transform: scale(1.2);
          color: #991b1b;
        }

        .empty {
          text-align: center;
          padding: 60px 20px;
        }

        .empty h4 {
          font-weight: 600;
          margin-bottom: 10px;
        }

        .empty p {
          color: #6b7280;
          margin-bottom: 20px;
        }
      `}</style>
    </>
  );
};

export default WishlistArea;
