import React, { useEffect, useState, useContext } from "react";
import { AppContext } from "~/AppContext";
import { format } from "date-fns";
import styles from "./styles.css";
import SunRiseSet from "~/components/SunRiseSet";

/**
 * Displays time and date
 *
 * @returns {JSX.Element} Clock component
 */
const Clock = () => {
  const { clockTime } = useContext(AppContext);
  const [date, setDate] = useState(new Date().getTime());

  useEffect(() => {
    const clockInterval = setInterval(() => {
      setDate(new Date().getTime());
    }, 1000);
    return () => {
      clearInterval(clockInterval);
    };
  }, []);

  return (
    <div>
      <div className={styles.date}>
        {format(date, "cccc").toUpperCase()}{" "}
        {format(date, "LLLL").toUpperCase()} {format(date, "d")}
      </div>
      <div className={styles.time}>{format(date, clockTime === "12" ? "p" : "HH:mm")}</div>
      <div className={styles.sunRiseSetContainer}>
        <SunRiseSet/>
      </div>
    </div>
  );
};

export default Clock;
