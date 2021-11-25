interface FakeProfile {
  LocalIP: string;
  PublicIP: string;
  doNotTrack: boolean;
  IsSendDoNotTrack: boolean;
  CpuConcurrency: number;
  MemoryAvailable: number;
  UserAgent: string;
  AppVersion: string;
  CanvasFingerPrintHash: string;
  BaseLatency: number;
  ScreenSize: {
    Height: number;
    Width: number;
    WindowOuterHeight: number;
    WindowOuterWidth: number;
    ScreenAvailHeight: number;
    WindowScreenAvailWidth: number;
    WindowScreenHeight: number;
    WindowScreenWidth: number;
  };
  ChannelDataDelta: number;
  ChannelDataIndexDelta: number;
  FloatFrequencyDataDelta: number;
  FloatFrequencyDataIndexDelta: number;
  Fonts: string[];
  WebGL: {
    Status: string;
    Params: {
      Value: unknown;
    }[];
    Noise: {
      Index: number;
      Difference: number;
    };
  };
  CanvasFingerprint: {
    R: number;
    G: number;
    B: number;
  };
}

export default FakeProfile;
