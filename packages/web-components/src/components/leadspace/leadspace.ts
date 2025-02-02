/**
 * @license
 *
 * Copyright IBM Corp. 2020, 2021
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { customElement, html, svg, property, LitElement } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map';
import settings from 'carbon-components/es/globals/js/settings';
import ddsSettings from '@carbon/ibmdotcom-utilities/es/utilities/settings/settings.js';
import { LEADSPACE_TYPE, LEADSPACE_GRADIENT_STYLE_SCHEME, LEADSPACE_SIZE } from './defs';
import styles from './leadspace.scss';
import StableSelectorMixin from '../../globals/mixins/stable-selector';

export { LEADSPACE_TYPE, LEADSPACE_GRADIENT_STYLE_SCHEME, LEADSPACE_SIZE };

const { prefix } = settings;
const { stablePrefix: ddsPrefix } = ddsSettings;

/**
 * The LeadSpace component.
 *
 * @element dds-leadspace
 * @slot action The action (CTA) content.
 * @slot image The image content.
 * @csspart section The first DOM node inside the shadow-root
 */
@customElement(`${ddsPrefix}-leadspace`)
class DDSLeadSpace extends StableSelectorMixin(LitElement) {
  /**
   * Sets background image for leadspace centered
   */
  protected _getBackgroundImage() {
    return this.defaultSrc && this.type === LEADSPACE_TYPE.CENTERED ? `background-image: url(${this.defaultSrc})` : '';
  }

  /**
   * Returns a class-name based on the gradient parameter type
   */
  protected _getGradientClass() {
    return classMap({
      [`${prefix}--leadspace--gradient`]: this.gradientStyleScheme === LEADSPACE_GRADIENT_STYLE_SCHEME.WITH_GRADIENT,
      [`${prefix}--leadspace__overlay`]: true,
    });
  }

  /**
   * Returns a class-name based on the type parameter type
   */
  protected _getTypeClass() {
    return classMap({
      [`${prefix}--leadspace--centered`]: this.type === LEADSPACE_TYPE.CENTERED,
      [`${prefix}--leadspace--centered__image`]: this.type === LEADSPACE_TYPE.CENTERED && this.defaultSrc,
      [`${prefix}--leadspace--productive`]: this.type === LEADSPACE_TYPE.SMALL,
      [`${prefix}--leadspace__section`]: true,
    });
  }

  /**
   * Returns a class-name based on the size parameter type
   */
  protected _getContainerClass() {
    return classMap({
      [`${prefix}--leadspace__container--medium`]: this.size === LEADSPACE_SIZE.MEDIUM,
      [`${prefix}--leadspace__container`]: this.size === LEADSPACE_SIZE.NONE,
    });
  }

  /**
   * Renders Leadspace copy/description
   */
  protected _renderCopy() {
    const { copy } = this;
    return html`
      <div class="${prefix}--leadspace__row">
        <p data-autoid="${ddsPrefix}--leadspace__desc" class="${this._getCopyType()}">
          <slot>${copy}</slot>
        </p>
      </div>
    `;
  }

  /**
   * Returns a class-name based on the size parameter type
   */
  protected _getCopyType() {
    return classMap({
      [`${prefix}--leadspace__desc--medium`]: this.size === LEADSPACE_SIZE.MEDIUM,
      [`${prefix}--leadspace__desc`]: this.size === LEADSPACE_SIZE.NONE,
    });
  }

  /**
   * Returns a class-name based on the size parameter type
   */
  protected _getContentType() {
    return classMap({
      [`${prefix}--leadspace--content__container`]: this.size === LEADSPACE_SIZE.NONE,
      [`${prefix}--leadspace--content__container--medium`]: this.size === LEADSPACE_SIZE.MEDIUM,
    });
  }

  /**
   * Renders Leadspace title slot
   */
  protected _renderHeading() {
    const { title } = this;
    return html`
      <slot name="heading">${title}</slot>
    `;
  }

  /**
   *  Renders the image slot or the mobile image for centered leadspace
   */
  protected _renderImage() {
    const { defaultSrc, alt, type } = this;
    if (this.defaultSrc && type === LEADSPACE_TYPE.CENTERED) {
      return html`
        <div data-autoid="${ddsPrefix}--leadspace--centered--mobile__image" class="${prefix}--leadspace--centered--mobile__image">
          <img src="${defaultSrc}" alt="${alt}" />
        </div>
      `;
    }
    return html`
      <slot name="image"></slot>
    `;
  }

  /**
   * The alternate text.
   */
  @property()
  alt = '';

  /**
   * The image source.
   */
  @property({ attribute: 'default-src' })
  defaultSrc = '';

  /**
   * The leadspace copy.
   */
  @property()
  copy = '';

  /**
   * The gradient style sceheme.
   */
  @property({ reflect: true, attribute: 'gradient-style-scheme' })
  gradientStyleScheme = LEADSPACE_GRADIENT_STYLE_SCHEME.WITH_GRADIENT;

  /**
   * The leadspace title.
   */
  @property()
  title = '';

  /**
   *  Leadspace type (small, left, or centered)
   */
  @property({ reflect: true })
  type = LEADSPACE_TYPE.LEFT;

  /**
   *  Leadspace size (tall or medium)
   */
  @property({ reflect: true })
  size = 'tall';

  render() {
    const { gradientStyleScheme, type } = this;
    return html`
      <section style="${this._getBackgroundImage()}" class="${this._getTypeClass()}" part="section">
        <div class="${this._getContainerClass()}">
          <div class="${this._getGradientClass()}">
            ${gradientStyleScheme === LEADSPACE_GRADIENT_STYLE_SCHEME.NONE
              ? undefined
              : svg`
                <svg
                  class="${prefix}--leadspace__gradient"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                >
                  <defs>
                    <linearGradient id="stops" class="${prefix}--leadspace__gradient__stops">
                      ${
                        type === LEADSPACE_TYPE.CENTERED
                          ? svg`
                          <stop offset="0%" />
                          <stop offset="27%" />
                          <stop offset="53%" />
                          <stop offset="80%" />
                        `
                          : svg`
                          <stop offset="0%" />
                          <stop offset="50%" />
                          <stop offset="75%" />
                        `
                      }
                    </linearGradient>
                  </defs>
                  <rect class="${prefix}--leadspace__gradient__rect" width="100" height="100" />
                </svg>
              `}
            <div class="${this._getContentType()}">
              <div class="${prefix}--leadspace__row">
                ${this._renderHeading()}
              </div>
              <div class="${prefix}--leadspace__content">
                ${this._renderCopy()}
                <slot name="action"></slot>
              </div>
            </div>
          </div>
          ${this._renderImage()}
        </div>
      </section>
    `;
  }

  static get headingSelector() {
    return `${ddsPrefix}-leadspace-heading`;
  }

  static get stableSelector() {
    return `${ddsPrefix}--leadspace`;
  }

  static styles = styles; // `styles` here is a `CSSResult` generated by custom WebPack loader
}

export default DDSLeadSpace;
