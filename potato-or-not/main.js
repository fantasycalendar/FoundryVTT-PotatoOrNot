Hooks.on("setup", () => {

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

    game.settings.registerMenu("potato-or-not", "potato-or-not", {
        name: "Set Up Potato Settings",
        label: "Show Dialog",
        icon: "fas fa-carrot",
        type: PotatoOrNotDialog,
        restricted: false
    });

    game.settings.register("potato-or-not", "settings", {
        name: "Show Dialog",
        scope: "client",
        default: {},
        type: Object,
        config: false
    });
	
	set_up();

});

async function set_up(){
	if(game.settings.get('potato-or-not', 'hasBeenPrompted') || !game.settings.get('potato-or-not', 'promptUsers')){
		return;
	}
	dialog();
}

async function dialog(){
	let dialog = new PotatoOrNotDialog().render(true);
}

class PotatoOrNotDialog extends FormApplication {
	
	constructor(dialogData={}, options={}) {
		super(dialogData, options);
		this._active_potato = game.settings.get("potato-or-not", "potatoLevel");
		this._data = [
			{
				"name": "Shitty Potato",
				"description": "If you have a laptop or a low end computer, use this setting for the smoothest experience!",
				"image": "/modules/potato-or-not/img/bad_potato.jpg",
				"settings": {
					"maxFPS": 20,
					"softShadows": false,
					"visionAnimation": false,
					"lightAnimation": false,
					"mipmap": false
				}
			},
			{
				"name": "Potato",
				"description": "You have a mid-range computer that isn't bad, but it's getting on its years.",
				"image": "/modules/potato-or-not/img/potato.png",
				"settings": {
					"maxFPS": 30,
					"softShadows": true,
					"visionAnimation": true,
					"lightAnimation": true,
					"mipmap": false
				}
			},
			{
				"name": "Premium Potato",
				"description": "Your computer is squarely in the PCMR club.",
				"image": "/modules/potato-or-not/img/good_potato.jpg",
				"settings": {
					"maxFPS": 60,
					"softShadows": true,
					"visionAnimation": true,
					"lightAnimation": true,
					"mipmap": true
				}
			}
		];
	}

	/* -------------------------------------------- */

	/** @override */
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			title: "Potato Or Not",
			template: `modules/potato-or-not/templates/potato-template.html`,
			classes: ["dnd5e", "dialog"],
			width: 600,
			height: 650,
		});
	}

	get current_data(){
		return this._data[this._active_potato];
	}

	/* -------------------------------------------- */

	/** @override */
	getData() {
		let data = super.getData();
		data = Object.assign(data, this.current_data);
		data['active_potato'] = this._active_potato;
		return data;
	}

	/** @override */
	activateListeners(html) {
		super.activateListeners(html);

		let input = html.find("#potato_level")[0];
		input.addEventListener('input', this._onPotatoLevelChange.bind(this));
	}


	async _updateObject(event, formData) {
		for(let [setting, value] of Object.entries(this.current_data.settings)){
			game.settings.set("core", setting, value);
		}
		game.settings.set("potato-or-not", "hasBeenPrompted", true);
		game.settings.set("potato-or-not", "potatoLevel", this._active_potato);
	}

	_onPotatoLevelChange(event){
		this._active_potato = $(event.target).val();
		let data = this.current_data;
		this._element.find('#potato-title').text(data['name']);
		this._element.find('#potato-description').text(data['description']);
		this._element.find('#potato-image').attr('src', data['image']);
	}

}