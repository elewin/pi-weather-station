import React, { useContext, useState, useEffect, useCallback } from "react";
import { AppContext } from "~/AppContext";
import styles from "../styles.css";
import { Line } from "react-chartjs-2";
import { format } from "date-fns";
import {
  convertTemp,
  convertLength,
  convertSpeed,
} from "~/services/conversions";
import { fontColor } from "../common";

const createChartOptions = ({
  darkMode,
  tempUnit,
  speedUnit,
  lengthUnit,
  altMode,
}) => {
  return {
    maintainAspectRatio: false,
    legend: {
      display: false,
    },
    responsive: true,
    hoverMode: "index",
    stacked: false,
    title: {
      display: true,
      text: `5 Day ${
        altMode
          ? `Wind Speed / Precipitation (${lengthUnit})`
          : `Temp / Precipitation`
      }`,
      fontColor: fontColor(darkMode),
      fontFamily: "Rubik, sans-serif",
    },
    scales: {
      xAxes: [
        {
          ticks: {
            fontColor: fontColor(darkMode),
            fontFamily: "Rubik, sans-serif",
          },
        },
      ],
      yAxes: [
        {
          type: "linear",
          display: true,
          position: "left",
          id: "y-axis-1",
          ticks: {
            fontColor: fontColor(darkMode),
            fontFamily: "Rubik, sans-serif",
            maxTicksLimit: 5,
            callback: (val) => {
              return altMode
                ? `${val} ${speedUnit === "mph" ? "mph" : "m/s"}`
                : `${val} ${tempUnit.toUpperCase()}`;
            },
          },
        },
        {
          type: "linear",
          display: true,
          position: "right",
          id: "y-axis-2",
          ticks: {
            fontColor: fontColor(darkMode),
            fontFamily: "Rubik, sans-serif",
            maxTicksLimit: 5,
            suggestedMin: 0,
            callback: (val) => {
              return `${val}${altMode ? ` ${lengthUnit}` : "%"}`;
            },
          },
          gridLines: {
            drawOnChartArea: false,
          },
        },
      ],
    },
  };
};

const chartColors = {
  blue: "rgba(63, 127, 191, 0.5)",
  gray: "rgba(127, 127, 127, 0.5)",
};

const mapChartData = ({
  data: weatherData,
  tempUnit,
  speedUnit,
  altMode,
  lengthUnit,
}) => {
  const data = weatherData?.data?.timelines?.[0]?.intervals;
  if (!data) {
    return null;
  }
  return {
    labels: data.map((e) => {
      const date = new Date(e.startTime);
      const adjustedTimestamp =
        date.getTime() + date.getTimezoneOffset() * 60 * 1000;
      return format(new Date(adjustedTimestamp), "EEEEE");
    }),
    datasets: [
      {
        radius: 0,
        label: altMode ? "Wind Speed" : "Temp",
        data: data.map((e) => {
          const {
            values: { windSpeed, temperature },
          } = e;
          return altMode
            ? convertSpeed(windSpeed, speedUnit)
            : convertTemp(temperature, tempUnit);
        }),
        yAxisID: "y-axis-1",
        borderColor: chartColors.gray,
        backgroundColor: chartColors.gray,
        fill: false,
      },
      {
        radius: 0,
        label: "Precipitation",
        data: data.map((e) => {
          const {
            values: { precipitationIntensity, precipitationProbability },
          } = e;
          return altMode
            ? convertLength(precipitationIntensity, lengthUnit)
            : precipitationProbability;
        }),
        yAxisID: "y-axis-2",
        borderColor: chartColors.blue,
        backgroundColor: chartColors.blue,
        fill: false,
      },
    ],
  };
};

/**
 * Daily forecast chart
 *
 * @returns {JSX.Element} Hourly forecast chart
 */
const DailyChart = () => {
  const {
    dailyWeatherData,
    dailyWeatherDataErr,
    dailyWeatherDataErrMsg,
    tempUnit,
    darkMode,
    lengthUnit,
    speedUnit,
  } = useContext(AppContext);

  const [altMode, setAltMode] = useState(false);
  const [chartData, setChartData] = useState(null);
  const [chartOptions, setChartOptions] = useState(null);

  const setChartDataCallback = useCallback((e) => setChartData(e), []);
  const setChartOptionsCallback = useCallback((e) => setChartOptions(e), []);

  useEffect(() => {
    if (dailyWeatherData) {
      setChartDataCallback(
        mapChartData({
          data: dailyWeatherData,
          tempUnit,
          lengthUnit,
          speedUnit,
          altMode,
        })
      );

      setChartOptionsCallback(
        createChartOptions({
          tempUnit,
          darkMode,
          lengthUnit,
          speedUnit,
          altMode,
        })
      );
    }
  }, [
    dailyWeatherData,
    tempUnit,
    lengthUnit,
    altMode,
    speedUnit,
    darkMode,
    setChartOptionsCallback,
    setChartDataCallback,
  ]);

  if (chartData && chartOptions) {
    return (
      <div
        className={styles.container}
        onClick={() => {
          setAltMode(!altMode);
        }}
      >
        <Line options={chartOptions} data={chartData} />
      </div>
    );
  } else if (dailyWeatherDataErr) {
    return (
      <div
        className={`${darkMode ? styles.dark : styles.light} ${
          styles.errContainer
        }`}
      >
        <div>Cannot get 5 day weather forecast</div>
        <div className={styles.message}>{dailyWeatherDataErrMsg}</div>
      </div>
    );
  } else {
    return null;
  }
};

export default DailyChart;
