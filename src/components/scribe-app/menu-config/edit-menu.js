"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.editMenu_undo = {
    name: 'Undo',
    shortcut: 'Ctrl+Z',
    icon: 'undo',
    actions: ['undo-action'],
};
exports.editMenu_redo = {
    name: 'Redo',
    shortcut: 'Ctrl+Shift+Z',
    icon: 'redo',
    actions: ['redo-action'],
};
exports.editMenu_cut = {
    name: 'Cut',
    shortcut: 'Ctrl+X',
    icon: 'content-cut',
    actions: ['cut-text'],
};
exports.editMenu_copy = {
    name: 'Copy',
    shortcut: 'Ctrl+C',
    icon: 'content-copy',
    actions: ['copy-text'],
};
exports.editMenu_paste = {
    name: 'Paste',
    shortcut: 'Ctrl+V',
    icon: 'content-paste',
    actions: ['paste-text'],
};
exports.editMenu_delete = {
    name: 'Delete',
    shortcut: 'Delete',
    icon: 'delete',
    actions: ['delete-text'],
};
exports.editMenu_selectAll = {
    name: 'Select all',
    shortcut: 'Ctrl+A',
    icon: 'select-all',
    actions: ['select-text'],
};
exports.editMenu_findReplace = {
    name: 'Find and replace',
    shortcut: 'Ctrl+F',
    icon: 'find-replace',
    actions: ['find-replace'],
};
exports.editMenu = {
    name: 'Edit',
    items: [
        exports.editMenu_undo,
        exports.editMenu_redo,
        { separator: true },
        exports.editMenu_cut,
        exports.editMenu_copy,
        exports.editMenu_paste,
        exports.editMenu_delete,
        exports.editMenu_selectAll,
        { separator: true },
        exports.editMenu_findReplace,
    ],
};
//# sourceMappingURL=edit-menu.js.map