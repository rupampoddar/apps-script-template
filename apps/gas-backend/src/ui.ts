/**
 * The event handler is triggered when installing the add-on.
 */
export function ui_onInstall(e: any) {
  ui_onOpen(e);
}

/**
 * Spreadsheet onOpen event handler.
 * Adds the addon menu to ui once the spreadsheet is opened.
 */
export function ui_onOpen(e: any) {
  try {
    const menu = SpreadsheetApp.getUi().createAddonMenu();
    menu.addItem("Open Sidebar", "openSidebar");
    menu.addToUi();
  } catch (e) {
    if (e instanceof Error) {
      SpreadsheetApp.getUi().alert(e.message);
    } else {
      SpreadsheetApp.getUi().alert("Unknown error");
    }
  }
}

/**
 * Opens a sidebar.
 */
export function ui_openSidebar() {
  try {
    // prepare the html output.
    // 'index' refers to apps/gas-frontend/index.html
    let htmlTemplate = HtmlService.createTemplateFromFile("sidebar-1");

    // pass data from gas-backend to gas-frontend
    htmlTemplate.data = {
      activeUserEmail: Session.getActiveUser().getEmail(),
    };
    SpreadsheetApp.getUi().showSidebar(
      htmlTemplate
        .evaluate()
        .setTitle(`My Addon (v` + process.env.PUBLIC_PACKAGE_VERSION + `)`)
    );
  } catch (e) {
    if (e instanceof Error) {
      SpreadsheetApp.getUi().alert(e.message);
    } else {
      SpreadsheetApp.getUi().alert("Unknown error");
    }
  }
}
