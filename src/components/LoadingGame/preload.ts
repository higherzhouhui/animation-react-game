export const preload = (obj: { files: any[]; progress: (num: number) => void; complete: () => void }) => {
  let count = 0;
  let fakeProgress = 0; //模拟进度
  const { files, progress, complete } = obj;
  let len = files.length;
  files.forEach((item, index) => {
    let imgObj = new Image();
    imgObj.addEventListener("load", function (e) {
      let p = Math.round(((count + 1) / len) * 100);
      if (fakeProgress <= p) {
        fakeProgress = p;
        progress(fakeProgress);
      }
      if (p === 100) {
        setTimeout(() => {
          complete();
        }, 1000);
      }
      count++;
    });
    imgObj.src = item;
  });
  const startFake = () => {
    setTimeout(() => {
      fakeProgress += 1;
      progress(fakeProgress);
      if (fakeProgress < 99) startFake();
    }, countTime(fakeProgress));
  };
  const countTime = (num: number) => {
    if (num < 20) {
      return 200;
    } else if (num < 40) {
      return 400;
    } else if (num < 60) {
      return 600;
    } else if (num < 80) {
      return 800;
    } else return 2000;
  };
  startFake();
};
