/**
 * Capitalizes the first letter of a string
 *
 * @param {String} string
 * @returns {String} String with first letter capitalized
 */
export const capitalizeFirstLetter = (string) => {
  if (string && typeof string === "string") {
    return string.charAt(0).toUpperCase() + string.slice(1);
  } else {      
    return string;
  }
};
