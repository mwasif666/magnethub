export type OnboardingRoleId = "1" | "2" | "3" | "4";

export interface OnboardingQuestion {
  id: string;
  prompt: string;
  options: string[];
}

export interface OnboardingRoleConfig {
  id: OnboardingRoleId;
  label: string;
  shortLabel: string;
  description: string;
  recommendedPlanSlug: string;
  questions: OnboardingQuestion[];
}

export const PRE_DASHBOARD_MESSAGE =
  "We're getting your dashboard ready. Please answer these questions to help us personalise your experience and show you the best opportunities on Magnate Hub.";

export const onboardingRoleConfigs: OnboardingRoleConfig[] = [
  {
    id: "1",
    label: "Buyer",
    shortLabel: "Buyer",
    description:
      "Browse businesses, define your budget, and get matched with opportunities that fit your acquisition goals.",
    recommendedPlanSlug: "free_plan",
    questions: [
      {
        id: "buyer-business-type",
        prompt: "What type of business are you looking to buy?",
        options: [
          "Retail",
          "Hospitality",
          "Service-based",
          "Ecommerce",
          "Manufacturing",
          "Healthcare",
          "Franchise",
          "Other",
        ],
      },
      {
        id: "buyer-budget",
        prompt: "What is your preferred budget range?",
        options: [
          "Under $50,000",
          "$50,000 to $100,000",
          "$100,000 to $250,000",
          "$250,000 to $500,000",
          "$500,000 to $1M",
          "$1M+",
        ],
      },
      {
        id: "buyer-location",
        prompt: "Which locations are you interested in?",
        options: [
          "NSW",
          "VIC",
          "QLD",
          "WA",
          "SA",
          "TAS",
          "ACT",
          "NT",
          "All Australia",
        ],
      },
      {
        id: "buyer-intent",
        prompt:
          "Are you looking for an owner-operated business, an investment, or either?",
        options: ["Owner-operated", "Investment", "Either"],
      },
      {
        id: "buyer-timeline",
        prompt: "How soon are you looking to buy?",
        options: [
          "Immediately",
          "Within 3 months",
          "Within 6 months",
          "Within 12 months",
          "Just browsing",
        ],
      },
      {
        id: "buyer-matching",
        prompt:
          "Would you like to be shown opportunities based on your interests and budget?",
        options: ["Yes", "No"],
      },
    ],
  },
  {
    id: "2",
    label: "Seller",
    shortLabel: "Seller",
    description:
      "Set up your seller profile, choose the right package, and get ready to attract serious buyers.",
    recommendedPlanSlug: "essentials",
    questions: [
      {
        id: "seller-business-type",
        prompt: "What type of business are you looking to sell?",
        options: [
          "Retail",
          "Hospitality",
          "Service-based",
          "Ecommerce",
          "Manufacturing",
          "Healthcare",
          "Franchise",
          "Other",
        ],
      },
      {
        id: "seller-asking-price",
        prompt: "What is the approximate asking price range?",
        options: [
          "Under $50,000",
          "$50,000 to $100,000",
          "$100,000 to $250,000",
          "$250,000 to $500,000",
          "$500,000 to $1M",
          "$1M+",
        ],
      },
      {
        id: "seller-location",
        prompt: "Which state or location is the business in?",
        options: ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"],
      },
      {
        id: "seller-support",
        prompt: "Are you selling the business yourself or with support?",
        options: ["Myself", "With broker support", "Unsure"],
      },
      {
        id: "seller-timeline",
        prompt: "How soon are you hoping to sell?",
        options: [
          "Immediately",
          "Within 3 months",
          "Within 6 months",
          "Within 12 months",
          "Just exploring",
        ],
      },
      {
        id: "seller-listing-help",
        prompt:
          "Would you like help improving your listing and attracting better buyers?",
        options: ["Yes", "No"],
      },
    ],
  },
  {
    id: "3",
    label: "Capital Raiser",
    shortLabel: "Capital",
    description:
      "Create an investor-ready profile, secure the right plan, and surface opportunities to the right audience.",
    recommendedPlanSlug: "capitai_rise",
    questions: [
      {
        id: "capital-opportunity-type",
        prompt: "What type of opportunity are you raising capital for?",
        options: [
          "Startup",
          "Existing business",
          "Acquisition",
          "Property",
          "Franchise",
          "Project",
          "Other",
        ],
      },
      {
        id: "capital-amount",
        prompt: "How much capital are you looking to raise?",
        options: [
          "Under $50,000",
          "$50,000 to $100,000",
          "$100,000 to $250,000",
          "$250,000 to $500,000",
          "$500,000 to $1M",
          "$1M+",
        ],
      },
      {
        id: "capital-industry",
        prompt: "Which industry is your opportunity in?",
        options: [
          "Technology",
          "Retail",
          "Hospitality",
          "Healthcare",
          "Property",
          "Manufacturing",
          "Finance",
          "Other",
        ],
      },
      {
        id: "capital-stage",
        prompt: "What stage is the business or project at?",
        options: [
          "Idea stage",
          "Pre-revenue",
          "Early revenue",
          "Growth stage",
          "Established",
        ],
      },
      {
        id: "capital-investors",
        prompt: "Are you looking for one investor or multiple investors?",
        options: ["One investor", "Multiple investors", "Open to either"],
      },
      {
        id: "capital-matching",
        prompt:
          "Would you like to be matched with relevant investors based on your raise?",
        options: ["Yes", "No"],
      },
    ],
  },
  {
    id: "4",
    label: "Broker / Franchisor",
    shortLabel: "Broker",
    description:
      "Set up your broker or franchisor profile, choose the right package, and unlock tailored lead tooling.",
    recommendedPlanSlug: "enterprise",
    questions: [
      {
        id: "broker-type",
        prompt: "Are you a broker, franchisor, or both?",
        options: ["Broker", "Franchisor", "Both"],
      },
      {
        id: "broker-portfolio",
        prompt: "What types of businesses or opportunities do you represent?",
        options: [
          "Retail",
          "Hospitality",
          "Service-based",
          "Ecommerce",
          "Franchise",
          "Investment opportunities",
          "Mixed portfolio",
          "Other",
        ],
      },
      {
        id: "broker-location",
        prompt: "Which locations or regions do you cover?",
        options: [
          "NSW",
          "VIC",
          "QLD",
          "WA",
          "SA",
          "TAS",
          "ACT",
          "NT",
          "National",
        ],
      },
      {
        id: "broker-volume",
        prompt: "How many listings or opportunities do you expect to upload?",
        options: ["1 to 5", "6 to 20", "21 to 50", "51+"],
      },
      {
        id: "broker-leads",
        prompt: "Are you looking for buyer leads, seller leads, or both?",
        options: ["Buyer leads", "Seller leads", "Both"],
      },
      {
        id: "broker-tools",
        prompt:
          "Would you like access to tailored opportunities and future lead tools based on your profile?",
        options: ["Yes", "No"],
      },
    ],
  },
];

export const getOnboardingRole = (roleId?: string | null) =>
  onboardingRoleConfigs.find((role) => role.id === roleId);
