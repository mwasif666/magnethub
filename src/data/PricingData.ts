interface DataType {
  id: number;
  title: string;
  desc: string;
  price: number;
  list: string[];
}

const pricing_data: DataType[] = [
  {
    id: 1,
    title: "Essentials",
    desc: "This tier is a great option for those who have the time and expertise to handle the sale process themselves and are looking for an affordable way to gain exposure for their business.",
    price: 109,
    list: [
      "No commissions or other fees",
      "Unlimited Edits",
      "6-Month Listing",
      "Free Non-Disclosure Document",
      "Statistics Dashboard",
      "Chat feature",
      "Includes 10% GST",
    ],
  },
  {
    id: 2,
    title: "Premium",
    desc: "Suitable for business owners who need a little help determining the price of the business as well as the sale process etc.",
    price: 330,
    list: [
      "No commissions or other fees (if you go via a broker, you may have to pay commissions or fees)",
      "Add your business to the Magnate Premium Directory",
      "Unlimited Edits",
      "Phone consultation",
      "Write, list and manage the Ad for you",
      "Listed until sold",
      "Sell yourself or with a broker",
      "Free Non-Disclosure Document",
      "Statistics Dashboard",
      "Chat feature",
      "Includes 10% GST",
    ],
  },
  {
    id: 3,
    title: "Enterprise",
    desc: "Suitable for Brokers, Agents and Franchises.",
    price: 1800,
    list: [
      "No commissions or other fees",
      "Unlimited Listings",
      "Listed until sold",
      "Unlimited Edits",
      "Unlimited Listings Australia wide",
      "Great backlinks for more robust SEO",
      "Chat feature",
      "Includes 10% GST",
    ],
  },
  {
    id: 4,
    title: "Capital Raise",
    desc: "The ultimate solution for investors looking to fund the next big thing. Suitable for startups, established businesses or pre-revenue ideas.",
    price: 249,
    list: [
      "No commissions or other fees",
      "Unlimited Edits",
      "6-Month Listing",
      "Free Non-Disclosure Document",
      "Statistics Dashboard",
      "Chat feature",
      "Includes 10% GST",
    ],
  },
];

export default pricing_data;
