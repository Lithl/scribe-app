/**
 * @fileoverview Typescript/Polymer3 implementation of
 * https://www.webcomponents.org/element/vpusher/paper-tree
 * with additions useful to this project
 */
import {PaperListboxElement} from '@polymer/paper-listbox/paper-listbox';
import '@polymer/paper-item/paper-item';
import * as PaperDialog from '@polymer/paper-dialog/paper-dialog';
import * as PaperInput from '@polymer/paper-input/paper-input';
import {IronInputElement} from'@polymer/iron-input/iron-input';
import '@polymer/paper-button/paper-button';
import * as IronA11yKeys from '@polymer/iron-a11y-keys/iron-a11y-keys';

import {PolymerElement, html} from '@polymer/polymer/polymer-element';
import {customElement, listen, property, query} from '@polymer/decorators';
import {DeclarativeEventListeners} from '@polymer/decorators/lib/declarative-event-listeners.js';

import {TreeNode, TreeNodeData, RootIconType, RootNodeData, ParentNodeData, LeafNodeData} from './node';
export {TreeNode, TreeNodeData, RootIconType, RootNodeData, ParentNodeData, LeafNodeData};

import * as template from './template.html';

import '../../common.scss?name=common';
import './index.scss?name=tree';

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
  selected: HTMLElement | null = null;

  @query('#contextMenu')
  private contextMenu_!: PaperListboxElement;

  @query('#renameDialog')
  private renameDialog_!: PaperDialog.PaperDialogElement;

  @query('#deleteDialog')
  private deleteDialog_!: PaperDialog.PaperDialogElement;

  @query('#nodeName')
  private nodeName_!: PaperInput.PaperInputElement;

  @query('#nodeToDelete')
  private nodeToDelete_!: HTMLSpanElement;

  @query('#nodeNameInputHandler')
  private nodeNameInputHandler_!: IronA11yKeys.IronA11yKeysElement;

  protected optionsNode_: TreeNode|null = null;

  ready() {
    super.ready();
    document.addEventListener('tap', () => {
      this.closeContextMenu_(0, 0);
    });
    this.nodeNameInputHandler_!.target = this.nodeName_;
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
  
  private closeContextMenu_(
      x: number,
      y: number,
      callback?: Array<ContextCallback>) {
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
  
  private openContextMenu_(
      x: number,
      y: number,
      callback?: Array<ContextCallback>) {
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
    if (!this.optionsNode_) return;
    this.closeContextMenu_(0, 0);

    this.nodeName_.value = this.optionsNode_.data.name;
    const ironInput = this.nodeName_.inputElement as IronInputElement;
    const input = ironInput.inputElement;
    setTimeout(() => input.select());
    this.renameDialog_.open();
  }
  
  protected deleteNode_() {
    if (!this.optionsNode_) return;
    this.closeContextMenu_(0, 0);

    this.nodeToDelete_.innerText = this.optionsNode_.data.name;
    this.deleteDialog_.open();
  }
  
  protected closeDialog_(e: Event) {
    const path = [...e.composedPath()].map((e) => e as HTMLElement);
    const dialog = path.find((e) => {
      return e.nodeName === 'PAPER-DIALOG';
    }) as PaperDialog.PaperDialogElement;
    if (!dialog) return;
    dialog.close();
  }
  
  protected updateNodeName_() {
    if (!this.optionsNode_) return;
    const newName = this.nodeName_.value;
    this.optionsNode_.set('data.name', newName);
    this.renameDialog_.close();
  }
  
  protected confirmDelete_() {
    if (!this.optionsNode_) return;
    const uuid = this.optionsNode_.uuid;
    const parent = this.optionsNode_.getParentNode();
    let siblings;
    if (!parent) return;
    if (parent instanceof PaperTree) {
      siblings = [...parent.shadowRoot!.querySelectorAll('tree-node')]
          .map((e) => e as TreeNode);
    } else {
      siblings = parent.getChildren();
    }

    const idx = siblings.findIndex((e) => e.uuid === uuid);
    if (parent instanceof PaperTree) {
      parent.splice('data', idx, 1);
    } else {
      parent.splice('data.children', idx, 1);
    }

    this.deleteDialog_.close();
  }
}
