const path = require("path");
const webpack = require("webpack");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");

module.exports = (env, argv) => {
  const PRODUCTION = argv.mode === "production";

  const definePlugin = new webpack.DefinePlugin({
    __PRODUCTION__: JSON.stringify(PRODUCTION),
  });

  return {
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "bundle.min.js",
      publicPath: "/",
      clean: true,
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          include: [path.resolve(__dirname, "src")],
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
          },
        },
        {
          test: /\.html$/,
          use: [
            {
              loader: "html-loader",
            },
          ],
        },
        {
          test: /\.css$/,
          use: [
            "style-loader",
            {
              loader: "css-loader",
              options: {
                sourceMap: !PRODUCTION,
                modules: {
                  namedExport: false,
                  exportLocalsConvention: "camelCase",
                  localIdentName: "[path][name]__[local]--[hash:base64:5]",
                },
              },
            },
            { loader: "postcss-loader", options: { sourceMap: !PRODUCTION } },
          ],
        },
        {
          test: /\.(png|svg|jpg|gif)$/,
          type: "asset",
          parser: {
            dataUrlCondition: { maxSize: 8192 },
          },
          generator: {
            filename: PRODUCTION
              ? "[contenthash][ext]"
              : "[path][name][ext]?[contenthash]",
          },
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          type: "asset/resource",
          generator: {
            filename: PRODUCTION
              ? "[contenthash][ext]"
              : "[path][name][ext]?[contenthash]",
          },
        },
      ],
    },
    resolve: {
      extensions: [".js", ".scss"],
      alias: {
        ["~"]: path.resolve(__dirname, "src"),
      },
    },
    plugins: [
      new HtmlWebPackPlugin({
        template: "./src/index.html",
        filename: "./index.html",
      }),
      new ESLintPlugin({
        extensions: ["js", "jsx"],
        files: "src",
      }),
      definePlugin,
    ],
    watchOptions: {
      ignored: /node_modules/,
    },
  };
};
