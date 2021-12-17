import FakeProfile from './FakeProfile';
import iframeContentPatching from './modules/iframeContentPatching';
import injectWebRTC from './modules/injectWebRTC';
import patchAudio from './modules/patchAudio';
import patchChrome from './modules/patchChrome';
import patchDnt from './modules/patchDnt';
import patchFonts from './modulesOriginal/patchFonts';
import patchNavigator from './modules/patchNavigator';
import patchNavigatorСonnection from './modules/patchNavigatorConnection';
// import patchPlugins from './modules/patchPlugins';
import patchWindow from './modules/patchWindow';
import patchCanvas from './modules/patchCanvas';
import patchGeo from './modules/patchGeo';

if (!window.injected) {
  window.injected = true;

  let config1: {
    FakeProfile: FakeProfile;
  };
  const fakeProfile = config1.FakeProfile;

  patchWindow(window, fakeProfile);
  injectWebRTC(fakeProfile);
  // patchPlugins(window);
  patchChrome(window);
  patchNavigatorСonnection(window);
  patchNavigator(window, fakeProfile);
  patchDnt(window, fakeProfile);
  patchCanvas(window, fakeProfile);
  patchAudio(window, fakeProfile);
  patchFonts(window, fakeProfile);
  iframeContentPatching(fakeProfile);
  patchGeo(window, fakeProfile);
}
