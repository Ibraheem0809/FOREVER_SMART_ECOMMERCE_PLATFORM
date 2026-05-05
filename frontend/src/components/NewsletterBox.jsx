import React from "react";

const NewsletterBox = () => {
  const onSubmitHandler = (e) => {
    e.preventDefault();
  };

  return (
    <div className="text-center ">
      <p className="text-2xl font-medium text-gray-700">
        Subscribe now & get 20% off
      </p>
      <p className="text-gray-400 mt-3">
        Subscribe today for exclusive offers, latest arrivals, and unbeatable
        savings.
      </p>
      <form
        onSubmit={onSubmitHandler}
        className="w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3"
      >
        <input
          type="email"
          name=""
          id=""
          placeholder="Enter your email"
          className="w-full sm:flex outline-none"
          required
        />
        <button
          type="submit"
          className="bg-black text-white text-sm px-10 py-4"
        >
          Subscribe
        </button>
      </form>
    </div>
  );
};

export default NewsletterBox;
