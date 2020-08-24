/**
 * Returns the appropriate font color depending on whether or not dark mode is enabled or not
 * see `InfoPanel/styles.css`
 * 
 * @param {Boolean} darkMode
 * @returns {String} font color
 */
export const fontColor = (darkMode) => {
  return darkMode ? "rgba(246, 246, 244, 0.8)" : "rgba(58, 57, 56, 0.8)";
};
