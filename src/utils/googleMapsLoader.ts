let scriptLoadingPromise: Promise<void> | null = null;

export const loadGoogleMapsScript = (): Promise<void> => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || import.meta.env.EXPO_PUBLIC_GOOGLE_PLACES_KEY || "";
  
  if (!apiKey) {
    console.warn("Google Maps API key is missing. Autocomplete will fallback to static suggestions.");
    return Promise.reject("API Key Missing");
  }

  if (window.google?.maps?.places) {
    return Promise.resolve();
  }

  if (scriptLoadingPromise) {
    return scriptLoadingPromise;
  }

  scriptLoadingPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      resolve();
    };
    script.onerror = (err) => {
      scriptLoadingPromise = null;
      reject(err);
    };
    document.head.appendChild(script);
  });

  return scriptLoadingPromise;
};
