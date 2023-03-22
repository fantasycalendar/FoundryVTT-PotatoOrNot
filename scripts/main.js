import CONSTANTS from "./constants.js";
import * as lib from "./lib.js";

Hooks.on("ready", () => {

  window.PotatoOrNot = new PotatoOrNotHandler();

  console.log("Potato Or Not | Ready")

  Hooks.call("PotatoOrNotReady");

  setTimeout(() => {
    window.PotatoOrNot.postSetup();
  }, 250);

});

class PotatoOrNotHandler {

  constructor() {

    for(const [key, value] of Object.entries(foundry.utils.deepClone(CONSTANTS.SETTINGS))){
      game.settings.register(CONSTANTS.MODULE_NAME, key, value);
    }

    game.settings.registerMenu("potato-or-not", "potato-or-not", {
      name: "Set Up Potato Settings",
      label: "Show Dialog",
      icon: "fas fa-carrot",
      type: PotatoOrNotApplication,
      restricted: false
    });

    this._settings = foundry.utils.deepClone(CONSTANTS.BASE_SETTINGS);

    this._quality = lib.getSetting(CONSTANTS.SETTING_KEYS.POTATO_LEVEL);

  }

  get current_settings() {
    return this.settings[this.quality];
  }

  set settings(settings) {
    throw new Error("You cannot set settings directly, please use PotatoOrNot.addSetting and PotatoOrNot.removeSetting");
  }

  get settings() {
    return this._settings;
  }

  _validate_quality_level(quality_level) {
    if (this.settings[quality_level] === undefined) throw new Error("quality_level must be 0, 1, or 2 - low, medium, and high settings");
  }

  _validate_module(quality_level, module) {
    this._validate_quality_level(quality_level);
    if (this.settings[quality_level][module] === undefined) throw `Module setting "${module}" not found in quality level of "${quality_level}"`;
  }

  _validate_setting(quality_level, module, setting) {
    this._validate_module(quality_level, module);
    if (this.settings[quality_level][module][setting] === undefined) throw `Setting "${setting}" in module "${module}" not found`;
  }

  get numberOfSettings() {
    let numberOfSettings = [];
    for (let i = 0; i < this.settings.length; i++) {
      numberOfSettings[i] = 0;
      for (let settings of Object.values(this.settings[i])) {
        numberOfSettings[i] += Object.keys(settings).length;
      }
    }
    return numberOfSettings;
  }

  postSetup() {

    let currentNumberOfSettings = this.numberOfSettings[this.quality];

    const hasBeenPrompted = lib.getSetting(CONSTANTS.SETTING_KEYS.HAS_BEEN_PROMPTED);
    const promptUsers = lib.getSetting(CONSTANTS.SETTING_KEYS.PROMPT_USERS);
    const numberOfSettings = lib.getSetting(CONSTANTS.SETTING_KEYS.NUMBER_OF_SETTINGS);

    if (!hasBeenPrompted && promptUsers) {
      this.showDialog();
    } else if (currentNumberOfSettings !== numberOfSettings) {
      this.updateSettings();
    }
  }

  async updateSettings() {

    let modules = Object.keys(this.current_settings);

    let currentNumberOfSettings = this.numberOfSettings[this.quality];

    await lib.setSetting(CONSTANTS.SETTING_KEYS.NUMBER_OF_SETTINGS, currentNumberOfSettings);
    await lib.setSetting(CONSTANTS.SETTING_KEYS.POTATO_LEVEL, this.quality);

    for (let module of modules) {
      for (let [setting, value] of Object.entries(this.current_settings[module])) {
        try {
          await game.settings.set(module, setting, value);
          console.log(`Potato Or Not | Set ${module}.${setting} to ${value}`);
        } catch (err) {
          console.error(`Potato Or Not | Could not set ${module}.${setting} to ${value}`);
        }
      }
    }

    window.location.reload();

  }

