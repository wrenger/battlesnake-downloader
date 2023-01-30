# Battlesnake Downloader

Firefox extension for fetching turns of [battlesnake](https://play.battlesnake.com) games to simplify testing and developing snakes with real game data.

This extension shows a button in the URL bar of an opened game, allowing you to copy specific turns.
The copied data closely relates to the requests the snakes got during the actual game.

## Installation

### Firefox AddOn Store

* [https://addons.mozilla.org/en-US/firefox/addon/battlesnake-downloader/](https://addons.mozilla.org/en-US/firefox/addon/battlesnake-downloader/)

### Download Latest Release

* [release](https://github.com/wrenger/battlesnake-downloader/releases/latest)

Install it by selecting `about:addons` > `Install Add-On From File...`.

### Testing

Clone the repository and open `about:debugging` > `This Firefox` > `Load Temporary Add-on`.
Navigate to the repository directory and select the `manifest.json`.
