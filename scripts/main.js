Hooks.on("ready", () => {

	window.PotatoOrNot = new PotatoOrNotHandler();

	console.log("Potato Or Not | Ready")

	Hooks.call("PotatoOrNotReady");

	window.PotatoOrNot.postSetup();

});

class PotatoOrNotHandler{

	constructor(){

		game.settings.register("potato-or-not", "promptUsers", {
			name: "Prompt All New Users",
			hint: "This will make it so that the prompt will be shown to all new users.",
			scope: "world",
			config: true,
			default: true,
			type: Boolean
		});
	
		game.settings.register("potato-or-not", "hasBeenPrompted", {
			scope: "client",
			config: false,
			default: false,
			type: Boolean
		});
	
		game.settings.register("potato-or-not", "potatoLevel", {
			scope: "client",
			config: false,
			default: 1,
			type: Number
		});
	
		game.settings.register("potato-or-not", "numberOfSettings", {
			scope: "client",
			config: false,
			default: 5,
			type: Number
		});
	
		game.settings.registerMenu("potato-or-not", "potato-or-not", {
			name: "Set Up Potato Settings",
			label: "Show Dialog",
			icon: "fas fa-carrot",
			type: PotatoOrNotApplication,
			restricted: false
		});
	
		game.settings.register("potato-or-not", "settings", {
			name: "Show Dialog",
			scope: "client",
			default: {},
			type: Object,
			config: false
		});

		this._settings = [
			{
				"core": {
					"maxFPS": 20,
					"softShadows": false,
					"mipmap": false,
					"visionAnimation": false,
					"lightAnimation": false,
				},
			},
			{
				"core": {
					"maxFPS": 30,
					"softShadows": true,
					"mipmap": false,
					"visionAnimation": true,
					"lightAnimation": true,
				}
			},
			{
				"core": {
					"maxFPS": 60,
					"softShadows": true,
					"mipmap": true,
					"visionAnimation": true,
					"lightAnimation": true,
				}
			}
		];

		this._quality = game.settings.get("potato-or-not", "potatoLevel");
		
	}

	get current_settings(){
		return this.settings[this.quality];
	}

	set settings(settings){
		throw "You cannot set settings directly, please use PotatoOrNot.addSetting and PotatoOrNot.removeSetting";
	}

	get settings(){
		return this._settings;
	}

	_validate_quality_level(quality_level){
		if(this.settings[quality_level] === undefined) throw "quality_level must be 0, 1, or 2 - low, medium, and high settings";
	}

	_validate_module(quality_level, module){
		this._validate_quality_level(quality_level);
		if(this.settings[quality_level][module] === undefined) throw `Module setting "${module}" not found in quality level of "${quality_level}"`;
	}

	_validate_setting(quality_level, module, setting){
		this._validate_module(quality_level, module);
		if(this.settings[quality_level][module][setting] === undefined) throw `Setting "${setting}" in module "${module}" not found`;
	}

	get numberOfSettings(){
		let numberOfSettings = [];
		for(let i = 0; i < this.settings.length; i++){
			numberOfSettings[i] = 0;
			for(let settings of Object.values(this.settings[i])){
				numberOfSettings[i] += Object.keys(settings).length;
			}
		}
		return numberOfSettings;
	}

	postSetup(){
		let numberOfSettings = this.numberOfSettings[this.quality];

		if(!game.settings.get('potato-or-not', 'hasBeenPrompted') && game.settings.get('potato-or-not', 'promptUsers')){
			this.showDialog();
		}else if(numberOfSettings != game.settings.get("potato-or-not", "numberOfSettings")){
			game.settings.set("potato-or-not", "numberOfSettings", numberOfSettings);
			this.updateSettings();
		}
	}

	updateSettings(){

		let modules = Object.keys(this.current_settings);

		for(let module of modules){
			for(let [setting, value] of Object.entries(this.current_settings[module])){
				try{
					game.settings.set(module, setting, value);
					console.log(`Potato Or Not | Set ${module}.${setting} to ${value}`);
				}catch(err){
					console.error(`Potato Or Not | Could not set ${module}.${setting} to ${value}`);
				}
			}
		}

		window.location.reload();

	}

	/**
	  * Locally prompts the settings dialog
	  * 
	  * @return {FormApplication}		The potato FormApplication
	  */
	showDialog(){
		return new PotatoOrNotApplication().render(true);
	}

	get quality(){
		return this._quality;
	}

	/**
	  * Sets the graphic quality of the client
	  * @param {number} quality_level	The quality level which to apply
	  * 
	  * @return {bool} 					If the quality level was applied succeeded
	  */
	set quality(level){
		if(typeof level !== 'number') throw "quality must be of type number";
		if(!(level >= 0 && level <= 2)) throw "quality must be 0, 1, or 2";

		this._quality = level;
		game.settings.set("potato-or-not", "potatoLevel", level);

		this.updateSettings();
	}

	/**
	  * Gets the value of a setting of a module at a quality level
	  * @param {number} quality_level	The quality level which to get the setting from
	  * @param {string} module			The module the setting belongs to
	  * @param {string} setting			The setting to get the value from
	  * 
	  * @return {any} 					The value of the setting
	  */
	getSetting(quality_level=1, module="", setting="", value=""){

		this._validate_setting(quality_level, module, setting);

		return this.settings[quality_level][module][setting];

	}

	/**
	  * Adds a setting to be applied on a quality level
	  * @param {number} quality_level	The quality level which to apply the setting to
	  * @param {string} module			The module the setting belongs to
	  * @param {string} setting			The setting to modify 
	  * @param {any} 	value			The value to set
	  * @param {bool}	force			Whether to force-apply the setting right away should the client have the same quality level
	  * 
	  * @return {bool} 					If setting was applied succeeded
	  */
	addSetting(quality_level=1, module="", setting="", value="", force=false){

		this._validate_quality_level(quality_level);

		if(this.settings[quality_level][module] === undefined){
			this.settings[quality_level][module] = {};
		}

		this.settings[quality_level][module][setting] = value;

		if(force && this.quality == quality_level){
			try{
				game.settings.set(module, setting, value);
				return true;
			}catch(err){
				console.error(`Potato Or Not | Could not set ${module}.${setting} to ${value} - please see log below`);
				throw err;
			}
		}

		return true;

	}

	/**
	  * Removes a setting from a quality level
	  * @param {number} quality_level	The quality level which to apply the setting to
	  * @param {string} module			The module the setting belongs to
	  * @param {string} setting			The setting to modify
	  * 
	  * @return {bool} 					If setting was removed successfully
	  */
	removeSetting(quality_level=1, module="", setting=""){

		this._validate_setting(quality_level, module, setting);

		try{
			delete this.settings[quality_level][module][setting];
		}catch(err){
			console.error(`Potato Or Not | Could not remove ${module}.${setting} - please see log below`);
			throw err;
		}

		return true;
		
	}

}

class PotatoOrNotApplication extends FormApplication {
	
	constructor(dialogData={}, options={}) {
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
			height: 425,
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
		btn.click(this._selectedPotatoLevel.bind(this));
	}

	/* -------------------------------------------- */

	_selectedPotatoLevel(event) {
		event.preventDefault();
		const btn = $(event.currentTarget);
		const level = btn.attr("level")|0;
		this.potato_quality = level;
		btn.attr('active', true);
		this._element.find(".potato-level-container").not(btn).removeAttr("active");
	}

	/* -------------------------------------------- */

	async _updateObject(event, formData) {
		PotatoOrNot.quality = this.potato_quality;
		game.settings.set("potato-or-not", "hasBeenPrompted", true);
	}

}