  /**
   * Locally prompts the settings dialog
   *
   * @return {FormApplication}    The potato FormApplication
   */
  showDialog() {
    return new PotatoOrNotApplication().render(true);
  }

  get quality() {
    return this._quality;
  }

  /**
   * Sets the graphic quality of the client
   * @param {number}     quality_level  The quality level which to apply
   *
   * @return {boolean}          If the quality level was applied succeeded
   */
  set quality(quality_level) {

    if (typeof quality_level !== 'number') throw new Error("quality must be of type number");
    if (!(quality_level >= 0 && quality_level <= 2)) throw new Error("quality must be 0, 1, or 2");

    this._quality = quality_level;

    this.updateSettings();
  }

  /**
   * Gets the value of a setting of a module at a quality level
   * @param {number} quality_level  The quality level which to get the setting from
   * @param {string} module      The module the setting belongs to
   * @param {string} setting      The setting to get the value from
   *
   * @return {any}          The value of the setting
   */
  getSetting(quality_level = 1, module = "", setting = "") {

    this._validate_setting(quality_level, module, setting);

    return this.settings[quality_level][module][setting];

  }

  /**
   * Adds a setting to be applied on a quality level
   * @param {number}     quality_level  The quality level which to apply the setting to
   * @param {string}     module      The module the setting belongs to
   * @param {string}     setting      The setting to modify
   * @param {any}      value      The value to set
   * @param {boolean}  force      Whether to force-apply the setting right away should the client have the same quality level
   *
   * @return {boolean}          If setting was applied succeeded
   */
  addSetting(quality_level = 1, module = "", setting = "", value = "", force = false) {

    this._validate_quality_level(quality_level);

    if (this.settings[quality_level][module] === undefined) {
      this.settings[quality_level][module] = {};
    }

    this.settings[quality_level][module][setting] = value;

    if (force && this.quality === quality_level) {
      try {
        game.settings.set(module, setting, value);
        return true;
      } catch (err) {
        console.error(`Potato Or Not | Could not set ${module}.${setting} to ${value} - please see log below`);
        throw err;
      }
    }

    return true;

  }

  /**
   * Removes a setting from a quality level
   * @param {number}     quality_level  The quality level which to apply the setting to
   * @param {string}     module      The module the setting belongs to
   * @param {string}     setting      The setting to modify
   *
   * @return {boolean}          If setting was removed successfully
   */
  removeSetting(quality_level = 1, module = "", setting = "") {

    this._validate_setting(quality_level, module, setting);

    try {
      delete this.settings[quality_level][module][setting];
    } catch (err) {
      console.error(`Potato Or Not | Could not remove ${module}.${setting} - please see log below`);
      throw err;
    }

    return true;

  }

}

class PotatoOrNotApplication extends FormApplication {

  constructor(dialogData = {}, options = {}) {
    super(dialogData, options);
    game.settings.sheet.close();
    this.potato_quality = PotatoOrNot.quality;
  }

  /* -------------------------------------------- */

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      title: "Potato Or Not",
      template: `modules/potato-or-not/templates/potato-template.html`,
      classes: ["dialog"],
      width: 900,
      height: "auto",
    });
  }

  /* -------------------------------------------- */

  /** @override */
  getData() {
    let data = super.getData();
    data.potato_quality = this.potato_quality;
    return data;
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);
    let btn = html.find(".potato-level-container");
    btn.on("click", this._selectedPotatoLevel.bind(this));
    setTimeout(() => this.setPosition(), 50);
  }

  /* -------------------------------------------- */

  _selectedPotatoLevel(event) {
    event.preventDefault();
    const btn = $(event.currentTarget);
    this.potato_quality = Number(btn.attr("level"));
    btn.attr('active', true);
    this._element.find(".potato-level-container").not(btn).removeAttr("active");
  }

  /* -------------------------------------------- */

  async _updateObject(event, formData) {
    PotatoOrNot.quality = this.potato_quality;
    lib.setSetting(CONSTANTS.SETTING_KEYS.HAS_BEEN_PROMPTED, true);
  }

}
