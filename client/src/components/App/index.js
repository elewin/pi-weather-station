import React, { useEffect, useContext } from "react";
import styles from "./styles.css";
import { AppContext } from "~/AppContext";

import WeatherMap from "~/components/WeatherMap";
import InfoPanel from "~/components/InfoPanel";
import Settings from "~/components/Settings";

import "!style-loader!css-loader!./overrides.css";

/**
 * Main component
 *
 * @returns {JSX.Element} Main component
 */
const App = () => {
  const {
    getBrowserGeo,
    getCustomLatLon,
    loadStoredData,
    darkMode,
    mouseHide,
  } = useContext(AppContext);

  useEffect(() => {
    getCustomLatLon();
    getBrowserGeo();
    loadStoredData();
  }, []);

  return (
    <div
      className={`${darkMode ? styles.dark : styles.light} ${
        mouseHide ? styles.hideMouse : ""
      }`}
    >
      <div className={styles.container}>
        <div className={styles.settingsContainer}>
          <Settings />
        </div>
        <div
          className={`${styles.weatherMap} map-container ${
            mouseHide ? "map-mouse-hide" : ""
          } ${darkMode ? "map-dark-mode" : ""}`}
        >
          <WeatherMap zoom={9} dark={darkMode} />
        </div>
        <div className={styles.infoContainer}>
          <InfoPanel />
        </div>
      </div>
    </div>
  );
};

export default App;
