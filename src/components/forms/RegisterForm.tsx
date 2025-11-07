"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { apiRequest } from "@/api/axiosInstance";

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const schema = yup
  .object({
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup
      .string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: yup
      .string()
      .required("Please confirm your password")
      .oneOf([yup.ref("password")], "Passwords must match"),
  })
  .required();

const RegisterForm = () => {
  const [activeTab, setActiveTab] = useState(1);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: RegisterData) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("first_name", data.firstName);
      formData.append("last_name", data.lastName);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("password_confirmation", data.confirmPassword);
      formData.append("type", activeTab.toString());

      await apiRequest({
        url: "/RegisterNewUser",
        method: "POST",
        data: formData,
      });

      toast.success("Registered successfully!", { position: "top-center" });
      reset();
    } catch (error: any) {
      console.error("Registration error:", error);
      const message =
        error?.data?.message ||
        error?.message ||
        "Something went wrong. Please try again.";
      toast.error(message, { position: "top-center" });
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 1, label: "Seller" },
    { id: 2, label: "Buyer" },
    { id: 3, label: "Capital Raiser" },
    { id: 4, label: "Brokers + Franchisers" },
  ];

  return (
    <>
      <div className="d-flex gap-2 justify-content-center mb-4 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="tab-btn"
            style={{
              padding: "10px 18px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              background:
                activeTab === tab.id
                  ? "linear-gradient(90deg,#6A14DA,#316FF6)"
                  : "#F1F1F1",
              color: activeTab === tab.id ? "#fff" : "#333",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row">
          <div className="col-lg-6 mb-25">
            <input
              className="input"
              type="text"
              placeholder="First Name"
              {...register("firstName")}
            />
            <p className="form_error">{errors.firstName?.message}</p>
          </div>

          <div className="col-lg-6 mb-25">
            <input
              className="input"
              type="text"
              placeholder="Last Name"
              {...register("lastName")}
            />
            <p className="form_error">{errors.lastName?.message}</p>
          </div>

          <div className="col-lg-12 mb-25">
            <input
              className="input"
              type="email"
              placeholder="Example@gmail.com"
              {...register("email")}
            />
            <p className="form_error">{errors.email?.message}</p>
          </div>

          <div className="col-lg-12 mb-25">
            <input
              className="input"
              type="password"
              placeholder="Password"
              {...register("password")}
            />
            <p className="form_error">{errors.password?.message}</p>
          </div>

          <div className="col-lg-12 mb-25">
            <input
              className="input"
              type="password"
              placeholder="Re-type Password"
              {...register("confirmPassword")}
            />
            <p className="form_error">{errors.confirmPassword?.message}</p>
          </div>

          <div className="col-lg-12">
            <div className="d-flex align-items-center justify-content-between">
              <div className="review-checkbox d-flex align-items-center mb-25">
                <label htmlFor="australia" className="tg-label">
                  Already Have An Account?
                </label>
              </div>
              <div className="tg-login-navigate mb-25">
                <Link href="/login">Log In</Link>
              </div>
            </div>

            <button type="submit" className="tg-btn w-100" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </button>
          </div>
        </div>
      </form>

      <style jsx>{`
        .form_error {
          color: red !important;
          font-size: 11px;
          margin: 4px;
        }
      `}</style>
    </>
  );
};

export default RegisterForm;
