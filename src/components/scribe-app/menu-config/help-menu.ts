import {MenuDescription} from '../../menu-bar/menu-item';

export const helpMenu_aboutScribe = {
  name: 'About Scribe',
  icon: 'help',
  actions: ['about-scribe'],
} as MenuDescription;

export const helpMenu_reportBug = {
  name: 'Report a bug',
  icon: 'bug-report',
  actions: ['report-bug'],
} as MenuDescription;

export const helpMenu_keyboardShortcuts = {
  name: 'Keyboard shortcuts',
  shortcut: 'Ctrl+/',
  icon: 'hardware:keyboard',
  actions: ['request-shortcuts'],
} as MenuDescription;

export const helpMenu = {
  name: 'Help',
  items: [
    helpMenu_aboutScribe,
    helpMenu_reportBug,
    {separator:true},
    helpMenu_keyboardShortcuts,
  ],
} as MenuDescription;
