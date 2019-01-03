/**
 * @fileoverview Exports the initial sidebar structure
 */
import {RootNodeData, ParentNodeData, LeafNodeData} from '../../paper-tree/node';
import {deepCopy} from '../../../util';

export const emptyProject = [
  new RootNodeData('lightbulb-outline', 'Ideas'),
  new RootNodeData('chrome-reader-mode', 'Manuscript', [
    new ParentNodeData('1st chapter', [
      new LeafNodeData('New scene', 'device:wallpaper'),
    ]),
  ]),
  new RootNodeData('face', 'Characters'),
  new RootNodeData('maps:satellite', 'Locations'),
  new RootNodeData('av:note', 'Notes'),
  new RootNodeData('work', 'Research'),
  new RootNodeData('device:widgets', 'Templates'),
];

export function generateProject() {
  return deepCopy(emptyProject);
}
