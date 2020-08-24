import axios from "axios";

/**
 * Gets settings
 *
 * @returns {Promise} resolves settings
 */
export function getSettings() {
  return new Promise((resolve, reject) => {
    axios
      .get("/settings")
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
}
