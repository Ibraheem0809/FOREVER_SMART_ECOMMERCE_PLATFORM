// utils/gemini.jsx

/**
 * Convert uploaded file to Base64
 */
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => resolve(reader.result);

    reader.onerror = (error) => reject(error);
  });
}

/**
 * Convert image URL to Base64
 */
export async function urlToBase64(url) {
  try {
    const response = await fetch(url);

    const blob = await response.blob();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.readAsDataURL(blob);

      reader.onload = () => resolve(reader.result);

      reader.onerror = (error) => reject(error);
    });
  } catch (error) {
    console.log(error);

    throw new Error(
      "Failed to process product image. CORS may be blocking the image."
    );
  }
}

/**
 * Generate AI Virtual Try-On Image
 */
export async function generateTryOnImage(productImageBase64, userImageBase64) {
  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error("Gemini API key is missing.");
    }

    // WORKING MODEL
    const model = "gemini-2.0-flash-preview-image-generation";

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    // REMOVE BASE64 PREFIX
    const cleanProduct = productImageBase64.split(",")[1] || productImageBase64;

    const cleanUser = userImageBase64.split(",")[1] || userImageBase64;

    // PAYLOAD
    const payload = {
      contents: [
        {
          role: "user",

          parts: [
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: cleanProduct,
              },
            },

            {
              inlineData: {
                mimeType: "image/jpeg",
                data: cleanUser,
              },
            },

            {
              text: `
Create a realistic AI fashion virtual try-on image.

The first image contains the clothing product.
The second image contains the person.

Make the person wear the clothing naturally.

Requirements:
- preserve person's face
- realistic fitting
- realistic shadows and lighting
- ecommerce fashion photography style
- high quality
- full body
- realistic fabric appearance
- natural pose
              `,
            },
          ],
        },
      ],

      generationConfig: {
        responseModalities: ["TEXT", "IMAGE"],
      },
    };

    // API CALL
    const response = await fetch(url, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(payload),
    });

    // ERROR RESPONSE
    if (!response.ok) {
      const errorData = await response.json();

      console.log("Gemini Error:", errorData);

      throw new Error(errorData.error?.message || "Failed to generate image.");
    }

    // SUCCESS RESPONSE
    const data = await response.json();

    console.log("Gemini Response:", data);

    const parts = data?.candidates?.[0]?.content?.parts || [];

    // FIND GENERATED IMAGE
    const generatedPart = parts.find((part) => part.inlineData);

    // RETURN IMAGE
    if (generatedPart?.inlineData) {
      return `data:${generatedPart.inlineData.mimeType};base64,${generatedPart.inlineData.data}`;
    }

    // NO IMAGE RETURNED
    const textResponse = parts.find((part) => part.text);

    if (textResponse?.text) {
      throw new Error(
        "Gemini returned text instead of image: " + textResponse.text
      );
    }

    throw new Error("No image was returned from Gemini API.");
  } catch (error) {
    console.log(error);

    throw error;
  }
}
