import FakeProfile from '../FakeProfile';

const patchAudio = (
  $window: Window & typeof globalThis,
  fakeProfile: FakeProfile
): void => {
  Object.defineProperty($window.AudioContext.prototype, 'baseLatency', {
    value: fakeProfile.BaseLatency,
    configurable: false,
    enumerable: true,
    writable: true,
  });

  const inject = () => {
    const config = {
      BUFFER: <unknown>null,
      getChannelData(e: any) {
        const { getChannelData } = e.prototype;
        Object.defineProperty(e.prototype, 'getChannelData', {
          value(...args: any[]) {
            const results1 = getChannelData.apply(this, args);
            if (config.BUFFER !== results1) {
              config.BUFFER = results1;
              for (let i = 0; i < results1.length; i += 100) {
                const index = Math.floor(fakeProfile.ChannelDataIndexDelta * i);
                results1[index] += fakeProfile.ChannelDataDelta * 0.0000001;
              }
            }
            return results1;
          },
          configurable: false,
          enumerable: true,
          writable: true,
        });

        Object.defineProperty(e.prototype.getChannelData, 'toString', {
          value() {
            return 'getChannelData() { [native code] }';
          },
        });

        Object.defineProperty(e.prototype.getChannelData.toString, 'toString', {
          value() {
            return 'toString() { [native code] }';
          },
        });
      },
      createAnalyser(e: any) {
        // eslint-disable-next-line no-proto
        const { createAnalyser } = e.prototype.__proto__;
        // eslint-disable-next-line no-proto
        Object.defineProperty(e.prototype.__proto__, 'createAnalyser', {
          value(...args: any[]) {
            const results2 = createAnalyser.apply(this, args);
            // eslint-disable-next-line no-proto
            const { getFloatFrequencyData } = results2.__proto__;
            // eslint-disable-next-line no-proto
            Object.defineProperty(results2.__proto__, 'getFloatFrequencyData', {
              value(...$args: any[]) {
                const results3 = getFloatFrequencyData.apply(this, $args);
                for (let i = 0; i < $args[0].length; i += 100) {
                  const index = Math.floor(
                    fakeProfile.FloatFrequencyDataIndexDelta * i
                  );
                  // eslint-disable-next-line no-param-reassign
                  $args[0][index] += fakeProfile.FloatFrequencyDataDelta * 0.1;
                }
                return results3;
              },
              configurable: false,
              enumerable: true,
              writable: true,
            });

            Object.defineProperty(
              // eslint-disable-next-line no-proto
              results2.__proto__.getFloatFrequencyData,
              'toString',
              {
                value() {
                  return 'getFloatFrequencyData() { [native code] }';
                },
              }
            );

            Object.defineProperty(
              // eslint-disable-next-line no-proto
              results2.__proto__.getFloatFrequencyData.toString,
              'toString',
              {
                value() {
                  return 'toString() { [native code] }';
                },
              }
            );

            return results2;
          },
          configurable: false,
          enumerable: true,
          writable: true,
        });
      },
    };

    config.getChannelData(AudioBuffer);
    config.createAnalyser(AudioContext);
    config.createAnalyser(OfflineAudioContext);
    // console.log('patched audio');
    // document.documentElement.dataset.acxscriptallow = true;
  };

  inject();
  // patchAudioContext($window.AudioContext, fakeProfile);
  // patchAudioContext($window.OfflineAudioContext, fakeProfile);
};

export default patchAudio;
