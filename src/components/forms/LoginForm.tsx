"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const { loginUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
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

      const response = await loginUser(formData);

      if (!response) {
        toast.error("No response from server.", { position: "top-center" });
        return;
      }

      if (response?.error) {
        if (response.message === "Account Not Verified") {
          toast.error(
            "Account not verified. Redirecting to OTP verification.",
            { position: "top-center" }
          );
          localStorage.setItem("code", response.code || "");
          router.push("/verifiy-otp");
          return;
        }
        toast.error(response?.message || "Login failed.", {
          position: "top-center",
        });
        return;
      }

      toast.success("Login successful!", { position: "top-center" });
      localStorage.removeItem("code");
      reset();
      if ((response as any)?.link) {
        window.open(
          "https://dash.magnatehub.au/dashboard/professionals",
          "_blank"
        );
        // router.push("https://dash.magnatehub.au/dashboard/professionals");
        // window.open((response as any).link, "_blank");
      }
      router.push("/");
    } catch (error: any) {
      console.error("Login error:", error);
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Invalid email or password.";
      toast.error(message, { position: "top-center" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="mh-auth-form">
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

          <div className="col-lg-12 mb-25">
            <input
              className="input"
              type="password"
              placeholder="Password"
              {...register("password")}
            />
            <p className="form_error">{errors.password?.message}</p>
          </div>

          <div className="col-lg-12 mb-20 text-end">
            <Link
              href="/forgot-password"
              className="text-white"
              style={{ textDecoration: "underline", fontSize: "0.9rem" }}
            >
              Forgot Password?
            </Link>
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
                <label htmlFor="rememberMe" className="tg-label text-white">
                  Remember me
                </label>
              </div>
              <div className="tg-login-navigate mb-25 text-white">
                <Link
                  href="/register"
                  className="text-white"
                  style={{
                    textDecoration: "none",
                  }}
                >
                  Register Now
                </Link>
              </div>
            </div>

            <button type="submit" className="tg-btn w-100" disabled={loading}>
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </div>
        </div>
      </form>

      <style jsx>{`
        .input {
          box-sizing: border-box;
          width: 100%;
          height: 52px;
          min-height: 52px;
          padding: 0 16px;
          border: 1px solid var(--mh-auth-field-border) !important;
          border-radius: 14px;
          background: var(--mh-auth-field-bg) !important;
          box-shadow: var(--mh-auth-field-shadow);
          color: #fff !important;
          font-size: 14px;
          line-height: 1.2;
        }

        .input::placeholder {
          color: rgba(255, 255, 255, 0.68);
        }

        .input:focus {
          border-color: rgba(255, 255, 255, 0.55) !important;
          box-shadow: var(--mh-auth-field-shadow), var(--mh-auth-field-focus);
        }

        .input:-webkit-autofill,
        .input:-webkit-autofill:hover,
        .input:-webkit-autofill:focus {
          -webkit-text-fill-color: #fff;
          caret-color: #fff;
          box-shadow:
            0 0 0 1000px rgba(255, 255, 255, 0.08) inset,
            var(--mh-auth-field-shadow);
          transition: background-color 9999s ease-out 0s;
        }

        .mh-auth-form :global(.tg-checkbox) {
          accent-color: #7d12ff;
        }

        .mh-auth-form :global(.tg-label),
        .mh-auth-form :global(.tg-login-navigate a),
        .mh-auth-form :global(a) {
          color: rgba(255, 255, 255, 0.92) !important;
          font-size: 12px !important;
          font-weight: 500;
        }

        .mh-auth-form :global(.tg-login-navigate a:hover),
        .mh-auth-form :global(.tg-login-navigate a:focus),
        .mh-auth-form :global(.tg-login-navigate a:active),
        .mh-auth-form :global(a:hover),
        .mh-auth-form :global(a:focus),
        .mh-auth-form :global(a:active) {
          color: rgba(255, 255, 255, 0.92) !important;
          cursor: pointer;
        }

        .mh-auth-form :global(.tg-btn) {
          min-height: 52px;
          border: 0;
          border-radius: 14px;
          background: var(--mh-auth-button-bg);
          color: #fff;
          font-size: 14px;
          font-weight: 700;
          box-shadow: 0 16px 36px rgba(90, 0, 255, 0.28);
        }

        .mh-auth-form :global(.tg-btn:disabled) {
          opacity: 0.72;
        }

        .form_error {
          color: #ff9da8 !important;
          font-size: 11px;
          margin: 4px;
        }
      `}</style>
    </>
  );
};

export default LoginForm;
