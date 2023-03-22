const CONSTANTS = {
  MODULE_NAME: "potato-or-not"
}


CONSTANTS.SETTING_KEYS = {
  PROMPT_USERS: "promptUsers",
  HAS_BEEN_PROMPTED: "hasBeenPrompted",
  POTATO_LEVEL: "potatoLevel",
  NUMBER_OF_SETTINGS: "numberOfSettings",
  SETTINGS: "settings",
}

CONSTANTS.SETTINGS = {
  [CONSTANTS.SETTING_KEYS.PROMPT_USERS]: {
    name: "Prompt All New Users",
    hint: "This will make it so that the prompt will be shown to all new users.",
    scope: "world",
    config: true,
    default: true,
    type: Boolean
  },
  [CONSTANTS.SETTING_KEYS.HAS_BEEN_PROMPTED]: {
    scope: "client",
    config: false,
    default: false,
    type: Boolean
  },
  [CONSTANTS.SETTING_KEYS.POTATO_LEVEL]: {
    scope: "client",
    config: false,
    default: 1,
    type: Number
  },
  [CONSTANTS.SETTING_KEYS.NUMBER_OF_SETTINGS]: {
    name: "Show Dialog",
    scope: "client",
    default: 5,
    type: Number,
    config: false
  },
  [CONSTANTS.SETTING_KEYS.SETTINGS]: {
    scope: "client",
    default: {},
    type: Object,
    config: false
  }
}

CONSTANTS.BASE_SETTINGS = [
  {
    "core": {
      "performanceMode": 0,
      "pixelRatioResolutionScaling": false,
      "photosensitiveMode": true,
      "maxFPS": 10,
      "mipmap": false,
      "visionAnimation": false,
      "lightAnimation": false,
    },
  },
  {
    "core": {
      "performanceMode": 1,
      "maxFPS": 30,
      "pixelRatioResolutionScaling": true,
      "photosensitiveMode": false,
      "mipmap": true,
      "visionAnimation": true,
      "lightAnimation": true,
    }
  },
  {
    "core": {
      "performanceMode": 2,
      "maxFPS": 60,
      "pixelRatioResolutionScaling": true,
      "photosensitiveMode": false,
      "mipmap": true,
      "visionAnimation": true,
      "lightAnimation": true,
    }
  }
]

export default CONSTANTS;
