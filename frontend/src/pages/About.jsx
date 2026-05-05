import React from "react";
import Title from "../components/Title";
import NewsletterBox from "../components/NewsletterBox";
import { assets } from "../assets/frontend_assets/assets";

const About = () => {
  return (
    <div>
      <div className="text-2xl text-center pt-8 border-t">
        <Title text1={"ABOUT"} text2={"US"} />
      </div>

      <div className="my-10 flex flex-col md:flex-row gap-16">
        <img
          className="w-full md:max-w-[450px]"
          src={assets.about_img}
          alt=""
        />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-600">
          <p>
            Forever is a modern e-commerce platform built to deliver quality,
            style, and value—all in one place. We carefully curate products that
            elevate your lifestyle, from everyday essentials to the latest
            fashion and trends. Our mission is simple: to make online shopping
            easy, affordable, and enjoyable for everyone.
          </p>
          <p>
            We believe in putting our customers first. With secure payments,
            fast delivery, and dedicated support, we ensure a smooth and trusted
            shopping experience. At Forever, we’re not just selling
            products—we’re building a brand that people can rely on. Shop smart.
            Shop Forever.
          </p>
          <b className="text-gray-800 ">Our Mission</b>
          <p>
            Our mission is to make quality fashion and lifestyle products
            accessible to everyone. We aim to deliver style, comfort, and trust
            through a seamless online shopping experience.
          </p>
        </div>
      </div>
      <div className="text-xl py-4">
        <Title text1={"WHY"} text2={"CHOOSE US"} />
      </div>
      <div className="flex flex-col md:flex-row text-sm mb-20">
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Quality Assurance:</b>
          <p className="text-gray-600">
            We deliver carefully curated products that meet the highest
            standards of durability and style.
          </p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Convenience:</b>
          <p className="text-gray-600">
            Shop anytime, anywhere with a smooth and hassle-free online
            experience.
          </p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Exceptional Customer Service:</b>
          <p className="text-gray-600">
            Your satisfaction comes first—our support team is here to help every
            step of the way.
          </p>
        </div>
      </div>
      <NewsletterBox />
    </div>
  );
};

export default About;
