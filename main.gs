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
  const folder = Drive.Files.get(item.id);
  const colourName = Object.keys(getAllFolderColours()).find(colourName => getAllFolderColours()[colourName] === e.formInput.colour);

  Logger.log(`All subfolders of ${folder.title} will be updated to ${colourName}`)

  const result = updateFolderColour(folder, e.formInput.colour, e.formInput.shared, e.formInput.multipleParents, 0);
  Logger.log(`We updated ${total} folders.`)

  return buildDriveHomePage(e);

}


/**
 * Update the colour of the folder, and all child folders.
 * 
 * @param {Object} folder the folder item to update
 * @param {String} colour the hex colour to set
 * @param {String} shared 'no', 'me', or 'all'
 * @param {String} multipleParents 'yes' or 'no'
 */
function updateFolderColour(folder, colour, shared, multipleParents, total) {

  // Apply the colour to the current folder
  const id = folder.id;
  const newFolder = Drive.newFile();
  newFolder.folderColorRgb = colour;
  Drive.Files.patch(newFolder, id);

  // Search for the children
  let params;
  if (shared === "no" || shared === "me") {
    params = {"maxResults": 1000, "orderBy": "title", "q": `mimeType = 'application/vnd.google-apps.folder' and '${id}' in parents and '${Session.getActiveUser().getEmail()}' in owners`};
  } else {
    params = {"maxResults": 1000, "orderBy": "title", "q": `mimeType = 'application/vnd.google-apps.folder' and ${id} in parents`};
  }
  const children = Drive.Files.list(params);

  // Iterate through the children
  let child;
  for (let i = 0; i<children.items.length; i++) {

    child = children.items[i];

    // If the user doesn't want to update shared folders then skip if shared
    if (shared === "no") {
      if (child.shared === true) {
        Logger.log(`Skipped ${child.title} because it's shared.`);
        continue;
      }

      // If the user only wants to update shared folder they own then skip those that aren't owned by them
    } else if (shared === "me") {
      if (child.owners[0].emailAddress !== Session.getActiveUser().getEmail()) {
        Logger.log(`Skipped ${child.title} because it's owned by someone else.`);
        continue;
      }
    }

    // If the user doesn't want to update folders with multiple parents then skip them
    if (multipleParents === "no") {
      if (child.parents.length > 1) {
        Logger.log(`Skipped ${child.title} because it has multiple parents.`);
        continue;
      }
    }

    // Run the function recursively
    total = updateFolderColour(child, colour, shared, multipleParents, total);

  }

  Logger.log(`New total is ${total}`)
  return total + children.items.length

}
