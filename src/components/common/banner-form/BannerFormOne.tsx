import { apiRequest } from "@/api/axiosInstance";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { FaRedo, FaSearch } from "react-icons/fa";

type BannerFormProps = {
  setListing: React.Dispatch<React.SetStateAction<any[]>>;
  setLocalPagination?: React.Dispatch<
    React.SetStateAction<{
      totalPage: number;
      currentPage: number;
      perPage: number;
      total: number;
      nextPageUrl?: string | null;
      prevPageUrl?: string | null;
    }>
  >;
  currentPage?: number;
  onPageChange?: (page: number) => void;
};

const BannerFormOne = ({
  setListing,
  setLocalPagination,
  currentPage = 1,
  onPageChange,
}: BannerFormProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isInitialMount = useRef(true);
  const hasLoadedFromUrl = useRef(false);
  const lastFetchUrl = useRef<string>("");
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
  const [businessRegions, setBusinessRegions] = useState<DropDown>([]);
  const [agencyRegions, setAgencyRegions] = useState<DropDown>([]);

  const [businessRegionLoading, setBusinessRegionLoading] = useState(false);
  const [agencyRegionLoading, setAgencyRegionLoading] = useState(false);

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

    if (name === "state") {
      getBusinessRegionsById(value);
    }

    if (name === "state2") {
      getAgencyRegionsById(value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onPageChange) onPageChange(1);

    if (pathname === "/") {
      const queryParams = new URLSearchParams();

      if (activeTab === "businesses") {
        if (formData.postcode) queryParams.append("postcode", formData.postcode);
        if (formData.businessId) queryParams.append("businessId", formData.businessId);
        if (formData.category) queryParams.append("category", formData.category);
        if (formData.state) queryParams.append("state", formData.state);
        if (formData.region) queryParams.append("region", formData.region);
        if (formData.minPrice) queryParams.append("minPrice", formData.minPrice);
        if (formData.maxPrice) queryParams.append("maxPrice", formData.maxPrice);
        if (formData.franchise) queryParams.append("franchise", "true");
        if (formData.premium) queryParams.append("premium", "true");
        if (formData.all) queryParams.append("all", "true");
      } else if (activeTab === "agencies") {
        if (formData.sPostcode) queryParams.append("postcode", formData.sPostcode);
        if (formData.agency) queryParams.append("agency", formData.agency);
        if (formData.state2) queryParams.append("state", formData.state2);
        if (formData.region2) queryParams.append("region", formData.region2);
      }

      queryParams.append("tab", activeTab);
      router.push(`/listings?${queryParams.toString()}`);
    } else {
      // If already on listings page, fetch data normally
      const url = constructUrl(formData, 1);
      if (url) {
        fetchProductDataAsPerFilter(url);
      }
    }
  };

  const getCategories = async () => {
    return apiRequest({ url: "GetAllProjectCategories", method: "GET" });
  };

  const getLocations = async () => {
    return apiRequest({ url: "GetAllProjectLocations", method: "GET" });
  };

  const getBusinessRegionsById = async (id: string) => {
    try {
      setBusinessRegionLoading(true);
      const response = await apiRequest({
        url: `GetAllRegions?locationId=${id}`,
        method: "GET",
      });

      setBusinessRegions(
        response?.data?.map((r: any) => ({
          label: r.name,
          value: r.id,
        })) || []
      );
    } finally {
      setBusinessRegionLoading(false);
    }
  };

  const getAgencyRegionsById = async (id: string) => {
    try {
      setAgencyRegionLoading(true);
      const response = await apiRequest({
        url: `GetAllRegions?locationId=${id}`,
        method: "GET",
      });

      setAgencyRegions(
        response?.data?.map((r: any) => ({
          label: r.name,
          value: r.id,
        })) || []
      );
    } finally {
      setAgencyRegionLoading(false);
    }
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

  const constructUrl = (
    filters: any,
    page: number = 1,
    perPage: number = 12
  ) => {
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
      params.per_page = perPage;
      params.page = page;
      return `GetAllProjects?${Object.keys(params)
        .map((key) => (params[key] === "" ? key : `${key}=${params[key]}`))
        .join("&")}`;
    }

    if (activeTab === "agencies") {
      if (filters.sPostcode) params.postcode = filters.sPostcode;
      if (filters.agency) params.agency = filters.agency;
      if (filters.state2) params.state = filters.state2;
      if (filters.region2) params.region = filters.region2;
      params.per_page = perPage;
      params.page = page;
      return `GetAllAgencies?${Object.keys(params)
        .map((key) => `${key}=${params[key]}`)
        .join("&")}`;
    }
  };

  const minPriceRanges = [
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

  const maxPriceRanges = [
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

  const handleClear = () => {
    setFormData({
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

    setListing([]);
    if (onPageChange) onPageChange(1);
    lastFetchUrl.current = "";
  };

  const getListingData = (page: number = 1) => {
    const initialUrl = constructUrl(formData, page);
    if (initialUrl) {
      fetchProductDataAsPerFilter(initialUrl);
    }
  };

  const fetchProductDataAsPerFilter = async (finalUrl: string) => {
    // Prevent duplicate API calls with the same URL
    if (lastFetchUrl.current === finalUrl) {
      return;
    }
    lastFetchUrl.current = finalUrl;

    try {
      const response = await apiRequest({ url: finalUrl, method: "GET" });
      setListing(response?.data?.data || []);
      if (setLocalPagination) {
        setLocalPagination({
          totalPage: response?.data?.last_page || 1,
          currentPage: response?.data?.current_page || 1,
          perPage: response?.data?.per_page || 12,
          total: response?.data?.total || 0,
          nextPageUrl: response?.data?.next_page_url,
          prevPageUrl: response?.data?.prev_page_url,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (setLocalPagination && currentPage && currentPage >= 1) {
      getListingData(currentPage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);


  useEffect(() => {
    // Only load initial data if NOT on listings page with URL params
    if (pathname === "/listings" && searchParams && Array.from(searchParams.keys()).length > 0) {
      return; // Skip initial load, URL param effect will handle it
    }
    getListingData(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (pathname !== "/listings" || !searchParams) return;
    
    // Prevent loading twice if already loaded from URL
    if (hasLoadedFromUrl.current) return;
    hasLoadedFromUrl.current = true;

    const tab = searchParams.get("tab") || "businesses";
    setActiveTab(tab);

    const newFormData = {
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
    };

    if (tab === "businesses") {
      newFormData.postcode = searchParams.get("postcode") || "";
      newFormData.businessId = searchParams.get("businessId") || "";
      newFormData.category = searchParams.get("category") || "";
      newFormData.state = searchParams.get("state") || "";
      newFormData.region = searchParams.get("region") || "";
      newFormData.minPrice = searchParams.get("minPrice") || "";
      newFormData.maxPrice = searchParams.get("maxPrice") || "";
      newFormData.franchise = searchParams.get("franchise") === "true";
      newFormData.premium = searchParams.get("premium") === "true";
      newFormData.all = searchParams.get("all") === "true";

      if (newFormData.state) {
        getBusinessRegionsById(newFormData.state);
      }
    }

    if (tab === "agencies") {
      newFormData.sPostcode = searchParams.get("postcode") || "";
      newFormData.agency = searchParams.get("agency") || "";
      newFormData.state2 = searchParams.get("state") || "";
      newFormData.region2 = searchParams.get("region") || "";

      if (newFormData.state2) {
        getAgencyRegionsById(newFormData.state2);
      }
    }

    setFormData(newFormData);
    
    // Fetch data immediately with the new form data and tab
    setTimeout(() => {
      const params: any = {};
      if (tab === "businesses") {
        if (newFormData.postcode) params.postcode = newFormData.postcode;
        if (newFormData.businessId) params.businessId = newFormData.businessId;
        if (newFormData.category) params.category = newFormData.category;
        if (newFormData.region) params.region = newFormData.region;
        if (newFormData.state) params.state = newFormData.state;
        if (newFormData.minPrice) params.minPrice = newFormData.minPrice;
        if (newFormData.maxPrice) params.maxPrice = newFormData.maxPrice;

        if (!newFormData.all) {
          if (newFormData.franchise) params.franchise = "";
          if (newFormData.premium) params.premium = "";
        }
        params.per_page = 12;
        params.page = 1;
        const url = `GetAllProjects?${Object.keys(params)
          .map((key) => (params[key] === "" ? key : `${key}=${params[key]}`))}`;
        fetchProductDataAsPerFilter(url);
      } else if (tab === "agencies") {
        if (newFormData.sPostcode) params.postcode = newFormData.sPostcode;
        if (newFormData.agency) params.agency = newFormData.agency;
        if (newFormData.state2) params.state = newFormData.state2;
        if (newFormData.region2) params.region = newFormData.region2;
        params.per_page = 12;
        params.page = 1;
        const url = `GetAllAgencies?${Object.keys(params)
          .map((key) => `${key}=${params[key]}`)
          .join("&")}`;
        fetchProductDataAsPerFilter(url);
      }
    }, 50);
  }, [pathname, searchParams]);


  const isListing = pathname.includes("listing");

  return (
    <div className=" py-4">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="glass-card shadow-sm border-0">
              <div className="card-body p-4">
                {/* Header */}
                <div className="text-center mb-4">
                  {/* <h1 className="display-5 fw-bold text-primary mb-2">SESES</h1> */}
                  <h2 className="h4 text-white ">
                    Find Business & Investments
                  </h2>
                </div>

                {/* Tab Navigation */}
                <ul className="nav nav-tabs nav-justified mb-4" role="tablist">
                  <li className="nav-item" role="presentation">
                    <button
                      className={`nav-link ${activeTab === "businesses" ? "active" : ""
                        } ${isListing ? "tab-listing-color" : ""}`}
                      onClick={() => setActiveTab("businesses")}
                      type="button"
                      role="tab"
                    >
                      FIND BUSINESSES
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className={`nav-link ${activeTab === "agencies" ? "active" : ""
                        } ${isListing ? "tab-listing-color" : ""}`}
                      onClick={() => setActiveTab("agencies")}
                      type="button"
                      role="tab"
                    >
                      FIND INVESTEMENTS
                    </button>
                  </li>
                </ul>
                <form onSubmit={handleSubmit}>
                  {/* Businesses Tab Content */}
                  {activeTab === "businesses" && (
                    <div className="tab-content">
                      {/* Search Row */}
                      <div className="row mb-4">
                        <div className="col-md-12">
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
                              placeholder="Search by name"
                            />
                          </div>
                        </div>
                        {/* <div className="col-md-2">
                          <button
                            type="submit"
                            className="btn btn-primary w-100 h-100"
                          >
                            SEARCH
                          </button>
                        </div> */}
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
                            {businessRegionLoading ? (
                              <option>Loading regions...</option>
                            ) : businessRegions.length === 0 ? (
                              <option value="">Select Region</option>
                            ) : (
                              <>
                                <option value="">Select Regions</option>
                                {businessRegions.map((r, index) => (
                                  <option key={index} value={r.value}>
                                    {r.label}
                                  </option>
                                ))}
                              </>
                            )}
                          </select>

                        </div>
                        <div className="col-md-3">
                          <select
                            className="form-select"
                            name="minPrice"
                            value={formData.minPrice}
                            onChange={handleInputChange}
                          >
                            <option value="">Min price</option>
                            {minPriceRanges.map((price, index) => (
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
                            <option value="">Max price</option>
                            {maxPriceRanges.map((price, index) => (
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
                              className={`form-check-label ${isListing ? "tab-listing-color" : ""
                                }`}
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
                              className={`form-check-label ${isListing ? "tab-listing-color" : ""
                                }`}
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
                              className={`form-check-label ${isListing ? "tab-listing-color" : ""
                                }`}
                              htmlFor="allCheck"
                            >
                              All
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="row justify-content-end">
                        <div className="col-md-5 d-flex gap-3">
                          <button
                            type="reset"
                            className="btn w-100 h-100 d-flex align-items-center btn-clear justify-content-center gap-2"
                            onClick={handleClear}
                          >
                            <FaRedo /> Clear
                          </button>
                          <button
                            type="submit"
                            className="btn w-100 h-100 d-flex align-items-center btn-submit justify-content-center gap-2"
                          >
                            <FaSearch /> SEARCH
                          </button>
                        </div>
                      </div>

                      {/* Bottom Link */}
                      <div className="text-center mt-4">
                        <span className="text-decoration-none text-white">
                          <u>
                            Sell your business or advertise your business for
                            sale
                          </u>
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Agencies Tab Content */}
                  {activeTab === "agencies" && (
                    <div className="tab-content">
                      {/* Search Row */}
                      <div className="row mb-4">
                        <div className="col-md-12">
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
                              placeholder="Search by name"
                            />
                          </div>
                        </div>
                        {/* <div className="col-md-2">
                          <button
                            type="submit"
                            className="btn btn-primary w-100 h-100"
                          >
                            SEARCH
                          </button>
                        </div> */}
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
                            placeholder="Find Investment"
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
                            {agencyRegionLoading ? (
                              <option>Loading regions...</option>
                            ) : agencyRegions.length === 0 ? (
                              <option value="">Select Region</option>
                            ) : (
                              <>
                                <option value="">Select Regions</option>
                                {agencyRegions.map((r, index) => (
                                  <option key={index} value={r.value}>
                                    {r.label}
                                  </option>
                                ))}
                              </>
                            )}
                          </select>

                        </div>
                      </div>
                      <div className="row justify-content-end mt-4">
                        <div className="col-md-5 d-flex gap-3">
                          <button
                            type="reset"
                            className="btn w-100 h-100 d-flex align-items-center btn-clear justify-content-center gap-2"
                          >
                            <FaRedo /> Clear
                          </button>
                          <button
                            type="submit"
                            className="btn w-100 h-100 d-flex align-items-center btn-submit justify-content-center gap-2"
                          >
                            <FaSearch /> SEARCH
                          </button>
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
        h4 {
          color: white !important;
        }
        .tab-listing-color {
          color: gray !important;
        }
        .form-check label {
          color: white;
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(15px);
          -webkit-backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 20px;
          transition: all 0.3s ease;
        }

        .glass-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
        }
        .btn-clear {
          background-color: #f5f5f5;
        }
        .btn-submit {
          background-color: #560ce3;
          color: white;
        }
        .nav-tabs .nav-link {
          color: #f5f5f5;
          font-weight: 600;
          border: none;
          border-bottom: 3px solid white;
          padding: 1rem 2rem;
        }

        .nav-tabs .nav-link.active {
          color: white;
          background: transparent;
          border-bottom: 3px solid #560ce3;
        }

        .nav-tabs .nav-link:hover {
          border: none;
          border-bottom: 3px solid #560ce3;
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
