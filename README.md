# Potato Or Not

*made with :potato: by Adam Oresten*

---

![Latest Release Download Count](https://img.shields.io/github/downloads/Haxxer/FoundryVTT-PotatoOrNot/latest/module.zip?color=2b82fc&label=DOWNLOADS&style=for-the-badge) [![Forge Installs](https://img.shields.io/badge/dynamic/json?label=Forge%20Installs&query=package.installs&suffix=%25&url=https%3A%2F%2Fforge-vtt.com%2Fapi%2Fbazaar%2Fpackage%2Fpotato-or-not&colorB=006400&style=for-the-badge)](https://forge-vtt.com/bazaar#package=potato-or-not) ![Foundry Core Compatible Version](https://img.shields.io/badge/dynamic/json.svg?url=https%3A%2F%2Fgithub.com%2FHaxxer%2FFoundryVTT-PotatoOrNot%2Freleases%2Flatest%2Fdownload%2Fmodule.json&label=Foundry%20Version&query=$.compatibleCoreVersion&colorB=orange&style=for-the-badge) ![Latest Version](https://img.shields.io/badge/dynamic/json.svg?url=https%3A%2F%2Fgithub.com%2FHaxxer%2FFoundryVTT-PotatoOrNot%2Freleases%2Flatest%2Fdownload%2Fmodule.json&label=Latest%20Release&prefix=v&query=$.version&colorB=red&style=for-the-badge)

---

![Samwise Gamgee Saying Po-Ta-Toes](docs/po-ta-toes.gif)

Is your computer a potato? Is your players' computers potatoes? Are they scared of navigating interfaces?

Presenting, **Potato Or Not**!

This modules provides a quick way to prompt your players how fast their computer is, and set their graphics settings accordingly.

![The Dialog](docs/po-ta-toes.jpg)

---

# API Documentation

## Constants

### <code>PotatoOrNot.quality</code>

Sets the graphic quality of the client and update settings associated with that quality level

| Param | Type | Range |
| --- | --- | --- |
| quality | <code>number</code> | 0-2 |

---

## Functions

### <code>PotatoOrNot.showDialog</code>

Locally prompts the dialogue

Returns <code>FormApplication</code>

---

### <code>PotatoOrNot.getSetting</code>

Gets the value of a setting of a module at a quality level

| Param | Type |
| --- | --- |
| quality_level | <code>number</code> |
| module | <code>string</code> |
| setting | <code>string</code> |

Returns <code>\*</code> on success

---

### <code>PotatoOrNot.addSetting</code>

Adds a setting to be applied on a quality level - can be forced to be applied immediately (if quality level matches)

| Param | Type |
| --- | --- |
| quality_level | <code>number</code> |
| module | <code>string</code> |
| setting | <code>string</code> |
| value | <code>\*</code> |
| force | <code>bool</code> |

Returns <code>bool</code> on success

---

### <code>PotatoOrNot.removeSetting</code>

Removes a setting from a quality level

| Param | Type |
| --- | --- |
| quality_level | <code>number</code> |
| module | <code>string</code> |
| setting | <code>string</code> |

Returns <code>bool</code> on success
