import React from "react";
import styles from "./styles.css";
import PropTypes from "prop-types";

/*
https://github.com/tobiasahlin/SpinKit
The MIT License (MIT)

Copyright (c) 2020 Tobias Ahlin

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/**
 * A spinner based off of https://github.com/tobiasahlin/SpinKit
 *
 * @param {Object} props
 * @param {String} props.color
 * @param {String} props.size
 * @returns {JSX.Element} Spinner
 */
function Spinner({ color, size }) {
  const style = {
    height: size,
    width: size,
    backgroundColor: color,
  };

  return (
    <div className={styles.spinner}>
      <div className={styles.bounce1} style={style} />
      <div className={styles.bounce2} style={style} />
      <div className={styles.bounce3} style={style} />
    </div>
  );
}

Spinner.propTypes = {
  size: PropTypes.string,
  color: PropTypes.string,
};

export default Spinner;
