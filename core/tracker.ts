const request = (function() {
  if (window.navigator.sendBeacon) {
    return window.navigator.sendBeacon.bind(window.navigator);
  }
  const requestImage = function(url, dataString) {
    const img = new Image();
    img.src = `${url}.gif?data=${encodeURIComponent(dataString)}`;
  };
  return requestImage;
})();

export interface TrackerOption {
  immediate?: boolean;
}

export class Tracker {
  constructor(public url: string) {
    this.url = url;
  }

  send(data: Record<string, unknown>, option?: TrackerOption) {
    const dataString = JSON.stringify(data);
    if (option?.immediate) {
      request(this.url, dataString);
      return;
    }
    if (window.requestIdleCallback) {
      window.requestIdleCallback(() => {
        request(this.url, dataString);
      });
    } else {
      setTimeout(() => {
        request(this.url, dataString);
      });
    }
  }
}
