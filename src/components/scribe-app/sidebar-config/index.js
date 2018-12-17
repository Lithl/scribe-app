"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../../../util");
exports.emptyProject = [
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
];
function generateProject() {
    return util_1.deepCopy(exports.emptyProject);
}
exports.generateProject = generateProject;
//# sourceMappingURL=index.js.map