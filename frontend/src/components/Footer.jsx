import React from "react";
import { assets } from "../assets/frontend_assets/assets";

const Footer = () => {
  return (
    <div>
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
        <div>
          <img src={assets.logo} className="mb-4 w-32" alt="" />
          <p className="w-full md:w-2/3 text-gray-600">
            Discover premium products at unbeatable prices. Enjoy secure
            payments, fast delivery, and dedicated support — bringing you
            quality, comfort, and style for every moment, making your shopping
            experience easy and delightful.
          </p>
        </div>
        <div>
          <p className="text-xl font-medium mb-5">COMPANY</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li>Home</li>
            <li>About us</li>
            <li>Dilevery</li>
            <li>Privacy Policy</li>
          </ul>
        </div>

        <div>
          <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li>+91-73102-27879</li>
            <li>ibraheemsiddiqui0809@gmail.com</li>
            <li>Instagram</li>
          </ul>
        </div>
      </div>

      <div>
        <hr />
        <p className="py-5 text-sm text-center text-gray-900">
          Copyright2026@sidd_ibraheem-All Right Reserved
        </p>
      </div>
    </div>
  );
};

export default Footer;
