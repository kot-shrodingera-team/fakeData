declare global {
  interface Window {
    injected: boolean;
    CefSharp: unknown;
    cefSharp: unknown;
  }
}

export default {};
