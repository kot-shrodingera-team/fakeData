import FakeProfile from '../FakeProfile';
import patchAudio from './patchAudio';
import patchCanvas from './patchCanvas';
import patchDnt from './patchDnt';
import patchGeo from './patchGeo';
// import patchFonts from './patchFonts';
// import patchPlugins from './patchPlugins';
import patchWindow from './patchWindow';

const iframeContentPatching = (fakeProfile: FakeProfile): void => {
  const g = Object.getOwnPropertyDescriptor(
    HTMLIFrameElement.prototype,
    'contentWindow'
  ).get;
  const h = Object.getOwnPropertyDescriptor(
    HTMLIFrameElement.prototype,
    'contentDocument'
  ).get;
  Object.defineProperties(HTMLIFrameElement.prototype, {
    contentWindow: {
      get() {
        const a = g.call(this);

        if (!('HTMLCanvasElement' in a)) {
          return a;
        }
        patchCanvas(a, fakeProfile);
        patchWindow(a, fakeProfile, true);
        // patchPlugins(a, true);
        patchDnt(a, fakeProfile);
        patchAudio(a, fakeProfile);
        patchGeo(a, fakeProfile);
        // try {
        //   patchFonts(a, fakeProfile);
        // } catch (e) {
        //   console.log('contentWindow PatchFonts', e);
        // }
        return a;
      },
    },
    contentDocument: {
      get() {
        const a = g.call(this);

        if (!('HTMLCanvasElement' in a)) {
          return a;
        }
        patchCanvas(a, fakeProfile);
        patchWindow(a, fakeProfile);
        // patchPlugins(a);
        patchDnt(a, fakeProfile);
        patchAudio(a, fakeProfile);
        patchGeo(a, fakeProfile);
        // try {
        //   patchFonts(a, fakeProfile);
        // } catch (e) {
        //   console.log('contentDocument PathFonts', e);
        // }
        return h.call(this);
      },
    },
  });
};

export default iframeContentPatching;
