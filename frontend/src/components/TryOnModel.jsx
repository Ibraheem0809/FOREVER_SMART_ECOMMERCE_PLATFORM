import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Loader2, Sparkles } from "lucide-react";
import { fileToBase64, urlToBase64, generateTryOnImage } from "../utils/gemini";

export function TryOnModal({ product, isOpen, onClose }) {
  const [userImageFile, setUserImageFile] = useState(null);
  const [userImagePreview, setUserImagePreview] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultImage, setResultImage] = useState(null);
  const [error, setError] = useState(null);

  const fileInputRef = useRef(null);

  if (!product) return null;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setUserImageFile(file);
      const url = URL.createObjectURL(file);
      setUserImagePreview(url);
      setResultImage(null);
      setError(null);
    }
  };

  const handleGenerate = async () => {
    if (!userImageFile) return;

    try {
      setIsGenerating(true);
      setError(null);

      // Convert both images to Base64
      const userBase64 = await fileToBase64(userImageFile);
      const productBase64 = await urlToBase64(product.image[0]);
      {
        /*Image array */
      }

      // Call Gemini API
      const generatedImage = await generateTryOnImage(
        productBase64,
        userBase64
      );

      setResultImage(generatedImage);
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsGenerating(false);
    }
  };

  const resetState = () => {
    setUserImageFile(null);
    setUserImagePreview(null);
    setResultImage(null);
    setError(null);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-5xl bg-white shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur hover:bg-black hover:text-white transition-colors duration-300 rounded-full"
            >
              <X size={20} />
            </button>

            {/* Left Side */}
            <div className="w-full md:w-1/2 bg-gray-50 p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-200 overflow-y-auto">
              <h3 className="text-2xl mb-2 text-center">{product.name}</h3>
              <p className="text-gray-500 mb-8 tracking-widest text-sm">
                {product.price}
              </p>
              <div className="relative w-full max-w-sm aspect-[3/4] overflow-hidden">
                <img
                  src={product.image[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  crossOrigin="anonymous"
                />
                {/*Image array */}
              </div>
            </div>

            {/* Right Side */}
            <div className="w-full md:w-1/2 p-8 flex flex-col justify-center overflow-y-auto">
              <h3 className="text-2xl mb-6 text-center">Virtual Try-On</h3>

              {!userImagePreview ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 hover:border-black transition-colors duration-300 p-12 flex flex-col items-center justify-center cursor-pointer group"
                >
                  <Upload className="w-8 h-8 mb-4 text-gray-400 group-hover:text-black transition-colors" />
                  <p className="text-sm text-center text-gray-500 group-hover:text-black uppercase tracking-wider">
                    Upload your photo
                  </p>
                  <p className="text-xs text-gray-400 mt-2 text-center">
                    For best results, use a full-body photo with good lighting.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center w-full">
                  <div className="relative w-full max-w-sm aspect-[3/4] mb-6 overflow-hidden bg-gray-100">
                    {resultImage ? (
                      <img
                        src={resultImage}
                        alt="Try-on result"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={userImagePreview}
                        alt="User upload"
                        className="w-full h-full object-cover opacity-80"
                      />
                    )}

                    {isGenerating && (
                      <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex flex-col items-center justify-center">
                        <Loader2 className="w-8 h-8 animate-spin mb-4" />
                        <p className="text-sm uppercase tracking-widest font-medium animate-pulse">
                          Tailoring...
                        </p>
                      </div>
                    )}
                  </div>

                  {error && (
                    <div className="w-full p-4 mb-6 bg-red-50 text-red-800 text-sm border border-red-200">
                      {error}
                    </div>
                  )}

                  {!resultImage ? (
                    <div className="flex gap-4 w-full max-w-sm">
                      <button
                        onClick={resetState}
                        disabled={isGenerating}
                        className="flex-1 py-3 px-4 border border-black text-black hover:bg-gray-50 uppercase tracking-wider text-xs disabled:opacity-50"
                      >
                        Change Photo
                      </button>

                      <button
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className="flex-1 py-3 px-4 bg-black text-white hover:bg-gray-900 uppercase tracking-wider text-xs flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {isGenerating ? (
                          "Processing"
                        ) : (
                          <>
                            <Sparkles size={14} /> Try It On
                          </>
                        )}
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-4 w-full max-w-sm">
                      <button
                        onClick={() => setResultImage(null)}
                        className="flex-1 py-3 px-4 border border-black text-black hover:bg-gray-50 uppercase tracking-wider text-xs"
                      >
                        Try Another Photo
                      </button>

                      <button
                        onClick={handleClose}
                        className="flex-1 py-3 px-4 bg-black text-white hover:bg-gray-900 uppercase tracking-wider text-xs"
                      >
                        Done
                      </button>
                    </div>
                  )}
                </div>
              )}

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
