/**
 * @fileoverview Typescript/Polymer3 implementation of
 * https://www.webcomponents.org/element/kcmr/resizable-panels
 */
import {PolymerElement, html} from '@polymer/polymer/polymer-element';
import {computed, customElement, observe, property} from '@polymer/decorators';
import {GestureEventListeners} from '@polymer/polymer/lib/mixins/gesture-event-listeners.js';
import * as Gestures from '@polymer/polymer/lib/utils/gestures.js';

import * as template from './template.html';

import '../../common.scss?name=common';
import './index.scss?name=resizable';

interface Rectangle {
  width: number,
  height: number,
}

interface DirectionalParams {
  previous: HTMLElement,
  next: HTMLElement,
  styleProperty: 'width'|'height',
  total: number|null,
  offset: number,
}

interface ResizeParams {
  offset: number,
  params: DirectionalParams,
}

@customElement('resizable-panel')
export class ResizablePanel extends GestureEventListeners(PolymerElement) {
  static get template() {
    // @ts-ignore
    return html([template]);
  }
  
  @property()
  vertical = false;
  
  children_: Array<HTMLElement> = [];
  private draggingDirectionChanged_ = false;
  private eventFired_ = false;
  private nextSiblingDimensions_: Rectangle|null = null;
  private previousSiblingDimensions_: Rectangle|null = null;
  private totalWidth_: number|null = 0;
  private totalHeight_: number|null = 0;
  private height_: number = 0;
  
  @computed('vertical', 'children_')
  get draggingDirection_() {
    if (this.children_ && this.children_.length) {
      return this.vertical ? 'vertical' : 'horizontal';
    }
    return '';
  }
  
  ready() {
    super.ready();
    Gestures.addListener(this, 'track', (e: Event) => this.trackHandler_(e as CustomEvent));
    setTimeout(() => {
      this.children_ = [...this.childNodes]
          .map((node) => node as HTMLElement)
          .filter((node) => node.nodeType === Node.ELEMENT_NODE);
      this.children_.forEach((panel, index) => this.addKnobs_(panel, index));
    });
  }
  
  @observe('draggingDirection_', 'children_')
  protected verticalObserver_(draggingDirection: 'vertical'|'horizontal'|'', children: Array<HTMLElement>) {
    if (!children.length) return;
    if (draggingDirection) {
      this.draggingDirectionChanged_ = true;
    }
    
    if (this.draggingDirectionChanged_) {
      children.forEach((child) => {
        this.resetPanelStyles_(
            child,
            draggingDirection === 'vertical' ? 'width' : 'height');
      });
      
      if (draggingDirection === 'vertical') {
        this.style.height = 'auto';
        this.height_ = this.getBoundingClientRect().height;
      }
      
      this.style.height = draggingDirection === 'vertical' ? `${this.height_}px` : '';
    }
  }
  
  private resetPanelStyles_(panel: HTMLElement, styleProperty: 'width'|'height') {
    panel.style[styleProperty] = '';
    panel.style.flexShrink = '';
  }
  
  private addKnobs_(panel: HTMLElement, index: number) {
    if (index > 0) {
      const knob = document.createElement('div');
      knob.classList.add('knob', `knob-panel-${index}`);
      this.insertBefore(knob, panel);
    }
  }
  
  private isKnob_(element: Event) {
    return (element.target as HTMLElement).className.indexOf('knob-panel-') >= 0;
  }
  
  private trackHandler_(event: CustomEvent) {
    const state = {
      start: (_: CustomEvent) => this.onTrackStart_(),
      track: (e: CustomEvent) => this.onTrack_(e),
      end: (_: CustomEvent) => this.onTrackEnd_(),
    };
    
    if (!(event.detail && event.detail.state)) return;
    let fn;
    switch (event.detail.state) {
      case 'start':
        fn = state.start;
        break;
      case 'track':
        fn = state.track;
        break;
      case 'end':
        fn = state.end;
        break;
      default:
        throw new Error(`Invalid event state: ${event.detail.state}`);
    }
    fn(event);
  }
  
  private onTrackStart_() {
    getSelection().removeAllRanges();
  }
  
