import {MenuDescription} from '../../menu-bar/menu-item';

export const formatMenu_text_bold = {
  name: 'Bold',
  shortcut: 'Ctrl+B',
  icon: 'editor:format-bold',
  actions: ['bold-text'],
} as MenuDescription;

export const formatMenu_text_italic = {
  name: 'Italic',
  shortcut: 'Ctrl+I',
  icon: 'editor:format-italic',
  actions: ['italicize-text'],
} as MenuDescription;

export const formatMenu_text_underline = {
  name: 'Underline',
  shortcut: 'Ctrl+U',
  icon: 'editor:format-underlined',
  actions: ['underline-text'],
} as MenuDescription;

export const formatMenu_text_strikethrough = {
  name: 'Strikethrough',
  shortcut: 'Alt+Shift+5',
  icon: 'editor:format-strikethrough',
  actions: ['strikethrough-text'],
} as MenuDescription;

export const formatMenu_text_color = {
  name: 'Color',
  icon: 'editor:format-color-text',
  actions: ['color-picker'],
} as MenuDescription;

export const formatMenu_text_superscript = {
  name: 'Superscript',
  shortcut: 'Ctrl+.',
  actions: ['superscript-text'],
} as MenuDescription;

export const formatMenu_text_subscript = {
  name: 'Subscript',
  shortcut: 'Ctrl+,',
  actions: ['subscript-text'],
} as MenuDescription;

export const formatMenu_text_spoiler = {
  name: 'Spoiler',
  icon: 'av:explicit',
  actions: ['spoiler-text'],
} as MenuDescription;

export const formatMenu_text = {
  name: 'Text...',
  items: [
    formatMenu_text_bold,
    formatMenu_text_italic,
    formatMenu_text_underline,
    formatMenu_text_strikethrough,
    formatMenu_text_color,
    formatMenu_text_superscript,
    formatMenu_text_subscript,
    formatMenu_text_spoiler,
  ],
} as MenuDescription;

export const formatMenu_paragraph_normal = {
  name: 'Normal',
  shortcut: 'Ctrl+Alt+0',
  actions: ['normal-paragraph'],
} as MenuDescription;

export const formatMenu_paragraph_quote = {
  name: 'Quote',
  icon: 'editor:format-quote',
  actions: ['quote-block'],
} as MenuDescription;

export const formatMenu_paragraph_code = {
  name: 'Code',
  icon: 'code',
  actions: ['code-block'],
} as MenuDescription;

export const formatMenu_paragraph_heading1 = {
  name: 'Heading 1',
  shortcut: 'Ctrl+Alt+1',
  actions: ['heading-1'],
} as MenuDescription;

export const formatMenu_paragraph_heading2 = {
  name: 'Heading 2',
  shortcut: 'Ctrl+Alt+2',
  actions: ['heading-2'],
} as MenuDescription;

export const formatMenu_paragraph_heading3 = {
  name: 'Heading 3',
  shortcut: 'Ctrl+Alt+3',
  actions: ['heading-3'],
} as MenuDescription;

export const formatMenu_paragraph_heading4 = {
  name: 'Heading 4',
  shortcut: 'Ctrl+Alt+4',
  actions: ['heading-4'],
} as MenuDescription;

export const formatMenu_paragraph_heading5 = {
  name: 'Heading 5',
  shortcut: 'Ctrl+Alt+5',
  actions: ['heading-5'],
} as MenuDescription;

export const formatMenu_paragraph_heading6 = {
  name: 'Heading 6',
  shortcut: 'Ctrl+Alt+6',
  actions: ['heading-6'],
} as MenuDescription;

export const formatMenu_paragraph = {
  name: 'Paragraph...',
  items: [
    formatMenu_paragraph_normal,
    formatMenu_paragraph_quote,
    formatMenu_paragraph_code,
    formatMenu_paragraph_heading1,
    formatMenu_paragraph_heading2,
    formatMenu_paragraph_heading3,
    formatMenu_paragraph_heading4,
    formatMenu_paragraph_heading5,
    formatMenu_paragraph_heading6,
  ],
} as MenuDescription;

export const formatMenu_align_left = {
  name: 'Left',
  shortcut: 'Ctrl+Shift+L',
  icon: 'editor:format-align-left',
  actions: ['left-align'],
} as MenuDescription;

export const formatMenu_align_center = {
  name: 'Center',
  shortcut: 'Ctrl+Shift+E',
  icon: 'editor:format-align-center',
  actions: ['center-align'],
} as MenuDescription;

export const formatMenu_align_right = {
  name: 'Right',
  shortcut: 'Ctrl+Shift+R',
  icon: 'editor:format-align-right',
  actions: ['right-align'],
} as MenuDescription;

export const formatMenu_align = {
  name: 'Align...',
  items: [
    formatMenu_align_left,
    formatMenu_align_center,
    formatMenu_align_right,
  ],
} as MenuDescription;

export const formatMenu_list_numbered = {
  name: 'Numbered',
  shortcut: 'Ctrl+Shift+7',
  icon: 'editor:format-list-numbered',
  actions: ['number-list'],
} as MenuDescription;

export const formatMenu_list_bulleted = {
  name: 'Bulleted',
  shortcut: 'Ctrl+Shift+8',
  icon: 'editor:format-list-bulleted',
  actions: ['bullet-list'],
} as MenuDescription;

export const formatMenu_list = {
  name: 'List...',
  items: [
    formatMenu_list_numbered,
    formatMenu_list_bulleted,
  ],
} as MenuDescription;

export const formatMenu_clearFormatting = {
  name: 'Clear formatting',
  shortcut: 'Ctrl+\\',
  icon: 'editor:format-clear',
  actions: ['clear-formatting'],
} as MenuDescription;

export const formatMenu = {
  name: 'Format',
  items: [
    formatMenu_text,
    formatMenu_paragraph,
    formatMenu_align,
    formatMenu_list,
    formatMenu_clearFormatting,
  ],
} as MenuDescription;
