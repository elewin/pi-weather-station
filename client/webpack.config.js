const path = require("path");
const webpack = require("webpack");
const HtmlWebPackPlugin = require("html-webpack-plugin");

module.exports = (env) => {
  const PRODUCTION = !!(env && env.BUILD_PRODUCTION);
  process.env.NODE_ENV = PRODUCTION ? "production" : "development";

  const definePlugin = new webpack.DefinePlugin({
    __PRODUCTION__: JSON.stringify(
      JSON.parse(env ? env.BUILD_PRODUCTION || "false" : "false")
    ),
  });

  return {
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "bundle.min.js",
      publicPath: "/",
    },
    module: {
      rules: [
        {
          enforce: "pre",
          test: /\.js$/,
          include: [path.resolve(__dirname, "src")],
          exclude: /node_modules/,
          use: {
            loader: "eslint-loader"
          }
        },        
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
          use: [
            {
              loader: "url-loader",
              options: {
                limit: 8192,
                sourceMap: !PRODUCTION,
                name: PRODUCTION
                ? "[contenthash].[ext]"
                : "[path][name].[ext]?[contenthash]"                
              },
            },
          ],
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          use: [
            {
              loader: "file-loader",
              options: {
                sourceMap: !PRODUCTION,
                name: PRODUCTION
                  ? "[contenthash].[ext]"
                  : "[path][name].[ext]?[contenthash]"
              },
            },
          ],
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
      definePlugin,
    ],
    watchOptions: {
      ignored: /node_modules/
    }
  };
};
