/**
 * Copyright 2020 The AMP HTML Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import '../amp-myvideo-player';
// import {VideoEvents} from '../../../../src/video-interface';
// import {listenOncePromise} from '../../../../src/event-helper';

describes.realWin(
  'amp-myvideo-player',
  {
    amp: {
      extensions: ['amp-myvideo-player'],
    },
  },
  (env) => {
    let win;
    let doc;

    beforeEach(() => {
      win = env.win;
      doc = win.document;
    });

    const widgetAttributes = {
      'data-widget': 'intext',
      'data-publisher': '998',
      'data-selection': '203',
      'data-configuration': '633',
      'data-hash': '8ad989d0050b4bb2cefd13807be3d702',
    };

    function getIframe(bc) {
      return bc.querySelector('iframe');
    }

    function getEncodedAttributes(bc) {
      const iframeClientRectProperties = getIframe(bc).getBoundingClientRect();
      const widget = encodeURIComponent(
        `widget=${widgetAttributes['data-widget']}`
      );
      const publisher = encodeURIComponent(
        `publisher=${widgetAttributes['data-publisher']}`
      );
      const selection = encodeURIComponent(
        `selection=${widgetAttributes['data-selection']}`
      );
      const configuration = encodeURIComponent(
        `configuration=${widgetAttributes['data-configuration']}`
      );
      const hash = encodeURIComponent(`hash=${widgetAttributes['data-hash']}`);
      const hostPageUrl = encodeURIComponent(
        `hostPageUrl=${window.location.href}`
      );
      const hostPageHostname = encodeURIComponent(
        `hostPageHostname=${window.location.hostname}`
      );
      const hostPageHeight = encodeURIComponent(
        `hostPageHeight=${window.document.body.scrollHeight}`
      );
      const hostPageScrollY = encodeURIComponent(
        `hostPageScrollY=${window.scrollY}`
      );
      const hostPageScrollX = encodeURIComponent(
        `hostPageScrollX=${window.scrollX}`
      );
      const hostPageInnerWidth = encodeURIComponent(
        `hostPageInnerWidth=${window.innerWidth}`
      );
      const hostPageInnerHeight = encodeURIComponent(
        `hostPageInnerHeight=${window.innerHeight}`
      );
      const iframeTopPosition = encodeURIComponent(
        `iframeTopPosition=${iframeClientRectProperties.top}`
      );
      const iframeLeftPosition = encodeURIComponent(
        `iframeLeftPosition=${iframeClientRectProperties.left}`
      );

      return [
        widget,
        publisher,
        selection,
        configuration,
        hash,
        hostPageUrl,
        hostPageHostname,
        hostPageHeight,
        hostPageScrollY,
        hostPageScrollX,
        hostPageInnerWidth,
        hostPageInnerHeight,
        iframeTopPosition,
        iframeLeftPosition,
      ].join('&');
    }

    function getIframeSrc(bc) {
      return `http://localhost:3000/widget.html?${getEncodedAttributes(bc)}`;
    }

    function renderMyVideoPlayer(attributes, opt_responsive) {
      const bc = doc.createElement('amp-myvideo-player');

      for (const key in attributes) {
        bc.setAttribute(key, attributes[key]);
      }

      bc.setAttribute('width', '480');
      bc.setAttribute('height', '270');

      if (opt_responsive) {
        bc.setAttribute('layout', 'responsive');
      }

      doc.body.appendChild(bc);

      return bc
        .build()
        .then(() => bc.layoutCallback())
        .then(() => bc);
    }

    // function fakePostMessage(bc) {
    //   bc.implementation_.sendMessageToWidget_({
    //     type: 'play',
    //   });
    // }

    it('renders', () => {
      const player = renderMyVideoPlayer(widgetAttributes, true);

      return player.then((bc) => {
        const iframe = getIframe(bc);

        expect(iframe).to.not.be.null;
        expect(iframe.tagName).to.equal('IFRAME');
      });
    });

    it('should call the endpoint with all query parameters', () => {
      const player = renderMyVideoPlayer(widgetAttributes, true);

      return player.then((bc) => {
        const iframe = getIframe(bc);

        expect(iframe.src).to.equal(getIframeSrc(bc));
      });
    });

    it('removes iframe after unlayoutCallback', () => {
      const player = renderMyVideoPlayer(widgetAttributes, true);

      return player.then((bc) => {
        const iframe = getIframe(bc);

        expect(iframe).to.not.be.null;

        const obj = bc.implementation_;
        obj.unlayoutCallback();

        expect(getIframe(bc)).to.be.null;
        expect(obj.iframe_).to.be.null;
      });
    });

    // it('send messages to widget', () => {
    //   const player = renderMyVideoPlayer(widgetAttributes, true);

    //   return player.then((bc) => {
    //     const p = listenOncePromise(bc, VideoEvents.LOAD);

    //     fakePostMessage(bc, {
    //       type: 'play',
    //     });

    //     return p;
    //   });
    // });
  }
);
