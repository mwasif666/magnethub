"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import NavMenu from "./Menu/NavMenu";
import Link from "next/link";
import Image from "next/image";
import UseSticky from "@/hooks/UseSticky";
import Offcanvas from "./Menu/Offcanvas";
import Sidebar from "./Menu/Sidebar";
import UserIcon from "@/svg/UserIcon";

import logo_1 from "@/assets/img/logo/logo-white.png";

const HeaderOne = () => {
  const { sticky } = UseSticky();
  const [offCanvas, setOffCanvas] = useState<boolean>(false);
  const [sidebar, setSidebar] = useState<boolean>(false);
  const { isAuthenticated, role } = useAuth();

  return (
    <>
      <style>
        {`.logo img{
              width:110px;
              height:70px;
              }
            `}
      </style>
      <header className="tg-header-height">
        <div
          className={`tg-header__area tg-header-tu-menu tg-header-lg-space z-index-999 tg-transparent ${
            sticky ? "header-sticky" : ""
          }`}
          id="header-sticky"
        >
          <div className="container">
            <div className="row align-items-center">
              <div className="col-xxl-10 col-xl-10 col-lg-10 col-6">
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
              <div className="col-xxl-2 col-xl-2 col-lg-2 col-6">
                <div className="tg-menu-right-action d-flex align-items-center justify-content-end">
    
                  <div className="tg-header-btn ml-20 d-none d-sm-block">
                    {!isAuthenticated ? (
                      <Link className="tg-btn-header" href="/login">
                        <span>
                          <UserIcon />
                        </span>
                        Login
                      </Link>
                    ) : (
                      <div className="tg-btn-header">
                        <span>
                          <UserIcon />
                        </span>
                        {role && role === "1" ? 'Buyer' : role === "2" ? "Seller" : role === "3" ? "Raiser/Broker" : 'user'}
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
