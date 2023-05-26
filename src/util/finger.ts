import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { Local, getParams } from "../common";

export const getFinger = () => {
  return new Promise((resolve, reject) => {
    if (getParams("udid")) {
      Local("finger", getParams("udid"));
      resolve(getParams("udid"));
    } else {
      FingerprintJS.load().then((fp) => {
        if (!Local("finger")) {
          fp.get().then((result) => {
            const visitorId = result.visitorId;
            Local("finger", visitorId);
            resolve(visitorId);
          });
        } else {
          resolve(Local("finger"));
        }
      });
    }
  });
};
