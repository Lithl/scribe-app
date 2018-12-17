"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertMenu_image = {
    name: 'Image',
    icon: 'editor:insert-photo',
    actions: ['insert-image'],
};
exports.insertMenu_emoticon = {
    name: 'Emoticon',
    icon: 'editor:insert-emoticon',
    actions: ['insert-emoticon'],
};
exports.insertMenu_horizontalLine = {
    name: 'Horizontal line',
    icon: 'remove',
    actions: ['insert-rule'],
};
exports.insertMenu_footnote = {
    name: 'Footnote',
    shortcut: 'Ctrl+Alt+F',
    icon: 'description',
    actions: ['insert-footnote'],
};
exports.insertMenu_specialCharacters = {
    name: 'Special characters',
    icon: 'editor:functions',
    actions: ['special-characters'],
};
exports.insertMenu_link = {
    name: 'Link',
    shortcut: 'Ctrl+K',
    icon: 'editor:insert-link',
    actions: ['insert-link'],
};
exports.insertMenu_comment = {
    name: 'Comment',
    shortcut: 'Ctrl+Alt+M',
    icon: 'editor:insert-comment',
    actions: ['insert-comment'],
};
exports.insertMenu_authorsNote = {
    name: 'Author\'s note',
    icon: 'font-download',
    actions: ['authors-note'],
};
exports.insertMenu = {
    name: 'Insert',
    items: [
        exports.insertMenu_image,
        exports.insertMenu_emoticon,
        exports.insertMenu_horizontalLine,
        exports.insertMenu_footnote,
        { separator: true },
        exports.insertMenu_specialCharacters,
        exports.insertMenu_link,
        exports.insertMenu_comment,
        { separator: true },
        exports.insertMenu_authorsNote,
    ],
};
//# sourceMappingURL=insert-menu.js.map