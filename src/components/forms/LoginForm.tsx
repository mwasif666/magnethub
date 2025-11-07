"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { apiRequest } from "@/api/axiosInstance";

interface LoginData {
  email: string;
  password: string;
  rememberMe: boolean;
}

const schema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
  rememberMe: yup.boolean().default(false),
});


const LoginForm = () => {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: LoginData) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("rememberMe", data.rememberMe ? "true" : "false");

      const response = await apiRequest({
        url: "/Raising/Login",
        method: "POST",
        data: formData,
      });
      if(response?.error){
         toast.error(response?.message, { position: "top-center" });
         return;
      }
      
      localStorage.setItem("token", response.token);
      toast.success("Login successful!", { position: "top-center" });

    } catch (error: any) {
      console.error("Login error:", error);
      const message =
        error?.data?.message ||
        error?.message ||
        "Invalid email or password.";
      toast.error(message, { position: "top-center" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row">
          <div className="col-lg-12 mb-25">
            <input
              className="input"
              type="text"
              placeholder="E-mail"
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

          <div className="col-lg-12">
            <div className="d-flex align-items-center justify-content-between">
              <div className="review-checkbox d-flex align-items-center mb-25">
                <input
                  className="tg-checkbox"
                  type="checkbox"
                  id="rememberMe"
                  {...register("rememberMe")}
                />
                <label htmlFor="rememberMe" className="tg-label">
                  Remember me
                </label>
              </div>
              <div className="tg-login-navigate mb-25">
                <Link href="/register">Register Now</Link>
              </div>
            </div>

            <button type="submit" className="tg-btn w-100" disabled={loading}>
              {loading ? "Signing In..." : "Sign In"}
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

export default LoginForm;
