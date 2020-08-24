
import React, { useContext } from "react";
import { AppContext } from "~/AppContext";
import styles from "./styles.css";
import {
  convertTemp,
  convertSpeed,
  convertLength,
} from "~/services/conversions";
import { capitalizeFirstLetter } from "~/services/formatting";
import { InlineIcon } from "@iconify/react";
import PropTypes from "prop-types";

import degreesIcon from "@iconify/icons-wi/degrees";
import nightClear from "@iconify/icons-wi/night-clear";
import daySunny from "@iconify/icons-wi/day-sunny";
import nightPartlyCloudy from "@iconify/icons-wi/night-partly-cloudy";
import nightAltPartlyCloudy from "@iconify/icons-wi/night-alt-partly-cloudy";
import dayCloudy from "@iconify/icons-wi/day-cloudy";
import nightAltCloudy from "@iconify/icons-wi/night-alt-cloudy";
import dayRain from "@iconify/icons-wi/day-rain";
import nightRain from "@iconify/icons-wi/night-rain";
import dayThunderstorm from "@iconify/icons-wi/day-thunderstorm";
import nightAltThunderstorm from "@iconify/icons-wi/night-alt-thunderstorm";
import daySnow from "@iconify/icons-wi/day-snow";
import nightAltSnow from "@iconify/icons-wi/night-alt-snow";
import dayFog from "@iconify/icons-wi/day-fog";
import nightFog from "@iconify/icons-wi/night-fog";
import humidityIcon from "@iconify/icons-carbon/humidity";
import cloudIcon from "@iconify/icons-wi/cloud";
import strongWind from "@iconify/icons-wi/strong-wind";
import snowIcon from "@iconify/icons-ion/snow";
import rainIcon from "@iconify/icons-wi/rain";

/**
 * Current weather conditions
 * see https://openweathermap.org/api/one-call-api
 *
 * @returns {JSX.Element} Current weather conditions component
 */
const CurrentWeather = () => {
  const { weatherData, tempUnit, speedUnit, lengthUnit } = useContext(
    AppContext
  );
  if (weatherData) {
    const {
      current: {
        temp,
        humidity,
        clouds,
        wind_speed, // eslint-disable-line babel/camelcase
        rain,
        snow,
        weather: currentWeather,
      },
    } = weatherData;
    const [{ icon: iconCode, description }] = currentWeather;

    const rainFall = rain ? rain["1h"] : null;
    const snowFall = snow ? snow["1h"] : null;

    return (
      <div className={styles.container}>
        <div className={styles.currentTemp}>
          {convertTemp(temp, tempUnit)}
          <InlineIcon icon={degreesIcon} />
        </div>
        <div className={styles.iconContainer}>
          <div className={styles.weatherIcon}>
            <InlineIcon icon={getWeatherIcon(iconCode)} />
          </div>
        </div>
        <div className={styles.stats}>
          <div>
            <div className={styles.statItem}>
              <div>
                <InlineIcon icon={cloudIcon} />
              </div>
              <div>{humidity}%</div>
            </div>
            <div className={styles.statItem}>
              <div>
                <InlineIcon icon={strongWind} />
              </div>
              <div className={styles.textUnit}>
                <div>{convertSpeed(wind_speed, speedUnit)}</div>
                <div className={styles.statUnit}>
                  {speedUnit === "mph" ? " mph" : " m/s"}
                </div>
              </div>
            </div>
            <div className={styles.statItem}>
              <div>
                <InlineIcon icon={humidityIcon} />
              </div>
              <div>{clouds}%</div>
            </div>
            <Precipitation
              snowFall={snowFall}
              rainFall={rainFall}
              lengthUnit={lengthUnit}
            />
          </div>
        </div>
        <div className={styles.description}>
          {capitalizeFirstLetter(description)}
        </div>
      </div>
    );
  } else {
    return <div>no weather data / loading</div>;
  }
};

/**
 * Precipitation, if any
 *
 * @param {Object} props
 * @param {Number} props.rainFall
 * @param {Number} props.snowFall
 * @param {String} props.lengthUnit
 * @returns {JSX.Element} precipitation component
 */
const Precipitation = ({ rainFall, snowFall, lengthUnit }) => {
  if ((rainFall && rainFall !== 0) || (snowFall && snowFall !== 0)) {
    return (
      <div className={styles.statItem}>
        <div>
          <InlineIcon icon={rainFall ? rainIcon : snowIcon} />
        </div>
        <div className={styles.textUnit}>
          <div>{convertLength(rainFall ? rainFall : snowFall, lengthUnit)}</div>
          <div>{lengthUnit}</div>
        </div>
      </div>
    );
  } else {
    return null;
  }
};

Precipitation.propTypes = {
  rainFall: PropTypes.number,
  snowFall: PropTypes.number,
  lengthUnit: PropTypes.string,
};

/**
 * Maps weather codes to icons
 * see https://openweathermap.org/weather-conditions#Weather-Condition-Codes-2
 *
 * @param {String} iconCode
 * @returns {Object} Icon
 */
function getWeatherIcon(iconCode) {
  switch (iconCode) {
    case "01d":
      return daySunny;
    case "01n":
      return nightClear;
    case "02d":
      return nightPartlyCloudy;
    case "02n":
      return nightAltPartlyCloudy;
    case "03d":
      return dayCloudy;
    case "03n":
      return nightAltCloudy;
    case "04d":
      return dayCloudy;
    case "04n":
      return nightAltCloudy;
    case "09d":
      return dayRain;
    case "09n":
      return nightRain;
    case "10d":
      return dayRain;
    case "10n":
      return nightRain;
    case "11d":
      return dayThunderstorm;
    case "11n":
      return nightAltThunderstorm;
    case "13d":
      return daySnow;
    case "13n":
      return nightAltSnow;
    case "50d":
      return dayFog;
    case "50n":
      return nightFog;
  }
}

export default CurrentWeather;