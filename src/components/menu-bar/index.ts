import '@polymer/paper-input/paper-input';

import {PolymerElement, html} from '@polymer/polymer/polymer-element';
import {customElement, listen, observe, property, query} from '@polymer/decorators';
import {DeclarativeEventListeners} from '@polymer/decorators/lib/declarative-event-listeners';

import './menu-item';
import {MenuItem, MenuDescription as Description, MenuChangeRecord} from './menu-item';

import * as template from './template.html';

import '../../common.scss?name=common';
import './index.scss?name=menu-bar';

export interface MenuDescription extends Description {}

/**
 * A container for menus, submenus, and menu items like a fully-fleged window
 */
@customElement('menu-bar')
export class MenuBar extends DeclarativeEventListeners(PolymerElement) {
  static get template() {
    // @ts-ignore
    return html([template]);
  }
  
  @property()
  menus!: Array<MenuDescription>;
  
  @query('#menuBar')
  protected menuBar_!: HTMLDivElement;
  
  @query('#title')
  protected titleInput_!: HTMLElement;
  
  private menuMode_ = false;
  
  constructor() {
    super();
    document.addEventListener('tap', () => this.toggleMenuMode_(false));
  }
  
  ready() {
    super.ready();
    setTimeout(() => this.forceInputBlurStyle_());
  }
  
  @observe('menus.*')
  protected menusChanged_(changeRecord: MenuChangeRecord) {
    const match = changeRecord.path.match(/^menus\.(\d+)/);
    if (!match) return;
    const idx = parseInt(match[1], 10);
    const children = [...this.menuBar_.children];
    const path = changeRecord.path.replace(`menus.${idx}.items`, 'menus');
    (children[idx] as PolymerElement).notifyPath(path);
  }
  
  protected toggleMenuMode_(eventOrForce: Event|boolean) {
    const findFn = (e: any) => (e as HTMLElement).nodeName === 'MENU-ITEM';
    const children = [...this.menuBar_.children];
    children
        .filter(findFn)
        .map((child) => child as MenuItem)
        .forEach(this.collapseAll_);
    
    if (typeof eventOrForce === 'boolean') {
      this.menuMode_ = eventOrForce;
    } else {
      eventOrForce.stopPropagation();
      
      const path = eventOrForce.composedPath();
      const menuItem = path.find(findFn) as MenuItem;
      if (!menuItem) return;
      
      this.menuMode_ = !this.menuMode_;
      menuItem!.expanded = this.menuMode_;
      menuItem!.classList.toggle('expanded', this.menuMode_);
    }
  }
  
  protected changeMenu_(e: MouseEvent) {
    const findFn = (e: any) => (e as HTMLElement).nodeName === 'MENU-ITEM';
    const menuItem = e.composedPath().find(findFn) as MenuItem;
    if (!menuItem) return;
    
    if (this.menuMode_) {
      [...this.menuBar_.children]
          .filter(findFn)
          .map((child) => child as MenuItem)
          .forEach(this.collapseAll_);
      menuItem!.expanded = true;
      menuItem!.classList.add('expanded');
    }
  }
  
  protected forceInputFocusStyle_() {
    const input = this.getNativeTitleInput_();
    input.style.fontVariant = 'normal';
    input.removeAttribute('readonly');
  }
  
  protected forceInputBlurStyle_() {
    const input = this.getNativeTitleInput_();
    input.style.fontVariant = 'small-caps';
    input.style.textOverflow = 'ellipsis';
    input.setAttribute('readonly', 'true');
  }
  
  private getNativeTitleInput_(): HTMLInputElement {
    return (this.titleInput_ as any).$.nativeInput;
  }
  
  @listen('menu-item-fired', document)
  onMenuItemFired_(e: Event) {
    const item = (e as CustomEvent).detail as MenuItem;
    this.collapseAll_(item);
    
    let node = item.parentNode;
    while (node !== document.body) {
      if (!node) break;
      
      if (node.nodeName === 'MENU-ITEM') {
        this.collapseAll_(node as MenuItem);
      }
      
      if (node.parentNode) {
        node = node.parentNode;
      } else if ((node as any).host) {
        node = (node as any).host;
      } else {
        break;
      }
    }
    this.menuMode_ = false;
  }
  
  private collapseAll_(item: MenuItem) {
    item.expanded = false;
    item.classList.remove('expanded');
  }
}
