export const encodeListingData = (obj) => {
  try {
    if (!obj) return "";
    // Clean up unnecessary large fields to keep URL size smaller
    const cleanObj = { ...obj };
    delete cleanObj.photos; // Photos are fetched separately by ID, no need to put in URL
    delete cleanObj.description; // Description is fetched by singleListing / project-details API
    delete cleanObj.amenities;

    const str = JSON.stringify(cleanObj);
    if (typeof window !== "undefined") {
      return window.btoa(unescape(encodeURIComponent(str)));
    } else {
      return Buffer.from(str).toString("base64");
    }
  } catch (e) {
    console.error("Error encoding data:", e);
    return "";
  }
};

export const decodeListingData = (str) => {
  try {
    if (!str) return null;
    // Replace spaces back to '+' as some URL query parsers interpret '+' as space
    const safeStr = str.replace(/ /g, "+");
    let decoded = "";
    if (typeof window !== "undefined") {
      decoded = decodeURIComponent(escape(window.atob(safeStr)));
    } else {
      decoded = Buffer.from(safeStr, "base64").toString("utf-8");
    }
    return JSON.parse(decoded);
  } catch (e) {
    console.error("Error decoding data:", e);
    return null;
  }
};
