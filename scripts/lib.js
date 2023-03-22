import CONSTANTS from "./constants.js";

export function getSetting(key) {
  return game.settings.get(CONSTANTS.MODULE_NAME, key);
}

export function setSetting(key, value) {
  if (value === undefined) throw new Error("setSetting | value must not be undefined!");
  return game.settings.set(CONSTANTS.MODULE_NAME, key, value);
}
