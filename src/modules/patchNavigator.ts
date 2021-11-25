import FakeProfile from '../FakeProfile';

declare global {
  interface Window {
    BatteryManager: Record<string, unknown>;
  }
}

const patchNavigator = ($window: Window, fakeProfile: FakeProfile): void => {
  Object.defineProperty($window.navigator, 'deviceMemory', {
    configurable: true,
    enumerable: true,
    value: fakeProfile.MemoryAvailable,
  });

  Object.defineProperty($window.navigator, 'maxTouchPoints', {
    configurable: true,
    enumerable: true,
    value: 0,
  });

  Object.defineProperty($window.navigator, 'maxTouchPoints', {
    configurable: true,
    enumerable: true,
    get() {
      return 0;
    },
  });

  const bluetooth = {
    getAvailability: () => {
      return new Promise((resolve, reject) => {
        resolve(false);
      });
    },
  };

  Object.defineProperty($window.navigator, 'bluetooth', {
    configurable: true,
    enumerable: true,
    value: bluetooth,
  });

  Object.defineProperty($window.navigator, 'hardwareConcurrency', {
    configurable: true,
    enumerable: true,
    value: fakeProfile.CpuConcurrency,
  });

  const battaryPatch = ($$window: Window) => {
    Object.defineProperty($$window.BatteryManager.prototype, 'level', {
      value: 1,
      configurable: false,
      enumerable: true,
      writable: true,
    });

    Object.defineProperty(
      $$window.BatteryManager.prototype,
      'dischargingTime',
      {
        value: Infinity,
        configurable: false,
        enumerable: true,
        writable: true,
      }
    );

    Object.defineProperty($$window.BatteryManager.prototype, 'charging', {
      value: true,
      configurable: false,
      enumerable: true,
      writable: true,
    });

    // console.info('BatteryManager patched');
  };

  battaryPatch($window);
  // console.info('navigator patched');
};

export default patchNavigator;
