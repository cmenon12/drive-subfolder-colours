/*
  =============================================================================
  Project Page: https://github.com/cmenon12/drive-subfolder-colours
  Copyright:    (c) 2020 by Christopher Menon
  License:      GNU General Public License, version 3 (GPL-3.0)
                http://www.opensource.org/licenses/gpl-3.0.html
  =============================================================================
 */


/**
 * Fetches the allowed folder colours.
 * 
 * @returns {Object} the colours in name:hex pairs
 */
function fetchAllFolderColours() {

  const colours = {
    "Brown": "#ac725e", //
    "Red, brick": "#d06b64",
    "Red, bright": "#f83a22",
    "Orange, dark": "#fa573c",
    "Orange": "#ff7537",
    "Yellow, dark": "#ffad46",
    "Green": "#42d692",//
    "Green, dark": "#16a765",
    "Lime": "#7bd148",
    "Lime, pale": "#b3dc6c",
    "Yellow, light": "#fbe983",
    "Yellow": "#fad165",
    "Green, light": "#92e1c0", //
    "Turquoise, light": "#9fe1e7",
    "Blue, light": "#9fc6e7",
    "Blue": "#4986e7",
    "Blue, pale": "#9a9cff",
    "Violet, light": "#b99aff",
    "Grey, dark (default)": "#8f8f8f", //
    "Grey, pale": "#cabdbf",
    "Brown, light": "#cca6ac",
    "Pink": "#f691b2",
    "Purple": "#cd74e6",
    "Violet": "#a47ae2"
  };

  return colours

}


/**
 * Processes the form submission from the Drive sidebar.
 *
 * @param {eventObject} e The event object
 * @returns {Card} The homepage card
 */
function processDriveSidebarForm(e) {

  const currentFolder = e.drive.activeCursorItem;

  return buildDriveHomePage(e);

}
