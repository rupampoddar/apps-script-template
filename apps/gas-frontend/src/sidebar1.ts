import server from "./lib/server";
import { init } from "./lib/bootstrap";

import "./styles/index.css";

// This will be used to call the `gas-backend` functions
const { serverFunctions } = server;

//
// Create html element using javascript and inject as a child to
// `<div id="app"></div>` element in `sidebar-1.html`
//
// You can also write the html directly in the `sidebar-1.html` file.
//
document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <h1>Google Apps Script + Vite</h1>
    <p id="currentUser"></p>
    <div class="api-example">
      <button id="fetchDataButton">Fetch data from Apps Script</button>
      <pre id="responseContainer"></pre>
    </div>
  </div>`;

init();

const buttonEl = document.getElementById("fetchDataButton");
if (buttonEl) {
  buttonEl.addEventListener("click", async () => {

    buttonEl.innerText = "loading ..."

    // Call the `gas-backend` function named `getData`
    const res = await serverFunctions.getData();
    const targetEl = document.getElementById("responseContainer");
    if (targetEl) targetEl.innerText = JSON.stringify(res, null, 2);

    buttonEl.innerText = "Fetch data from Apps Script"

  });
}
