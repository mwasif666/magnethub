"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/api/axiosInstance";
import * as yup from "yup";

interface EmailData {
  email: string;
}

const schema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
});

const ForgotPasswordFindForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EmailData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: EmailData) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("email", data.email);
      const response = await apiRequest({
        url: "Raising/Find",
        method: "POST",
        data: formData,
      });
     
      if(!response?.error){
        toast.success("Token Send Successfully", { position: "top-center" });
        localStorage.removeItem("code");
        localStorage.setItem("code", response.code || "");
        reset();
        router.push("/verify-reset-code");
      }else{
        toast.error(response.message || "Not able to send token")

      }
    } catch (error: any) {
      toast.error('Some thing went wrong', { position: "top-center" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row text-white">
          <div className="col-lg-12 mb-25">
            <input
              className="input"
              type="text"
              placeholder="E-mail"
              {...register("email")}
            />
            <p className="form_error">{errors.email?.message}</p>
          </div>
          <div className="col-lg-12 mb-20 text-end">
            <Link
              href="/login"
              className="text-white"
              style={{ textDecoration: "underline", fontSize: "0.9rem" }}
            >
              Login?
            </Link>
          </div>

          <div className="col-lg-12">
            <button type="submit" className="tg-btn w-100" disabled={loading}>
              {loading ? "Sending Otp..." : "Send Otp"}
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

export default ForgotPasswordFindForm;
