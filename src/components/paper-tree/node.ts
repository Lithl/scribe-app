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
import {DomRepeat} from '@polymer/polymer/lib/elements/dom-repeat';

import * as template from './node-template.html';
import {PaperTree} from './';

import {uuid} from '../../util';

import '../../common.scss?name=common';
import './node.scss?name=tree-node'

export interface TreeNodeData {
  open: boolean,
  children?: Array<TreeNodeData>,
  icon?: string,
  selectable: boolean,
  name: string,
}

export type RootIconType = 'lightbulb-outline' | 'face' | 'maps:satellite'
      | 'av:note' | 'work' | 'device:widgets' | 'chrome-reader-mode';

export class RootNodeData implements TreeNodeData {
  readonly open = true;
  children: Array<ParentNodeData | LeafNodeData> = [];
  icon: RootIconType;
  readonly selectable = false;
  name = '';
  
  constructor(
      icon: RootIconType,
      name: string,
      children?: Array<ParentNodeData | LeafNodeData>) {
    this.icon = icon;
    this.name = name;
    this.children = children || [];
  }
}

export class ParentNodeData implements TreeNodeData {
  readonly open = true;
  children: Array<LeafNodeData> = [];
  icon = 'book';
  readonly selectable = false;
  name = '';
  
  constructor(name: string, children?: Array<LeafNodeData>) {
    this.name = name;
    this.children = children || [];
  }
}

export class LeafNodeData implements TreeNodeData {
  open = true;
  icon: 'device:wallpaper' | undefined;
  readonly selectable = true;
  name = '';
  
  constructor(name: string, icon?: 'device:wallpaper') {
    this.icon = icon;
    this.name = name;
  }
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
  
  private uuid_ = uuid();

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
    this.nodeContainer_!.addEventListener(
        'dragend', () => this.clearAllInsertClasses_());
    this.nodeContainer_!.addEventListener(
        'dragleave', () => this.clearAllInsertClasses_());
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
  
  private getParentTree_() {
    let root: (Node & ParentNode) | null = this;
    while (root && !(root instanceof PaperTree)) {
      if ((root as any).host) {
        root = (root as any).host;
      } else {
        root = root.parentNode;
      }
    }
    return root;
  }
  
  getChildren() {
    return [...this.shadowRoot!.querySelectorAll('tree-node')]
        .map((e) => e as TreeNode);
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
    
    const uuidChain = [this.uuid_];
    let anscestor: PaperTree | TreeNode | null | undefined = parent;
    if (anscestor instanceof TreeNode) {
      uuidChain.unshift(anscestor.uuid_);
      while (anscestor = anscestor instanceof TreeNode
          ? anscestor.getParentNode() : null) {
        if (anscestor instanceof TreeNode) uuidChain.unshift(anscestor.uuid_);
      }
    }

    e.dataTransfer!.setData('text/plain', JSON.stringify({
      transfer: 'tree-node',
      dropTargets,
      uuidChain,
    }));
    dropTargets.forEach((t) => e.dataTransfer!.setData(t, 'dummy'));
  }

