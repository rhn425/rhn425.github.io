const generateAiImages = async (userPrompt, userImgQuantity) => {
  try {
    // Send a request to the OpenAI API to generate images based on user inputs
    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        prompt: userPrompt,
        n: userImgQuantity,
        size: "512x512",
        response_format: "b64_json"
      }),
    });

    // Parse the response JSON
    const responseData = await response.json();

    // Handle API error response
    if (!response.ok || responseData.status === false) {
      const errorMessage = responseData.message || "Failed to generate AI images. Make sure your API key is valid.";
      throw new Error(errorMessage);
    }

    // Update image cards with the data from the response
    const { data } = responseData; 
    updateImageCard([...data]);
  } catch (error) {
    // Display an alert with the error message
    alert(error.message);
  } finally {
    // Re-enable the generate button and reset its text
    generateBtn.removeAttribute("disabled");
    generateBtn.innerText = "Generate";
    isImageGenerating = false;
  }
};
