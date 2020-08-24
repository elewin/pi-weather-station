import React, { useContext } from "react";
import { AppContext } from "~/AppContext";
import styles from "./styles.css";
import {
  convertTemp,
  convertSpeed,
  convertLength,
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
  const { currentWeatherData, tempUnit, speedUnit, lengthUnit } = useContext(
    AppContext
  );
  if (currentWeatherData) {
    const {
      cloud_cover: { value: cloudCover },
      humidity: { value: humidity },
      precipitation: { value: precipitation },
      precipitation_type: { value: precipitationType },
      temp: { value: temp },
      weather_code: { value: weatherCode },
      wind_speed: { value: windSpeed },
      sunrise: { value: sunrise },
      sunset: { value: sunset },
    } = currentWeatherData;

    const { icon: weatherIcon, desc: weatherDesc } =
      parseWeatherCode(weatherCode, isDaylight(sunrise, sunset)) || {};

    return (
      <div className={styles.container}>
        <div className={styles.currentTemp}>
          {convertTemp(temp, tempUnit)}
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
            <div className={styles.statItem}>
              <div>
                <InlineIcon
                  icon={precipitationType === "snow" ? snowIcon : rainIcon}
                />
              </div>
              <div className={styles.textUnit}>
                <div>{convertLength(precipitation, lengthUnit)}</div>
                <div>{lengthUnit}</div>
              </div>
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
 * @param {String} code
 * @param {Boolean} [isDay] if it is currently day
 * @returns {Object} weather description and icon
 */
const parseWeatherCode = (code, isDay) => {
  switch (code) {
    case "freezing_rain_heavy":
      return { desc: "Heavy freezing rain", icon: isDay ? dayRain : nightRain };
    case "freezing_rain":
      return { desc: "Freezing rain", icon: isDay ? dayRain : nightRain };
    case "freezing_rain_light":
      return { desc: "Light freezing rain", icon: isDay ? dayRain : nightRain };
    case "freezing_drizzle":
      return { desc: "Freezing drizzle", icon: rainMix };
    case "ice_pellets_heavy":
      return { desc: "Heavy ice pellets", icon: rainMix };
    case "ice_pellets":
      return { desc: "Ice pellets", icon: rainMix };
    case "ice_pellets_light":
      return { desc: "Light ice pellets", icon: rainMix };
    case "snow_heavy":
      return { desc: "Heavy snow", icon: snowIcon };
    case "snow":
      return { desc: "Show", icon: snowIcon };
    case "snow_light":
      return { desc: "Light snow", icon: snowIcon };
    case "flurries":
      return { desc: "Flurries", icon: snowIcon };
    case "tstorm":
      return { desc: "Thunder storm", icon: thunderstormIcon };
    case "rain_heavy":
      return { desc: "Heavy rain", icon: isDay ? dayRain : nightRain };
    case "rain":
      return { desc: "Rain", icon: isDay ? dayRain : nightRain };
    case "rain_light":
      return { desc: "Light rain", icon: isDay ? dayRain : nightRain };
    case "drizzle":
      return { desc: "Drizzle", icon: rainMix };
    case "fog_light":
      return { desc: "Light fog", icon: fogIcon };
    case "fog":
      return { desc: "Fog", icon: fogIcon };
    case "cloudy":
      return { desc: "Cloudy", icon: cloudyIcon };
    case "mostly_cloudy":
      return { desc: "Mostly cloudy", icon: cloudyIcon };
    case "partly_cloudy":
      return {
        desc: "Partly cloudy",
        icon: isDay ? daySunnyOvercast : nightAltCloudy,
      };
    case "mostly_clear":
      return { desc: "Mostly clear", icon: isDay ? dayCloudy : nightAltCloudy };
    case "clear":
      return { desc: "Clear", icon: isDay ? daySunny : nightClear };
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
