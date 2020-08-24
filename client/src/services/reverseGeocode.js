import axios from "axios";

let prevCoords = {};
let prevResult = null;

/**
 * Reverse geocode lookup
 *
 * @param {Object} params
 * @param {Number} params.lat latitude
 * @param {Number} params.lon longitude
 * @param {String} params.apiKey api key
 * @returns {Promise} API result
 */
function reverseGeocode({ lat, lon, apiKey }) {  
  return new Promise((resolve, reject) => {
    if (prevCoords.lat === lat && prevCoords.lon === lon) {
      return resolve(prevResult);
    }
    
    axios
      .get(
        `https://us1.locationiq.com/v1/reverse.php?key=${apiKey}&lat=${lat}&lon=${lon}&format=json`
      )
      .then((res) => {        
        prevCoords = { lat, lon };
        prevResult = res.data;
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });

    // return reject(); //tempoarily disabling
    // axios
    //   .get(
    //     `https://api.bigdatacloud.net/data/reverse-geocode?latitude=${lat}&longitude=${lon}&localityLanguage=en`
    //   )
    //   .then((res) => {
    //     prevCoords = { lat, lon };
    //     prevResult = res.data;
    //     resolve(res.data);
    //   })
    //   .catch((err) => {
    //     reject(err);
    //   });
  });
}

export default reverseGeocode;
