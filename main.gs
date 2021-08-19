/*
  =============================================================================
  Project Page: https://github.com/cmenon12/drive-subfolder-colours
  Copyright:    (c) 2020 by Christopher Menon
  License:      GNU General Public License, version 3 (GPL-3.0)
                http://www.opensource.org/licenses/gpl-3.0.html
  =============================================================================
 */


/**
 * Returns the allowed folder colours.
 * 
 * @returns {Object} the colours in name:hex pairs
 */
function getAllFolderColours() {

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

  const item = e.drive.activeCursorItem;

  Logger.log(JSON.stringify(e))
  Logger.log(JSON.stringify(item))

  const folder = DriveApp.getFolderById(item.id);

  Logger.log(JSON.stringify(folder.getSharingAccess()))
  Logger.log(JSON.stringify(folder.getEditors()))
  Logger.log(JSON.stringify(folder.getViewers()))
  Logger.log(JSON.stringify(folder.getOwner()))
  Logger.log(JSON.stringify(Session.getActiveUser().getEmail()))



  return buildDriveHomePage(e);

}


/**
 * Update the colour of the folder, and all child folders.
 * 
 * @param {DriveApp.Folder} folder the folder to update
 * @param {String} colour the hex colour to set
 * @param {String} shared 'no', 'me', or 'all'
 * @param {String} multipleParents 'yes' or 'no'
 */
function updateFolderColour(folder, colour, shared, multipleParents) {

  // Apply the colour to the current folder
  const id = folder.getId();
  const newFolder = Drive.newFile()
  newFolder.folderColorRgb = colour
  Drive.Files.patch(newFolder, id)

  let child;
  const children = DriveApp.getFolders();
  while (children.hasNext()) {
    child = children.next();

    if (shared === "no") {
      if (child.getSharingAccess() !== DriveApp.Access.PRIVATE || child.getEditors().length > 0 || child.getViewers().length > 0) {
        continue;
      }
    } else if (shared === "me") {
      if (child.getOwner().getEmail() !== Session.getActiveUser().getEmail()) {
        continue;
      }
    }

    if (multipleParents === "no") {
      // check that it only has one parent
    }

    Logger.log(folder.getName());
  }

}
