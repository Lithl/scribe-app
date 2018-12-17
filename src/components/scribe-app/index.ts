import {PolymerElement, html} from '@polymer/polymer/polymer-element';
import {customElement, listen, observe, property, query} from '@polymer/decorators';
import {DeclarativeEventListeners} from '@polymer/decorators/lib/declarative-event-listeners';
import {DomRepeat} from '@polymer/polymer/lib/elements/dom-repeat';

import {PaperTree, TreeNodeData} from '../paper-tree';
import {TreeNode} from '../paper-tree/node';
import {MenuBar} from '../menu-bar';
import '../resizable-panel';

import * as template from './template.html';
import {fileMenu, editMenu, insertMenu, formatMenu, helpMenu} from './menu-config';
import {
  fileMenu_openRecent as openRecent,
  fileMenu_exportTo_googleDrive as googleDrive
} from './menu-config/file-menu';
import {generateProject} from './sidebar-config';
import {nth} from '../../util';

import '../../common.scss?name=common';
import './index.scss?name=main';

@customElement('scribe-app')
export class ScribeApp extends DeclarativeEventListeners(PolymerElement) {
  static get template() {
    // @ts-ignore
    return html([template]);
  }
  
  @property()
  googleUser!: gapi.auth2.GoogleUser;
  
  @query('paper-tree')
  protected tree_!: PaperTree;
  
  @query('menu-bar')
  protected menu_!: MenuBar;
  
  private lastSelectedNode_: TreeNode|null = null;
  
  ready() {
    super.ready();
    this.tree_!.data = generateProject();
    
    this.menu_!.menus = [
      fileMenu,
      editMenu,
      insertMenu,
      formatMenu,
      helpMenu,
    ];
    
    // TODO: obtain most recent session file if exists
    openRecent.items!.push({
      name: 'recent session',
      icon: 'history',
      actions: ['open-recent'],
    });
    openRecent.items!.push({separator: true});
    // TODO: obtain all recent session files if exist
    openRecent.items!.push({
      name: 'older session 1',
      actions: ['open-recent'],
    });
    openRecent.items!.push({
      name: 'older session 2',
      actions: ['open-recent'],
    });
    openRecent.items!.push({
      name: 'oldest session',
      actions: ['open-recent'],
    });
  }
  
  @listen('new-project', document)
  newProject() {
    // TODO: save current project if state is dirty
    this.tree_!.data = generateProject();
  }
  
  /**
   * Forces a node's dom-repeat to re-render, letting a newly-added child be
   * displayed without toggling the root node
   * @param matchIcon the name of the icon to search the tree for to find the
   * root node
   * @param breakOnFound true (default) if the tree only has one root node of
   * the desired type, set to false if there could be multiple root nodes of the
   * desired type to ensure all get rendered properly
   */
  private nodeRenderHelper(matchIcon: string, breakOnFound = true) {
    if (!this.tree_) return;
    if (!this.tree_.shadowRoot) return;
    const nodes = [...this.tree_.shadowRoot.querySelectorAll('tree-node')];
    for (const node of nodes) {
      if ((node as TreeNode).data.icon === matchIcon) {
        if (!node.shadowRoot) continue;
        const domRepeat = node.shadowRoot.querySelector('dom-repeat');
        (domRepeat as DomRepeat).render();
        if (breakOnFound) {
          break;
        }
      }
    }
  }
  
  /**
   * Common function for most of the File > New actions
   * @param name the root node to create, if none exists
   * @param matchIcon the name of the icon to search the tree for to find the
   * root node
   * @param childName the name to give to the newly-created child of the root
   * node
   */
  private rootNodeInsertionHelper(name: string, matchIcon: string, childName: string, child?: TreeNodeData) {
    if (!this.tree_) {
      throw new Error('Cannot insert nodes before tree is initialized');
    }
    let node: TreeNodeData|null = null;
    const data = this.tree_.data;
    let i = 0;
    for (; i < data.length; i++) {
      if (data[i].icon === matchIcon) {
        node = data[i];
        break;
      }
    }
    if (node === null) {
      node = {
        open: true,
        children: [],
        icon: matchIcon,
        name: name,
      };
      data.push(node);
      this.tree_.data = data.slice();
    }
    
    if (!child) {
      child = {
        selectable: true,
        name: childName,
      };
    }
    node.children!.push(child);
    // force +/- to display when first child is added
    this.tree_.notifyPath(`data.${i}.children`, node.children);
    
    // force new child to display without toggling group
    this.nodeRenderHelper(matchIcon);
  }
  
  @listen('new-manuscript', document)
  newManuscript() {
    const data = this.tree_!.data;
    let i = data.length - 1;
    for (; i >= 0; i--) {
      if (data[i].icon === 'chrome-reader-mode') {
        break;
      }
    }
    
    const newManuscript = {
      open: true,
      children: [{
        open: true,
        children: [{
          selectable: true,
          icon: 'device:wallpaper',
          name: 'New scene',
        }],
        icon: 'book',
        name: '1st chapter',
      }],
      icon: 'chrome-reader-mode',
      name: 'Manuscript',
    };
    if (i < 0) {
      data.push(newManuscript);
      i = data.length - 1;
    } else {
      data.splice(i + 1, 0, newManuscript);
    }
    
    this.tree_!.data = data.slice();
    this.nodeRenderHelper('chrome-reader-mode', false);
  }
  
