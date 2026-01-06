"use client";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import NavMenu from "./Menu/NavMenu";
import Link from "next/link";
import Image from "next/image";
import UseSticky from "@/hooks/UseSticky";
import Offcanvas from "./Menu/Offcanvas";
import Sidebar from "./Menu/Sidebar";
import UserIcon from "@/svg/UserIcon";
import logo_1 from "@/assets/img/logo/logo-white.png";
import { useRouter } from "next/navigation";

const HeaderOne = () => {
  const { sticky } = UseSticky();
  const { logout, isAuthenticated, role } = useAuth();
  const router = useRouter();
  const [offCanvas, setOffCanvas] = useState(false);
  const [sidebar, setSidebar] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleRedirect = () => {
    router.push("https://dash.magnatehub.au/dashboard/professionals");
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowLogout(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <style>
        {`
          .logo img {
            width:110px;
            height:70px;
          }
        `}
      </style>

      <header className="tg-header-height">
        <div
          className={`tg-header__area tg-header-tu-menu tg-header-lg-space z-index-999 tg-transparent ${sticky ? "header-sticky" : ""
            }`}
          id="header-sticky"
        >
          <div className="container">
            <div className="row align-items-center">
              <div className="col-xxl-10 col-xl-10 col-lg-9 col-6">
                <div className="tgmenu__wrap d-flex align-items-center justify-content-between">
                  <div className="logo">
                    <Link className="logo-1" href="/">
                      <Image src={logo_1} alt="Logo" />
                    </Link>
                    <Link className="logo-2 d-none" href="/">
                      <Image src={logo_1} alt="Logo" />
                    </Link>
                  </div>

                  <nav className="tgmenu__nav tgmenu-1-space">
                    <div className="tgmenu__navbar-wrap tgmenu__main-menu d-none d-xl-flex">
                      <NavMenu />
                    </div>
                  </nav>
                </div>
              </div>

              <div className="col-xxl-2 col-xl-2 col-lg-3 col-6">
                <div className="tg-menu-right-action d-flex align-items-center justify-content-end">
                  <div className="tg-header-btn ml-20 d-none d-sm-block">
                    {!isAuthenticated ? (
                      <Link className="tg-btn-header" href="/login">
                        <span>
                          <UserIcon />
                        </span>
                        Login / SignUp
                      </Link>
                    ) : (
                      <div
                        ref={dropdownRef}
                        className="tg-btn-header position-relative"
                      >
                        <div
                          onClick={() => setShowLogout(!showLogout)}
                          style={{ cursor: "pointer" }}
                          className="d-flex align-items-center"
                        >
                          <span>
                            <UserIcon />
                          </span>
                          {role === "1"
                            ? "Buyer"
                            : role === "2"
                              ? "Seller"
                              : role === "3" ? "Capital Raiser" :
                                role === "4"
                                  ? "Broker/Franchisers"
                                  : "User"}
                        </div>

                        {showLogout && (
                          <div
                            className="logout-dropdown"
                            style={{
                              position: "absolute",
                              top: "45px",
                              width: "180px",
                              padding: "20px",
                              right: "0",
                              background: "#fff",
                              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                              borderRadius: "6px",
                              zIndex: "999",
                            }}
                          >
                            <button
                              onClick={handleRedirect}
                              className="w-100"
                              style={{ background: '#560ce3', color: '#fff', margin: '4px', padding: '8px', borderRadius: '6px', border: 'none' }}
                            >
                              Dashboard
                            </button>
                            <button
                              onClick={handleLogout}
                              className="btn btn-danger w-100"
                              style={{ margin: '4px' }}
                            >
                              Logout
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="tg-header-menu-bar p-relative">
                    <button
                      onClick={() => setOffCanvas(true)}
                      style={{ cursor: "pointer" }}
                      className="tgmenu-offcanvas-open-btn mobile-nav-toggler d-block d-xl-none ml-10"
                    >
                      <span></span>
                      <span></span>
                      <span></span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <Sidebar sidebar={sidebar} setSidebar={setSidebar} />
      <Offcanvas offCanvas={offCanvas} setOffCanvas={setOffCanvas} />
    </>
  );
};

export default HeaderOne;
