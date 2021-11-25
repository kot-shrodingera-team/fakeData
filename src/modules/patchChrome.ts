declare global {
  const worker: {
    BookmakerName: string;
  };
  interface Window {
    chrome: {
      runtime: {
        onMessage: {
          addListener: (
            callback: (
              request: {
                path: unknown;
                method: unknown;
                data: unknown;
              },
              sender: unknown,
              sendResponse: unknown
            ) => unknown
          ) => unknown;
        };
        sendMessage: (data: unknown) => unknown;
      };
    };
  }
}

const patchChrome = ($window: Window): void => {
  // Вроде как chrome.webstore уже deprecated
  // https://developer.chrome.com/docs/extensions/reference/webstore/
  // В обычном хроме chrome.webstore = undefined
  // class Event {
  //   addListener: () => unknown;

  //   addRules: () => unknown;

  //   dispatch: () => unknown;

  //   dispatchToListener: () => unknown;

  //   getRules: () => unknown;

  //   hasListener: () => unknown;

  //   hasListeners: () => unknown;

  //   removeListener: () => unknown;

  //   removeRules: () => unknown;

  //   constructor() {
  //     this.addListener = () => {};
  //     this.addRules = () => {};
  //     this.dispatch = () => {};
  //     this.dispatchToListener = () => {};
  //     this.getRules = () => {};
  //     this.hasListener = () => {};
  //     this.hasListeners = () => {};
  //     this.removeListener = () => {};
  //     this.removeRules = () => {};
  //   }
  // }
  // const webStore = {
  //   install: (url: unknown, onSuccess: unknown, onFailure: unknown) => {
  //     console.info('Кто-то пытаеться установить расширение');
  //     console.info(url);
  //     console.info(onSuccess);
  //     console.info(onFailure);
  //   },
  //   onDownloadProgress: new Event(),
  //   onInstallStageChanged: new Event(),
  // };

  const app = {
    getDetails: function GetDetails() {},
    getIsInstalled: function GetIsInstalled() {},
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    installState: function GetInstallState(callback: unknown) {},
    isInstalled: false,
    runningState: function GetRunningState() {},
  };

  const runtime = {
    OnInstalledReason: {
      CHROME_UPDATE: 'chrome_update',
      INSTALL: 'install',
      SHARED_MODULE_UPDATE: 'shared_module_update',
      UPDATE: 'update',
    },
    OnRestartRequiredReason: {
      APP_UPDATE: 'app_update',
      OS_UPDATE: 'os_update',
      PERIODIC: 'periodic',
    },
    PlatformArch: {
      ARM: 'arm',
      X86_32: 'x86-32',
      X86_64: 'x86-64',
    },
    PlatformNaclArch: {
      ARM: 'arm',
      X86_32: 'x86-32',
      X86_64: 'x86-64',
    },
    PlatformOs: {
      ANDROID: 'android',
      CROS: 'cros',
      LINUX: 'linux',
      MAC: 'mac',
      OPENBSD: 'openbsd',
      WIN: 'win',
    },
    RequestUpdateCheckStatus: {
      NO_UPDATE: 'no_update',
      THROTTLED: 'throttled',
      UPDATE_AVAILABLE: 'update_available',
    },
    // connect и sendMessage нужны для бетки [07.08.2021]
    // Но в Лиге Ставок и 1ЦУПИС с ним выдаёт ошибку 403
    ...(typeof worker === 'undefined' || worker.BookmakerName === 'bet365'
      ? {
          connect() {
            // console.info('Кто-то пытаеться использовать chrome.runtime.connect');
            return {
              onDisconnect: {
                addListener: (ls: () => unknown) => {
                  ls();
                },
              },
            };
          },
          sendMessage() {
            // console.info('Кто-то пытаеться использовать chrome.runtime.sendMessage');
          },
        }
      : {}),
  };

  Object.defineProperty(app, 'isInstalled', {
    // __proto__: null,
    configurable: true,
    enumerable: true,
    get() {
      return false;
    },
  });

  // Этот объект обязателен для бетки [07.08.2021]
  Object.defineProperty($window.chrome, 'runtime', {
    // __proto__: null,
    configurable: true,
    enumerable: true,
    value: runtime,
  });

  // Object.defineProperty(
  //     $window.chrome, 'webstore',
  //     {
  //         __proto__: null,
  //         configurable: true,
  //         enumerable: true,
  //         get: function nativeGetter() { return webStore; }
  //     });

  Object.defineProperty($window.chrome, 'app', {
    // __proto__: null,
    configurable: true,
    enumerable: true,
    get: function nativeGetter() {
      return app;
    },
  });

  // console.info('Chrome patched');
};

export default patchChrome;
