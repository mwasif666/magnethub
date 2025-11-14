import { apiRequest } from "@/api/axiosInstance";
import Wishlist from "@/svg/home-one/Wishlist";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import styles from "./ListingDetail.module.css";

interface ListingDetailProps {
  url: string;
  id: string;
}

const ListingDetail: React.FC<ListingDetailProps> = ({ url, id }) => {
  const [listing, setListing] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const getProductDetails = async () => {
    try {
      setLoading(true);
      const response = await apiRequest({
        url: `GetAllProjects/${id}`,
        method: "GET",
      });
      setListing(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProductDetails();
  }, []);

  return (
    <div className={`container ${styles.listingContainer}`}>
      {/* HEADER */}
      <div className={`card p-4 mb-3 ${styles.headerCard}`}>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h2 className={styles.title}>Nightclub Bar</h2>
            <h5 className={styles.host}>
              <span>Hosted By:</span> Waleed Ghori
            </h5>
          </div>

          <div className="text-end cursor-pointer">
            <Wishlist />
            <p className="mt-2 mb-0 fw-semibold">Add To Favorite</p>
          </div>
        </div>
      </div>

      {/* IMAGE */}
      <div className="card p-3 mb-3">
        <Image
          className={`w-100 rounded ${styles.listingImage}`}
          src={`http://magnatehub.au/uploads/project/card`}
          alt="Project Image"
          width={500}
          height={500}
          unoptimized
          onError={(e) => {
            e.currentTarget.src =
              "http://magnatehub.au/uploads/project/card/67-1759918312-87531328.jpg";
          }}
        />
      </div>

      {/* INFO GRID */}
      <div className={`card p-4 mb-4 ${styles.infoCard}`}>
        <h3 className="mb-3">Business Overview</h3>

        <div className="row g-4">
          {[
            { label: "Location", value: "Victoria - VIC" },
            { label: "Category", value: "Age Care Retirement" },
            { label: "Price", value: "45000" },
            { label: "Yearly Trading", value: "12" },
            { label: "Earning Type", value: "EBIDA" },
            { label: "Stock Level", value: "20000" },
          ].map((item, i) => (
            <div className="col-6 col-md-4" key={i}>
              <p className={styles.infoLabel}>{item.label}</p>
              <h6 className={styles.infoValue}>{item.value}</h6>
            </div>
          ))}
        </div>
      </div>

      {/* SECTIONS */}
      {[
        "Summary",
        "Skills",
        "Potential",
        "Hours",
        "Staff",
        "Lease",
        "Business",
        "Training",
        "Awards",
        "Selling Reason",
      ].map((section, index) => (
        <div key={index} className={`card p-4 mb-3 ${styles.sectionCard}`}>
          <h3 className={styles.sectionTitle}>{section}</h3>
          <p className={styles.sectionText}>
            8:15 - 8:45pm - dinner buffet service 8:50 - 8:55pm - Sahu parents
            speech 9:00 - 9:05 - Ranasinghe parents speech 9:10 - 9:20 - Bride +
            groom speech 9:20 - 9:30 - cake + first dance 9:30 - 10:00pm - dance
            floor open 10:00 - 10:15 - guests to move into after party 10:15
            onwards - dance floor open
          </p>
        </div>
      ))}
    </div>
  );
};

export default ListingDetail;
