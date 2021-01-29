import React, { useEffect, useState, useContext } from "react";
import { AppContext } from "~/AppContext";
import { InlineIcon } from "@iconify/react";
import reverseGeocode from "~/services/reverseGeocode";
import locationIcon from "@iconify/icons-gridicons/location";
import styles from "./styles.css";

/**
 * Map location
 *
 * @returns {JSX.Element} Location name
 */
const LocationName = () => {
  const { mapGeo, reverseGeoApiKey } = useContext(AppContext);
  const [name, setName] = useState(null);

  useEffect(() => {
    if (mapGeo && reverseGeoApiKey) {
      const { latitude: lat, longitude: lon } = mapGeo;
      reverseGeocode({ lat, lon, apiKey: reverseGeoApiKey })
        .then((res) => {
          setName(getName(res));
        })
        .catch((err) => {
          setName(`${lat}, ${lon}`);
          console.log("err!", err);
        });
    } else if (mapGeo && !reverseGeoApiKey) {
      const { latitude: lat, longitude: lon } = mapGeo;
      setName(`${lat}, ${lon}`);
    }
  }, [mapGeo, reverseGeoApiKey]);

  return (
    <div className={`${styles.container}`}>
      {name ? (
        <div>
          <InlineIcon icon={locationIcon} /> {name}
        </div>
      ) : null}
    </div>
  );
};

/**
 * Parses name data from results
 *
 * @param {Object} res
 * @returns {String} Display name
 */
const getName = (res) => {
  // eslint-disable-next-line babel/camelcase
  const { city, country, state, country_code, county, region } = res.address;
  // eslint-disable-next-line babel/camelcase
  if (country_code === "us") {
    if (city) {
      return `${city}, ${state}`;
    } else if (county) {
      return `${county}, ${state}`;
    } else if (state) {
      return `${state}`;
    } else {
      return `${country}`;
    }
  } else {
    if (city) {
      return `${city}, ${country}`;
    } else {
      return `${
        county
          ? `${county}, `
          : region
          ? `${region}, `
          : state
          ? `${state}, `
          : ""
      }${country}`;
    }
  }
};

export default LocationName;
