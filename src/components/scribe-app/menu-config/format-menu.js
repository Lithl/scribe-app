"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatMenu_text_bold = {
    name: 'Bold',
    shortcut: 'Ctrl+B',
    icon: 'editor:format-bold',
    actions: ['bold-text'],
};
exports.formatMenu_text_italic = {
    name: 'Italic',
    shortcut: 'Ctrl+I',
    icon: 'editor:format-italic',
    actions: ['italicize-text'],
};
exports.formatMenu_text_underline = {
    name: 'Underline',
    shortcut: 'Ctrl+U',
    icon: 'editor:format-underlined',
    actions: ['underline-text'],
};
exports.formatMenu_text_strikethrough = {
    name: 'Strikethrough',
    shortcut: 'Alt+Shift+5',
    icon: 'editor:format-strikethrough',
    actions: ['strikethrough-text'],
};
exports.formatMenu_text_color = {
    name: 'Color',
    icon: 'editor:format-color-text',
    actions: ['color-picker'],
};
exports.formatMenu_text_superscript = {
    name: 'Superscript',
    shortcut: 'Ctrl+.',
    actions: ['superscript-text'],
};
exports.formatMenu_text_subscript = {
    name: 'Subscript',
    shortcut: 'Ctrl+,',
    actions: ['subscript-text'],
};
exports.formatMenu_text_spoiler = {
    name: 'Spoiler',
    icon: 'av:explicit',
    actions: ['spoiler-text'],
};
exports.formatMenu_text = {
    name: 'Text...',
    items: [
        exports.formatMenu_text_bold,
        exports.formatMenu_text_italic,
        exports.formatMenu_text_underline,
        exports.formatMenu_text_strikethrough,
        exports.formatMenu_text_color,
        exports.formatMenu_text_superscript,
        exports.formatMenu_text_subscript,
        exports.formatMenu_text_spoiler,
    ],
};
exports.formatMenu_paragraph_normal = {
    name: 'Normal',
    shortcut: 'Ctrl+Alt+0',
    actions: ['normal-paragraph'],
};
exports.formatMenu_paragraph_quote = {
    name: 'Quote',
    icon: 'editor:format-quote',
    actions: ['quote-block'],
};
exports.formatMenu_paragraph_code = {
    name: 'Code',
    icon: 'code',
    actions: ['code-block'],
};
exports.formatMenu_paragraph_heading1 = {
    name: 'Heading 1',
    shortcut: 'Ctrl+Alt+1',
    actions: ['heading-1'],
};
exports.formatMenu_paragraph_heading2 = {
    name: 'Heading 2',
    shortcut: 'Ctrl+Alt+2',
    actions: ['heading-2'],
};
exports.formatMenu_paragraph_heading3 = {
    name: 'Heading 3',
    shortcut: 'Ctrl+Alt+3',
    actions: ['heading-3'],
};
exports.formatMenu_paragraph_heading4 = {
    name: 'Heading 4',
    shortcut: 'Ctrl+Alt+4',
    actions: ['heading-4'],
};
exports.formatMenu_paragraph_heading5 = {
    name: 'Heading 5',
    shortcut: 'Ctrl+Alt+5',
    actions: ['heading-5'],
};
exports.formatMenu_paragraph_heading6 = {
    name: 'Heading 6',
    shortcut: 'Ctrl+Alt+6',
    actions: ['heading-6'],
};
exports.formatMenu_paragraph = {
    name: 'Paragraph...',
    items: [
        exports.formatMenu_paragraph_normal,
        exports.formatMenu_paragraph_quote,
        exports.formatMenu_paragraph_code,
        exports.formatMenu_paragraph_heading1,
        exports.formatMenu_paragraph_heading2,
        exports.formatMenu_paragraph_heading3,
        exports.formatMenu_paragraph_heading4,
        exports.formatMenu_paragraph_heading5,
        exports.formatMenu_paragraph_heading6,
    ],
};
exports.formatMenu_align_left = {
    name: 'Left',
    shortcut: 'Ctrl+Shift+L',
    icon: 'editor:format-align-left',
    actions: ['left-align'],
};
exports.formatMenu_align_center = {
    name: 'Center',
    shortcut: 'Ctrl+Shift+E',
    icon: 'editor:format-align-center',
    actions: ['center-align'],
};
exports.formatMenu_align_right = {
    name: 'Right',
    shortcut: 'Ctrl+Shift+R',
    icon: 'editor:format-align-right',
    actions: ['right-align'],
};
exports.formatMenu_align = {
    name: 'Align...',
    items: [
        exports.formatMenu_align_left,
        exports.formatMenu_align_center,
        exports.formatMenu_align_right,
    ],
};
exports.formatMenu_list_numbered = {
    name: 'Numbered',
    shortcut: 'Ctrl+Shift+7',
    icon: 'editor:format-list-numbered',
    actions: ['number-list'],
};
exports.formatMenu_list_bulleted = {
    name: 'Bulleted',
    shortcut: 'Ctrl+Shift+8',
    icon: 'editor:format-list-bulleted',
    actions: ['bullet-list'],
};
exports.formatMenu_list = {
    name: 'List...',
    items: [
        exports.formatMenu_list_numbered,
        exports.formatMenu_list_bulleted,
    ],
};
exports.formatMenu_clearFormatting = {
    name: 'Clear formatting',
    shortcut: 'Ctrl+\\',
    icon: 'editor:format-clear',
    actions: ['clear-formatting'],
};
exports.formatMenu = {
    name: 'Format',
    items: [
        exports.formatMenu_text,
        exports.formatMenu_paragraph,
        exports.formatMenu_align,
        exports.formatMenu_list,
        exports.formatMenu_clearFormatting,
    ],
};
//# sourceMappingURL=format-menu.js.map