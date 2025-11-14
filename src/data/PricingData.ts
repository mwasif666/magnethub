interface DataType {
  id: number;
  slug?: string;
  title: string;
  desc: string;
  price: number;
  list: string[];
  suitable?: string;
}

const pricing_data: DataType[] = [
  {
    id: 1,
    title: "Essentials",
    slug: "essentials",
    desc: `
The "Essentials" pricing tier is designed for business owners who are comfortable managing the sale of their business on their own. This is the most affordable option, which provides you with exposure to potential buyers. 

With this tier, you will be able to list your business on our platform and have access to our network of buyers. You will be responsible for all aspects of the sale, including the evaluation of your business, gathering the necessary documents, and communicating with potential buyers. 
`,
    price: 149,
    list: [
      "No commissions or other fees",
      "Unlimited Edits",
      "6-Month Listing",
      "Free Non-Disclosure Document",
      "Statistics Dashboard",
      "Chat feature",
      "Sell A Business Checklist",
      "Premium positioning when listed",
      "Choice to refresh every 30 days so your seen",
      "Alert buyers that are interested in your ‘Category’ or type of business",
      " 6 months listing",
    ],
    suitable:
      "This tier is a great option for those who have the time and expertise to handle the sale process themselves and are looking for an affordable way to gain exposure for their business.",
  },
  {
    id: 2,
    title: "Premium",
    slug: "premium",
    desc: `The "Premium" pricing tier offers comprehensive support for selling your business. This includes assistance in evaluating your business to determine its value and potential market appeal, as well as help in gathering the necessary documents and paperwork and editing your listing to maximise the chances of a swift sale.

You will also be guided through the whole process to make sure that the sale goes smoothly and successfully. With this tier, you can be sure that you'll get the expert help you need to make your business worth as much as possible and find the right buyer. This includes us creating an Information Memorandum, created by us, to position you in the best possible light.`,
    price: 1999,
    list: [
      "No commissions or other fees",
      "Information memorandum included",
      "Add your business to the Magnate Premium Directory",
      "Unlimited Edits",
      "Phone consultation",
      "Business evaluation",
      "Write, list and manage the Ad for you",
      "Listed until sold",
      "Sell yourself or with a broker",
      "Free Non-Disclosure Document",
      "Statistics Dashboard",
      "Chat feature",
      "listed until sold",
    ],
    suitable:
      "Business owners who need a little help determining the price of the business as well as the sale process etc",
  },
  {
    id: 3,
    title: "Enterprise",
    slug: "enterprise",
    desc: `The "Enterprise" pricing tier is the ultimate package for brokers, agents, and franchisers. This premium offering allows access to unlimited listings Australia-wide, providing maximum exposure and easily list, change, edit your listings all in one flat fee`,
    price: 1500,
    list: [
      "No commissions or other fees",
      "Unlimited Listings",
      "Listed until sold",
      "Unlimited Edits",
      "Unlimited Listings Australia wide",
      "Great backlinks for more robust SEO",
      "Chat feature",
      "Analytics Dashboard",
      "listed until sold",
    ],
    suitable:
      "This is for business brokers who have many businesses, they have unlimited adverts they can post and they don’t expire, they will add and delete as they want to.",
  },
  {
    id: 4,
    title: "Capital Raise",
    slug: "capitai_rise",
    desc: "The ultimate solution to find investors looking to fund the next big thing. Whether you're a startup, an established business, or pre-revenue ideas, our platform connects you with a wide range of opportunities to grow your portfolio and get in front of the right people.",
    price: 249,
    list: [
      "No commissions or other fees",
      "Unlimited Edits",
      "6-Month Listing",
      "Free Non-Disclosure Document",
      "Statistics Dashboard",
      "Chat feature",
    ],
    suitable: "Startups, established businesses or pre revenue ideas.",
  },
];

export default pricing_data;
