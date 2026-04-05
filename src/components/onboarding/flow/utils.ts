"use client";

import {
  getOnboardingRole,
  onboardingRoleConfigs,
  type OnboardingQuestion,
  type OnboardingRoleId,
} from "@/data/OnboardingQuestions";
import pricing_data from "@/data/PricingData";
import type {
  PaymentState,
  PricingItem,
  QuestionAnswerState,
  SignupState,
  StepContent,
  StepId,
} from "./types";

export const STEP_CONTENT: Record<StepId, StepContent> = {
  role: {
    eyebrow: "Step 1 of 6",
    title: "Select Role",
    description:
      "Choose the role that best describes how you will use Magnate Hub. This helps us customize your experience from the start.",
  },
  signup: {
    eyebrow: "Step 2 of 6",
    title: "Create Your Account",
    description:
      "Create your Magnate Hub account by entering your details. We'll email you a verification code before your account is created.",
  },
  otp: {
    eyebrow: "Step 3 of 6",
    title: "Verify Your Email",
    description:
      "Enter the verification code sent to your email. Once it's confirmed, we'll create your signup lead and unlock plan selection.",
  },
  plan: {
    eyebrow: "Step 4 of 6",
    title: "Select a Plan",
    description:
      "Choose the plan that best fits your needs. You can review features and select the option that works best for you.",
  },
  checkout: {
    eyebrow: "Step 5 of 6",
    title: "Checkout",
    description:
      "Review your selected plan and complete the payment if required. Once finished, your account will be ready for setup.",
  },
  questions: {
    eyebrow: "Step 6 of 6",
    title: "Personalize Your Dashboard",
    description:
      "Answer a few quick questions so we can tailor your dashboard and features to match your goals.",
  },
};

export const DASHBOARD_URL =
  "https://dash.magnatehub.au/dashboard/professionals";
export const STRIPE_TEST_PUBLISHABLE_KEY =
  "pk_test_51MNU17FLKdDrx0HlvOHo2FL7A2WgPTHhoF39uLjJ85HE9MzIcdfVg7538L663FmEPKf2zHRE344l4cUhekQS8Il700Ai0b51y2";
export const OTP_LENGTH = 6;

export const initialSignupState: SignupState = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export const initialPaymentState: PaymentState = {
  name: "",
  email: "",
  phone: "",
  message: "",
  cardName: "",
  cardNumber: "",
  cvc: "",
  expMonth: "",
  expYear: "",
};

export const isValidRoleId = (
  value?: string | null
): value is OnboardingRoleId =>
  onboardingRoleConfigs.some((role) => role.id === value);

export const getDefaultPlanForRole = (roleId?: OnboardingRoleId | null) =>
  getOnboardingRole(roleId)?.recommendedPlanSlug ?? "free_plan";

export const isBuyerRole = (roleId?: OnboardingRoleId | null) =>
  roleId === "buyer";

export const getPlanBySlug = (slug?: string | null): PricingItem | undefined =>
  (pricing_data as PricingItem[]).find((item) => item.slug === slug);

export const getApiErrorMessage = (error: any, fallback: string) =>
  error?.response?.data?.message ||
  error?.data?.message ||
  error?.message ||
  fallback;

export const formatCardNumber = (value: string) =>
  value
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();

export const sanitizeDigits = (value: string, maxLength: number) =>
  value.replace(/\D/g, "").slice(0, maxLength);

export const getStripeExpiryYear = (expYear: string) =>
  expYear.length === 2 ? `20${expYear}` : expYear;

export const extractQuestionOptions = (rawQuestion: any): string[] => {
  const source =
    rawQuestion?.options ??
    rawQuestion?.answer_options ??
    rawQuestion?.choices ??
    [];

  if (!Array.isArray(source)) {
    return [];
  }

  return source
    .map((option: any) => {
      if (typeof option === "string") {
        return option;
      }

      return (
        option?.label ??
        option?.title ??
        option?.name ??
        option?.value ??
        ""
      );
    })
    .filter(Boolean);
};

export const mapApiQuestion = (rawQuestion: any): OnboardingQuestion => ({
  id: String(rawQuestion?.id ?? rawQuestion?.professional_question_id ?? ""),
  professionalQuestionId: Number(
    rawQuestion?.id ?? rawQuestion?.professional_question_id ?? 0
  ),
  prompt:
    rawQuestion?.question ??
    rawQuestion?.prompt ??
    rawQuestion?.title ??
    "",
  options: extractQuestionOptions(rawQuestion),
  allowMultiple: Boolean(
    rawQuestion?.allow_multiple ?? rawQuestion?.is_multiple ?? false
  ),
  customOptionLabel:
    rawQuestion?.custom_option_label ??
    rawQuestion?.other_option_label ??
    undefined,
  customInputPlaceholder:
    rawQuestion?.custom_input_placeholder ??
    rawQuestion?.other_input_placeholder ??
    undefined,
  helperText: rawQuestion?.helper_text ?? undefined,
});

export const extractApiQuestions = (payload: any): OnboardingQuestion[] => {
  const questionList =
    payload?.data?.questions ??
    payload?.questions ??
    payload?.data ??
    payload;

  if (!Array.isArray(questionList)) {
    return [];
  }

  return questionList
    .map(mapApiQuestion)
    .filter((question) => question.id && question.prompt);
};

export const persistAuthFromSignupComplete = (payload: any) => {
  if (typeof window === "undefined") {
    return;
  }

  const user = payload?.user ?? payload?.data?.user ?? payload?.data ?? null;
  const token =
    payload?.token ?? payload?._token ?? payload?.data?.token ?? null;
  const role = user?.role ?? payload?.type ?? payload?.data?.type ?? null;

  if (user?.id) {
    localStorage.setItem("user_id", JSON.stringify(user.id));
  }

  if (token) {
    localStorage.setItem("token", token);
  }

  if (role) {
    localStorage.setItem("role", role);
  }
};

export const normalizeExistingAnswer = (
  question: OnboardingQuestion,
  rawAnswer: any
): QuestionAnswerState => {
  if (Array.isArray(rawAnswer)) {
    return {
      selectedOptions: rawAnswer.map((value) => String(value)),
      customValue: "",
    };
  }

  const answerText = String(rawAnswer ?? "").trim();

  if (!answerText) {
    return { selectedOptions: [], customValue: "" };
  }

  if (question.allowMultiple) {
    return {
      selectedOptions: answerText
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean),
      customValue: "",
    };
  }

  return {
    selectedOptions: [answerText],
    customValue: "",
  };
};
