import { createApp } from "vue";
import "./styles/index.css";
import App from "./App.vue";

// import server from "./lib/server";
// const { serverFunctions } = server;
import { init } from "./lib/bootstrap";

createApp(App).mount("#app");

init();
