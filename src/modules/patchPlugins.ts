const patchPlugins = ($window: Window, iframe = false): void => {
  const createFakeMimeType = (
    description: string,
    suffixes: string,
    type: string
  ): MimeType => {
    const fakeMimeType = Object.create(navigator.mimeTypes[0]);

    Object.defineProperty(fakeMimeType, 'type', {
      value: type,
      configurable: false,
      enumerable: true,
      writable: false,
    });

    Object.defineProperty(fakeMimeType, 'suffixes', {
      value: suffixes,
      configurable: false,
      enumerable: true,
      writable: false,
    });

    Object.defineProperty(fakeMimeType, 'description', {
      value: description,
      configurable: false,
      enumerable: true,
      writable: false,
    });

    return fakeMimeType;
  };

  const createFakeMimeTypesInNavigator = (
    $$window: Window,
    mimeTypes: MimeType[]
  ) => {
    const fakeArray = Object.create($$window.navigator.mimeTypes);

    const { length } = mimeTypes;
    for (let i = 0; i < mimeTypes.length; i += 1) {
      Object.defineProperty(fakeArray, i, {
        value: mimeTypes[i],
        configurable: false,
        enumerable: true,
        writable: false,
      });
      Object.defineProperty(fakeArray, mimeTypes[i].type, {
        value: mimeTypes[i],
        configurable: false,
        enumerable: false,
        writable: false,
      });
    }

    Object.defineProperty(fakeArray, 'length', {
      value: length,
      configurable: false,
      enumerable: true,
      writable: false,
    });

    Object.defineProperty($$window.navigator, 'mimeTypes', {
      value: fakeArray,
      configurable: false,
      enumerable: true,
      writable: true,
    });
  };

  const createFakePlugin = (
    description: string,
    fileName: string,
    name: string
  ): Plugin => {
    const plugin = Object.create(navigator.plugins[0]);

    Object.defineProperty(plugin, 'description', {
      value: description,
      configurable: false,
      enumerable: true,
      writable: false,
    });
    Object.defineProperty(plugin, 'filename', {
      value: fileName,
      configurable: false,
      enumerable: true,
      writable: false,
    });
    // Object.defineProperty(plugin, 'length', {
    //   value: length,
    //   configurable: false,
    //   enumerable: true,
    //   writable: false,
    // });

    Object.defineProperty(plugin, 'name', {
      value: name,
      configurable: false,
      enumerable: true,
      writable: false,
    });

    return plugin;
  };

  const setEnebledPlugin = (mimeType: MimeType, plugin: Plugin): void => {
    Object.defineProperty(mimeType, 'enabledPlugin', {
      value: plugin,
      configurable: false,
      enumerable: true,
      writable: false,
    });
  };

  const updateFakePlugin = (plugin: Plugin, mimeTypes: MimeType[]): void => {
    const { length } = mimeTypes;

    Object.defineProperty(plugin, 'length', {
      value: length,
      configurable: false,
      enumerable: true,
      writable: false,
    });

    for (let i = 0; i < mimeTypes.length; i += 1) {
      Object.defineProperty(plugin, i, {
        value: mimeTypes[i],
        configurable: false,
        enumerable: true,
        writable: false,
      });

      Object.defineProperty(plugin, mimeTypes[i].type, {
        value: mimeTypes[i],
        configurable: false,
        enumerable: false,
        writable: false,
      });
    }
  };

  const createFakePluginsTypesInNavigator = (
    $$window: Window,
    plugins: Plugin[]
  ): void => {
    const fakeArray = Object.create($$window.navigator.plugins);

    const { length } = plugins;

    for (let i = 0; i < plugins.length; i += 1) {
      Object.defineProperty(fakeArray, i, {
        value: plugins[i],
        configurable: false,
        enumerable: true,
        writable: false,
      });
      Object.defineProperty(fakeArray, plugins[i].name, {
        value: plugins[i],
        configurable: false,
        enumerable: false,
        writable: false,
      });
    }

    Object.defineProperty(fakeArray, 'length', {
      value: length,
      configurable: false,
      enumerable: true,
      writable: false,
    });

    Object.defineProperty($$window.navigator, 'plugins', {
      value: fakeArray,
      configurable: false,
      enumerable: true,
      writable: true,
    });
  };

  const protectPluginsAndMimetype = ($$window: Window) => {
    // условие на рекапчу было в фиксе бетки Мегабота, но скорее всего не требуется [07.08.2021]
    // if (document.querySelector("#recaptcha-token") != null) {
    //   return;
    // }

    const mime1 = createFakeMimeType('', 'pdf', 'application/pdf');
    const mime2 = createFakeMimeType(
      'Portable Document Format',
      'pdf',
      'application/x-google-chrome-pdf'
    );
    const mime3 = createFakeMimeType(
      'Native Client Executable',
      '',
      'application/x-nacl'
    );
    const mime4 = createFakeMimeType(
      'Portable Native Client Executable',
      '',
      'application/x-pnacl'
    );
    createFakeMimeTypesInNavigator($$window, [mime1, mime2, mime3, mime4]);

    const plugin1 = createFakePlugin(
      'Portable Document Format',
      'internal-pdf-viewer',
      'Chrome PDF Plugin'
    );
    const plugin2 = createFakePlugin(
      '',
      'mhjfbmdgcfjbbpaeojofohoefgiehjai',
      'Chrome PDF Viewer'
    );
    const plugin3 = createFakePlugin(
      '',
      'internal-nacl-plugin',
      'Native Client'
    );

    if (iframe !== true) {
      setEnebledPlugin(mime1, plugin2);
      setEnebledPlugin(mime2, plugin1);
      setEnebledPlugin(mime3, plugin3);
      setEnebledPlugin(mime4, plugin3);
    }

    updateFakePlugin(plugin1, [mime2]);
    updateFakePlugin(plugin2, [mime1]);
    updateFakePlugin(plugin3, [mime3, mime4]);

    createFakePluginsTypesInNavigator($$window, [plugin1, plugin2, plugin3]);
  };

  protectPluginsAndMimetype($window);
  // console.info('Plugin patched');
};

export default patchPlugins;
