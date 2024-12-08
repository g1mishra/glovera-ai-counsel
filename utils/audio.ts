export const processAudioChunk = async (audioBlob: Blob): Promise<string | null> => {
  try {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          // Remove the data URL prefix
          const base64Audio = reader.result.split(",")[1];
          resolve(base64Audio);
        } else {
          reject(new Error("Failed to convert audio to base64"));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(audioBlob);
    });
  } catch (error) {
    console.error("Error processing audio:", error);
    return null;
  }
};
