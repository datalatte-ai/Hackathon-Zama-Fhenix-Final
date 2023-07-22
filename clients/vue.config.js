const { defineConfig } = require("@vue/cli-service");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    resolve: {
      fallback: {
        crypto: require.resolve("crypto-browserify"),
        stream: require.resolve("stream-browserify"),
        path: require.resolve("path-browserify"),
        "tfhe_bg.wasm": require.resolve("tfhe/tfhe_bg.wasm"),
      },
    },
    plugins: [
      new CopyPlugin({
        patterns: [
          {
            from: "node_modules/fhevmjs/bundle/*",
            to: "static/[name][ext]",
          },
        ],
      }),
    ],
  },
});
