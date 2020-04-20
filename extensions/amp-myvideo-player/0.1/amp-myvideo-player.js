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
import {Layout} from '../../../src/layout';
import {Services} from '../../../src/services';
import {createFrameFor} from '../../../src/iframe-video';
import {installVideoManagerForDoc} from '../../../src/service/video-manager-impl';
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

    /** @private {?Promise} */
    // this.playerReadyPromise_ = null;

    /** @private {?Function} */
    // this.playerReadyResolver_ = null;

    /** @private {?HTMLIFrameElement} */
    this.iframe_ = null;
  }

  /**
   * @param {boolean=} opt_onLayout
   * @override
   */
  preconnectCallback(opt_onLayout) {
    Services.preconnectFor(this.win).url(
      this.getAmpDoc(),
      'https://wapi.theoutplay.com',
      opt_onLayout
    );

    // TODO: Add preconnect to the amp-widget player url
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

    console.log({
      widgetType: this.widgetType_,
      publisherID: this.publisherID_,
      selectionID: this.selectionID_,
      configurationID: this.configurationID_,
      hashID: this.hashID_,
    });

    const deferred = new Deferred();
    this.playerReadyPromise_ = deferred.promise;
    this.playerReadyResolver_ = deferred.resolve;

    installVideoManagerForDoc(element);
    // Services.videoManagerForDoc(element).register(this);
  }

  /** @override */
  isLayoutSupported(layout) {
    return layout == Layout.RESPONSIVE;
  }

  /** @override */
  layoutCallback() {
    const iframe = createFrameFor(this, 'https://fakepage.com/ampFrame.html');

    this.iframe_ = /** @type {HTMLIFrameElement} */ (iframe);

    iframe.setAttribute(
      'sandbox',
      'allow-scripts allow-same-origin allow-popups'
    );

    return this.loadPromise(iframe).then(this.playerReadyPromise_);
  }
}

AMP.extension(TAG, '0.1', AMP => {
  AMP.registerElement(TAG, AmpMyvideoPlayer);
});