  @listen('new-idea', document)
  newIdea() {
    this.rootNodeInsertionHelper('Ideas', 'lightbulb-outline', 'Empty idea');
  }
  
  @listen('select', document)
  treeItemSelected(e: Event) {
    const treeNode = (e as CustomEvent).detail as TreeNode;
    this.lastSelectedNode_ = treeNode;
  }
  
  @listen('new-chapter', document)
  newChapter() {
    const newChapter = {
      open: true,
      children: [{
        selectable: true,
        icon: 'device:wallpaper',
        name: 'New scene',
      }],
      icon: 'book',
      get name() { return `${nth(length + 1)} chapter`; },
    };
    let length = 0;
    if (!this.lastSelectedNode_) {
      // we haven't clicked any nodes, add the chapter to the first manuscript
      // TODO: this will fail if all manuscripts have been deleted
      length = this.tree_!.data.find((nd) => {
        return nd.icon === 'chrome-reader-mode'
      })!.children!.length;
      this.rootNodeInsertionHelper(
          'Manuscript',
          'chrome-reader-mode',
          'Untitled chapter',
          newChapter);
    } else {
      const icon = this.lastSelectedNode_.data.icon;
      if (icon === 'chrome-reader-mode') {
        // last clicked node was a manuscript, add chapter to that one
        length = this.lastSelectedNode_.data.children!.length;
        this.lastSelectedNode_.data.children!.push(newChapter);
        this.nodeRenderHelper('chrome-reader-mode', false);
      } else if (icon === 'book') {
        // last clicked node was chapter, add chapter after that one
        const parent = this.lastSelectedNode_.getParentNode();
        if (!parent || parent instanceof PaperTree) {
          throw new Error('Invalid tree state: chapter node at root');
        }
        const idx = parent.data.children!.indexOf(this.lastSelectedNode_.data);
        length = parent.data.children!.length;
        if (idx >= 0) {
          parent.data.children!.splice(idx + 1, 0, newChapter);
        } else {
          throw new Error('Invalid tree state: chapter node not in parent children');
        }
        this.nodeRenderHelper('chrome-reader-mode', false);
      } else if (icon === 'device:wallpaper') {
        // last clicked node was a scene, add chapter after parent
        const parent = this.lastSelectedNode_.getParentNode();
        if (!parent || parent instanceof PaperTree) {
          throw new Error('Invalid tree state: scene node at root');
        }
        const grandparent = parent.getParentNode();
        if (!grandparent || grandparent instanceof PaperTree) {
          throw new Error('Invalid tree state: chapter node at root');
        }
        const idx = grandparent.data.children!.indexOf(parent.data);
        length = grandparent.data.children!.length;
        if (idx >= 0) {
          grandparent.data.children!.splice(idx + 1, 0, newChapter);
        } else {
          throw new Error('Invalid tree state: chapter node not in parent children');
        }
        this.nodeRenderHelper('chrome-reader-mode', false);
      } else {
        // last clicked node wasn't a manuscript/chapter/scene, so treat like no
        // last selected node
        // TODO: this will fail if all manuscripts have been deleted
        // TODO: remove duplicate code
        length = this.tree_!.data.find((nd) => {
          return nd.icon === 'chrome-reader-mode'
        })!.children!.length;
        this.rootNodeInsertionHelper(
            'Manuscript',
            'chrome-reader-mode',
            'Untitled chapter',
            newChapter);
      }
    }
    console.log('create new chapter');
  }
  
  @listen('new-scene', document)
  newScene() {
    console.log('create new scene');
  }
  
  @listen('new-character', document)
  newCharacter() {
    this.rootNodeInsertionHelper('Characters', 'face', 'Unnamed character');
  }
  
  @listen('new-location', document)
  newLocation() {
    this.rootNodeInsertionHelper(
        'Locations',
        'maps:satellite',
        'Unnamed location');
  }
  
  @listen('new-note', document)
  newNote() {
    this.rootNodeInsertionHelper('Notes', 'av:note', 'Empty note');
  }
  
  @listen('new-research', document)
  newResearch() {
    this.rootNodeInsertionHelper('Research', 'work', 'Unnamed research');
  }
  
  @listen('new-template', document)
  newTemplate() {
    this.rootNodeInsertionHelper(
        'Templates',
        'device:widgets',
        'Unnamed template');
  }
  
  @listen('force-save', document)
  forceSave() {
    console.log('call autosave process manually');
  }
  
  @listen('drive-export', document)
  driveExport() {
    console.log('export project data to Google Drive (authenticate if necessary)');
  }
  
  @listen('download-project', document)
  downloadProject() {
    console.log('create file with all project data');
  }
  
