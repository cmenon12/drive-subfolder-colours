/*
  =============================================================================
  Project Page: https://github.com/cmenon12/drive-subfolder-colours
  Copyright:    (c) 2020 by Christopher Menon
  License:      GNU General Public License, version 3 (GPL-3.0)
                http://www.opensource.org/licenses/gpl-3.0.html
  =============================================================================
 */


/**
 * Builds the homepage Card specifically for Drive.
 * If the user has selected a folder they'll be prompted to
 * change the colour. Otherwise they'll be asked to select one.
 *
 * @param {eventObject} e The event object
 * @returns {Card} The homepage Card
 */
function buildDriveHomePage(e, message = undefined) {

  // Start to create the Card
  const header = CardService.newCardHeader()
    .setTitle("Change Subfolder Colours")
    .setImageUrl("https://raw.githubusercontent.com/cmenon12/drive-subfolder-colours/main/assets/logo.png");
  const card = CardService.newCardBuilder()
    .setHeader(header);

  // If they haven't selected anything yet
  // Or they've selected something that isn't a folder
  // Just ask them to select something
  if (Object.keys(e.drive).length === 0 || e.drive.activeCursorItem.mimeType !== "application/vnd.google-apps.folder") {

    const instructions = CardService.newTextParagraph()
      .setText("Please select a folder to update.");
    card.addSection(CardService.newCardSection()
      .addWidget(instructions));

    return card.build();

  }

  // Add the result from last time if it's available
  if (message !== undefined) {
    const resultText = CardService.newTextParagraph().setText(`<b>${message}</b>`);
    const resultSection = CardService.newCardSection().addWidget(resultText);
    card.addSection(resultSection);
  }

  card.addSection(getFormSection(e));
  card.addSection(getConfirmationSection(e));

  return card.build();

}


/**
 * Does an in-place update of the drive homepage.
 *
 * @param {eventObject} e The event object
 * @returns {Card} The homepage Card
 */
function updateDriveHomePage(e) {
  return CardService.newActionResponseBuilder()
    .setNavigation(CardService.newNavigation()
      .updateCard(buildDriveHomePage(e)))
    .build();
}


/**
 * Build and return the section to confirm the user's choice with buttons.
 *
 * @param {eventObject} e The event object
 * @returns {CardSection} A section with the login form.
 */
function getConfirmationSection(e) {

  const currentFolder = e.drive.activeCursorItem;
  const section = CardService.newCardSection();

  // Create the submit button
  const buttons = CardService.newButtonSet();
  buttons.addButton(CardService.newTextButton()
    .setText("UPDATE")
    .setOnClickAction(CardService.newAction()
      .setFunctionName("processDriveSidebarForm"))
    .setTextButtonStyle(CardService.TextButtonStyle.FILLED))

  // Detect if the user specified a new colour
  let iconUrl;
  if (e.formInput === undefined) {
    iconUrl = currentFolder.iconUrl;
  } else {
    iconUrl = getAllFolderColours()[e.formInput.colour].icon;
    if (currentFolder.iconUrl.includes("+shared")) {
      iconUrl = iconUrl.concat("+shared");
    }
  }

  // Tell the user which folder will be updated
  const folder = CardService.newKeyValue()
    .setContent(currentFolder.title)
    .setIconUrl(iconUrl)
    .setTopLabel("This folder and subfolders will be updated.");

  section.addWidget(folder)
    .addWidget(buttons);

  return section;

}


/**
 * Build and return the section with the login form.
 *
 * @param {eventObject} e The event object
 * @returns {CardSection} A section with the login form.
 */
function getFormSection(e) {

  const section = CardService.newCardSection();

  // Detect if the user already filled it out
  const currentColour = getCurrentFolderColourName(e);
  let selectedColour;
  let currentShared;
  let currentMultipleParents;
  if (e.formInput !== undefined) {
    selectedColour = e.formInput.colour;
    currentShared = e.formInput.shared;
    currentMultipleParents = e.formInput.multipleParents;
  }

  // Create the colour dropdown
  const colour = CardService.newSelectionInput()
    .setType(CardService.SelectionInputType.DROPDOWN)
    .setFieldName("colour")
    .setTitle("Colour")
    .setOnChangeAction(CardService.newAction()
      .setFunctionName("updateDriveHomePage"));

  // Add the colours, with the current as default
  const colours = getAllFolderColours()
  for (const property in colours) {

    if (property === currentColour) {

      // Create a selected flag
      let selected = false;
      if (property === selectedColour || selectedColour === undefined) {
        selected = true;
      }

      // Need to combine current and default nicely
      if (property.includes("default")) {
        const propName = property.replace("(default)", "(current, default)");
        colour.addItem(propName, property, selected);
      } else {
        colour.addItem(`${property} (current)`, property, selected);
      }

    } else {
      // Dont bother with a selected flag, not worth it
      if (property === selectedColour) {
        colour.addItem(property, property, true);
      } else {
        colour.addItem(property, property, false);
      }
    }
  }

  // Create the shared dropdown
  const shared = CardService.newSelectionInput()
    .setType(CardService.SelectionInputType.RADIO_BUTTON)
    .setFieldName("shared")
    .setTitle("Include shared folders?")

  // Add the items to shared
  const sharedItems = [["Do not include shared folders", "no"],
  ["Only include shared folders owned by me", "me"],
  ["Include all shared folders", "all"]];
  sharedItems.forEach(item => {
    if (item[1] === currentShared) {
      shared.addItem(item[0], item[1], true);
    } else {
      shared.addItem(item[0], item[1], false);
    }
  });

  // Create the multiple parents radio buttons
  const multipleParents = CardService.newSelectionInput()
    .setType(CardService.SelectionInputType.RADIO_BUTTON)
    .setFieldName("multipleParents")
    .setTitle("Include folders with multiple parents?")

  // Add the items to multiple parents
  const multipleParentsItems = [["Yes", "yes"], ["No", "no"]];
  multipleParentsItems.forEach(item => {
    if (item[1] === currentMultipleParents) {
      multipleParents.addItem(item[0], item[1], true);
    } else {
      multipleParents.addItem(item[0], item[1], false);
    }
  })

  section.addWidget(colour)
    .addWidget(shared)
    .addWidget(multipleParents);

  return section;

}


/**
 * Produces and displays a notification.
 *
 * @param {String} message The message to notify.
 * @returns {ActionResponse} The notification to display.
 */
function buildNotification(message) {
  return CardService.newActionResponseBuilder()
    .setNotification(CardService.newNotification()
      .setText(message))
    .build();
}
