// import server from "../src/lib/server";

import Server from "gas-client-fork";
const FILENAME = process.env.FILENAME;
const PORT = process.env.PORT;
const server = new Server({
  // this is necessary for local development but will be ignored in production
  allowedDevelopmentDomains: `https://localhost:${PORT}`,
});

const { serverFunctions } = server;

/**
 * Jsonifies the error object
 *
 * @see https://stackoverflow.com/a/26199752/3153583
 * @see https://stackoverflow.com/a/50738205/3153583
 */
const reconstructErrorObject = (err) => {
  console.log("dev/template.js", err);
  return JSON.parse(JSON.stringify(err, Object.getOwnPropertyNames(err)));
};

const validateMessageOrigin = (eventOrigin) => {
  // child iframe must have one of the following urls
  // https://localhost:PORT or https://127.0.0.1:PORT
  // console.log(`[devserver(${FILENAME})] eventOrigin:`, eventOrigin);
  return (
    eventOrigin === `https://localhost:${PORT}` ||
    eventOrigin === `https://127.0.0.1:${PORT}`
  );
};

let iframeElement = document.createElement("iframe");
iframeElement.setAttribute("src", `https://localhost:${PORT}/${FILENAME}`);
iframeElement.style.position = "fixed";
iframeElement.style.top = 0;
iframeElement.style.left = 0;
iframeElement.style.bottom = 0;
iframeElement.style.right = 0;
iframeElement.style.width = "100%";
iframeElement.style.height = "100%";
iframeElement.style.border = "none";
iframeElement.style.margin = 0;
iframeElement.style.padding = 0;
iframeElement.style.overflow = "hidden";
iframeElement.style.zIndex = 999999;
document.getElementById("root").appendChild(iframeElement);

window.addEventListener(
  "message",
  (event) => {
    // console.log(`[devserver(${FILENAME})] message event received from child iframe`, event);

    const eventOrigin = event.origin;

    // check if the message is sent from legitimate source or not.
    // accept messages only from child iframe that has known url.
    if (!validateMessageOrigin(eventOrigin)) return;

    // get the message payload
    const eventData = event.data;

    // check event data signature
    if (eventData === "GETTEMPLATEDATA") {
      // console.log(`[devserver(${FILENAME})] sending __TEMPLATE_DATA__ to child iframe`);
      iframeElement.contentWindow.postMessage(
        { templateData: document.getElementById("__TEMPLATE_DATA__").value },
        `https://localhost:${PORT}`
      );
    } else if (eventData.type && eventData.type === "REQUEST") {
      // the message sent from the child iframe is an object (see README.md)
      const { type, functionName, id, args } = eventData;

      // filter invalid message
      // if (type !== "REQUEST") return;

      // google.script.run() function needs the server side function name
      // and the function arguments (if any).
      // pass it to gas-client(-fork) which returns a promise
      try {
        // check if the function (that is to be called) exists or not
        // in serverFunctions object.
        // throw error if property not found
        if (serverFunctions.hasOwnProperty(functionName)) {
          serverFunctions[functionName](...args)
            .then((response) => {
              // console.log("dev/template.js", response);
              // we got the response from google.script.run(),
              // send the response to the child iframe
              // console.log(
              //   `[devserver(${FILENAME})] sending SUCCESS response to child iframe (${eventOrigin})`
              // );
              iframeElement.contentWindow.postMessage(
                { type: "RESPONSE", id, status: "SUCCESS", response },
                eventOrigin
              );
            })
            .catch((err) => {
              // in case google.script.run() returns error (withFailureHandler),
              // send the error response to child iframe
              // console.log(
              //   `[devserver(${FILENAME})] sending ERROR response to child iframe (${eventOrigin})`
              // );
              iframeElement.contentWindow.postMessage(
                {
                  type: "RESPONSE",
                  id,
                  status: "ERROR",
                  response: reconstructErrorObject(err),
                },
                eventOrigin
              );
            });
        } else {
          // throw function not found error message
          throw new TypeError(
            `google.script.run.withSuccessHandler(...).withFailureHandler(...).${functionName} is not a function`
          );
        }
      } catch (err) {
        // send error to child iframe
        // console.log(
        //   `[devserver(${FILENAME})] sending ERROR response to child iframe (${eventOrigin})`
        // );
        iframeElement.contentWindow.postMessage(
          {
            type: "RESPONSE",
            id,
            status: "ERROR",
            response: reconstructErrorObject(err),
          },
          eventOrigin
        );
      }
    } else {
      return;
    }
  },
  false
);
