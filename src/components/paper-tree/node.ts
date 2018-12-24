/**
 * @fileoverview Typescript/Polymer3 implementation of
 * https://www.webcomponents.org/element/vpusher/paper-tree
 */
import '@polymer/iron-icons/iron-icons';
import '@polymer/iron-icon/iron-icon';
import '@polymer/paper-menu-button/paper-menu-button';
import '@polymer/paper-icon-button/paper-icon-button';
import '@polymer/paper-listbox/paper-listbox';
import '@polymer/paper-item/paper-item';

import {PolymerElement, html} from '@polymer/polymer/polymer-element';
import {customElement, property, query} from '@polymer/decorators';

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
  
  @query('.node-container')
  protected nodeContainer_!: HTMLDivElement;

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

    this.nodeContainer_!.addEventListener(
        'dragstart', (e: DragEvent) => this.nodeDragStart_(e));
    this.nodeContainer_!.addEventListener(
        'dragenter', (e: DragEvent) => this.nodeDragEnter_(e));
    this.nodeContainer_!.addEventListener(
        'dragover', (e: DragEvent) => this.nodeDragOver_(e));
    this.nodeContainer_!.addEventListener(
        'drop', (e: DragEvent) => this.nodeDrop_(e));
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
    this.set(
        'data.open',
        !this.data.open && this.data.children && this.data.children.length);
    setTimeout(() => this.dispatchEvent(new CustomEvent('toggle', {
      bubbles: true,
      composed: true,
      detail: this,
    })));
  }

  private nodeDragStart_(e: DragEvent) {
    e.stopPropagation();

    const parent = this.getParentNode();
    if (!parent) return;

    const dropTargets: Array<string> = [];
    if (parent instanceof PaperTree) {
      // node is Ideas, Manuscript, Characters, Locations, Notes, Research,
      // or Templates
      dropTargets.push('root');
    } else {
      const parentIcon = parent.computeIcon_();

      if (parentIcon === 'lightbulb-outline' // node is Ideas leaf node
          || parentIcon === 'face' // node is Characters leaf node
          || parentIcon === 'maps:satellite' // node is Locations leaf node
          || parentIcon === 'av:note' // node is Notes leaf node
          || parentIcon === 'work' // node is Research leaf node
          || parentIcon === 'device:widgets') { // node is Templates leaf node
        dropTargets.push(parentIcon);
      } else {
        // node is descendant of Manuscripts node
        dropTargets.push('chrome-reader-mode');
        if (parentIcon === 'book') {
          // node is a Scene
          dropTargets.push('book');
        }
      }
    }

    e.dataTransfer!.setData('text/plain', JSON.stringify({
      transfer: 'tree-node',
      dropTargets,
    }));
    dropTargets.forEach((t) => e.dataTransfer!.setData(t, 'dummy'));
  }

  private nodeDragEnter_(e: DragEvent) {
    e.stopPropagation();
    let canMove = false;

    const parent = this.getParentNode();
    if (!parent || parent instanceof PaperTree) return;

    const types = e.dataTransfer!.types;
    const icon = this.computeIcon_();
    const parentIcon = parent.computeIcon_();
    if (icon === 'lightbulb-outline' // node is Ideas
        || icon === 'chrome-reader-mode' // node is Manuscript
        || icon === 'face' // node is Characters
        || icon === 'maps:satellite' // node is Locations
        || icon === 'av:note' // node is Notes
        || icon === 'work' // node is Research
        || icon === 'device:widgets') { // node is Templates
      if (types.indexOf('root') >= 0) {
        // dragging one of the root node types onto the root
        canMove = true;
      }

      if (icon === 'chrome-reader-mode') {
        if (types.indexOf('chrome-reader-mode') >= 0 // dragging a Chapter
            || types.indexOf('book') >= 0) { // dragging a Scene
          // dragging a descendant of a Manuscript onto a Manuscript
          canMove = true;
        }
      }
    } else if (icon === 'book' && types.indexOf('book') >= 0) {
      // dragging a Scene onto a Chapter
      canMove = true;
    }

    if (canMove || types.indexOf(`${parentIcon}`) >= 0) {
      e.preventDefault();
    }
  }

  private nodeDragOver_(e: DragEvent) {
    this.nodeDragEnter_(e);
  }

  private nodeDrop_(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
  }
}
