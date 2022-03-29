# vintage_cube_sorter
A website that connects to a database to allow people to sort cards in vintage cube. Accessible at https://ancient-fjord-10244.herokuapp.com/ Input a username, if it isn't 
in use, you can start a new user with that username. If it is in use, you can continue the sort with that username, so please do not continue unless the username is yours.
Two cards will appear at a time. Pick the button for whichever card you would rather pick first in a vintage cube draft (first card of the first pack).
Picking the cards will sort them in your personal ranking and affect global rankings for each card. There is a skip button if you have no preference, and it will randomly
sort the two cards and not affect global rankings. After all of the cards have been sorted, you can download spreadsheets for your own rankings and for global rankings.
Your personal rankings are decided by a merge sort algorithm, where each comparison is you picking a card. The global rankings are decided with an ELO system where every
pick from every user counts towards the rankings, unless they hit skip.
