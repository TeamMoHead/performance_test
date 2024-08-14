export function initGlobalFPSFunction() {
  window.getFPS = function (duration) {
    console.log('[TEST PAGE] => Measuring FPS started');
    return new Promise(resolve => {
      let frameCount = 0;
      let startTime = performance.now();

      function countFrame(timestamp) {
        frameCount++;
        if (performance.now() - startTime < duration) {
          requestAnimationFrame(countFrame);
        } else {
          let fps = Math.round(frameCount / (duration / 1000));
          console.log('[TEST PAGE] => Measuring FPS finished & FPS: ', fps);
          resolve(fps);
        }
      }

      requestAnimationFrame(countFrame);
    });
  };
}
