import { ui_onInstall, ui_onOpen, ui_openSidebar } from "./ui";
import * as api from "./api";

// Built-in event listeners
const onInstall = (e: any) => ui_onInstall(e);
const onOpen = (e: any) => ui_onOpen(e);

// Sidebar
const openSidebar = () => ui_openSidebar();

// These functions are callable from `gas-frontend`
const getData = () => api.getData();