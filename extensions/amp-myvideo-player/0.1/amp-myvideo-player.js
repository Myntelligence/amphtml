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

import {Deferred} from '../../../src/utils/promise';
import {Services} from '../../../src/services';
import {VideoEvents} from '../../../src/video-interface';
import {
  createFrameFor,
  originMatches,
  redispatch,
} from '../../../src/iframe-video';
import {installVideoManagerForDoc} from '../../../src/service/video-manager-impl';
import {listen} from '../../../src/event-helper';
import {removeElement} from '../../../src/dom';
import {userAssert} from '../../../src/log';

const TAG = 'amp-myvideo-player';

export class AmpMyvideoPlayer extends AMP.BaseElement {
  /** @param {!AmpElement} element */
  constructor(element) {
    super(element);

    /** @private {string} */
    this.widgetType_ = '';

    /** @private {string} */
    this.publisherID_ = '';

    /** @private {string} */
    this.selectionID_ = '';

    /** @private {string} */
    this.configurationID_ = '';

    /** @private {string} */
    this.hashID_ = '';

    /** @private {?Element} */
    this.iframe_ = null;

    /** @private {?Function} */
    this.unlistenMessage_ = null;

    /** @private {?number}  */
    this.currentTime_ = 0;

    /** @private {?number}  */
    this.currentDuration_ = 0;

    /** @private {?number}  */
    this.currentVolume_ = 0;

    /** @private {?boolean}  */
    this.muted_ = false;

    /** @private {?string}  */
    this.postMessagePrefix_ = 'topw://';

    /** @private {?string}  */
    this.baseUrl_ = 'https://amp.theoutplay.com/dev';
  }

  /**
   * @param {boolean=} opt_onLayout
   * @override
   */
  preconnectCallback(opt_onLayout) {
    Services.preconnectFor(this.win).url(
      this.getAmpDoc(),
      'https://amp.theoutplay.com/dev/',
      opt_onLayout
    );
    Services.preconnectFor(this.win).url(
      this.getAmpDoc(),
      'https://wapi.theoutplay.com/',
      opt_onLayout
    );
  }

  /** @override */
  buildCallback() {
    const {element} = this;

    this.widgetType_ = userAssert(
      element.getAttribute('data-widget'),
      'The data-widget attribute is required for <amp-myvideo-player> %s',
      element
    );

    this.publisherID_ = userAssert(
      element.getAttribute('data-publisher'),
      'The data-publisher attribute is required for <amp-myvideo-player> %s',
      element
    );

    this.selectionID_ = userAssert(
      element.getAttribute('data-selection'),
      'The data-publisher attribute is required for <amp-myvideo-player> %s',
      element
    );

    this.configurationID_ = userAssert(
      element.getAttribute('data-configuration'),
      'The data-publisher attribute is required for <amp-myvideo-player> %s',
      element
    );

    this.hashID_ = userAssert(
      element.getAttribute('data-hash'),
      'The data-publisher attribute is required for <amp-myvideo-player> %s',
      element
    );

    const deferred = new Deferred();
    this.playerReadyPromise_ = deferred.promise;
    this.playerReadyResolver_ = deferred.resolve;

    installVideoManagerForDoc(element);
  }

  /** @override */
  isLayoutSupported(layout) {
    return layout;
  }

  /**
   * @param {!Event} event
   * @return {object}
   * @private
   */
  parseWidgetMessageData_(event) {
    return JSON.parse(event.data.replace(this.postMessagePrefix_, ''));
  }

  /**
   * @param {!Event} event
   * @return {boolean}
   * @private
   */
  isTopMessage_(event) {
    return event.data.includes(this.postMessagePrefix_);
  }

