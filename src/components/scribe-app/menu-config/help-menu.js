"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.helpMenu_aboutScribe = {
    name: 'About Scribe',
    icon: 'help',
    actions: ['about-scribe'],
};
exports.helpMenu_reportBug = {
    name: 'Report a bug',
    icon: 'bug-report',
    actions: ['report-bug'],
};
exports.helpMenu_keyboardShortcuts = {
    name: 'Keyboard shortcuts',
    shortcut: 'Ctrl+/',
    icon: 'hardware:keyboard',
    actions: ['request-shortcuts'],
};
exports.helpMenu = {
    name: 'Help',
    items: [
        exports.helpMenu_aboutScribe,
        exports.helpMenu_reportBug,
        { separator: true },
        exports.helpMenu_keyboardShortcuts,
    ],
};
//# sourceMappingURL=help-menu.js.map