import FakeProfile from '../FakeProfile';

const protectedCanvasFingerPrint = (
  $window: Window & typeof globalThis,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  fakeProfile: FakeProfile
): void => {
  // const fillPtr = $window.CanvasRenderingContext2D.prototype.fillRect;

  // // eslint-disable-next-line no-param-reassign
  // $window.CanvasRenderingContext2D.prototype.fillRect = function fillRect(
  //   ...args
  // ) {
  //   if (!this.callCounter) {
  //     this.callCounter = 0;
  //   }
  //   this.callCounter += 1;
  //   // $window.console.log('Кто-то добавил текст' + JSON.stringify(arguments) + ' ' + this.callCounter + " раз");
  //   return fillPtr.apply(this, args);
  // };

  // // const ptr = $window.HTMLCanvasElement.prototype.toDataURL;
  // // // eslint-disable-next-line no-param-reassign
  // // $window.HTMLCanvasElement.prototype.toDataURL = function (...args) {
  // //   if (console) {
  // //     // console.warn('Кто-то считал канвас');
  // //   }
  // //   const ctx = this.getContext('2d');
  // //   if (ctx) {
  // //     if (ctx.callCounter < 500) {
  // //       // изначально было 0.1, в какой-то момент с таким значением в бетке были проблемы с загрузкой страницы
  // //       // ctx.fillStyle = 'rgba(255, 255, 0, 0.1)';
  // //       // вроде как нормально работало, если число не такое круглое, но ткак же работало и с 0, оставил 0
  // //       // ctx.fillStyle = 'rgba(255, 255, 0, 0)';
  // //       // но оказалось, что с таким значением не меняется canvas fingerprint
  // //       // возможно вернуть 0.1 нормальный вариант, но пока попробуем просто другое близкое значение
  // //       ctx.fillStyle = 'rgba(255, 255, 0, 0.97153)';
  // //       const randFinger = fakeProfile.CanvasFingerPrintHash;
  // //       ctx.fillText(randFinger, 2, 15);
  // //     }
  // //   }
  // //   return ptr.apply(this, args);
  // // };

  // if ($window.location.href.indexOf('wedo.bet/') === -1) {
  //   /* eslint-disable no-param-reassign */
  //   $window.HTMLCanvasElement.prototype.toDataURL.toString = () => {
  //     return 'toDataURL() { [native code] }';
  //   };
  //   $window.HTMLCanvasElement.prototype.toDataURL.toString.toString = () => {
  //     return 'toString() { [native code] }';
  //   };
  //   $window.HTMLCanvasElement.prototype.toDataURL.toString.toString.toString =
  //     () => {
  //       return 'toString() { [native code] }';
  //     };
  //   $window.HTMLCanvasElement.prototype.toDataURL.toString.toString.toString.toString =
  //     () => {
  //       return 'toString() { [native code] }';
  //     };
  //   $window.HTMLCanvasElement.prototype.toDataURL.toString.toString.toString.toString.toString =
  //     () => {
  //       return 'toString() { [native code] }';
  //     };
  //   $window.HTMLCanvasElement.prototype.toDataURL.toString.toString.toString.toString.toString.toString =
  //     () => {
  //       return 'toString() { [native code] }';
  //     };
  //   /* eslint-enable no-param-reassign */
  // }

  const { toBlob } = $window.HTMLCanvasElement.prototype;
  const { toDataURL } = $window.HTMLCanvasElement.prototype;
  // const { getImageData } = $window.CanvasRenderingContext2D.prototype;
  //
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, func-names
  (HTMLCanvasElement.prototype as any).manipulate = function () {
    const { width, height } = this;
    const context = this.getContext('2d');
    const shift = {
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
  console.log('Test');
  Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
    // eslint-disable-next-line func-names, object-shorthand
    value: function (...args: unknown[]) {
      try {
        this.manipulate();
        console.warn('manipulated');
      } catch (e) {
        console.warn('manipulation failed', e);
      }
      return toBlob.apply(this, args);
    },
  });
  Object.defineProperty(HTMLCanvasElement.prototype, 'toDataURL', {
    // eslint-disable-next-line func-names, object-shorthand
    value: function (...args: unknown[]) {
      try {
        this.manipulate();
        console.warn('manipulated');
      } catch (e) {
        console.warn('manipulation failed', e);
      }
      return toDataURL.apply(this, args);
    },
  });

  // console.info('canvas patched');
};

export default protectedCanvasFingerPrint;
