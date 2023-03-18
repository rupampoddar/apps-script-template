import { api_hello } from "./api";
import { ui_onInstall, ui_onOpen, ui_openSidebar } from "./ui";

// Built-in event listeners
const onInstall = (e: any) => ui_onInstall(e);
const onOpen = (e: any) => ui_onOpen(e);

// Sidebar
const openSidebar = () => ui_openSidebar();

// API handler functions
// These functions are callable from frontend and should return JSON response
const apiHello = () => api_hello();