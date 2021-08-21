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
function buildDriveHomePage(e) {

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

  card.addSection(getFormSection());
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

  // Tell the user which folder will be updated
  const folder = CardService.newKeyValue()
    .setContent(currentFolder.title)
    .setIconUrl(currentFolder.iconUrl)
    .setTopLabel("This folder and subfolders will be updated.");

  section.addWidget(folder)
    .addWidget(buttons);

  return section;

}


/**
 * Build and return the section with the login form.
 *
 * @returns {CardSection} A section with the login form.
 */
function getFormSection() {

  const section = CardService.newCardSection();

  // Create the colour dropdown
  const colour = CardService.newSelectionInput()
    .setType(CardService.SelectionInputType.DROPDOWN)
    .setFieldName("colour")
    .setTitle("Colour")
    .setOnChangeAction(CardService.newAction()
      .setFunctionName("updateDriveHomePage"));

  // Add the colours
  const colours = getAllFolderColours()
  for (const property in colours) {
    if (property.includes("default")) {
      colour.addItem(property, property, true);
    } else {
      colour.addItem(property, property, false);
    }
  }

  // Create the shared dropdown
  const shared = CardService.newSelectionInput()
    .setType(CardService.SelectionInputType.RADIO_BUTTON)
    .setFieldName("shared")
    .setTitle("Include shared folders?")
    .addItem("Do not include shared folders", "no", false)
    .addItem("Only include shared folders owned by me", "me", false)
    .addItem("Include all shared folders", "all", false);

  // Create the multiple parents radio buttons
  const multipleParents = CardService.newSelectionInput()
    .setType(CardService.SelectionInputType.RADIO_BUTTON)
    .setFieldName("multipleParents")
    .setTitle("Include folders with multiple parents?")
    .addItem("Yes", "yes", false)
    .addItem("No", "no", false);

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
