import FakeProfile from '../FakeProfile';

const patchCanvas = (
  $window: Window & typeof globalThis,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  fakeProfile: FakeProfile
): void => {
  if (worker.BookmakerName === 'bet365') {
    return;
  }
  const { toBlob } = $window.HTMLCanvasElement.prototype;
  const { toDataURL } = $window.HTMLCanvasElement.prototype;
  const canvasPrototype = $window.HTMLCanvasElement
    .prototype as HTMLCanvasElement & { manipulate: () => unknown };
  canvasPrototype.manipulate = function manipulate() {
    const { width, height } = this;
    const context = this.getContext('2d');
    const shift = fakeProfile.CanvasFingerprint
      ? {
          r: fakeProfile.CanvasFingerprint.R,
          g: fakeProfile.CanvasFingerprint.G,
          b: fakeProfile.CanvasFingerprint.B,
        }
      : {
          r: Math.floor(Math.random() * 10) - 5,
          g: Math.floor(Math.random() * 10) - 5,
          b: Math.floor(Math.random() * 10) - 5,
        };
    const matt = context.getImageData(0, 0, width, height);
    for (let i = 0; i < height; i += Math.max(1, height / 10)) {
      for (let j = 0; j < width; j += Math.max(1, width / 10)) {
        const n = i * (width * 4) + j * 4;
        matt.data[n + 0] = matt.data[n + 0] + shift.r;
        matt.data[n + 1] = matt.data[n + 1] + shift.g;
        matt.data[n + 2] = matt.data[n + 2] + shift.b;
      }
    }
    context.putImageData(matt, 0, 0);
  };
  $window.Object.defineProperty($window.HTMLCanvasElement.prototype, 'toBlob', {
    value(...args: unknown[]) {
      try {
        this.manipulate();
      } catch (e) {
        // console.warn('manipulation failed', e);
      }
      return toBlob.apply(this, args);
    },
  });
  $window.Object.defineProperty(
    $window.HTMLCanvasElement.prototype,
    'toDataURL',
    {
      value(...args: unknown[]) {
        try {
          this.manipulate();
        } catch (e) {
          // console.warn('manipulation failed', e);
        }
        return toDataURL.apply(this, args);
      },
    }
  );
};

export default patchCanvas;
