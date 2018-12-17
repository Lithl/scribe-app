Scribe is a webapp designed to assist in the writing process, modeled after the
[Scrivener](https://www.literatureandlatte.com/scrivener) tool available on
Windows, Mac OS, and iOS. As a webapp, Scrivener is usable on other platforms,
such as Chrome OS.

Scribe is currently deployed at https://scribe.lithl.info

## Features
The primary element of a Scribe Project is the Manuscript. A Manuscript contains
Chapters, which themselves contain Scenes. A Scene can be as short or as long as
you like, and while working on your project you can move Scenes around relative
to one another, even moving a Scene into a different Chapter entirely. Likewise,
Chapters can be moved around relative to one another.

A Project can contain multiple Manuscripts, and Chapters can be moved between
them (and Scenes can be moved to Chapters in another Manuscript, if you like).
This might be useful if you have a series of connected stories you want to
write, as keeping all of the work in one place can help you organize your ideas.

In addition to Manuscripts and their components, a Project can have:

- Ideas: Jot down ideas for things you want to do in your Manuscripts. You can
store everything in a single Idea object, or create multiple and name them
something useful to distinguish them from one another.
- Characters: Design the Characters involved in your story, so you never forget
what you've said about someone! There is no mandatory structure to a Character,
simply structure your thoughts in a fashion you find useful.
- Locations: Like Characters, remembering your Locations is important! What
features does some palce have, who lives there, etc. A Location might be as
small as a room or as big as a country, or even a world!
- Notes: Make Notes about what you're planning to do with your story and its
elements.
- Research: Write down the Research you've done on different parts of your
story, so you don't have to look it up again. What does an Air Force funeral
look like? You don't want to write it twice!
- Templates: Create Templates of default text to use when creating elements in
other categories. Is there a particular structure you want to use for writing
your Character details? Create that structure here, and re-use it whenever you
create a new Character.

### Saving your Project
Your Scribe project will be automatically saved in the cloud periodically. You
can either be an anonymous user, in which case your Project will be associated
with your IP address so that you can come back later and resume your work, or
you can log in using your Google account, in which case your Project will be
associated with your Google account so that you can work from multiple devices
on multiple networks if you need to.

In addition to the cloud saves, you can export your Project data to your Google
Drive (if you are logged in with your Google account), or download your data as
a file. In both cases, you can export the entire set of Project data, or just
export the Manuscript(s).

## Deploying Scribe
If you want to use the code in this repository to deploy an instance of Scribe
yourself, you'll need to do several things:

1. Install NPM dependencies with `npm install`
2. Compile the typescript files into javscript with something like `npx tsc`
3. Bundle the files with something like `npx webpack`
4. Run the server with something like `node index` (note: this will attempt to
run on port 3002; if that port is in use, it will not work)

Steps 2 and 3 can be combined with the build script included in the package
file. You can invoke it with a command like `npm run build --silent`.

_TODO: Add instructions for setting up database once database communication is
implemented in the repository._
