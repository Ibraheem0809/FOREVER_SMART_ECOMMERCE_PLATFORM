import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/frontend_assets/assets";
import RelatedProducts from "../components/RelatedProducts";

import { fileToBase64, urlToBase64, generateTryOnImage } from "../utils/gemini";

const Product = () => {
  const { productId } = useParams();

  const { products, currency, addToCart } = useContext(ShopContext);

  const [productData, setProductData] = useState(false);

  const [image, setImage] = useState("");

  const [size, setSize] = useState("");

  // TRY ON STATES
  const [showTryOn, setShowTryOn] = useState(false);

  const [userImage, setUserImage] = useState(null);

  const [generatedImage, setGeneratedImage] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  // FETCH PRODUCT
  const fetchProductData = async () => {
    products.map((item) => {
      if (item._id === productId) {
        setProductData(item);

        setImage(item.image[0]);

        return null;
      }
    });
  };

  useEffect(() => {
    fetchProductData();
  }, [productId, products]);

  // GENERATE TRY ON
  const handleGenerateTryOn = async () => {
    try {
      setError("");

      setGeneratedImage("");

      if (!userImage) {
        setError("Please upload your image.");

        return;
      }

      setLoading(true);

      // PRODUCT IMAGE
      const productBase64 = await urlToBase64(image);

      // USER IMAGE
      const userBase64 = await fileToBase64(userImage);

      // GENERATE IMAGE
      const result = await generateTryOnImage(productBase64, userBase64);

      setGeneratedImage(result);
    } catch (error) {
      console.log(error);

      setError(error.message || "Something went wrong while generating image.");
    } finally {
      setLoading(false);
    }
  };

  return productData ? (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      {/* PRODUCT DATA */}
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        {/* PRODUCT IMAGES */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          {/* THUMBNAILS */}
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
            {productData.image.map((item, index) => (
              <img
                onClick={() => setImage(item)}
                src={item}
                key={index}
                className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer border"
                alt=""
              />
            ))}
          </div>

          {/* MAIN IMAGE */}
          <div className="w-full sm:w-[80%]">
            <img src={image} alt="" className="w-full h-auto" />
          </div>
        </div>

        {/* PRODUCT INFO */}
        <div className="flex-1">
          <h1 className="font-medium text-2xl mt-2">{productData.name}</h1>

          {/* RATING */}
          <div className="flex items-center gap-1 mt-2">
            <img src={assets.star_icon} alt="" className="w-3" />
            <img src={assets.star_icon} alt="" className="w-3" />
            <img src={assets.star_icon} alt="" className="w-3" />
            <img src={assets.star_icon} alt="" className="w-3" />
            <img src={assets.star_dull_icon} alt="" className="w-3" />

            <p className="pl-2">(122)</p>
          </div>

          {/* PRICE */}
          <p className="font-medium text-3xl mt-5">
            {currency}
            {productData.price}
          </p>

          {/* DESCRIPTION */}
          <p className="mt-5 text-gray-700">{productData.description}</p>

          {/* SIZES */}
          <div className="flex flex-col gap-4 my-8">
            <p>Select Size</p>

            <div className="flex gap-2">
              {productData.sizes.map((item, index) => (
                <button
                  onClick={() => setSize(item)}
                  className={`border py-2 px-4 bg-gray-100 ${
                    item === size ? "border-orange-500" : ""
                  }`}
                  key={index}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex gap-4 flex-wrap">
            <button
              onClick={() => addToCart(productData._id, size)}
              className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700"
            >
              ADD TO CART
            </button>

            <button
              onClick={() => {
                setShowTryOn(true);

                setGeneratedImage("");

                setError("");

                setUserImage(null);
              }}
              className="bg-orange-500 text-white px-8 py-3 text-sm hover:bg-orange-600 transition"
            >
              TRY IT
            </button>
          </div>

          <hr className="mt-8 sm:w-4/5" />

          {/* EXTRA INFO */}
          <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
            <p>100% Original Product.</p>

            <p>Cash on delivery is available.</p>

            <p>Easy return and exchange policy within 7 days.</p>
          </div>
        </div>
      </div>

      {/* TRY ON MODAL */}
      {showTryOn && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-5">
          <div className="bg-white p-6 rounded-2xl w-full max-w-6xl relative overflow-y-auto max-h-[95vh]">
            {/* CLOSE BUTTON */}
            <button
              onClick={() => setShowTryOn(false)}
              className="absolute top-4 right-4 text-3xl font-bold"
            >
              ×
            </button>

            <h2 className="text-3xl font-semibold mb-8">AI Virtual Try-On</h2>

            {/* MAIN GRID */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* PRODUCT SIDE */}
              <div className="flex flex-col">
                <h3 className="font-medium mb-3 text-lg">Product Image</h3>

                <img
                  src={image}
                  alt=""
                  className="rounded-xl border h-[500px] object-cover"
                />
              </div>

              {/* USER PREVIEW */}
              {/* USER PREVIEW */}
              <div className="flex flex-col">
                <h3 className="font-medium mb-3 text-lg">Your Preview</h3>

                <div className="border rounded-xl h-[500px] flex items-center justify-center overflow-hidden bg-gray-100 relative">
                  {/* IMAGE PREVIEW */}
                  {userImage ? (
                    <img
                      src={URL.createObjectURL(userImage)}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-4">
                      <p className="text-gray-500 text-lg">Upload your image</p>

                      {/* FILE INPUT IN CENTER */}
                      <label className="bg-black text-white px-6 py-3 rounded-lg cursor-pointer hover:bg-gray-800 transition">
                        Choose File
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setUserImage(e.target.files[0])}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}
                </div>

                {/* CHANGE IMAGE BUTTON */}
                {userImage && (
                  <label className="mt-4 border border-black text-black py-3 rounded-lg text-center cursor-pointer hover:bg-black hover:text-white transition">
                    Change Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setUserImage(e.target.files[0])}
                      className="hidden"
                    />
                  </label>
                )}

                {/* GENERATE BUTTON */}
                <button
                  onClick={handleGenerateTryOn}
                  disabled={loading}
                  className={`mt-5 py-3 rounded-lg text-white transition ${
                    loading
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-black hover:bg-gray-800"
                  }`}
                >
                  {loading ? "Generating..." : "Generate Try-On"}
                </button>
              </div>
            </div>

            {/* ERROR */}

            {error && (
              <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
                <div className="bg-red-100 border border-red-400 text-red-600 px-6 py-4 rounded-xl shadow-xl max-w-2xl text-center mx-5 pointer-events-auto">
                  <p className="font-medium">{error}</p>
                </div>
              </div>
            )}

            {/* GENERATED RESULT */}
            {generatedImage && (
              <div className="mt-10">
                <h3 className="text-2xl font-semibold mb-5">
                  AI Generated Result
                </h3>

                <div className="border rounded-2xl overflow-hidden">
                  <img src={generatedImage} alt="" className="w-full" />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* DESCRIPTION */}
      <div className="mt-20">
        <div className="flex">
          <b className="border px-5 py-3 text-sm">Description</b>

          <p className="border px-5 py-3 text-sm">Reviews (122)</p>
        </div>

        <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500">
          <p>
            An e-commerce website is an online platform that facilitates the
            buying and selling of products or services over the internet.
          </p>

          <p>
            E-commerce websites display products with descriptions, prices,
            images, and reviews.
          </p>
        </div>
      </div>

      {/* RELATED PRODUCTS */}
      <RelatedProducts
        category={productData.category}
        subCategory={productData.subCategory}
      />
    </div>
  ) : (
    <div className="opacity-0"></div>
  );
};

export default Product;
