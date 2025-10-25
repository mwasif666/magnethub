"use client";
import PriceRange from "@/components/features/feature-one/PriceRange";
import { useState } from "react";

const BannerFormTwo = () => {
  const [formData, setFormData] = useState({
    // Businesses tab
    postcode: "",
    businessId: "",
    category: "",
    state: "",
    region: "",
    minPrice: "",
    maxPrice: "",
    franchise: false,
    premium: false,
    all: false,
    listingType: "",

    // Agencies tab
    sPostcode: "",
    agency: "",
    state2: "",
    region2: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Handle form submission here
  };

  const categories = [
    "Aged Care & Retirement",
    "Agriculture & Primary Services",
    "Automotive & Marine",
    "Books, Stationery & DVDs",
    "Building & Construction",
    "Business Services",
    "Catering & Events",
    "Children's Products & Services",
    "Cleaning",
    "Coffee, Cafes & Restaurants",
    "Convenience, Grocery & Liquor Stores",
    "Digital, Crypto & Mobile Apps",
    "Discount & Variety Stores",
    "Education, Coaching & Training",
    "Electronic Equipment",
    "Entertainment & Amusement",
    "Fashion",
    "Food & Beverage",
    "Garden, Pool & Outdoor Maintenance",
    "Gifts & Florists",
    "Green & Eco friendly",
    "Hair, Beauty & Spa",
    "Handymen & Home Services",
    "Health & Medical",
    "Homewares & Furniture",
    "Industrial",
    "Manufacturing, Wholesale & Distribution",
    "Master Franchises",
    "Mortgage & Finance",
    "Newsagency, Lottery & Post Office",
    "Pet Products & Services",
    "Pubs, Bars & Clubs",
    "Real Estate, Property & Relocation",
    "Safety & Security",
    "Specialty Retail",
    "Sport, Fitness & Adventure",
    "Takeaway & Casual Dining",
    "Technology, Telecommunications & Internet",
    "Transport & Storage",
    "Vending",
  ];

  const states = [
    "New South Wales - NSW",
    "Northern Territory",
    "Western Australia",
    "Tasmania",
    "Queensland",
    "South Australia",
    "Victoria",
  ];

  const pageItem = [
    { value: 20, label: "20" },
    { value: 50, label: "50" },
    { value: 100, label: "100" },
    { value: 200, label: "200" },
    { value: 400, label: "400" },
    { value: 800, label: "800" },
  ];

  const [priceValue, setPriceValue] = useState([0, 5000]);

  const handleChanges = (val: number[]) => {
    setPriceValue(val);
  };

  return (
    <div className=" py-4">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="card shadow-sm border-0">
              <div className="card-body p-4">
                {/* Header */}
                <div className="text-center mb-4">
                  <h2 className="h4 text-muted">
                    Explore Unique Business Ideas, Find Your Path to Success
                  </h2>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="tab-content">
                    <div className="row g-3 mb-4">
                      <div className="col-md-6">
                        <select
                          className="form-select"
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                        >
                          <option value="">Select categories</option>
                          {categories.map((category, index) => (
                            <option key={index} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-3">
                        <select
                          className="form-select"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                        >
                          <option value="">Select Item Range</option>
                          {pageItem.map((page, index) => (
                            <option key={index} value={page.value}>
                              {page.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-3">
                        <select
                          className="form-select"
                          name="region"
                          value={formData.region}
                          onChange={handleInputChange}
                        >
                          <option value="">Order By</option>
                          <option value="oldest">Oldest</option>
                          <option value="newest">Newest</option>
                        </select>
                      </div>
                      <div className="col-md-4">
                        <input
                          type="text"
                          className="form-control"
                          name="businessId"
                          value={formData.businessId}
                          onChange={handleInputChange}
                          placeholder="Write Referal Id"
                        />
                      </div>
                      <div className="col-md-4">
                        <input
                          type="text"
                          className="form-control"
                          name="businessId"
                          value={formData.businessId}
                          onChange={handleInputChange}
                          placeholder="What are you looking for?"
                        />
                      </div>
                      <div className="col-md-4">
                        <select
                          className="form-select"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                        >
                          <option value="">Select state</option>
                          {states.map((state, index) => (
                            <option key={index} value={state}>
                              {state}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-4">
                        <PriceRange
                          MAX={5000}
                          MIN={0}
                          STEP={1}
                          values={priceValue}
                          handleChanges={handleChanges}
                        />
                        <div className="d-flex align-items-center mt-15">
                          <span
                            className="input-range"
                            onChange={() => handleChanges}
                          >
                            ${priceValue[0]} - ${priceValue[1]}
                          </span>
                        </div>
                      </div>
                      <div className="col-md-5">
                        <div className="d-flex align-items-center justify-center gap-4">
                          <div className="checkbox d-flex align-items-center">
                            <input
                              className="tg-checkbox"
                              type="checkbox"
                              name="franchise"
                              checked={formData.franchise}
                              onChange={handleInputChange}
                              id="franchiseCheck"
                            />
                            <label
                              htmlFor="franchiseCheck"
                              className="tg-label ms-2"
                            >
                              Franchise
                            </label>
                          </div>

                          <div className="checkbox d-flex align-items-center">
                            <input
                              className="tg-checkbox"
                              type="checkbox"
                              name="premium"
                              checked={formData.premium}
                              onChange={handleInputChange}
                              id="premiumCheck"
                            />
                            <label
                              htmlFor="premiumCheck"
                              className="tg-label ms-2"
                            >
                              Premium Listing
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="tg-tour-about-time d-flex align-items-center mb-10">
                          <div className="form-check me-3">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="listingType"
                              id="allType"
                              value="all"
                              checked={formData.listingType === "all"}
                              onChange={handleInputChange}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="allType"
                            >
                              All
                            </label>
                          </div>

                          <div className="form-check me-3">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="listingType"
                              id="investType"
                              value="invest"
                              checked={formData.listingType === "invest"}
                              onChange={handleInputChange}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="investType"
                            >
                              Invest
                            </label>
                          </div>

                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="listingType"
                              id="buyType"
                              value="buy"
                              checked={formData.listingType === "buy"}
                              onChange={handleInputChange}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="buyType"
                            >
                              Buy
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <button
                        type="submit"
                        className="btn btn-primary w-100 h-100"
                      >
                        SEARCH
                      </button>
                    </div>

                    <div className="row mb-4">
                      <div className="col-12"></div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bootstrap Icons CDN */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
      />
      <style jsx>{`
        .nav-tabs .nav-link {
          color: #6c757d;
          font-weight: 600;
          border: none;
          padding: 1rem 2rem;
        }

        .nav-tabs .nav-link.active {
          color: #0d6efd;
          background: transparent;
          border-bottom: 3px solid #0d6efd;
        }

        .nav-tabs .nav-link:hover {
          border: none;
          border-bottom: 3px solid #dee2e6;
        }

        .card {
          border-radius: 15px;
        }

        .form-control,
        .form-select {
          border-radius: 8px;
          padding: 0.75rem 1rem;
        }

        .btn-primary {
          border-radius: 8px;
          font-weight: 600;
        }

        .input-group-text {
          border-radius: 8px 0 0 8px;
        }

        .form-control:focus,
        .form-select:focus {
          box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
        }
      `}</style>
    </div>
  );
};

export default BannerFormTwo;
