import {PolymerElement, html} from '@polymer/polymer/polymer-element';
import {customElement, computed, property, query} from '@polymer/decorators';
import '@polymer/paper-card/paper-card';

import * as template from './template.html';

import '../../common.scss?name=common';
import './index.scss?name=editor';

@customElement('rich-editor')
export class RichEditorCollection extends PolymerElement {
  static get template() {
    // @ts-ignore
    return html([template]);
  }
  
  @property()
  parentIdentifier = '';
  
  @property({type: Boolean})
  hideParentIdentifier = false;
  
  @property()
  identifier = '';
  
  @property()
  text = '';
  
  @query('#container')
  protected container_!: HTMLDivElement;
  
  @query('#body')
  protected body_!: HTMLDivElement;
  
  @computed('hideParentIdentifier')
  get hideParentIdentifierClass() {
    return this.hideParentIdentifier ? 'hide-parent' : '';
  }
  
  protected bodyFocused_() {
    this.container_.classList.add('body-focused');
  }
  
  protected bodyBlurred_() {
    this.container_.classList.remove('body-focused');
  }
}