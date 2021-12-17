/* eslint-disable max-classes-per-file */

import FakeProfile from '../FakeProfile';

const patchGeo = (
  $window: Window & typeof globalThis,
  fakeProfile: FakeProfile
): void => {
  if (!fakeProfile.GeoEnabled) {
    return;
  }

  $window.Object.defineProperty(
    $window.Object.getPrototypeOf($window.navigator.permissions),
    'query',
    {
      value: (parameters: PermissionDescriptor) => {
        return !!parameters && parameters.name === 'geolocation'
          ? Promise.resolve({ state: 'granted' })
          : $window.navigator.permissions.query(parameters);
      },
      configurable: false,
      enumerable: true,
      writable: true,
    }
  );

  class MyGeolocationCoordinates {
    accuracy: number;

    altitude: null;

    altitudeAccuracy: null;

    heading: null;

    latitude: number;

    longitude: number;

    speed: null;

    constructor() {
      this.accuracy = fakeProfile.GeoData.accuracy;
      this.altitude = null;
      this.altitudeAccuracy = null;
      this.heading = null;
      this.latitude = fakeProfile.GeoData.lat;
      this.longitude = fakeProfile.GeoData.lng;
      this.speed = null;
    }
  }

  class MyGeolocationPosition {
    coords: MyGeolocationCoordinates;

    timestamp: number;

    constructor() {
      this.coords = new MyGeolocationCoordinates();
      this.timestamp = Date.now() + fakeProfile.GeoData.offset * 1000;
    }
  }

  $window.Object.defineProperty(
    $window.Object.getPrototypeOf($window.navigator.geolocation),
    'getCurrentPosition',
    {
      value: (
        success: PositionCallback,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        error: PositionErrorCallback = undefined,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        options: PositionOptions = undefined
      ) => {
        const geo = new MyGeolocationPosition();
        success(geo);
      },
      configurable: false,
      enumerable: true,
      writable: true,
    }
  );

  let watchIterator = 0;

  $window.Object.defineProperty(
    $window.Object.getPrototypeOf($window.navigator.geolocation),
    'watchPosition',
    {
      value: (
        success: PositionCallback,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        error: PositionErrorCallback = undefined,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        options: PositionOptions = undefined
      ) => {
        const geo = new MyGeolocationPosition();
        setInterval(() => {
          success(geo);
        }, 5000);
        watchIterator += 1;
        return watchIterator;
      },
      configurable: false,
      enumerable: true,
      writable: true,
    }
  );
};

export default patchGeo;