  private nodeDragEnter_(e: DragEvent) {
    e.stopPropagation();
    let canMove = false;

    const parent = this.getParentNode();
    if (!parent) return; // this instanceof PaperTree

    const types = e.dataTransfer!.types;
    const icon = this.computeIcon_();
    const parentIcon = parent instanceof PaperTree ? '' : parent.computeIcon_();
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
      return true;
    }
    return false;
  }

  private nodeDragOver_(e: DragEvent) {
    const canMove = this.nodeDragEnter_(e);
    if (!canMove) return;

    const path = e.composedPath();
    const overNode = path
        .find((n) => (n as Node).nodeName === 'TREE-NODE') as TreeNode;
    if (!overNode) return; // not over any tree-node

    const nodeY = overNode.nodeContainer_.offsetTop;
    const nodeHeight = overNode.nodeContainer_.clientHeight;
    const mouseY = e.y;

    if (mouseY < nodeY + nodeHeight / 2) {
      overNode.classList.remove('insert-below');
      overNode.classList.add('insert-above');
    } else {
      overNode.classList.remove('insert-above');
      overNode.classList.add('insert-below');
    }
  }

  private nodeDrop_(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    
    const forceRender = (root: TreeNode) => {
      if (!root.shadowRoot) return;
      const domRepeat = root.shadowRoot.querySelector('dom-repeat');
      (domRepeat as DomRepeat).render();
    }

    const data = JSON.parse(e.dataTransfer!.getData('text/plain'));
    if (data.transfer !== 'tree-node') return;
    
    const nodeY = this.nodeContainer_.offsetTop;
    const nodeHeight = this.nodeContainer_.clientHeight;
    const mouseY = e.y;
    const insertAbove = mouseY < nodeY + nodeHeight / 2;
    
    const tree = this.getParentTree_();
    const chain = data.uuidChain.slice();
    let sourceParent: TreeNode | undefined;
    while (chain.length > 1) {
      const id = chain.shift();
      const children = sourceParent ?
          sourceParent.getChildren()
          : [...tree!.shadowRoot!.querySelectorAll('tree-node')]
              .map((e) => e as TreeNode);
      sourceParent = children.find((c) => c.uuid_ === id);
    }
    if (!sourceParent || !sourceParent.data.children) return;
    
    const sourceUuid = data.uuidChain[data.uuidChain.length - 1];
    const idx = sourceParent.getChildren()
        .findIndex((c) => c.uuid_ === sourceUuid);
    const spliced = sourceParent.data.children.splice(idx, 1);
    if (spliced.length !== 1) return;
    const transferredData = spliced[0];
    sourceParent.notifyPath('data.children', sourceParent.data.children);
    forceRender(sourceParent);
    
    let insertParent;
    let insertIdx;
    if (data.dropTargets.indexOf(this.icon_) >= 0
        && transferredData.icon === 'device:wallpaper'
        && this.icon_ === 'chrome-reader-mode') {
      // dropped scene node into manuscript; append to first chapter, or
      // create new chapter if none exist
      if (!this.data.children || !this.data.children.length) {
        this.data.children = [new ParentNodeData('1st chapter')];
        forceRender(this);
      }
      insertParent = this.getChildren()![0];
      insertIdx = -1;
    } else {
      // dropped non-scene node, or dropped scene node into chapter; append to
      // drop target if it's a parent/root node, or insert above/below drop
      // target otherwise
      if (data.dropTargets.indexOf(this.icon_) >= 0) {
        insertParent = this;
        insertIdx = -1;
      } else {
        insertParent = this.getParentNode();
        if (!insertParent || insertParent instanceof PaperTree) return;
        else {
          insertIdx = insertParent.getChildren()
              .findIndex((e) => e.uuid_ === this.uuid_);
        }
      }
    }

    if (!insertParent.data.children) insertParent.data.children = [];
    if (insertIdx < 0) {
      insertParent.data.children.push(transferredData);
    } else {
      if (!insertAbove) insertIdx++;
      insertParent.data.children.splice(insertIdx, 0, transferredData);
    }
    insertParent.notifyPath('data.children', insertParent.data.children);
    forceRender(insertParent);
    
    this.clearAllInsertClasses_();
  }
  
  private clearAllInsertClasses_() {
    const root = this.getParentTree_();
    if (root) {
      const children = [...root.shadowRoot!.querySelectorAll('tree-node')]
          .map((e) => e as TreeNode);
      children.forEach((c) => TreeNode.clearInsertClassesOf_(c));
    } else {
      TreeNode.clearInsertClassesOf_(this);
    }
  }

  private static clearInsertClassesOf_(root: TreeNode) {
    const children = root.getChildren();
    if (children && children.length) {
      children.forEach((c) => TreeNode.clearInsertClassesOf_(c));
    }
    
    root.classList.remove('insert-above');
    root.classList.remove('insert-below');
  }
}
