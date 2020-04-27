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
import {createFrameFor} from '../../../src/iframe-video';
import {installVideoManagerForDoc} from '../../../src/service/video-manager-impl';
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
      `https://amp.theoutplay.com/dev/widget.html?${urlParameters.join('&')}`
    );

    this.iframe_ = /** @type {HTMLIFrameElement} */ (iframe);

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

    const deferred = new Deferred();

    this.playerReadyPromise_ = deferred.promise;
    this.playerReadyResolver_ = deferred.resolve;

    return true; // Call layoutCallback again.
  }
}

AMP.extension(TAG, '0.1', (AMP) => {
  AMP.registerElement(TAG, AmpMyvideoPlayer);
});
