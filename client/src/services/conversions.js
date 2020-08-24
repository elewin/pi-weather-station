/**
 * Convert celsius to fahrenheit
 *
 * @param {Number} c degrees celsius
 * @returns {Number} degrees fahrenheit
 * @private
 */
const cToF = (c) => {
  return c * (9/5) + 32;
};

/**
 * Convert temperature to celsius if needed
 *
 * @param {Number} c temperature in celsius
 * @param {String} units `f` for fahrenheit, `c` for celsius
 * @returns {Number} converted temperature
 */
export const convertTemp = (c, units) => {
  if (!c && c !== 0) {
    console.log("missing input temp!");
    return null;
  }

  if (units && units.toLowerCase() === "c") {
    return parseInt(c);
  } else if (units && units.toLowerCase() === "f") {
    return parseInt(cToF(c));
  } else {
    console.log("Missing / invalid target unit!", units);
    return null;
  }
};

/**
 * Convert m/s to mph
 *
 * @param {Number} ms
 * @returns {Number} mph
 * @private
 */
const msToMph = (ms) => {
  return ms / 0.44704;
};

/**
 * Converts speed
 *
 * @param {Number} speed
 * @param {String} units mph or ms for m/s
 * @returns {Number} converted speed
 */
export const convertSpeed = (speed, units) => {
  if (!speed && speed !== 0) {
    console.log("missing input speed");
    return null;
  }
  if (units && units.toLowerCase() === "mph") {
    return parseInt(msToMph(speed));
  } else if (units && units.toLowerCase() === "ms") {
    return parseInt(speed);
  } else {
    console.log("Missing / invalid target unit!", units);
    return null;
  }
};

/**
 * Converts mm to inches
 *
 * @param {Number} mm
 * @returns {Number} inches
 * @private
 */
const mmToIn = (mm) => {
  return mm / 25.4;
};

/**
 * Convert length
 *
 * @param {Number} len mm
 * @param {String} units in or mm
 * @returns {Number} converted length
 */
export const convertLength = (len, units) => {
  if (!len && len !== 0) {
    console.log("missing input length!");
    return null;
  }
  if (units && units.toLowerCase() === "in") {
    return parseInt(mmToIn(len) * 100) / 100;
  } else if (units && units.toLowerCase() === "mm") {
    return len;
  } else {
    console.log("Missing / invalid target unit!", units);
    return null;
  }
};
