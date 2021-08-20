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
    "Brown": { "hex": "#ac725e", "icon": "https://raw.githubusercontent.com/cmenon12/drive-subfolder-colours/main/assets/icons/folder25.png" }, //
    "Red, brick": { "hex": "#d06b64", "icon": "https://raw.githubusercontent.com/cmenon12/drive-subfolder-colours/main/assets/icons/folder26.png" },
    "Red, bright": { "hex": "#f83a22", "icon": "https://raw.githubusercontent.com/cmenon12/drive-subfolder-colours/main/assets/icons/folder27.png" },
    "Orange, dark": { "hex": "#fa573c", "icon": "https://raw.githubusercontent.com/cmenon12/drive-subfolder-colours/main/assets/icons/folder28.png" },
    "Orange": { "hex": "#ff7537", "icon": "https://raw.githubusercontent.com/cmenon12/drive-subfolder-colours/main/assets/icons/folder29.png" },
    "Yellow, dark": { "hex": "#ffad46", "icon": "https://raw.githubusercontent.com/cmenon12/drive-subfolder-colours/main/assets/icons/folder30.png" },
    "Green": { "hex": "#42d692", "icon": "https://raw.githubusercontent.com/cmenon12/drive-subfolder-colours/main/assets/icons/folder36.png" },//
    "Green, dark": { "hex": "#16a765", "icon": "https://raw.githubusercontent.com/cmenon12/drive-subfolder-colours/main/assets/icons/folder35.png" },
    "Lime": { "hex": "#7bd148", "icon": "https://raw.githubusercontent.com/cmenon12/drive-subfolder-colours/main/assets/icons/folder34.png" },
    "Lime, pale": { "hex": "#b3dc6c", "icon": "https://raw.githubusercontent.com/cmenon12/drive-subfolder-colours/main/assets/icons/folder33.png" },
    "Yellow, light": { "hex": "#fbe983", "icon": "https://raw.githubusercontent.com/cmenon12/drive-subfolder-colours/main/assets/icons/folder32.png" },
    "Yellow": { "hex": "#fad165", "icon": "https://raw.githubusercontent.com/cmenon12/drive-subfolder-colours/main/assets/icons/folder31.png" },
    "Green, light": { "hex": "#92e1c0", "icon": "https://raw.githubusercontent.com/cmenon12/drive-subfolder-colours/main/assets/icons/folder37.png" }, //
    "Turquoise, light": { "hex": "#9fe1e7", "icon": "https://raw.githubusercontent.com/cmenon12/drive-subfolder-colours/main/assets/icons/folder38.png" },
    "Blue, light": { "hex": "#9fc6e7", "icon": "https://raw.githubusercontent.com/cmenon12/drive-subfolder-colours/main/assets/icons/folder39.png" },
    "Blue": { "hex": "#4986e7", "icon": "https://raw.githubusercontent.com/cmenon12/drive-subfolder-colours/main/assets/icons/folder40.png" },
    "Blue, pale": { "hex": "#9a9cff", "icon": "https://raw.githubusercontent.com/cmenon12/drive-subfolder-colours/main/assets/icons/folder41.png" },
    "Violet, light": { "hex": "#b99aff", "icon": "https://raw.githubusercontent.com/cmenon12/drive-subfolder-colours/main/assets/icons/folder42.png" },
    "Grey, dark (default)": { "hex": "#8f8f8f", "icon": "https://raw.githubusercontent.com/cmenon12/drive-subfolder-colours/main/assets/icons/folder48.png" }, //
    "Grey, pale": { "hex": "#cabdbf", "icon": "https://raw.githubusercontent.com/cmenon12/drive-subfolder-colours/main/assets/icons/folder47.png" },
    "Brown, light": { "hex": "#cca6ac", "icon": "https://raw.githubusercontent.com/cmenon12/drive-subfolder-colours/main/assets/icons/folder46.png" },
    "Pink": { "hex": "#f691b2", "icon": "https://raw.githubusercontent.com/cmenon12/drive-subfolder-colours/main/assets/icons/folder45.png" },
    "Purple": { "hex": "#cd74e6", "icon": "https://raw.githubusercontent.com/cmenon12/drive-subfolder-colours/main/assets/icons/folder44.png" },
    "Violet": { "hex": "#a47ae2", "icon": "https://raw.githubusercontent.com/cmenon12/drive-subfolder-colours/main/assets/icons/folder43.png" }
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
  const colourName = Object.keys(getAllFolderColours()).find(colourName => getAllFolderColours()[colourName].hex === e.formInput.colour);

  Logger.log(`All subfolders of ${folder.title} will be updated to ${colourName}`)

  const result = updateFolderColour(folder, e.formInput.colour, e.formInput.shared, e.formInput.multipleParents, Session.getActiveUser().getEmail(), 0);
  Logger.log(`We updated ${result} folders.`)

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
function updateFolderColour(folder, colour, shared, multipleParents, email, total) {

  // Apply the colour to the current folder
  const id = folder.id;
  const newFolder = Drive.newFile();
  newFolder.folderColorRgb = colour;
  Drive.Files.patch(newFolder, id);

  // Search for the children
  let params;
  if (shared === "no" || shared === "me") {
    params = { "maxResults": 1000, "orderBy": "title", "q": `mimeType = 'application/vnd.google-apps.folder' and '${id}' in parents and '${email}' in owners` };
  } else {
    params = { "maxResults": 1000, "orderBy": "title", "q": `mimeType = 'application/vnd.google-apps.folder' and '${id}' in parents` };
  }
  const children = Drive.Files.list(params);

  // Iterate through the children
  let child;
  for (let i = 0; i < children.items.length; i++) {

    child = children.items[i];

    // If the user doesn't want to update shared folders then skip if shared
    if (shared === "no") {
      if (child.shared === true) {
        Logger.log(`Skipped ${child.title} because it's shared.`);
        continue;
      }

      // If the user only wants to update shared folder they own then skip those that aren't owned by them
    } else if (shared === "me") {
      if (child.owners[0].emailAddress !== email) {
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
    total = updateFolderColour(child, colour, shared, multipleParents, email, total);

  }

  return total + children.items.length

}
