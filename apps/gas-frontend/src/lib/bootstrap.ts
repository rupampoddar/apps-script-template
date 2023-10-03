/**
 * Delays execution during development
 */
const delay = (ms: number) => {
  if (import.meta.env.PUBLIC_APP_ENV === "production") return;
  return new Promise((res) => setTimeout(res, ms));
};

/**
 * Init function.
 *
 * The primary task of this function is to collect the data passed to the html
 * template from `gas-backend`.
 */
export async function init() {
  // Sleep for 2 seconds during development
  await delay(2000);

  // Get data from html hidden input field
  const tdElement = document.getElementById(
    "__TEMPLATE_DATA__"
  ) as HTMLInputElement;
  if (tdElement) {
    const tdElValue = tdElement.value;
    if (tdElValue) {
      try {
        // Convert text to object
        const data = JSON.parse(tdElValue);
        console.log("[bootstrap/init]", data);

        // Now that you have the data, use it as you wish
        if (data.activeUserEmail) {
          // const t = document.getElementById("currentUser");
          // if (t) t.innerText = `Logged in as: ${data.activeUserEmail}`;
        }
      } catch (e) {
        console.error("[bootstrap/init]", e);
      }
    }
  }
}
