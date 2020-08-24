const postcssPresetEnv = require("postcss-preset-env");
const autoprefixer = require("autoprefixer");

const config = {
  plugins: [
    autoprefixer,
    postcssPresetEnv()
  ]
};

module.exports = config;
