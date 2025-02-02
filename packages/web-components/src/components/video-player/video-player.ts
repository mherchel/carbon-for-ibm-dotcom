/**
 * @license
 *
 * Copyright IBM Corp. 2020, 2021
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { html, property, customElement, LitElement } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map';
import settings from 'carbon-components/es/globals/js/settings.js';
import ddsSettings from '@carbon/ibmdotcom-utilities/es/utilities/settings/settings.js';
import ifNonNull from 'carbon-web-components/es/globals/directives/if-non-null.js';
import {
  formatVideoCaption,
  formatVideoDuration,
} from '@carbon/ibmdotcom-utilities/es/utilities/formatVideoCaption/formatVideoCaption.js';
import FocusMixin from 'carbon-web-components/es/globals/mixins/focus.js';
import PlayVideo from '@carbon/ibmdotcom-styles/icons/svg/play-video.svg';
import { VIDEO_PLAYER_CONTENT_STATE } from './defs';
import '../image/image';
import styles from './video-player.scss';

export { VIDEO_PLAYER_CONTENT_STATE };

const { prefix } = settings;
const { stablePrefix: ddsPrefix } = ddsSettings;

/**
 * Video player.
 *
 * @element dds-video-player
 */
@customElement(`${ddsPrefix}-video-player`)
class DDSVideoPlayer extends FocusMixin(LitElement) {
  /**
   * Handles `click` event on the video thumbnail.
   */
  private _handleClickOverlay() {
    this.contentState = VIDEO_PLAYER_CONTENT_STATE.VIDEO;
    const { videoId } = this;
    const { eventContentStateChange } = this.constructor as typeof DDSVideoPlayer;
    this.dispatchEvent(
      new CustomEvent(eventContentStateChange, {
        bubbles: true,
        composed: true,
        detail: {
          videoId,
          contentState: VIDEO_PLAYER_CONTENT_STATE.VIDEO,
        },
      })
    );
  }

  /**
   * @returns The video content.
   */
  private _renderContent() {
    const { contentState, name, thumbnailUrl } = this;
    return contentState === VIDEO_PLAYER_CONTENT_STATE.THUMBNAIL
      ? html`
          <div class="${prefix}--video-player__video">
            <button class="${prefix}--video-player__image-overlay" @click="${this._handleClickOverlay}">
              <dds-image default-src="${thumbnailUrl}" alt="${ifNonNull(name)}">
                ${PlayVideo({ slot: 'icon' })}
              </dds-image>
            </button>
          </div>
        `
      : html`
          <slot></slot>
        `;
  }

  /**
   * The video player's content state.
   */
  @property({ reflect: true, attribute: 'content-state' })
  contentState = VIDEO_PLAYER_CONTENT_STATE.THUMBNAIL;

  /**
   * The video duration.
   */
  @property({ type: Number })
  duration?: number;

  /**
   * The formatter for the video caption, composed with the video name and the video duration.
   * Should be changed upon the locale the UI is rendered with.
   */
  @property({ attribute: false })
  formatCaption = formatVideoCaption;

  /**
   * The formatter for the video duration.
   * Should be changed upon the locale the UI is rendered with.
   */
  @property({ attribute: false })
  formatDuration = formatVideoDuration;

  /**
   * `true` to hide the caption.
   */
  @property({ type: Boolean, attribute: 'hide-caption' })
  hideCaption = false;

  /**
   * The video name.
   */
  @property()
  name = '';

  /**
   * The thumbnail URL.
   */
  @property({ attribute: 'thumbnail-url' })
  thumbnailUrl = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg"/%3E';

  /**
   * The video ID.
   */
  @property({ attribute: 'video-id' })
  videoId?: string;

  /**
   * Override default aspect ratio of `16x9`.
   * Available aspect ratios:
   *
   * `16x9`, `9x16`, `2x1`, `1x2`, `4x3`, `3x4`, `1x1`
   */
  @property({ attribute: 'aspect-ratio' })
  aspectRatio?: string;

  createRenderRoot() {
    return this.attachShadow({
      mode: 'open',
      delegatesFocus: Number((/Safari\/(\d+)/.exec(navigator.userAgent) ?? ['', 0])[1]) <= 537,
    });
  }

  render() {
    const { aspectRatio, duration, formatCaption, formatDuration, hideCaption, name } = this;

    const aspectRatioClass = classMap({
      [`${prefix}--video-player__video-container`]: true,
      [`${prefix}--video-player__aspect-ratio--${aspectRatio}`]: !!aspectRatio,
    });

    return html`
      <div class="${aspectRatioClass}">
        ${this._renderContent()}
      </div>
      ${hideCaption
        ? undefined
        : html`
            <div class="${prefix}--video-player__video-caption">
              ${formatCaption({ duration: formatDuration({ duration: !duration ? duration : duration * 1000 }), name })}
            </div>
          `}
    `;
  }

  updated(changedProperties) {
    if (changedProperties.has('duration') || changedProperties.has('formatCaption') || changedProperties.has('name')) {
      const { duration, formatCaption, formatDuration, name } = this;
      const caption = formatCaption({ duration: formatDuration({ duration: !duration ? duration : duration * 1000 }), name });
      if (caption) {
        this.setAttribute('aria-label', caption);
      }
    }
  }

  /**
   * The name of the custom event fired after video content state is changed upon a user gesture.
   */
  static get eventContentStateChange() {
    return `${ddsPrefix}-video-player-content-state-changed`;
  }

  static styles = styles; // `styles` here is a `CSSResult` generated by custom WebPack loader
}

export default DDSVideoPlayer;
