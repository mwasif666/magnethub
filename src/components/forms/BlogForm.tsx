"use client";

import { useAuth } from "@/context/AuthContext";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { useState } from "react";
import { apiRequest } from "@/api/axiosInstance";

interface BlogCommentForm {
  comment: string;
  name: string;
  email: string;
  phone?: string; 
}

const schema: yup.ObjectSchema<BlogCommentForm> = yup.object({
  comment: yup.string().required("Comment is required"),
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup
    .string()
    .matches(/^[0-9]*$/, "Phone must be numeric")
    .optional(),
});

const BlogForm = ({ blogId }: { blogId: number }) => {
  const { userId } = useAuth();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BlogCommentForm>({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<BlogCommentForm> = async (data) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("blogId", blogId.toString());
      formData.append("userId", userId?.toString() ?? "0");
      formData.append("comment", data.comment);
      formData.append("name", data.name);
      formData.append("email", data.email);
      if (data.phone) {
        formData.append("phone", data.phone);
      }

      await apiRequest({
        url: "/GetAllBlogs/comment",
        method: "POST",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Comment submitted!", { position: "top-center" });

      reset();
    } catch (error) {
      console.error(error);
      toast.error("Error submitting comment", { position: "top-center" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="row gx-15">
        <div className="col-lg-12">
          <textarea
            className="textarea mb-5"
            placeholder="Comment"
            {...register("comment")}
          ></textarea>
          <p className="form_error">{errors.comment?.message}</p>
        </div>
        <div className="col-lg-4 mb-15">
          <input
            className="input"
            type="text"
            placeholder="Name"
            {...register("name")}
          />
          <p className="form_error">{errors.name?.message}</p>
        </div>
        <div className="col-lg-4 mb-15">
          <input
            className="input"
            type="email"
            placeholder="Email"
            {...register("email")}
          />
          <p className="form_error">{errors.email?.message}</p>
        </div>
        <div className="col-lg-4 mb-15">
          <input
            className="input"
            type="text"
            placeholder="Phone (optional)"
            {...register("phone")}
          />
          <p className="form_error">{errors.phone?.message}</p>
        </div>
        <div className="col-lg-12">
          <button type="submit" className="tg-btn tg-btn-switch-animation" disabled={loading}>
            <span className="d-flex align-items-center justify-content-center">
              <span className="btn-text">{loading ? "Submitting..." : "Submit Comment"}</span>
            </span>
          </button>
        </div>
      </div>

      <style jsx>{`
        .form_error {
          color: red !important;
          font-size: 11px;
          margin: 4px 0 0;
        }
      `}</style>
    </form>
  );
};

export default BlogForm;
