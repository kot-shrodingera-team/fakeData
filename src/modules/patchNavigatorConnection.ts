const patchNavigatorСonnection = ($window: Window): void => {
  // TODO: убрать это после обновления хрома
  class NetworkInformation {}

  Object.defineProperty(NetworkInformation.prototype, 'downlink', {
    // __proto__: null,
    configurable: true,
    enumerable: true,
    get() {
      return 8.1;
    },
  });

  Object.defineProperty(NetworkInformation.prototype, 'effectiveType', {
    // __proto__: null,
    configurable: true,
    enumerable: true,
    get() {
      return '4g';
    },
  });

  Object.defineProperty(NetworkInformation.prototype, 'onchange', {
    // __proto__: null,
    configurable: true,
    enumerable: true,
    get() {
      return null;
    },
  });

  Object.defineProperty(NetworkInformation.prototype, 'rtt', {
    // __proto__: null,
    configurable: true,
    enumerable: true,
    get() {
      return 100;
    },
  });

  Object.defineProperty(NetworkInformation.prototype, 'saveData', {
    // __proto__: null,
    configurable: true,
    enumerable: true,
    get() {
      return false;
    },
  });

  const networkInfo = new NetworkInformation();

  Object.defineProperty($window.navigator, 'connection', {
    // __proto__: NetworkInformation.prototype,
    configurable: true,
    enumerable: true,
    value: networkInfo,
  });

  // console.info('navigator.connection patched');
};

export default patchNavigatorСonnection;
