"use client";
import Image from "next/image";
import { JSX } from "react";
import Link from "next/link";

import shape from "@/assets/img/chose/chose-5/map.png";
import choose_thumb1 from "@/assets/img/chose/chose-5/chose-2.jpg";
import choose_thumb2 from "@/assets/img/chose/chose-5/chose-3.jpg";
import choose_thumb3 from "@/assets/img/chose/chose-5/chose-1.jpg";
import circle from "@/assets/img/chose/chose-5/text.png";
import circle2 from "@/assets/img/chose/chose-5/icon.png";
import Button from "@/components/common/Button";
import Choose3 from "@/svg/home-one/Choose3";
import Choose1 from "@/svg/home-one/Choose1";
import Choose2 from "@/svg/home-one/Choose2";
import { FaChartLine, FaUserTie, FaUsers, FaHandshake } from "react-icons/fa";

interface DataType {
  id: number;
  icon: JSX.Element;
  title: string;
  desc: string;
}

interface StatType {
  id: number;
  icon: JSX.Element;
  value: string;
  label: string;
}

const choose_data: DataType[] = [
  {
    id: 1,
    icon: <Choose1 />,
    title: "Verified Opportunities",
    desc: "Access a growing marketplace of vetted buyers, sellers, and investors ready to engage in real business deals.",
  },
  {
    id: 2,
    icon: <Choose2 />,
    title: "Fast & Secure Transactions",
    desc: "Experience quick deal closures and safe interactions through our trusted and transparent platform.",
  },
  {
    id: 3,
    icon: <Choose3 />,
    title: "Smart Business Growth",
    desc: "Whether you’re raising capital or expanding your portfolio, Magnate Hub helps you make smarter moves.",
  },
];

const stats_data: StatType[] = [
  {
    id: 1,
    icon: <FaChartLine size={35} className="text-primary mb-3" />,
    value: "10,000+",
    label: "Monthly Web Visits",
  },
  {
    id: 2,
    icon: <FaUserTie size={35} className="text-primary mb-3" />,
    value: "250+",
    label: "Active Investors",
  },
  {
    id: 3,
    icon: <FaUsers size={35} className="text-primary mb-3" />,
    value: "3,000+",
    label: "Registered Members",
  },
  {
    id: 4,
    icon: <FaHandshake size={35} className="text-primary mb-3" />,
    value: "$2,500,000+",
    label: "Deals Successfully Closed",
  },
];

const ChooseArea = () => {
  return (
    <div className="tg-chose-area pt-140 pb-130 p-relative z-index-1">
      <Image
        className="tg-chose-5-map-shape d-none d-lg-block"
        src={shape}
        alt="Map Shape"
      />
      <div className="container">
        {/* --- Heading and Intro --- */}
        <div className="row align-items-center">
          <div className="col-lg-7">
            <div className="tg-chose-section-title mb-30">
              <h5
                className="tg-section-subtitle mb-15 wow fadeInUp"
                data-wow-delay=".3s"
                data-wow-duration=".1s"
              >
                Our Achievement
              </h5>
              <h2
                className="mb-15 text-capitalize wow fadeInUp"
                data-wow-delay=".4s"
                data-wow-duration=".9s"
              >
                Building connections that create opportunities
              </h2>
            </div>
          </div>
          <div className="col-lg-5">
            <div className="tg-chose-5-para">
              <p
                className="text-capitalize wow fadeInUp mb-0"
                data-wow-delay=".5s"
                data-wow-duration=".9s"
              >
                Magnate Hub may be new in the market, but we’re already driving
                real success. Our platform actively connects entrepreneurs,
                investors, and business owners—helping them close deals, raise
                capital, and achieve growth faster than ever before.
              </p>
            </div>
          </div>
        </div>

        {/* --- New Icon-Based Achievement Section --- */}
        <div className="row mt-50 mb-70 justify-content-center">
          {stats_data.map((stat, index) => (
            <div
              key={stat.id}
              className="col-md-3 col-6 text-center mb-30 wow fadeInUp"
              data-wow-delay={`${0.4 + index * 0.1}s`}
            >
              <div className="d-flex flex-column align-items-center">
                {stat.icon}
                <h2 className="fw-bold text-primary">{stat.value}</h2>
                <p className="mb-0">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* --- Images and Features --- */}
        <div className="row">
          <div
            className="col-lg-7 wow fadeInLeft"
            data-wow-delay=".4s"
            data-wow-duration="1s"
          >
            <div className="tg-chose-5-left mr-40">
              <div className="row">
                <div className="col-lg-5 col-md-5 col-sm-5">
                  <div className="tg-chose-5-thumb">
                    <Image
                      className="mb-20"
                      src={choose_thumb1}
                      alt="Choose Image 1"
                    />
                    <Image src={choose_thumb2} alt="Choose Image 2" />
                  </div>
                </div>
                <div className="col-lg-7 col-md-7 col-sm-7">
                  <div className="tg-chose-5-thumb-2 p-relative">
                    <div className="tg-chose-5-text-round d-none d-sm-block">
                      <div className="tg-chose-3-rounded p-relative mb-20">
                        <Image
                          className="rotate-infinite-2"
                          src={circle}
                          alt="Circle Text"
                        />
                        <Image
                          className="tg-chose-3-star rounded-circale"
                          src={circle2}
                          alt="Circle Icon"
                        />
                      </div>
                    </div>
                    <Image src={choose_thumb3} alt="Choose Image 3" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* --- Feature Cards --- */}
          <div className="col-lg-5">
            <div className="tg-chose-list-wrap tg-chose-5-list-wrap pt-40">
              {choose_data.map((item) => (
                <div
                  key={item.id}
                  className="tg-chose-list d-flex mb-20 wow fadeInUp"
                  data-wow-delay=".6s"
                  data-wow-duration=".9s"
                >
                  <span className="tg-chose-list-icon mr-20">{item.icon}</span>
                  <div className="tg-chose-list-content">
                    <h4 className="tg-chose-list-title mb-5">{item.title}</h4>
                    <p>{item.desc}</p>
                  </div>
                </div>
              ))}

              {/* --- Button --- */}
              <div
                className="tg-chose-btn wow fadeInUp"
                data-wow-delay=".8s"
                data-wow-duration=".9s"
              >
                <Link
                  href="/contact"
                  className="tg-btn tg-btn-switch-animation"
                >
                  <Button text="Join Magnate Hub" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChooseArea;
