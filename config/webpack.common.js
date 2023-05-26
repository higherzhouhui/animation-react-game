const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const loaderUtils = require("loader-utils");
require("@babel/polyfill");
const friendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");
const isDEV = process.env.BASE_ENV === "development";
const SpritesmithPlugin = require("webpack-spritesmith");

const commonScss = {
  loader: "sass-resources-loader",
  options: {
    resources: [path.resolve(__dirname, "../src/assets/style/index.scss")],
  },
};
module.exports = {
  entry: {
    main: path.resolve(__dirname, "../src/index.tsx"),
  },
  output: {
    path: path.resolve(__dirname, "../dist"),
    filename: "js/[name].bundle.js",
  },
  plugins: [
    new friendlyErrorsWebpackPlugin({
      clearConsole: true,
    }),
    new HtmlWebpackPlugin({
      title: "FBS",
      template: path.resolve(__dirname, "../public/index.html"),
      filename: "index.html",
    }),
    new SpritesmithPlugin({
      src: {
        cwd: path.resolve(__dirname, "../src/assets/image/icon"),
        glob: "*.png",
      },
      target: {
        image: path.resolve(__dirname, "../src/assets/sprite/sprite.png"),
        css: [
          [
            path.resolve(__dirname, "../src/assets/sprite/sprite.css"),
            {
              format: "function_based_template",
            },
          ],
        ],
      },
      apiOptions: {
        cssImageRef: "./sprite.png",
      },
      customTemplates: {
        function_based_template: (data) => {
          var perSprite = data.sprites
            .map(function (sprite) {
              return ".icon-N { width: Wpx; height: Hpx; background-position: Xpx Ypx;background-image: url(I);background-size: bzWpx bzHpx; }"
                .replace("N", sprite.name)
                .replace("W", sprite.width / 2)
                .replace("H", sprite.height / 2)
                .replace("X", sprite.offset_x / 2)
                .replace("Y", sprite.offset_y / 2)
                .replace("I", data.sprites[0].image)
                .replace("bzW", sprite.total_width / 2)
                .replace("bzH", sprite.total_height / 2);
            })
            .join("\n");

          return perSprite;
        },
      },
    }),
  ],
  module: {
    unsafeCache: true,
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              ["@babel/preset-env"],
              ["@babel/preset-react", { runtime: "classic" }],
              ["@babel/preset-typescript"], // 加上这一句
            ],
          },
        },
      },
      {
        test: /\.(mp3|wav|wma|ape|aac)$/i,
        use: ["file-loader"],
      },
      {
        test: /.(png|jpg|jpeg|gif|svg)$/, // 匹配图片文件
        type: "asset", // type选择asset
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 小于10kb转base64位
          },
        },
        generator: {
          filename: "images/[name].[contenthash:8][ext]", // 文件输出目录和命名
        },
        use: [
          {
            loader: "image-webpack-loader",
            options: {
              mozjpeg: {
                progressive: true,
              },
              optipng: {
                enabled: true,
                quality: 0.75,
              },
              pngquant: {
                quality: [0.65, 0.8],
                speed: 4,
              },
              gifsicle: {
                interlaced: true,
              },
              // the webp option will enable WEBP
              webp: {
                quality: 75,
              },
            },
          },
        ],
      },
      {
        test: /\.css$/,
        exclude: /\.module\.css$/,
        use: [isDEV ? "style-loader" : MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
      },
      {
        test: /\.scss$/,
        exclude: /\.module\.scss$/,
        use: [isDEV ? "style-loader" : MiniCssExtractPlugin.loader, "css-loader", "postcss-loader", "sass-loader", commonScss],
      },
      {
        test: /\.module\.scss$/,
        use: [
          isDEV ? "style-loader" : MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              modules: {
                getLocalIdent: (context, localIdentName, localName, options) => {
                  // Use the filename or folder name, based on some uses the index.js / index.module.(css|scss|sass) project style
                  const fileNameOrFolder = context.resourcePath.match(/index\.module\.(css|scss|sass)$/) ? "[folder]" : "[name]";
                  // Create a hash based on a the file location and class name. Will be unique across a project, and close to globally unique.
                  const hash = loaderUtils.getHashDigest(path.posix.relative(context.rootContext, context.resourcePath) + localName, "md5", "base64", 5);
                  // Use loaderUtils to find the file or folder name
                  const className = loaderUtils.interpolateName(context, fileNameOrFolder + "_" + localName + "__" + hash, options);
                  // remove the .module that appears in every classname when based on the file.
                  return className.replace(".module_", "_");
                },
              },
            },
          },
          "postcss-loader",
          "sass-loader",
          commonScss,
        ],
      },
    ],
  },
  devServer: {
    port: 4000,
    compress: false, // gzip压缩,开发环境不开启,提升热更新速度
    hot: true, // 开启热更新，后面会讲react模块热替换具体配置
    historyApiFallback: true, // 当使用 HTML5 History API 时，任意的 404 响应都可能需要被替代为 index.html
    static: {
      directory: path.join(__dirname, "../public"), //托管静态资源public文件夹
    },
    proxy: {
      "/api": {
        // target: 'http://fbsweb.testlive.vip', //fbs 测试环境 （默认连接测试环境开发）
        target: "http://fbs-web.testlive.vip", //fbs 测试环境 （默认连接测试环境开发）
        // target: "http://192.168.12.22:8101", //fbs 测试环境 （默认连接测试环境开发）
        // target: 'http://fbs-liveapi.testlive.vip', //fbs 测试环境 （默认连接测试环境开发）
        // target: 'http://fbslive.com', //fbs 正式环境
        changeOrigin: true,
        pathRewrite: { "^/api": "/api" },
      },
      "/service-game-platform": {
        target: "http://game.testlive.vip",
        changeOrigin: true,
      },
    },
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
    alias: {
      "@": path.join(__dirname, "../src"),
    },
  },
};
