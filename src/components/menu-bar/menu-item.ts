import '@polymer/iron-icon';
import '@polymer/iron-icons';
import '@polymer/iron-icons/av-icons';
import '@polymer/iron-icons/device-icons';
import '@polymer/iron-icons/editor-icons';
import '@polymer/iron-icons/hardware-icons';
import '@polymer/iron-icons/maps-icons';
import {PaperListboxElement} from '@polymer/paper-listbox';
import '@polymer/paper-item';

import {PolymerElement, html} from '@polymer/polymer/polymer-element';
import {customElement, observe, property} from '@polymer/decorators';
import {GestureEventListeners} from '@polymer/polymer/lib/mixins/gesture-event-listeners';

import '../fim-iconset';

import * as template from './item-template.html';

import '../../common.scss?name=common';
import './item.scss?name=menu-item';

export interface MenuDescription {
  name?: string,
  shortcut?: string,
  items?: Array<MenuDescription>,
  icon?: string,
  separator?: boolean,
  actions?: Array<string>,
  disabled?: boolean,
}

@customElement('menu-item')
export class MenuItem extends GestureEventListeners(PolymerElement) {
  static get template() {
    // @ts-ignore
    return html([template]);
  }
  
  @property()
  name!: string;
  
  @property()
  shortcut!: string;
  
  @property({type: Boolean, reflectToAttribute: true})
  disabled = false;
  
  @property()
  icon = '';
  
  @property()
  menus!: Array<MenuDescription>;
  
  @property()
  expanded = false;
  
  @property()
  actions!: Array<string>;
  
  @property({type: Boolean})
  hideIcon = false;
  
  @observe('menus.*')
  protected menusChanged_(changeRecord: {base: Array<MenuDescription>, path: string, value: MenuDescription}) {
    let path = changeRecord.path;
    const match = path.match(/^menus\.(\d+)/);
    if (!match) return;
    const idx = parseInt(match[1], 10);
    const submenu = this.shadowRoot!.querySelector('#submenu') as PaperListboxElement;
    if (!submenu) return;
    const items = submenu.querySelectorAll('paper-item');
    if (!items) return;
    const content = items[idx].querySelector('div');
    if (!content) return;
    const menuItem = content.querySelector('menu-item') as PolymerElement;
    if (path.match(/^menus\.(\d+)$/)) {
      // done drilling into menus
      const listItem = items[idx] as HTMLElement;
      if (changeRecord.value.disabled) {
        listItem.setAttribute('disabled', 'true');
      } else {
        listItem.removeAttribute('disabled');
      }
    } else {
      path = changeRecord.path.replace(`menus.${idx}.items`, 'menus');
    }
    menuItem.notifyPath(path);
  }
  
  protected fireActions_(e: Event) {
    const findFn = (name: string) =>
        (e: any) => (e as HTMLElement).nodeName === name;
    const findMenuItem = findFn('MENU-ITEM');
    const menuItem = e.composedPath().find(findMenuItem) as MenuItem;
    
    if (!menuItem) return;
    if (menuItem.actions) {
      menuItem.actions.forEach((action) => {
        this.dispatchEvent(new CustomEvent(action, {
          bubbles: true,
          composed: true,
          detail: this,
        }));
      });
      this.dispatchEvent(new CustomEvent('menu-item-fired', {
        bubbles: true,
        composed: true,
        detail: this,
      }));
    } else if (menuItem.menus) {
      setTimeout(() => this.adjustPositionFor_(menuItem));
      
      let parent = menuItem.parentNode;
      while (parent && parent!.nodeName !== 'PAPER-LISTBOX') {
        parent = parent.parentNode;
      }
      if (!parent) return;
      
      const toggleVal = !menuItem.expanded;
      [...parent.children].filter(findFn('PAPER-ITEM')).forEach((e) => {
        const content = [...(e as HTMLElement).children].find(findFn('DIV'));
        if (!content) return;
        const sibling = [...(content as HTMLElement).children]
            .find(findMenuItem);
        (sibling as MenuItem).expanded = false;
        sibling!.classList.remove('expanded');
      });
      menuItem.expanded = toggleVal;
      menuItem.classList.toggle('expanded', menuItem.expanded);
    }
  }
  
  private adjustPositionFor_(menuItem: MenuItem) {
    const children = menuItem.shadowRoot!.children;
    let submenu;
    for (let i = 0; i < children.length; i++) {
      const elem = children.item(i);
      if (elem!.nodeName === 'PAPER-LISTBOX') {
        submenu = elem as PaperListboxElement;
        break;
      }
    }
    if (!submenu) return;
    
    const parentWidth = (menuItem.parentNode as HTMLDivElement)!.clientWidth;
    submenu.style.left = `${parentWidth - 18}px`;
    submenu.style.top = '5px';
  }
}

