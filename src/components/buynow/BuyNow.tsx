"use client";
import React, { useEffect, useState } from "react";
import pricing_data from "@/data/PricingData";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { apiRequest } from "@/api/axiosInstance";

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
  phone: yup
    .string()
    .required("Phone number is required")
    .matches(/^[0-9]+$/, "Phone number must be numeric"),
  message: yup.string().required("Message is required"),

  cardName: yup.string().required("Name on card is required"),
  cardNumber: yup
    .string()
    .required("Card number is required")
    .matches(/^[0-9]{16}$/, "Card number must be 16 digits"),
  cvc: yup
    .string()
    .required("CVC is required")
    .matches(/^[0-9]{3,4}$/, "CVC must be 3 or 4 digits"),
  expMonth: yup
    .string()
    .required("Expiration month is required")
    .matches(/^(0[1-9]|1[0-2])$/, "Invalid month"),
  expYear: yup
    .string()
    .required("Expiration year is required")
    .matches(/^20[2-9][0-9]$/, "Enter a valid year (e.g. 2025)"),
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
    if (data && data.slug) setItem(data);
    else setItem(null);
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
      toast.success("Message sent successfully!", { position: "top-center" });
      reset({ ...data, plan: selectedSlug });
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.", {
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePlanChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSlug = e.target.value;
    setSelectedSlug(newSlug);
  };

  if (!item) return <div>Loading...</div>;

  const truncatedText =
    item.desc.length > 100 ? item.desc.slice(0, 100) + "..." : item.desc;

  return (
    <div className="col-lg-12 row">
      <div className="col-lg-6 col-md-6 mx-2">
        <div className="card p-4 shadow-sm rounded-3">
          <h1>Package Selected</h1>
          <h4 className="mb-3">Here you can select the packages</h4>

          <form onSubmit={handleSubmit(onSubmit)} id="buy-now-form">
            <div className="column mb-4">
              <label>Plan</label>
              <select
                {...register("plan")}
                value={selectedSlug}
                onChange={handlePlanChange}
                className="form-control"
              >
                {pricing_data.map((plan) => (
                  <option key={plan.slug} value={plan.slug}>
                    {plan.title}
                  </option>
                ))}
              </select>
              <p className="form_error">{errors.plan?.message}</p>
            </div>

            <h3>Contact Details</h3>
            <div className="row">
              <div className="col-lg-6 mb-3">
                <input
                  className="input"
                  type="text"
                  {...register("name")}
                  placeholder="Name"
                />
                <p className="form_error">{errors.name?.message}</p>
              </div>

              <div className="col-lg-6 mb-3">
                <input
                  className="input"
                  type="email"
                  {...register("email")}
                  placeholder="E-mail"
                />
                <p className="form_error">{errors.email?.message}</p>
              </div>

              <div className="col-lg-12 mb-3">
                <input
                  className="input"
                  type="text"
                  {...register("phone")}
                  placeholder="Phone Number"
                />
                <p className="form_error">{errors.phone?.message}</p>
              </div>

              <div className="col-lg-12 mb-3">
                <textarea
                  className="textarea"
                  {...register("message")}
                  placeholder="Your Message"
                ></textarea>
                <p className="form_error">{errors.message?.message}</p>
              </div>
            </div>

            <h3 className="mt-4">Payment Details</h3>
            <div className="row">
              <div className="col-lg-12 mb-3">
                <input
                  className="input"
                  type="text"
                  {...register("cardName")}
                  placeholder="Name on Card"
                />
                <p className="form_error">{errors.cardName?.message}</p>
              </div>

              <div className="col-lg-12 mb-3">
                <input
                  className="input"
                  type="text"
                  {...register("cardNumber")}
                  placeholder="Card Number"
                />
                <p className="form_error">{errors.cardNumber?.message}</p>
              </div>

              <div className="col-lg-6 mb-3">
                <input
                  className="input"
                  type="text"
                  {...register("cvc")}
                  placeholder="CVC"
                />
                <p className="form_error">{errors.cvc?.message}</p>
              </div>

              <div className="col-lg-3 mb-3">
                <input
                  className="input"
                  type="text"
                  {...register("expMonth")}
                  placeholder="MM"
                />
                <p className="form_error">{errors.expMonth?.message}</p>
              </div>

              <div className="col-lg-3 mb-3">
                <input
                  className="input"
                  type="text"
                  {...register("expYear")}
                  placeholder="YYYY"
                />
                <p className="form_error">{errors.expYear?.message}</p>
              </div>
            </div>

            <button type="submit" className="tg-btn mt-3" disabled={loading}>
              {loading ? "Processing..." : "Submit Payment"}
            </button>
          </form>
        </div>
      </div>

      {/* Right column — Plan details */}
      <div className="col-lg-3 col-md-6">
        <div
          className="tg-pricing-wrap mb-30 wow fadeInUp"
          data-wow-delay=".3s"
          data-wow-duration=".9s"
          style={{ height: "129vh" }}
        >
          <div className="tg-pricing-head">
            <h4 className="tg-pricing-title mb-15">{item.title}</h4>
          </div>

          <div className="tg-pricing-price mb-25">
            <h2>
              <span>$</span>
              {item.price}
            </h2>
            <span className="dates">/month *</span>
          </div>

          <div className="tg-pricing-list">
            <p className="mb-25 pricing list-desc">
              {showFullText ? item.desc : truncatedText}
              {item.desc.length > 100 && (
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
  );
};

export default BuyNow;
