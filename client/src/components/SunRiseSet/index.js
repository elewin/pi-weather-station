import React, { useContext } from "react";
import { AppContext } from "~/AppContext";
import { InlineIcon } from "@iconify/react";
import bxsMoon from '@iconify/icons-bx/bxs-moon';
import bxsSun from '@iconify/icons-bx/bxs-sun';

import { format } from "date-fns";
import styles from "./styles.css";

/**
 * Sunrise / Sunset component
 *
 * @returns {JSX.Element} Sunrise / Sunset component
 */
const SunRiseSet = () => {
  const { sunriseTime, sunsetTime, clockTime } = useContext(AppContext);
  if (sunriseTime && sunsetTime) {
    return (
      <div className={styles.container}>
        <div>
          <InlineIcon icon={bxsSun} />
          <span>
            {format(new Date(sunriseTime), clockTime === "12" ? "p" : "HH:mm")}
          </span>
        </div>
        <div>
          <InlineIcon icon={bxsMoon} />
          <span>
            {format(new Date(sunsetTime), clockTime === "12" ? "p" : "HH:mm")}
          </span>
        </div>
      </div>
    );
  } else {
    return null;
  }
};

export default SunRiseSet;