  private onTrack_(event: CustomEvent) {
    if (!this.isKnob_(event)) return;
    
    if (!this.eventFired_) {
      this.dispatchEvent(new CustomEvent('resizing', {
        bubbles: true,
        composed: true,
        detail: {state: 'start'},
      }));
      this.classList.add('dragging');
      this.eventFired_ = true;
    }
    
    const next = (event.target as HTMLElement).nextElementSibling as HTMLElement;
    const previous = (event.target as HTMLElement).previousElementSibling as HTMLElement;
    
    this.nextSiblingDimensions_ = this.nextSiblingDimensions_ || this.computeDimensionsWithoutPadding_(next);
    this.previousSiblingDimensions_ = this.previousSiblingDimensions_ || this.computeDimensionsWithoutPadding_(previous);
    this.totalWidth_ = this.totalWidth_ || (event.currentTarget as HTMLElement).getBoundingClientRect().width;
    this.totalHeight_ = this.totalHeight_ || (event.currentTarget as HTMLElement).getBoundingClientRect().height;
    
    const hParams = {
      previous,
      next,
      styleProperty: 'width' as 'width'|'height',
      total: this.totalWidth_,
      offset: Math.abs(event.detail.dx),
    };
    const vParams = {
      previous,
      next,
      styleProperty: 'height' as 'width'|'height',
      total: this.totalHeight_,
      offset: Math.abs(event.detail.dy),
    };
    const resizeParams = {
      offset: this.draggingDirection_ === 'horizontal' ? event.detail.dx : event.detail.dy,
      params: this.draggingDirection_ === 'horizontal' ? hParams : vParams,
    };
    
    this.resize_(resizeParams);
  }
  
  private computeDimensionsWithoutPadding_(node: HTMLElement) {
    const bcr = node.getBoundingClientRect();
    const cs = getComputedStyle(node);
    
    if (!cs.paddingLeft) cs.paddingLeft = '0';
    if (!cs.paddingRight) cs.paddingRight = '0';
    if (!cs.paddingTop) cs.paddingTop = '0';
    if (!cs.paddingBottom) cs.paddingBottom = '0';
    
    return {
      width: bcr.width - (parseInt(cs.paddingLeft, 10) + parseInt(cs.paddingRight, 10)),
      height: bcr.height - (parseInt(cs.paddingTop, 10) + parseInt(cs.paddingBottom, 10)),
    };
  }
  
  private onTrackEnd_() {
    this.classList.remove('dragging');
    this.nextSiblingDimensions_ = null;
    this.previousSiblingDimensions_ = null;
    this.totalWidth_ = null;
    this.totalHeight_ = null;
    this.eventFired_ = false;
    this.dispatchEvent(new CustomEvent('resizing', {
      bubbles: true,
      composed: true,
      detail: {state: 'end'},
    }));
  }
  
  private getPct_(current: string, total: string) {
    return Math.round(parseInt(current, 10) * 100 / parseInt(total, 10));
  }
  
  private resize_(resizeParams: ResizeParams) {
    const offset = resizeParams.offset;
    const params = resizeParams.params;
    offset < 0 ? this.shrinkPrevious_(params) : this.shrinkNext_(params);
  }
  
  private isResizedToMinimum_(node: HTMLElement, styleProperty: 'width'|'height') {
    return parseInt(`${getComputedStyle(node)[styleProperty]}`, 10) === 0;
  }
  
  private shrinkPrevious_(params: DirectionalParams) {
    this.changeSize_(params.previous, this.previousSiblingDimensions_, params, '-');
    if (!this.isResizedToMinimum_(params.previous, params.styleProperty)) {
      this.changeSize_(params.next, this.nextSiblingDimensions_, params, '+');
    }
  }
  
  private shrinkNext_(params: DirectionalParams) {
    this.changeSize_(params.next, this.nextSiblingDimensions_, params, '-');
    if (!this.isResizedToMinimum_(params.next, params.styleProperty)) {
      this.changeSize_(params.previous, this.previousSiblingDimensions_, params, '+');
    }
  }
  
  private changeSize_(elem: HTMLElement, dimensions: Rectangle|null, params: DirectionalParams, operator: '+'|'-') {
    if (!dimensions) return;
    
    let current;
    if (params.styleProperty === 'width') {
      current = dimensions.width;
    } else {
      current = dimensions.height;
    }
    const pct = this.getPct_(`${current}`, `${params.total}`);
    elem.style[params.styleProperty] = `calc(${pct}% ${operator} ${params.offset}px)`;
    elem.style.flexShrink = '0';
  }
}