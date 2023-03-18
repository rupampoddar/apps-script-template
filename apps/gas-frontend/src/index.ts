import "./styles/index.css";
import server from "./lib/server";
const { serverFunctions } = server;

const delay = (ms: number) => {
  if (import.meta.env.PUBLIC_APP_ENV === "production") return;
  return new Promise((res) => setTimeout(res, ms));
};

/**
 * This is an example of how to get the data passed from gas-backend to
 * gas-frontend
 */
async function init() {
  // delay during development
  await delay(2000);

  // get data from html hidden input
  const tdElement = document.getElementById(
    "__TEMPLATE_DATA__"
  ) as HTMLInputElement;
  if (tdElement) {
    const tdElValue = tdElement.value;
    if (tdElValue) {
      const td = JSON.parse(tdElValue);
      console.log(td);
      if (td.activeUserEmail) {
        const t = document.getElementById("currentUser");
        if (t) t.innerText = `Logged in as: ${td.activeUserEmail}`;
      }
    }
  }
}

/**
 * This is an example of how to call a gas-backend function from gas-frontend
 */
async function callBackendApi() {
  // call the gas-backend function named "apiHello"
  const res = await serverFunctions.apiHello();
  const t = document.getElementById("apiResTarget");
  if (t) t.innerText = JSON.stringify(res);
}

/**
 * A simple button click counter example
 */
function setupCounter(element: HTMLButtonElement) {
  let counter = 0
  const setCounter = (count: number) => {
    counter = count
    element.innerHTML = `count is ${counter}`
  }
  element.addEventListener('click', () => setCounter(counter + 1))
  setCounter(0)
}

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <h1>GAS + Vite</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p id="currentUser"></p>
    <div class="api-example">
      <button id="apiTriggerButton">Call API</button>
      <p>Response from api</p>
      <p id="apiResTarget"></p>
    </div>
  </div>
`;

//
init();
setupCounter(document.querySelector<HTMLButtonElement>("#counter")!);

const buttonEl = document.getElementById("apiTriggerButton");
if (buttonEl) {
  buttonEl.addEventListener("click", callBackendApi);
}
