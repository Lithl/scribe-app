/**
 * @fileoverview Typescript/Polymer3 implementation of
 * https://www.webcomponents.org/element/vpusher/paper-tree
 */
import {PaperListboxElement} from '@polymer/paper-listbox/paper-listbox';
import '@polymer/paper-item/paper-item';

import {PolymerElement, html} from '@polymer/polymer/polymer-element';
import {customElement, listen, property, query} from '@polymer/decorators';
import {DeclarativeEventListeners} from '@polymer/decorators/lib/declarative-event-listeners.js';

import {TreeNode, TreeNodeData, RootIconType, RootNodeData, ParentNodeData, LeafNodeData} from './node';
export {TreeNode, TreeNodeData, RootIconType, RootNodeData, ParentNodeData, LeafNodeData};

import * as template from './template.html';

import '../../common.scss?name=common';
import './index.scss?name=tree';


// if (typeof TreeNode === 'string') {
//   // nop; fixes strange issue with tree-node not importing correctly after build
// }

/**
 * Milliseconds to show/hide the context menu
 */
const CONTEXT_DELAY = 200;

interface ContextCallback {
  (x: number, y: number, callback: Array<ContextCallback>): void,
}

@customElement('paper-tree')
export class PaperTree extends DeclarativeEventListeners(PolymerElement) {
  static get template() {
    // @ts-ignore
    return html([template]);
  }
  
  @property()
  data!: Array<RootNodeData>;
  
  @property({type: Object, notify: true})
  selected: HTMLElement|null = null;
  
  @query('#contextMenu')
  private contextMenu_!: PaperListboxElement;
  
  protected optionsNode_: TreeNode|null = null;
  
  ready() {
    super.ready();
    document.addEventListener('tap', () => {
      this.closeContextMenu_(0, 0, []);
    });
  }
  
  @listen('select', document)
  selectNode_(event: Event) {
    const e = event as CustomEvent;
    if (this.selected) {
      this.selected.classList.toggle('selected', false);
    }
    
    if (e.detail && e.detail.tagName === 'TREE-NODE') {
      this.selected = e.detail;
      if (e.detail.selectable) {
        this.selected!.classList.toggle('selected', true);
      } else {
        (this.selected as TreeNode).toggleChildren();
      }
    } else {
      this.selected = null;
    }
  }
  
  @listen('right-click', document)
  showNodeOptions_(event: Event) {
    const e = event as CustomEvent;
    this.optionsNode_ = e.detail.node;
    const x = e.detail.sourceEvent.clientX;
    const y = e.detail.sourceEvent.clientY;
    this.closeContextMenu_(x, y, [
      (x: number, y: number, callback: Array<ContextCallback>) => {
        this.openContextMenu_(x, y, callback);
      },
    ]);
  }
  
  private closeContextMenu_(x: number, y: number, callback: Array<ContextCallback>) {
    this.contextMenu_.style.height = '0';
    setTimeout(() => {
      this.contextMenu_.style.display = 'none';
      if (callback && callback.length) {
        setTimeout(() => {
          callback[0](x, y, callback.slice(1));
        }, CONTEXT_DELAY);
      }
    }, CONTEXT_DELAY);
  }
  
  private openContextMenu_(x: number, y: number, callback: Array<ContextCallback>) {
    this.contextMenu_.style.display = 'block';
    this.contextMenu_.style.top = `${y}px`;
    this.contextMenu_.style.left = `${x}px`;
    let height = 0;
    [...this.contextMenu_.children].forEach((elem: Element) => {
      height += elem.getBoundingClientRect().height;
    });
    this.contextMenu_.style.height = `${height}px`;
    setTimeout(() => {
      if (callback && callback.length) {
        setTimeout(() => {
          callback[0](x, y, callback.slice(1));
        }, CONTEXT_DELAY);
      }
    }, CONTEXT_DELAY);
  }
  
  protected renameNode_() {
    console.log('rename this.optionsNode_');
  }
  
  protected deleteNode_() {
    console.log('delete this.optionsNode_');
  }
}
