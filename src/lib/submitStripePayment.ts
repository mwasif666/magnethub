"use client";

import { apiRequest } from "@/api/axiosInstance";

interface StripePaymentPayload {
  user_id: number;
  plan_id: number | string;
  stripe_token: string;
  billing_first_name: string;
  billing_last_name: string;
  billing_business_name?: string;
  billing_abn?: string;
  billing_email: string;
  billing_phone?: string;
  billing_address: string;
}

interface StripePaymentResponse {
  success: boolean;
  redirect?: string;
  chargeId?: string;
  amount?: number;
  currency?: string;
  message?: string;
}

export const submitStripePayment = async ({
  user_id,
  plan_id,
  stripe_token,
  billing_first_name,
  billing_last_name,
  billing_business_name,
  billing_abn,
  billing_email,
  billing_phone,
  billing_address,
}: StripePaymentPayload): Promise<StripePaymentResponse> => {
  const payload = await apiRequest({
    url: "plans/subscribe",
    method: "POST",
    data: {
      user_id,
      plan_id,
      stripe_token,
      billing_first_name,
      billing_last_name,
      billing_business_name: billing_business_name || "",
      billing_abn: billing_abn || "",
      billing_email,
      billing_phone: billing_phone || "",
      billing_address,
    },
  });

  if ((payload as any)?.error) {
    throw new Error(payload?.message || "Stripe payment failed.");
  }

  return payload;
};
