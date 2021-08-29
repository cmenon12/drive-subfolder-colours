/*
  =============================================================================
  Project Page: https://github.com/cmenon12/drive-subfolder-colours
  Copyright:    (c) 2020 by Christopher Menon
  License:      GNU General Public License, version 3 (GPL-3.0)
                http://www.opensource.org/licenses/gpl-3.0.html
  =============================================================================
 */


// Declare global variables for execution time limit (40s)
var MAX_EXECUTION_TIME = 40000
var NOW;
var isTimeLeft = () => {
  return MAX_EXECUTION_TIME > Date.now() - NOW;
};


/**
 * Returns the allowed folder colours.
 *
 * @returns {Object} the colours in name:hex pairs
 */
function getAllFolderColours() {

  const colours = {
    "Brown": {
      "hex": "#ac725e",
      "icon": "https://drive-thirdparty.googleusercontent.com/32/type/application/vnd.google-apps.folder+25"
    }, //
    "Red, brick": {
      "hex": "#d06b64",
      "icon": "https://drive-thirdparty.googleusercontent.com/32/type/application/vnd.google-apps.folder+26"
    },
    "Red, bright": {
      "hex": "#f83a22",
      "icon": "https://drive-thirdparty.googleusercontent.com/32/type/application/vnd.google-apps.folder+27"
    },
    "Orange, dark": {
      "hex": "#fa573c",
      "icon": "https://drive-thirdparty.googleusercontent.com/32/type/application/vnd.google-apps.folder+28"
    },
    "Orange": {
      "hex": "#ff7537",
      "icon": "https://drive-thirdparty.googleusercontent.com/32/type/application/vnd.google-apps.folder+29"
    },
    "Yellow, dark": {
      "hex": "#ffad46",
      "icon": "https://drive-thirdparty.googleusercontent.com/32/type/application/vnd.google-apps.folder+30"
    },
    "Green": {
      "hex": "#42d692",
      "icon": "https://drive-thirdparty.googleusercontent.com/32/type/application/vnd.google-apps.folder+36"
    },//
    "Green, dark": {
      "hex": "#16a765",
      "icon": "https://drive-thirdparty.googleusercontent.com/32/type/application/vnd.google-apps.folder+35"
    },
    "Lime": {
      "hex": "#7bd148",
      "icon": "https://drive-thirdparty.googleusercontent.com/32/type/application/vnd.google-apps.folder+34"
    },
    "Lime, pale": {
      "hex": "#b3dc6c",
      "icon": "https://drive-thirdparty.googleusercontent.com/32/type/application/vnd.google-apps.folder+33"
    },
    "Yellow, light": {
      "hex": "#fbe983",
      "icon": "https://drive-thirdparty.googleusercontent.com/32/type/application/vnd.google-apps.folder+32"
    },
    "Yellow": {
      "hex": "#fad165",
      "icon": "https://drive-thirdparty.googleusercontent.com/32/type/application/vnd.google-apps.folder+31"
    },
    "Green, light": {
      "hex": "#92e1c0",
      "icon": "https://drive-thirdparty.googleusercontent.com/32/type/application/vnd.google-apps.folder+37"
    }, //
    "Turquoise, light": {
      "hex": "#9fe1e7",
      "icon": "https://drive-thirdparty.googleusercontent.com/32/type/application/vnd.google-apps.folder+38"
    },
    "Blue, light": {
      "hex": "#9fc6e7",
      "icon": "https://drive-thirdparty.googleusercontent.com/32/type/application/vnd.google-apps.folder+39"
    },
    "Blue": {
      "hex": "#4986e7",
      "icon": "https://drive-thirdparty.googleusercontent.com/32/type/application/vnd.google-apps.folder+40"
    },
    "Blue, pale": {
      "hex": "#9a9cff",
      "icon": "https://drive-thirdparty.googleusercontent.com/32/type/application/vnd.google-apps.folder+41"
    },
    "Violet, light": {
      "hex": "#b99aff",
      "icon": "https://drive-thirdparty.googleusercontent.com/32/type/application/vnd.google-apps.folder+42"
    },
    "Grey, dark (default)": {
      "hex": "#8f8f8f",
      "icon": "https://drive-thirdparty.googleusercontent.com/32/type/application/vnd.google-apps.folder"
    }, //
    "Grey, pale": {
      "hex": "#cabdbf",
      "icon": "https://drive-thirdparty.googleusercontent.com/32/type/application/vnd.google-apps.folder+47"
    },
    "Brown, light": {
      "hex": "#cca6ac",
      "icon": "https://drive-thirdparty.googleusercontent.com/32/type/application/vnd.google-apps.folder+46"
    },
    "Pink": {
      "hex": "#f691b2",
      "icon": "https://drive-thirdparty.googleusercontent.com/32/type/application/vnd.google-apps.folder+45"
    },
    "Purple": {
      "hex": "#cd74e6",
      "icon": "https://drive-thirdparty.googleusercontent.com/32/type/application/vnd.google-apps.folder+44"
    },
    "Violet": {
      "hex": "#a47ae2",
      "icon": "https://drive-thirdparty.googleusercontent.com/32/type/application/vnd.google-apps.folder+43"
    }
  };

  return colours

}


/**
 * Get the colour of the folder in the event object
 *
 * @param {eventObject} e The event object
 * @returns {Object} the colour name
 */
function getCurrentFolderColourName(e) {

  const item = e.drive.activeCursorItem;
  const folder = Drive.Files.get(item.id);
  const iconLinkLarge = folder.iconLink.replace("/16/", "/32/").replace("+shared", "");
  const colourName = Object.keys(getAllFolderColours()).find(colourName => getAllFolderColours()[colourName].icon === iconLinkLarge);
  return colourName;


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
  const colourName = e.formInput.colour;

  Logger.log(`All subfolders of ${folder.title} will be updated to ${colourName}`);

  // Start the execution timer
  NOW = Date.now();

  const result = updateFolderColour(folder, getAllFolderColours()[colourName].hex, e.formInput.shared, e.formInput.multipleParents, Session.getActiveUser().getEmail(), 1);
  Logger.log(`We updated ${result} folders.`);

  let message;
  if (!isTimeLeft()) {
    message = `The execution timed out so only ${result} folders were updated.`;
  } else {
    if (result === 1) {
      message = `Success! That folder was updated.`;
    } else {
      message = `Success! All ${result} folders were updated.`;
    }
  }

  return buildDriveHomePage(e, message);

}


/**
 * Update the colour of the folder, and all child folders.
 *
 * @param {Object} folder the folder item to update
 * @param {String} colour the hex colour to set
 * @param {String} shared 'no', 'me', or 'all'
 * @param {String} multipleParents null or 'yes'
 * @param {String} email the email address of the current user
 * @param {Number} total the running total of updated folders
 * @returns {Number} the updated total
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
    params = {
      "maxResults": 1000,
      "orderBy": "title",
      "q": `mimeType = 'application/vnd.google-apps.folder' and '${id}' in parents and '${email}' in owners`
    };
  } else {
    params = {
      "maxResults": 1000,
      "orderBy": "title",
      "q": `mimeType = 'application/vnd.google-apps.folder' and '${id}' in parents`
    };
  }
  const children = Drive.Files.list(params);

  // Iterate through the children
  let child;
  for (let i = 0; i < children.items.length; i++) {

    if (!isTimeLeft()) {
      Logger.log("forced to break")
      return total + i;
    }

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
    if (multipleParents !== "yes") {
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
