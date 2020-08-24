import React, {
  useEffect,
  useContext,
  useState,
  useCallback,
  useRef,
} from "react";
import { Map, TileLayer, AttributionControl, Marker } from "react-leaflet";
import PropTypes from "prop-types";
import { AppContext } from "~/AppContext";
import debounce from "debounce";
import axios from "axios";
import styles from "./styles.css";

/**
 * Weather map
 *
 * @param {Object} props
 * @param {Number} props.zoom zoom level
 * @param {Boolean} [props.dark] dark mode
 * @returns {JSX.Element} Weather map
 */
const WeatherMap = ({ zoom, dark }) => {
  const MAP_CLICK_DEBOUNCE_TIME = 200; //ms
  const {
    setMapPosition,
    panToCoords,
    setPanToCoords,
    browserGeo,
    mapGeo,
    mapApiKey,
    getMapApiKey,
    markerIsVisible,
    animateWeatherMap,
  } = useContext(AppContext);
  const mapRef = useRef();

  const mapClickHandler = useCallback(
    debounce((e) => {
      const { lat: latitude, lng: longitude } = e.latlng;
      const newCoords = { latitude, longitude };
      setMapPosition(newCoords);
    }, MAP_CLICK_DEBOUNCE_TIME),
    [setMapPosition]
  );

  const [mapTimestamps, setMapTimestamps] = useState(null);
  const [mapTimestamp, setMapTimestamp] = useState(null);
  const [currentMapTimestampIdx, setCurrentMapTimestampIdx] = useState(0);

  const MAP_TIMESTAMP_REFRESH_FREQUENCY = 1000 * 60 * 10; //update every 10 minutes
  const MAP_CYCLE_RATE = 1000; //ms

  const getMapApiKeyCallback = useCallback(() => getMapApiKey(), [
    getMapApiKey,
  ]);

  useEffect(() => {
    getMapApiKeyCallback().catch((err) => {
      console.log("err!", err);
    });

    const updateTimeStamps = () => {
      getMapTimestamps()
        .then((res) => {
          setMapTimestamps(res);
        })
        .catch((err) => {
          console.log("err", err);
        });
    };

    const mapTimestampsInterval = setInterval(
      updateTimeStamps,
      MAP_TIMESTAMP_REFRESH_FREQUENCY
    );
    updateTimeStamps(); //initial update
    return () => {
      clearInterval(mapTimestampsInterval);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Pan the screen to a a specific location when `panToCoords` is updated with grid coordinates
  useEffect(() => {
    if (panToCoords && mapRef.current) {
      const { leafletElement } = mapRef.current;
      leafletElement.panTo([panToCoords.latitude, panToCoords.longitude]);
      setPanToCoords(null); //reset back to null so we can observe a change next time its fired for the same coords
    }
  }, [panToCoords, mapRef]); // eslint-disable-line react-hooks/exhaustive-deps

  const { latitude, longitude } = browserGeo || {};

  useEffect(() => {
    if (mapTimestamps) {
      setMapTimestamp(mapTimestamps[currentMapTimestampIdx]);
    }
  }, [currentMapTimestampIdx, mapTimestamps]);

  // cycle through weather maps when animated is enabled
  useEffect(() => {
    if (mapTimestamps) {
      if (animateWeatherMap) {
        const interval = setInterval(() => {
          let nextIdx;
          if (currentMapTimestampIdx + 1 >= mapTimestamps.length) {
            nextIdx = 0;
          } else {
            nextIdx = currentMapTimestampIdx + 1;
          }
          setCurrentMapTimestampIdx(nextIdx);
        }, MAP_CYCLE_RATE);
        return () => {
          clearInterval(interval);
        };
      } else {
        setCurrentMapTimestampIdx(mapTimestamps.length - 1);
      }
    }
  }, [currentMapTimestampIdx, animateWeatherMap, mapTimestamps]);

  if (!hasVal(latitude) || !hasVal(longitude) || !zoom || !mapApiKey) {
    return (
      <div className={`${styles.noMap} ${dark ? styles.dark : styles.light}`}>
        <div>Cannot retrieve map data.</div>
        <div>Did you enter an API key?</div>
      </div>
    );
  }
  const markerPosition = mapGeo ? [mapGeo.latitude, mapGeo.longitude] : null;

  return (
    <Map
      ref={mapRef}
      center={[latitude, longitude]}
      zoom={zoom}
      style={{ width: "100%", height: "100%" }}
      attributionControl={false}
      touchZoom={true}
      dragging={true}
      fadeAnimation={false}
      onClick={mapClickHandler}
    >
      <AttributionControl position={"bottomleft"} />
      <TileLayer
        attribution='© <a href="https://www.mapbox.com/feedback/">Mapbox</a>'
        url={`https://api.mapbox.com/styles/v1/mapbox/${
          dark ? "dark-v10" : "light-v10"
        }/tiles/{z}/{x}/{y}?access_token={apiKey}`}
        apiKey={mapApiKey}
      />
      {mapTimestamp ? (
        <TileLayer
          attribution='<a href="https://www.rainviewer.com/">RainViewer</a>'
          url={`https://tilecache.rainviewer.com/v2/radar/${mapTimestamp}/{size}/{z}/{x}/{y}/{color}/{smooth}_{snow}.png`}
          opacity={0.3}
          size={512}
          color={6} // https://www.rainviewer.com/api.html#colorSchemes
          smooth={1}
          snow={1}
        />
      ) : null}
      {markerIsVisible && markerPosition ? (
        <Marker position={markerPosition} opacity={0.65}></Marker>
      ) : null}
    </Map>
  );
};

WeatherMap.propTypes = {
  zoom: PropTypes.number.isRequired,
  dark: PropTypes.bool,
};

/**
 * Weather layer
 *
 * @param {Object} props
 * @param {String} props.layer
 * @param {String} props.weatherApiKey
 * @returns {JSX.Element} Weather layer
 */
const WeatherLayer = ({ layer, weatherApiKey }) => {
  return (
    <TileLayer
      attribution='&amp;copy <a href="https://openweathermap.org/">OpenWeather</a>'
      url={`https://tile.openweathermap.org/map/${layer}/{z}/{x}/{y}.png?appid=${weatherApiKey}`}
      apiKey
    />
  );
};

WeatherLayer.propTypes = {
  layer: PropTypes.string.isRequired,
  weatherApiKey: PropTypes.string,
};

/**
 * Determines if truthy, but returns true for 0
 *
 * @param {*} i
 * @returns {Boolean} If truthy or zero
 */
function hasVal(i) {
  return !!(i || i === 0);
}

/**
 * Get timestamps for weather map
 *
 * @returns {Promise} Promise of timestamps
 */
function getMapTimestamps() {
  return new Promise((resolve, reject) => {
    axios
      .get("https://api.rainviewer.com/public/maps.json")
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export default WeatherMap;
