import FakeProfile from '../FakeProfile';

const injectWebRTC = (fakeProfile: FakeProfile): void => {
  if (
    !('IsWebRtcEnabled' in fakeProfile) ||
    fakeProfile.IsWebRtcEnabled === false
  ) {
    return;
  }

  const remoteIp = fakeProfile.PublicIP;
  const localIp = fakeProfile.LocalIP || '';
  const ipRegexp = /^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/;
  const isNotLocalIp = (ip: string) =>
    !ip.match(/^(192\.168\.|169\.254\.|10\.|127\.|172\.(1[6-9]|2\d|3[01])\.)/);
  const isIP = (ip: string) => ip.match(ipRegexp);
  const replaceIP = (line: string) => {
    const e = line.split(' ');
    for (let i = 0; i < e.length; i += 1) {
      if (isIP(e[i])) {
        e[i] = e[i].replace(ipRegexp, isNotLocalIp(e[i]) ? remoteIp : localIp);
      }
    }
    return e.join(' ');
  };

  const makeid = (length: number) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i += 1) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  const randInd = (min: number, max: number) => {
    const ceilMin = Math.ceil(min);
    const floorMax = Math.floor(max);
    return Math.floor(Math.random() * (floorMax - ceilMin)) + ceilMin; // Максимум не включается, минимум включается
  };

  const newCandidate = () => {
    const candstr =
      // eslint-disable-next-line prefer-template
      'candidate:' +
      randInd(800000000, 900000000) +
      ' 1 udp ' +
      randInd(1043278322, 2043278322) +
      ' ' +
      remoteIp +
      ' ' +
      randInd(5000, 5600) +
      ' typ srflx raddr 0.0.0.0 rport 0 generation 0 ufrag ' +
      makeid(4) +
      ' network-cost 999';
    return new RTCIceCandidate({
      sdpMLineIndex: 0,
      candidate: candstr,
      sdpMid: '0',
      usernameFragment: makeid(4),
    });
  };

  const spoof = {
    candidate: (target: any) => {
      if (!target) {
        return;
      }
      const addr = Object.getOwnPropertyDescriptor(
        target.prototype,
        'address'
      ).get;
      const cand = Object.getOwnPropertyDescriptor(
        target.prototype,
        'candidate'
      ).get;
      const typeGetter = Object.getOwnPropertyDescriptor(
        target.prototype,
        'type'
      ).get;
      Object.defineProperties(target.prototype, {
        address: {
          get() {
            const realAddr = addr.call(this);
            const type = typeGetter.call(this);
            return realAddr.replace(
              ipRegexp,
              isNotLocalIp(realAddr) ? remoteIp : localIp
            );
          },
        },
        candidate: {
          get() {
            const realCandidate = cand.call(this);
            const type = typeGetter.call(this);
            return replaceIP(realCandidate);
          },
        },
      });
    },
    connection: (target: any) => {
      if (!target) {
        return;
      }
      const croffer = target.prototype.createOffer;
      const addcand = target.prototype.addIceCandidate;
      // var offer = target.prototype.onicecandidate;
      Object.defineProperty(target.prototype, 'createOffer', {
        configurable: false,
        enumerable: true,
        writable: true,
        value() {
          const cr = croffer.call(this);
          // addcand.call(this, newCandidate());
          if (this.onicecandidate)
            this.onicecandidate(
              new RTCPeerConnectionIceEvent('icecandidate', {
                candidate: newCandidate(),
              })
            );
          return cr;
        },
      });
    },
    sdp: (target: any) => {
      const g = Object.getOwnPropertyDescriptor(target.prototype, 'sdp').get;
      Object.defineProperties(target.prototype, {
        sdp: {
          get() {
            const realSdp = g.call(this);
            const lines = realSdp.split('\n');
            for (let i = 0; i < lines.length; i += 1) {
              if (lines[i].indexOf('a=candidate:') === 0) {
                lines[i] = replaceIP(lines[i]);
              }
            }
            return lines.join('\n');
          },
        },
      });
    },
    iceevent: (target: any) => {
      const istrusted = Object.getOwnPropertyDescriptor(
        target.prototype,
        'isTrusted'
      ).get;
      Object.defineProperties(target.prototype, {
        isTrusted: {
          get() {
            return true;
          },
        },
      });
    },
  };
  try {
    spoof.candidate(RTCIceCandidate);
    spoof.connection(RTCPeerConnection);
    // spoof.candidate(webkitRTCPeerConnection);
    spoof.sdp(RTCSessionDescription);
  } catch (e) {
    //
  }
  // spoof.iceevent(RTCPeerConnectionIceEvent);
};

export default injectWebRTC;
