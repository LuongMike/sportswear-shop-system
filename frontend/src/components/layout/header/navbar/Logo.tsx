import React from "react";
import { useNavigate } from "react-router";

const Logo = () => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    // <div className="shrink-0">
    //   <Link to="/" className="flex items-center">
    //     <img
    //       src="/puma-logo.svg"
    //       alt="PUMA"
    //       className="h-8 w-auto"
    //       onError={(e) => {
    //         e.currentTarget.style.display = "none";
    //         const next = e.currentTarget.nextElementSibling as HTMLElement;
    //         if (next) next.style.display = "block";
    //       }}
    //     />
    //     <div className="hidden text-2xl font-bold text-black">PUMA</div>
    //   </Link>
    // </div>
    <div
      onClick={handleLogoClick}
      className="text-2xl font-bold tracking-wide text-black cursor-pointer"
    >
      SPORTSHOP
    </div>
  );
};

export default Logo;