  /**
   * @param {!Event} event
   * @private
   */
  handleWidgetMessages_(event) {
    if (
      !originMatches(event, this.iframe_, this.baseUrl_) ||
      !this.isTopMessage_(event)
    ) {
      return;
    }

    const {element} = this;
    const {type, data} = this.parseWidgetMessageData_(event);

    redispatch(element, type, {
      'ready': VideoEvents.LOAD,
      'play': VideoEvents.PLAYING,
      'pause': VideoEvents.PAUSE,
      'ended': VideoEvents.ENDED,
      'adStart': VideoEvents.AD_START,
      'adEnd': VideoEvents.AD_END,
      'loadedmetadata': VideoEvents.LOADEDMETADATA,
    });

    if (type === 'current-time') {
      this.currentTime_ = data.currentTime;
    }

    if (type === 'current-duration') {
      this.currentDuration_ = data.currentDuration;
    }

    if (type === 'muted') {
      this.muted_ = data.muted;
    }

    if (type === 'current-volume') {
      this.currentVolume_ = data.currentVolume;

      if (data.currentVolume === 0 && !this.muted_) {
        this.muted_ = true;
      }

      if (data.currentVolume > 0 && this.muted_) {
        this.muted_ = false;
      }
    }
  }

  /** @override */
  layoutCallback() {
    const iframeWrapperPosition = this.element.getBoundingClientRect();

    const widget = encodeURIComponent(`widget=${this.widgetType_}`);
    const publisher = encodeURIComponent(`publisher=${this.publisherID_}`);
    const selection = encodeURIComponent(`selection=${this.selectionID_}`);
    const configuration = encodeURIComponent(
      `configuration=${this.configurationID_}`
    );
    const hash = encodeURIComponent(`hash=${this.hashID_}`);
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
      `iframeTopPosition=${iframeWrapperPosition.top}`
    );
    const iframeLeftPosition = encodeURIComponent(
      `iframeLeftPosition=${iframeWrapperPosition.left}`
    );

    const urlParameters = [
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
    ];

    const iframe = createFrameFor(
      this,
      `${this.baseUrl_}/widget.html?${urlParameters.join('&')}`
    );

    this.iframe_ = /** @type {HTMLIFrameElement} */ (iframe);

    this.unlistenMessage_ = listen(
      this.win,
      'message',
      this.handleWidgetMessages_.bind(this)
    );

    iframe.setAttribute(
      'sandbox',
      'allow-scripts allow-same-origin allow-popups'
    );

    return this.loadPromise(iframe).then(this.playerReadyResolver_);
  }

  /** @override */
  unlayoutCallback() {
    if (this.iframe_) {
      removeElement(this.iframe_);

      this.iframe_ = null;
    }

    if (this.unlistenMessage_) {
      this.unlistenMessage_();
    }

    const deferred = new Deferred();

    this.playerReadyPromise_ = deferred.promise;
    this.playerReadyResolver_ = deferred.resolve;

    return true; // Call layoutCallback again.
  }

  /**
   * Sends a command to the player through postMessage.
   * @param {object} messageObject
   * @private
   * */
  sendMessageToWidget_(messageObject) {
    this.playerReadyPromise_.then(() => {
      if (this.iframe_ && this.iframe_.contentWindow) {
        const message = 'topw://' + JSON.stringify(messageObject);

        this.iframe_.contentWindow./*OK*/ postMessage(message, '*');
      }
    });
  }

  /** @override */
  play() {
    this.sendMessageToWidget_({
      type: 'play',
    });
  }

  /** @override */
  pause() {
    this.sendMessageToWidget_({
      type: 'pause',
    });
  }

  /** @override */
  mute() {
    this.sendMessageToWidget_({
      type: 'mute',
    });
  }

  /** @override */
  unmute() {
    this.sendMessageToWidget_({
      type: 'unmute',
    });
  }

  /** @override */
  getCurrentTime() {
    return this.currentTime_;
  }

  /** @override */
  getCurrentDuration() {
    return this.currentDuration_;
  }

  /** @override */
  getCurrentVolume() {
    return this.currentVolume_;
  }

  /** @override */
  getIsMuted() {
    return this.muted_;
  }
}

AMP.extension(TAG, '0.1', (AMP) => {
  AMP.registerElement(TAG, AmpMyvideoPlayer);
});
