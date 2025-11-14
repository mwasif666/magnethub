"use client";
import React, { useEffect, useState } from "react";
import pricing_data from "@/data/PricingData";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { apiRequest } from "@/api/axiosInstance";
import styles from "./BuyNow.module.css";

interface BuyNowProps {
  slug: string;
}

interface PricingItem {
  title: string;
  price: number;
  slug?: string;
  desc: string;
  list: string[];
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
  cardName: string;
  cardNumber: string;
  cvc: string;
  expMonth: string;
  expYear: string;
  plan: string;
}

const schema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().required("Phone is required"),
  message: yup.string().required("Message is required"),
  cardName: yup.string().required("Name on card is required"),
  cardNumber: yup
    .string()
    .required("Card number is required")
    .matches(/^[0-9]{16}$/, "Card must be 16 digits"),
  cvc: yup
    .string()
    .required("CVC is required")
    .matches(/^[0-9]{3,4}$/, "Invalid CVC"),
  expMonth: yup
    .string()
    .required("MM is required")
    .matches(/^(0[1-9]|1[0-2])$/, "Invalid month"),
  expYear: yup
    .string()
    .required("Year required")
    .matches(/^20[2-9][0-9]$/, "Invalid year"),
  plan: yup.string().required("Please select a plan"),
});

const BuyNow: React.FC<BuyNowProps> = ({ slug }) => {
  const [selectedSlug, setSelectedSlug] = useState(slug);
  const [item, setItem] = useState<PricingItem | null>(null);
  const [showFullText, setShowFullText] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: { plan: slug },
  });

  const getPackageDetails = (slug: string) => {
    const data = pricing_data.find((plan) => plan.slug === slug);
    setItem(data || null);
  };

  useEffect(() => {
    getPackageDetails(selectedSlug);
  }, [selectedSlug]);

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      await apiRequest({
        url: "/SaveContactForm",
        method: "POST",
        data,
      });
      toast.success("Message sent successfully!");
      reset({ ...data, plan: selectedSlug });
    } catch (error) {
      toast.error("Error submitting form");
    } finally {
      setLoading(false);
    }
  };

  // FIXED — truncation
  const truncatedText =
    item?.desc && item.desc.length > 120
      ? item.desc.slice(0, 120) + "..."
      : item?.desc;

  if (!item) return <div className="p-5 text-center">Loading...</div>;

  return (
    <div className={`container ${styles.buyNowContainer}`}>
      <div className="row justify-content-center">
        {/* FORM SECTION */}
        <div className="col-lg-7 col-md-8 mb-4">
          <div className={`card shadow-sm p-4 ${styles.formCard}`}>
            <h2 className="mb-3 fw-bold">Buy Package</h2>

            <form onSubmit={handleSubmit(onSubmit)}>
              {/* PLAN SELECT */}
              <div className="mb-4">
                <label className="form-label">Plan</label>
                <select
                  {...register("plan")}
                  value={selectedSlug}
                  onChange={(e) => setSelectedSlug(e.target.value)}
                  className="form-control"
                >
                  {pricing_data.map((p) => (
                    <option key={p.slug} value={p.slug}>
                      {p.title}
                    </option>
                  ))}
                </select>
                <p className={styles.error}>{errors.plan?.message}</p>
              </div>

              <h4 className="fw-bold mb-3">Contact Details</h4>

              <div className="row">
                <div className="col-lg-6 mb-3">
                  <input
                    className="form-control"
                    {...register("name")}
                    placeholder="Name"
                  />
                  <p className={styles.error}>{errors.name?.message}</p>
                </div>

                <div className="col-lg-6 mb-3">
                  <input
                    className="form-control"
                    {...register("email")}
                    placeholder="Email"
                  />
                  <p className={styles.error}>{errors.email?.message}</p>
                </div>

                <div className="col-lg-12 mb-3">
                  <input
                    className="form-control"
                    {...register("phone")}
                    placeholder="Phone"
                  />
                  <p className={styles.error}>{errors.phone?.message}</p>
                </div>

                <div className="col-lg-12 mb-3">
                  <textarea
                    className="form-control"
                    {...register("message")}
                    placeholder="Message"
                  ></textarea>
                  <p className={styles.error}>{errors.message?.message}</p>
                </div>
              </div>

              <h4 className="fw-bold mb-3">Payment Details</h4>

              <div className="row">
                <div className="col-lg-12 mb-3">
                  <input
                    className="form-control"
                    {...register("cardName")}
                    placeholder="Name on Card"
                  />
                  <p className={styles.error}>{errors.cardName?.message}</p>
                </div>

                <div className="col-lg-12 mb-3">
                  <input
                    className="form-control"
                    {...register("cardNumber")}
                    placeholder="Card Number"
                  />
                  <p className={styles.error}>{errors.cardNumber?.message}</p>
                </div>

                <div className="col-lg-4 mb-3">
                  <input
                    className="form-control"
                    {...register("cvc")}
                    placeholder="CVC"
                  />
                  <p className={styles.error}>{errors.cvc?.message}</p>
                </div>

                <div className="col-lg-4 mb-3">
                  <input
                    className="form-control"
                    {...register("expMonth")}
                    placeholder="MM"
                  />
                  <p className={styles.error}>{errors.expMonth?.message}</p>
                </div>

                <div className="col-lg-4 mb-3">
                  <input
                    className="form-control"
                    {...register("expYear")}
                    placeholder="YYYY"
                  />
                  <p className={styles.error}>{errors.expYear?.message}</p>
                </div>
              </div>

              <button
                className={`btn ${styles.submitBtn} mt-3`}
                disabled={loading}
              >
                {loading ? "Processing..." : "Submit Payment"}
              </button>
            </form>
          </div>
        </div>

        {/* PRICING CARD — SAME DESIGN FIXED */}
        <div className="col-lg-5 col-md-6">
          <div
            className="tg-pricing-wrap mb-30 wow fadeInUp"
            data-wow-delay=".3s"
            data-wow-duration=".9s"
          >
            <div className="tg-pricing-head">
              <h4 className="tg-pricing-title mb-15">{item.title}</h4>
            </div>

            <div className="tg-pricing-price mb-25">
              <h2>
                <span>$</span> {item.price}
              </h2>
              <span className="dates">/month *</span>
            </div>

            <div className="tg-pricing-list">
              <p className="mb-25 pricing list-desc">
                {showFullText ? item.desc : truncatedText}

                {item.desc.length > 120 && (
                  <button
                    onClick={() => setShowFullText(!showFullText)}
                    className="see-more-btn ms-2 border-0 bg-transparent p-0"
                  >
                    {showFullText ? "See Less" : "See More"}
                  </button>
                )}
              </p>

              <ul>
                {item.list.map((list, i) => (
                  <li key={i}>
                    <span className="icon">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M17 8.26858V9.00458C16.999 10.7297 16.4404 12.4083 15.4075 13.79C14.3745 15.1718 12.9226 16.1826 11.2683 16.6717C9.61394 17.1608 7.8458 17.1021 6.22757 16.5042C4.60934 15.9064 3.22772 14.8015 2.28877 13.3542C1.34981 11.907 0.903833 10.195 1.01734 8.47363C1.13085 6.75223 1.79777 5.11364 2.91862 3.80224C4.03948 2.49083 5.55423 1.57688 7.23695 1.1967C8.91967 0.816507 10.6802 0.990449 12.256 1.69258M17 2.60458L9 10.6126L6.6 8.21258"
                          stroke="#560CE3"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <span>{list}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyNow;