  @listen('fim-export', document)
  fimExport() {
    console.log('export story to Fimfiction (authenticate if necessary)');
  }
  
  @listen('open-project', document)
  openProject() {
    console.log('open existing project, either saved to the server, exported to Google Drive, or downloaded');
  }
  
  @listen('open-recent', document)
  openRecent(e: Event) {
    console.log('check value of `e` to find which recent project should be opened');
    console.log(e);
  }
  
  @listen('undo-action', document)
  undoAction() {
    console.log('undo typing? undo other actions?');
  }
  
  @listen('redo-action', document)
  redoAction() {
    console.log('redo typing? redo other actions?');
  }
  
  /*
  cut-text, copy-text, paste-text, delete-text, and select-text
  probably don't need actual implementations
  */
  
  @listen('find-replace', document)
  findAndReplace() {
    console.log('open find-replace dialog');
  }
  
  @listen('insert-image', document)
  insertImage() {
    console.log('insert image from url');
  }
  
  @listen('insert-emoticon', document)
  insertEmoticon() {
    console.log('insert fimfiction emoticon');
  }
  
  @listen('insert-rule', document)
  insertRule() {
    console.log('insert horizontal rule');
  }
  
  @listen('insert-footnote', document)
  insertFootnote() {
    console.log('insert footnote at cursor');
  }
  
  @listen('special-characters', document)
  specialCharacters() {
    console.log('open unicode symbol dialog');
  }
  
  @listen('insert-link', document)
  insertLink() {
    console.log('insert link');
  }
  
  @listen('insert-comment', document)
  insertComment() {
    console.log('add comment on current scene or selected text');
  }
  
  @listen('authors-note', document)
  authorsNote() {
    console.log('add an author\'s note to the current chapter');
  }
  
  @listen('bold-text', document)
  boldText() {
    console.log('bold selected text/text at cursor');
  }
  
  @listen('italicize-text', document)
  italicizeText() {
    console.log('italicize selected text/text at cursor');
  }
  
  @listen('underline-text', document)
  underlineText() {
    console.log('underline selected text/text at cursor');
  }
  
  @listen('strikethrough-text', document)
  strikethroughText() {
    console.log('strikethrough selected text/text at cursor');
  }
  
  @listen('color-picker', document)
  colorPicker() {
    console.log('show color picker to set text color');
  }
  
  @listen('superscript-text', document)
  superscriptText() {
    console.log('superscript selected text/text at cursor');
  }
  
  @listen('subscript-text', document)
  subscriptText() {
    console.log('subscript selected text/text at cursor');
  }
  
  @listen('spoiler-text', document)
  spoilerText() {
    console.log('spoiler selected tedxt/text at cursor');
  }
  
  @listen('normal-paragraph', document)
  normalParagraph() {
    console.log('return to normal paragraph');
  }
  
  @listen('quote-block', document)
  quoteBlock() {
    console.log('convert to quote');
  }
  
  @listen('code-block', document)
  codeBlock() {
    console.log('convert to code block');
  }
  
  @listen('heading-1', document)
  heading1() { this.heading_(1); }
  
  @listen('heading-2', document)
  heading2() { this.heading_(2); }
  
  @listen('heading-3', document)
  heading3() { this.heading_(3); }
  
  @listen('heading-4', document)
  heading4() { this.heading_(4); }
  
  @listen('heading-5', document)
  heading5() { this.heading_(5); }
  
  @listen('heading-6', document)
  heading6() { this.heading_(6); }
  
  private heading_(level: number) {
    console.log(`set to heading level ${level}`);
  }
  
  @listen('left-align', document)
  leftAlign() {
    console.log('left align');
  }
  
  @listen('center-align', document)
  centerAlign() {
    console.log('center align');
  }
  
  @listen('right-align', document)
  rightAlign() {
    console.log('right align');
  }
  
  @listen('number-list', document)
  numberList() {
    console.log('createnumber list');
  }
  
  @listen('bullet-list', document)
  bulletList() {
    console.log('create bullet list');
  }
  
  @listen('clear-formatting', document)
  clearFormatting() {
    console.log('clear formatting');
  }
  
  @listen('about-scribe', document)
  requestAbout() {
    console.log('about requested');
  }
  
  @listen('report-bug', document)
  reportBug() {
    console.log('report a bug');
  }
  
  @listen('request-shortcuts', document)
  requestShortcuts() {
    console.log('request keyboard shortcuts');
  }
  
  @observe('googleUser')
  protected googleUserChanged(user: gapi.auth2.GoogleUser) {
    googleDrive.disabled = !(user && user.isSignedIn());
    let path = 'menus';
    path += '.0.items'; // fileMenu
    let submenu;
    for (let i = 0; i < fileMenu.items!.length; i++) {
      submenu = fileMenu.items![i];
      if (!submenu.items) continue;
      const idx = submenu.items.indexOf(googleDrive);
      if (idx >= 0) {
        path += `.${i}.items.${idx}`;
        break;
      }
    }
    this.menu_.notifyPath(path);
  }
}
