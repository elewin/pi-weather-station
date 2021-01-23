import React, { useContext } from "react";
import { AppContext } from "~/AppContext";
import styles from "./styles.css";
import {
  convertTemp,
  convertSpeed,
} from "~/services/conversions";

import { InlineIcon } from "@iconify/react";
import degreesIcon from "@iconify/icons-wi/degrees";
import nightClear from "@iconify/icons-wi/night-clear";
import daySunny from "@iconify/icons-wi/day-sunny";
import dayCloudy from "@iconify/icons-wi/day-cloudy";
import nightAltCloudy from "@iconify/icons-wi/night-alt-cloudy";
import dayRain from "@iconify/icons-wi/day-rain";
import nightRain from "@iconify/icons-wi/night-rain";
import humidityAlt from "@iconify/icons-carbon/humidity-alt";
import cloudIcon from "@iconify/icons-wi/cloud";
import strongWind from "@iconify/icons-wi/strong-wind";
import snowIcon from "@iconify/icons-ion/snow";
import rainIcon from "@iconify/icons-wi/rain";
import rainMix from "@iconify/icons-wi/rain-mix";
import thunderstormIcon from "@iconify/icons-wi/thunderstorm";
import fogIcon from "@iconify/icons-wi/fog";
import cloudyIcon from "@iconify/icons-wi/cloudy";
import daySunnyOvercast from "@iconify/icons-wi/day-sunny-overcast";

/**
 * Current weather conditions
 * https://developer.climacell.co/v3/reference#data-layers-weather
 *
 * @returns {JSX.Element} Current weather conditions component
 */
const CurrentWeather = () => {
  const { currentWeatherData, tempUnit, speedUnit, sunriseTime, sunsetTime } = useContext(
    AppContext
  );
  const weatherData =
    currentWeatherData?.data?.timelines?.[0]?.intervals[0]?.values;
  if (weatherData) {
    const {
      cloudCover,
      humidity,
      precipitationType,
      precipitationProbability,
      temperature,
      weatherCode,
      windSpeed,
    } = weatherData;
    const daylight = sunriseTime && sunsetTime ? isDaylight(new Date(sunriseTime), new Date(sunsetTime)) : true;
    const { icon: weatherIcon, desc: weatherDesc } =
      parseWeatherCode(weatherCode, daylight) || {};

    return (
      <div className={styles.container}>
        <div className={styles.currentTemp}>
          {convertTemp(temperature, tempUnit)}
          <InlineIcon icon={degreesIcon} />
        </div>
        <div className={styles.iconContainer}>
          <div className={styles.weatherIcon}>
            {weatherIcon ? <InlineIcon icon={weatherIcon} /> : null}
          </div>
        </div>
        <div className={styles.stats}>
          <div>
            <div className={styles.statItem}>
              <div>
                <InlineIcon
                  icon={precipitationType === 2 ? snowIcon : rainIcon}
                />
              </div>
              <div>{precipitationProbability}%</div>
            </div>
            <div className={styles.statItem}>
              <div>
                <InlineIcon icon={cloudIcon} />
              </div>
              <div>{parseInt(cloudCover)}%</div>
            </div>
            <div className={styles.statItem}>
              <div>
                <InlineIcon icon={strongWind} />
              </div>
              <div className={styles.textUnit}>
                <div>{convertSpeed(windSpeed, speedUnit)}</div>
                <div className={styles.statUnit}>
                  {speedUnit === "mph" ? " mph" : " m/s"}
                </div>
              </div>
            </div>
            <div className={styles.statItem}>
              <div>
                <InlineIcon icon={humidityAlt} />
              </div>
              <div>{parseInt(humidity)}%</div>
            </div>
          </div>
        </div>
        <div className={styles.description}>{weatherDesc || ""}</div>
      </div>
    );
  } else {
    return <div></div>;
  }
};

/**
 * Parse weather code
 *
 * https://docs.climacell.co/reference/data-layers-overview
 *
 * @param {String} code
 * @param {Boolean} [isDay] if it is currently day
 * @returns {Object} weather description and icon
 */
const parseWeatherCode = (code, isDay) => {
  switch (code) {
    case 6201:
      return { desc: "Heavy freezing rain", icon: isDay ? dayRain : nightRain };
    case 6001:
      return { desc: "Freezing rain", icon: isDay ? dayRain : nightRain };
    case 6200:
      return { desc: "Light freezing rain", icon: isDay ? dayRain : nightRain };
    case 6000:
      return { desc: "Freezing drizzle", icon: rainMix };
    case 7101:
      return { desc: "Heavy ice pellets", icon: rainMix };
    case 7000:
      return { desc: "Ice pellets", icon: rainMix };
    case 7102:
      return { desc: "Light ice pellets", icon: rainMix };
    case 5101:
      return { desc: "Heavy snow", icon: snowIcon };
    case 5000:
      return { desc: "Show", icon: snowIcon };
    case 5100:
      return { desc: "Light snow", icon: snowIcon };
    case 5001:
      return { desc: "Flurries", icon: snowIcon };
    case 8000:
      return { desc: "Thunder storm", icon: thunderstormIcon };
    case 4201:
      return { desc: "Heavy rain", icon: isDay ? dayRain : nightRain };
    case 4001:
      return { desc: "Rain", icon: isDay ? dayRain : nightRain };
    case 4200:
      return { desc: "Light rain", icon: isDay ? dayRain : nightRain };
    case 4000:
      return { desc: "Drizzle", icon: rainMix };
    case 2100:
      return { desc: "Light fog", icon: fogIcon };
    case 2000:
      return { desc: "Fog", icon: fogIcon };
    case 1001:
      return { desc: "Cloudy", icon: cloudyIcon };
    case 1102:
      return { desc: "Mostly cloudy", icon: cloudyIcon };
    case 1101:
      return {
        desc: "Partly cloudy",
        icon: isDay ? daySunnyOvercast : nightAltCloudy,
      };
    case 1100:
      return { desc: "Mostly clear", icon: isDay ? dayCloudy : nightAltCloudy };
    case 1000:
      return { desc: "Clear", icon: isDay ? daySunny : nightClear };
    case 3001:
      return { desc: "Wind", icon: strongWind };
    case 3000:
      return { desc: "Light wind", icon: strongWind };
    case 3002:
      return { desc: "Strong wind", icon: strongWind };
  }
};

/**
 * Determine if it is currently daylight
 *
 * @param {Date} sunrise
 * @param {Date} sunset
 * @returns {Boolean} if current time is during daylight
 */
function isDaylight(sunrise, sunset) {
  const sunriseTime = new Date(sunrise).getTime();
  const sunsetTime = new Date(sunset).getTime();
  const now = new Date().getTime();
  return !!(now > sunriseTime && now < sunsetTime);
}

export default CurrentWeather;
