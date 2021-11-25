import FakeProfile from '../FakeProfile';

const patchDnt = ($window: Window, fakeProfile: FakeProfile): void => {
  if (fakeProfile.IsSendDoNotTrack) {
    Object.defineProperty(navigator, 'doNotTrack', {
      value: 1,
      configurable: false,
      enumerable: true,
      writable: true,
    });

    // console.info('DNT patched');
  }
};

export default patchDnt;
