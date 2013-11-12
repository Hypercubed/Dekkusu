Dekkusu - デックス
===========================

Hierarchical study decks (flash cards)

# Goals

1. Simple plain text card syntax.
2. Spaced repetition based on deck hierarchy.
3. No backend.

# Card syntax

Unlike other flash card systems, here there is front and back or question and answer side, per se.  Instead cards are said to in a clozed state or open state.  The clozed state can be considered the front (or question) side of the card.  While the open state can be considered the back (or answer).  The syntax of the card determines what is shown or not show in each state.  The syntax for the card is markdown (easy-to-read, easy-to-write plain text format) with some additional formatting syntax:

## Clozed text

Text enclosed in mustache brackets is hidden or shown depending on the card state.  `{A}` is hidden in the clozed state (front or question side) but becomes `A` in the open state (back or answer side).  Double colon can be used to add open (front side) text.  `{A::Q}` is shown as `Q` in the closed state and `A` in the open state.  Both sides of the `::` are optional.  In other-words `{::Q}` is only shown on the "front" (clozed state).

Text enclosed in double curly brackets is shown clozed in square brackets depending on the card state.  `{{A}}` becomes `[...]` in the clozed state and `[A]` in the open state.  An alternate clozed text can be added after double colons `::`.  `{{A::Q}}` becomes `[A]` in the open state and `[Q]` in the clozed state.

### Examples

Source                                            | Clozed Display                       | Open Display                             
--------------------------------------------------|--------------------------------------|------------------------------------------
The capital of California {Sacramento}            | The capital of California            | The capital of California Sacramento               
The capital of California is {{Sacramento}}       | The capital of California is [...]   | The capital of California is [Sacramento]
The capital of California is {{Sacramento::city}} | The capital of California is [city]  | The capital of California is [Sacramento]

## Ruby text/Furigana

A word (string of text preceded by white space or the beginning of the line) followed by square brackets is interpreted as ruby characters.  So `word[text]` becomes XXX.  Ruby text (like other text) can be switched using curly bracket notation above.

# License

Copyright (c) 2013 Jayson Harshbarger [![Gittip donate button](http://badgr.co/gittip/hypercubed.png)](https://www.gittip.com/hypercubed/ "Donate weekly to this project using Gittip")
[![Paypal donate button](http://badgr.co/paypal/donate.png?bg=%23feb13d)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=X7KYR6T9U2NHC "One time donation to this project using Paypal")

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
