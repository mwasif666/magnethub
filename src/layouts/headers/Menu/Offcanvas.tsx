import Image from "next/image";
import Link from "next/link";

import logo from "@/assets/img/logo/logo-green.png";
import MobileMenu from "./MobileMenu";
import { useState } from "react";

interface MobileSidebarProps {
  offCanvas: boolean;
  setOffCanvas: (offCanvas: boolean) => void;
}

const Offcanvas = ({ offCanvas, setOffCanvas }: MobileSidebarProps) => {
  const [searchValue, setSearchValue] = useState("");

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchValue("");
    setOffCanvas(false);
  };

  return (
    <div className={offCanvas ? "mobile-menu-visible" : ""}>
      <div className="tgmobile__menu">
        <nav className="tgmobile__menu-box">
          <div onClick={() => setOffCanvas(false)} className="close-btn">
            <i className="fa-solid fa-xmark"></i>
          </div>

          <div
            className="tgmobile__menu-outer"
            style={{
              marginTop: "90px",
            }}
          >
            <MobileMenu />
          </div>
        </nav>
      </div>
      <div
        onClick={() => setOffCanvas(false)}
        className="tgmobile__menu-backdrop"
      ></div>
    </div>
  );
};

export default Offcanvas;
