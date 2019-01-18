import {PolymerElement, html} from '@polymer/polymer/polymer-element';
import {customElement, observe, property} from '@polymer/decorators';
import '@polymer/polymer/lib/elements/dom-repeat';

import {ParentNodeData, LeafNodeData} from '../paper-tree';
import '../rich-editor';

import * as template from './template.html';

import '../../common.scss?name=common';
import './index.scss?name=editor-collection';

interface TextBlock {
  parentIdentifier?: string;
  hideParentIdentifier?: boolean;
  identifier: string;
  text: string;
}

@customElement('rich-editor-collection')
export class RichEditorCollection extends PolymerElement {
  static get template() {
    // @ts-ignore
    return html([template]);
  }
  
  @property()
  editorData: Array<ParentNodeData | LeafNodeData> = [];
  
  private editorDataFlat_: Array<TextBlock> = [];
  
  @observe('editorData')
  protected editorDataChanged_() {
    this.editorDataFlat_ = [];
    this.editorData.forEach((data) => {
      if (data instanceof LeafNodeData) {
        this.editorDataFlat_.push({
          identifier: data.name,
          text: data.text,
        });
      } else {
        data.children.forEach((leaf, i) => {
          const block: TextBlock = {
            identifier: leaf.name,
            text: leaf.text,
            parentIdentifier: data.name,
          };
          if (i !== 0) {
            block.hideParentIdentifier = true;
          }
          this.editorDataFlat_.push(block);
        });
      }
    });
  }
  
  scrollToBlock(currentBlock: LeafNodeData) {
    console.log(currentBlock);
  }
}