# Potato Or Not

*made with ![Sam saying Po-Ta-Toes](docs/small_potato.png) by Adam Oresten*

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
