"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileMenu_new_project = {
    name: 'Project',
    icon: 'extension',
    actions: ['new-project'],
};
exports.fileMenu_new_manuscript = {
    name: 'Manuscript',
    icon: 'chrome-reader-mode',
    actions: ['new-manuscript'],
};
exports.fileMenu_new_idea = {
    name: 'Idea',
    icon: 'lightbulb-outline',
    actions: ['new-idea'],
};
exports.fileMenu_new_chapter = {
    name: 'Chapter',
    icon: 'book',
    actions: ['new-chapter'],
};
exports.fileMenu_new_scene = {
    name: 'Scene',
    icon: 'device:wallpaper',
    actions: ['new-scene'],
};
exports.fileMenu_new_character = {
    name: 'Character',
    icon: 'face',
    actions: ['new-character'],
};
exports.fileMenu_new_location = {
    name: 'Location',
    icon: 'maps:satellite',
    actions: ['new-location'],
};
exports.fileMenu_new_note = {
    name: 'Note',
    icon: 'av:note',
    actions: ['new-note'],
};
exports.fileMenu_new_research = {
    name: 'Research',
    icon: 'work',
    actions: ['new-research'],
};
exports.fileMenu_new_template = {
    name: 'Template',
    icon: 'device:widgets',
    actions: ['new-template'],
};
exports.fileMenu_new = {
    name: 'New...',
    items: [
        exports.fileMenu_new_project,
        { separator: true },
        exports.fileMenu_new_manuscript,
        exports.fileMenu_new_idea,
        exports.fileMenu_new_chapter,
        exports.fileMenu_new_scene,
        exports.fileMenu_new_character,
        exports.fileMenu_new_location,
        exports.fileMenu_new_note,
        exports.fileMenu_new_research,
        exports.fileMenu_new_template,
    ],
};
exports.fileMenu_save = {
    name: 'Save',
    shortcut: 'Ctrl+S',
    icon: 'save',
    actions: ['force-save'],
};
exports.fileMenu_exportTo_googleDrive = {
    name: 'Google Drive',
    icon: 'cloud-upload',
    actions: ['drive-export'],
};
exports.fileMenu_exportTo_localDownload = {
    name: 'Local download',
    icon: 'file-download',
    actions: ['download-project'],
};
exports.fileMenu_exportTo_fimfiction = {
    name: 'Fimfiction',
    icon: 'fim:favicon',
    actions: ['fim-export'],
};
exports.fileMenu_exportTo = {
    name: 'Export to...',
    items: [
        exports.fileMenu_exportTo_googleDrive,
        exports.fileMenu_exportTo_localDownload,
        exports.fileMenu_exportTo_fimfiction,
    ],
};
exports.fileMenu_open = {
    name: 'Open',
    shortcut: 'Ctrl+O',
    icon: 'folder',
    actions: ['open-project'],
};
exports.fileMenu_openRecent = {
    name: 'Open recent...',
    items: [],
};
exports.fileMenu = {
    name: 'File',
    items: [
        exports.fileMenu_new,
        { separator: true },
        exports.fileMenu_save,
        exports.fileMenu_exportTo,
        exports.fileMenu_open,
        exports.fileMenu_openRecent,
    ],
};
//# sourceMappingURL=file-menu.js.map