import '@polymer/iron-icons/iron-icons';
import '@polymer/iron-icon/iron-icon';
import '@polymer/paper-menu-button/paper-menu-button';
import '@polymer/paper-icon-button/paper-icon-button';
import '@polymer/paper-listbox/paper-listbox';
import '@polymer/paper-item/paper-item';

import {PolymerElement, html} from '@polymer/polymer/polymer-element';
import {customElement, property} from '@polymer/decorators';

import * as template from './node-template.html';
import {PaperTree} from './';

import '../../common.scss?name=common';
import './node.scss?name=tree-node'

export interface TreeNodeData {
  open?: boolean,
  children?: Array<TreeNodeData>,
  icon?: string,
  selectable?: boolean,
  name: string,
}

@customElement('tree-node')
export class TreeNode extends PolymerElement {
  static get template() {
    // @ts-ignore
    return html([template]);
  }
  
  @property()
  data!: TreeNodeData;
  
  @property()
  selectable = false;
  
  @property({computed: 'computeNodeClasses_(data.*)', type: String})
  protected nodeClasses_ = '';
  
  @property({computed: 'computeIcon_(data.icon)', type: String})
  protected icon_ = '';
  
  ready() {
    super.ready();
    const names = [...this.shadowRoot!.querySelectorAll('.node-name')];
    names.forEach((name) => {
      name.addEventListener('contextmenu', (e: Event) => {
        const event = e as MouseEvent;
        if ((event.buttons & 2) === 2) {
          e.preventDefault();
          this.dispatchEvent(new CustomEvent('right-click', {
            bubbles: true,
            composed: true,
            detail: {
              node: this,
              sourceEvent: e,
            },
          }));
        }
      });
    });
  }
  
  protected computeNodeClasses_(changed: {base: TreeNodeData}) {
    const open = changed && changed.base && changed.base.open;
    const children = changed && changed.base && changed.base.children;
    const classes = ['node-preicon'];
    if (children && children.length) {
      if (open) {
        classes.push('expanded');
      } else {
        classes.push('collapsed');
      }
    }
    return classes.join(' ');
  }
  
  protected computeIcon_() {
    return this.data ? this.data.icon : '';
  }
  
  select() {
    this.dispatchEvent(new CustomEvent('select', {
      bubbles: true,
      composed: true,
      detail: this,
    }));
    return false;
  }
  
  getParentNode() {
    let parent = this.parentNode;
    while (parent !== document.body) {
      if (!parent) break;
      if (parent.nodeName === 'TREE-NODE' || parent.nodeName === 'PAPER-TREE') {
        break;
      }
      
      if (parent.parentNode) {
        parent = parent.parentNode;
      } else if ((parent as any).host) {
        parent = (parent as any).host;
      } else {
        throw new Error('Cannot traverse node tree');
      }
    }
    
    if (parent === document.body || !parent) return undefined;
    return parent as TreeNode|PaperTree;
  }
  
  getChildren() {
    return [...this.shadowRoot!.querySelectorAll('tree-node')];
  }
  
  toggleChildren() {
    this.set('data.open', !this.data.open && this.data.children && this.data.children.length);
    setTimeout(() => this.dispatchEvent(new CustomEvent('toggle', {
      bubbles: true,
      composed: true,
      detail: this,
    })));
  }
}
