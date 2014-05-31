# Todo list for [Dekkusu](https://github.com/Hypercubed/Dekkusu)

Key -
  [ ] - Due
  [x] - Done
  [-] - Skipped
  [*] - Inprogress

_\( managed using [todo-md](https://github.com/Hypercubed/todo-md) \)_

# Limitations (for now)
- One user - one deck

# Current
- [ ] Drag and drop
  - [ ] Drop on root
  - [ ] Make directive (dekksu-drop-card, dekkusu-drag-card)?
  - [x] Drag and drop (move)
  - [x] Drag and drop (copy)
  - [ ] Drag and drop (duplicate)
- [x] Left Sidebar
  - [ ] Nest
- [ ] Finish export
  - [ ] Controller
  - [ ] getText function
  - [ ] load decendents
- [ ] Finish tree
  - [ ] Three views: grid, list, tree
- [x] Remove sets (use users)
- [x] Use only gravatars (md5 on email on login)



- [x] Deck view right sidebar
- [ ] Improved Markdown editor
- [ ] Fix card view/scroll
- [ ] Nested view in list mode?
- [ ] Fix/improve fit-text
- [x] Double click on card
- [ ] Textarea lose focus?
- [ ] Key bindings
- [ ] Study mode!!!!

# Next
- [x] Firebase v2
- [x] Data services
- [x] Reorganize controllers/view files
- [ ] Copy & move decks!!
- [ ] Fix progressing algo (Again!)
- [x] app constants ('FBURL')
- [ ] Fix editing
- [ ] Tab while editing saves?
- [ ] Re-implement double click to edit
- [x] Firebase util?
- [-] Security (Authorized list)
- [x] Redirect on logout
- [ ] Better services

# Soon
- [ ] Sidebar showing login info and root list
- [ ] Drag and drop
- [x] De-normalize data?
- [ ] user object
- [ ] $user.admin
- [ ] private (read-only) decks?
- [ ] localStorage backup for guests?
- [ ] Guest account reset
- [ ] Cards -> angularFirebaseCollection
- [ ] Optimize stats ($scope.stats = getDeckStats();)
- [ ] Cache stats?
- [ ] Fix new card UI
- [ ] Card study/edit directive
- [ ] Multiple guests

# Longer term
- [ ] User profile
- [ ] Import/export decks
- [ ] better navbar controller
- [ ] Optimize view-controller
- [ ] Parent/child relationships

# General
- Use more services, filters, and directives
- Use app constants

# Other
- [ ] Better study -> editor -> study UI
- [ ] Native file format i.e. Markdown with tags? (@due 1-1-2020) (@tags japanese phrase) (@interval 0)?
- [ ] Separate deck from progress journal?
- [-] Separate cards from deck?
- [ ] Multiple selections?
- [ ] After creating a new sub card, mark due, return to original
- [ ] Add new sub-card without moving from original?
- [ ] Google translate helper?
- [ ] Algorithm should consider hierarchy
- [ ] Timer?
- [ ] Move forward/back buttons?
- [ ] Swipe forward/back?
- [ ] Syntax help
- [ ] Statistics popup?
- [ ] Full markdown editor?
- [ ] Undo
- [ ] Use moment.js?
- [ ] Copy markup when creating a new card
- [ ] Tests for markdown, ruby text
- [ ] Fix/improve filters: New, due, done, all
- [ ] Finish examples in readme.
- [ ] Rethink filters
- [ ] Down vote should move card to 'due'
- [ ] Improve/Optimize clozed markdown plugin
- [ ] Move reset/clear buttons to deck controller
