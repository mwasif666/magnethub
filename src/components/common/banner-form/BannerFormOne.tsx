import { apiRequest } from "@/api/axiosInstance";
import { useEffect, useRef, useState } from "react";

const BannerFormOne = () => {
  type DropDown = { label: string; value: string }[];
  const [activeTab, setActiveTab] = useState("businesses");
  const [formData, setFormData] = useState({
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
    sPostcode: "",
    agency: "",
    state2: "",
    region2: "",
  });

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<DropDown>([]);
  const [locations, setLocations] = useState<DropDown>([]);
  const [listings, setListings] = useState<any>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    const newForm = {
      ...formData,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    };

    setFormData(newForm);

    if (name === "businessId") {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(() => {
        const url = constructUrl(newForm);
        if (url) fetchProductDataAsPerFilter(url);
      }, 300);
    }

    if (name !== "businessId" && name !== "postcode") {
      const url = constructUrl(newForm);
      if (url) fetchProductDataAsPerFilter(url);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.postcode.length > 3) {
      const url = constructUrl(formData);
      if (url) fetchProductDataAsPerFilter(url);
    }
  };

  const getCategories = async () => {
    return apiRequest({ url: "GetAllProjectCategories", method: "GET" });
  };

  const getLocations = async () => {
    return apiRequest({ url: "GetAllProjectLocations", method: "GET" });
  };

  useEffect(() => {
    setLoading(true);

    Promise.all([getCategories(), getLocations()])
      .then(([catRes, locRes]) => {
        setCategories(
          catRes?.data?.map((c: any) => ({
            label: c.name,
            value: c.category_id,
          })) || []
        );

        setLocations(
          locRes?.data?.map((l: any) => ({
            label: l.name,
            value: l.location_id,
          })) || []
        );
      })
      .finally(() => setLoading(false));
  }, []);

  const constructUrl = (filters: any) => {
    let params: any = {};

    if (activeTab === "businesses") {
      if (filters.postcode) params.postcode = filters.postcode;
      if (filters.businessId) params.businessId = filters.businessId;
      if (filters.category) params.category = filters.category;
      if (filters.region) params.region = filters.region;
      if (filters.state) params.state = filters.state;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;

      if (!filters.all) {
        if (filters.franchise) params.franchise = "";
        if (filters.premium) params.premium = "";
      }

      return `GetAllProjects?${Object.keys(params)
        .map((key) => (params[key] === "" ? key : `${params[key]}`))
        .join("&")}`;
    }

    if (activeTab === "agencies") {
      if (filters.sPostcode) params.postcode = filters.sPostcode;
      if (filters.agency) params.agency = filters.agency;
      if (filters.state2) params.state = filters.state2;
      if (filters.region2) params.region = filters.region2;

      return `GetAllAgencies?${Object.keys(params)
        .map((key) => `${key}=${params[key]}`)
        .join("&")}`;
    }
  };

  const fetchProductDataAsPerFilter = async (finalUrl: string) => {
    try {
      const response = await apiRequest({ url: finalUrl, method: "GET" });
      setListings(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const priceRanges = [
    { value: "0", label: "$0" },
    { value: "25000", label: "$25,000" },
    { value: "50000", label: "$50,000" },
    { value: "75000", label: "$75,000" },
    { value: "100000", label: "$100,000" },
    { value: "200000", label: "$200,000" },
    { value: "300000", label: "$300,000" },
    { value: "400000", label: "$400,000" },
    { value: "500000", label: "$500,000" },
    { value: "600000", label: "$600,000" },
    { value: "700000", label: "$700,000" },
    { value: "800000", label: "$800,000" },
    { value: "900000", label: "$900,000" },
    { value: "1000000", label: "$1,000,000" },
    { value: "2000000", label: "$2,000,000" },
    { value: "3000000", label: "$3,000,000" },
    { value: "4000000", label: "$4,000,000" },
    { value: "5000000", label: "$5,000,000+" },
  ];

  return (
    <div className=" py-4">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="card shadow-sm border-0">
              <div className="card-body p-4">
                {/* Header */}
                <div className="text-center mb-4">
                  {/* <h1 className="display-5 fw-bold text-primary mb-2">SESES</h1> */}
                  <h2 className="h4 text-muted">FIND BUSINESSES & AGENCIES</h2>
                </div>

                {/* Tab Navigation */}
                <ul className="nav nav-tabs nav-justified mb-4" role="tablist">
                  <li className="nav-item" role="presentation">
                    <button
                      className={`nav-link ${
                        activeTab === "businesses" ? "active" : ""
                      }`}
                      onClick={() => setActiveTab("businesses")}
                      type="button"
                      role="tab"
                    >
                      FIND BUSINESSES
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className={`nav-link ${
                        activeTab === "agencies" ? "active" : ""
                      }`}
                      onClick={() => setActiveTab("agencies")}
                      type="button"
                      role="tab"
                    >
                      FIND AGENCIES
                    </button>
                  </li>
                </ul>

                <form onSubmit={handleSubmit}>
                  {/* Businesses Tab Content */}
                  {activeTab === "businesses" && (
                    <div className="tab-content">
                      {/* Search Row */}
                      <div className="row mb-4">
                        <div className="col-md-10">
                          <div className="input-group">
                            <span className="input-group-text bg-white border-end-0">
                              <i className="fas fa-search text-muted"></i>
                            </span>
                            <input
                              type="text"
                              className="form-control border-start-0"
                              name="postcode"
                              value={formData.postcode}
                              onChange={handleInputChange}
                              placeholder="Search suburb or postcode"
                            />
                          </div>
                        </div>
                        <div className="col-md-2">
                          <button
                            type="submit"
                            className="btn btn-primary w-100 h-100"
                          >
                            SEARCH
                          </button>
                        </div>
                      </div>

                      {/* Filters Row */}
                      <div className="row g-3 mb-4">
                        <div className="col-md-6">
                          <input
                            type="text"
                            className="form-control"
                            name="businessId"
                            value={formData.businessId}
                            onChange={handleInputChange}
                            placeholder="Keywords or business Id"
                          />
                        </div>
                        <div className="col-md-6">
                          <select
                            className="form-select"
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                          >
                            <option value="">Select categories</option>
                            {categories.map((category, index) => (
                              <option key={index} value={category.value}>
                                {category.label}
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
                            <option value="">Select state</option>
                            {locations.map((state, index) => (
                              <option key={index} value={state.value}>
                                {state.label}
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
                            <option value="">Select regions</option>
                            <option value="region1">Region 1</option>
                            <option value="region2">Region 2</option>
                            <option value="region3">Region 3</option>
                          </select>
                        </div>
                        <div className="col-md-3">
                          <select
                            className="form-select"
                            name="minPrice"
                            value={formData.minPrice}
                            onChange={handleInputChange}
                          >
                            <option value="">min price</option>
                            {priceRanges.map((price, index) => (
                              <option key={index} value={price.value}>
                                {price.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="col-md-3">
                          <select
                            className="form-select"
                            name="maxPrice"
                            value={formData.maxPrice}
                            onChange={handleInputChange}
                          >
                            <option value="">max price</option>
                            {priceRanges.map((price, index) => (
                              <option key={index} value={price.value}>
                                {price.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Checkboxes */}
                      <div className="row mb-4">
                        <div className="col-12">
                          <div className="form-check form-check-inline">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="franchise"
                              checked={formData.franchise}
                              onChange={handleInputChange}
                              id="franchiseCheck"
                            />
                            <label
                              className="form-check-label"
                              htmlFor="franchiseCheck"
                            >
                              Franchise
                            </label>
                          </div>
                          <div className="form-check form-check-inline">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="premium"
                              checked={formData.premium}
                              onChange={handleInputChange}
                              id="premiumCheck"
                            />
                            <label
                              className="form-check-label"
                              htmlFor="premiumCheck"
                            >
                              Premium Listing
                            </label>
                          </div>
                          <div className="form-check form-check-inline">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="all"
                              checked={formData.all}
                              onChange={handleInputChange}
                              id="allCheck"
                            />
                            <label
                              className="form-check-label"
                              htmlFor="allCheck"
                            >
                              All
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Link */}
                      <div className="text-center">
                        <a href="#" className="text-decoration-none">
                          <u>
                            Sell your business or advertise your business for
                            sale
                          </u>
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Agencies Tab Content */}
                  {activeTab === "agencies" && (
                    <div className="tab-content">
                      {/* Search Row */}
                      <div className="row mb-4">
                        <div className="col-md-10">
                          <div className="input-group">
                            <span className="input-group-text bg-white border-end-0">
                              <i className="fas fa-search text-muted"></i>
                            </span>
                            <input
                              type="text"
                              className="form-control border-start-0"
                              name="sPostcode"
                              value={formData.sPostcode}
                              onChange={handleInputChange}
                              placeholder="Search suburb or postcode"
                            />
                          </div>
                        </div>
                        <div className="col-md-2">
                          <button
                            type="submit"
                            className="btn btn-primary w-100 h-100"
                          >
                            SEARCH
                          </button>
                        </div>
                      </div>

                      {/* Filters Row */}
                      <div className="row g-3">
                        <div className="col-md-4">
                          <input
                            type="text"
                            className="form-control"
                            name="agency"
                            value={formData.agency}
                            onChange={handleInputChange}
                            placeholder="Agency's Name"
                          />
                        </div>
                        <div className="col-md-4">
                          <select
                            className="form-select"
                            name="state2"
                            value={formData.state2}
                            onChange={handleInputChange}
                          >
                            <option value="">Select state</option>
                            {locations.map((state, index) => (
                              <option key={index} value={state.value}>
                                {state.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="col-md-4">
                          <select
                            className="form-select"
                            name="region2"
                            value={formData.region2}
                            onChange={handleInputChange}
                          >
                            <option value="">Select regions</option>
                            <option value="region1">Region 1</option>
                            <option value="region2">Region 2</option>
                            <option value="region3">Region 3</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}
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

export default BannerFormOne;
