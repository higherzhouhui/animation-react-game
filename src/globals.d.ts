declare module "*.scss";
declare module "lodash";
declare module "*.mp3";
declare module "*.jpg";
declare module "*.png";

declare interface Window {
  $bus: {
    emit: any;
    removeListener: any;
    addListener: any;
  };
}
