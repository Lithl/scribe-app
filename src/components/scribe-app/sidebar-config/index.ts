/**
 * @fileoverview Exports the initial sidebar structure
 */
import {TreeNodeData} from '../../paper-tree/node';
import {deepCopy} from '../../../util';

export const emptyProject = [
  {
    open: true,
    children: [],
    icon: 'lightbulb-outline',
    name: 'Ideas',
  },
  {
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
  },
  {
    open: true,
    children: [],
    icon: 'face',
    name: 'Characters',
  },
  {
    open: true,
    children: [],
    icon: 'maps:satellite',
    name: 'Locations',
  },
  {
    open: true,
    children: [],
    icon: 'av:note',
    name: 'Notes',
  },
  {
    open: true,
    children: [],
    icon: 'work',
    name: 'Research',
  },
  {
    open: true,
    children: [],
    icon: 'device:widgets',
    name: 'Templates',
  },
] as Array<TreeNodeData>;

export function generateProject() {
  return deepCopy(emptyProject);
}
