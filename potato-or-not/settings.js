Hooks.once("init", () => {
	game.settings.register("potato-or-not", "promptUsers", {
		name: "Prompt All New Users",
		hint: "This will make it so that the prompt will be shown to all new users.",
		scope: "world",
		config: true,
		default: true,
		type: Boolean
	});
});