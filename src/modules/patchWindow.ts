import FakeProfile from '../FakeProfile';

const patchWindow = (
  $window: Window & typeof globalThis,
  fakeProfile: FakeProfile,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  iframe = false
): void => {
  // eslint-disable-next-line no-param-reassign
  delete $window.CefSharp;
  // eslint-disable-next-line no-param-reassign
  delete $window.cefSharp;

  // TODO: разобраться с масштабированием.
  Object.defineProperty($window, 'outerWidth', {
    value: fakeProfile.ScreenSize.WindowOuterWidth,
    configurable: false,
    enumerable: true,
    writable: true,
  });

  Object.defineProperty($window, 'outerHeight', {
    value: fakeProfile.ScreenSize.WindowOuterHeight,
    configurable: false,
    enumerable: true,
    writable: true,
  });

  Object.defineProperty($window, 'innerHeight', {
    value: fakeProfile.ScreenSize.WindowScreenHeight - 106,
    configurable: false,
    enumerable: true,
    writable: true,
  });

  Object.defineProperty($window, 'innerWidth', {
    value: fakeProfile.ScreenSize.WindowScreenAvailWidth,
    configurable: false,
    enumerable: true,
    writable: true,
  });

  Object.defineProperty($window.screen, 'height', {
    value: fakeProfile.ScreenSize.WindowScreenHeight,
    configurable: false,
    enumerable: true,
    writable: true,
  });

  Object.defineProperty($window.screen, 'width', {
    value: fakeProfile.ScreenSize.WindowScreenWidth,
    configurable: false,
    enumerable: true,
    writable: true,
  });

  Object.defineProperty($window.screen, 'availWidth', {
    value: fakeProfile.ScreenSize.WindowScreenAvailWidth,
    configurable: false,
    enumerable: true,
    writable: true,
  });

  Object.defineProperty($window.screen, 'availHeight', {
    value: fakeProfile.ScreenSize.ScreenAvailHeight,
    configurable: false,
    enumerable: true,
    writable: true,
  });

  Object.defineProperty($window.screen, 'pixelDepth', {
    value: 24,
    configurable: false,
    enumerable: true,
    writable: true,
  });

  // Этот проп обязателен для бетки, без него при авторизации пишет "Неверные данные" [07.08.2021]
  Object.defineProperty($window.screen, 'colorDepth', {
    value: 24,
    configurable: false,
    enumerable: true,
    writable: true,
  });

  // условие на iframe и рекапчу было в фиксе бетки Мегабота, но скорее всего не требуется [07.08.2021]
  // if (!iframe && document.querySelector("#recaptcha-token") == null) {
  Object.defineProperty($window.HTMLBodyElement.prototype, 'offsetWidth', {
    value: fakeProfile.ScreenSize.WindowScreenWidth - 17,
    configurable: false,
    enumerable: true,
    writable: false,
  });
  Object.defineProperty($window.HTMLBodyElement.prototype, 'offsetHeight', {
    value: fakeProfile.ScreenSize.WindowScreenHeight - 106,
    configurable: false,
    enumerable: true,
    writable: false,
  });
  Object.defineProperty($window.HTMLBodyElement.prototype, 'clientWidth', {
    value: fakeProfile.ScreenSize.WindowScreenWidth - 17,
    configurable: false,
    enumerable: true,
    writable: false,
  });
  Object.defineProperty($window.HTMLBodyElement.prototype, 'clientHeight', {
    value: fakeProfile.ScreenSize.WindowScreenHeight - 106,
    configurable: false,
    enumerable: true,
    writable: false,
  });
  // }

  // В Bet365 не грузится страница без этого костыля
  // Походу уже фикс (подмена UA только в не iframe) необязателен, работает без него [07.08.2021]
  // if (iframe !== true) {
  Object.defineProperty($window.navigator, 'userAgent', {
    value: fakeProfile.UserAgent,
    configurable: true,
    enumerable: true,
    writable: true,
  });
  // }
  Object.defineProperty($window.navigator, 'appVersion', {
    value: fakeProfile.AppVersion,
    configurable: true,
    enumerable: true,
    writable: true,
  });
};

export default patchWindow;
