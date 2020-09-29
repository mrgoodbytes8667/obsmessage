# OBS Message

[![Release](https://github.com/mrgoodbytes8667/obsmessage/workflows/Release/badge.svg)](https://github.com/mrgoodbytes8667/obsmessage/releases) ![CI](https://github.com/mrgoodbytes8667/obsmessage/workflows/CI/badge.svg)

A plugin for [Stream Deck](https://developer.elgato.com/documentation/stream-deck/) to interact with [Kruiz Control](https://github.com/Kruiser8/Kruiz-Control).

### Features

- Allows you to send a message via the OBS Websocket plugin that can be heard inside Kruiz Control
- Can be used in multi-actions

### Pre-requisites

- [Kruiz Control](https://github.com/Kruiser8/Kruiz-Control)
- [OBS Websocket Plugin](https://github.com/Palakis/obs-websocket/releases)
- [Stream Deck (hardware, mobile, or keyboard)](https://www.elgato.com/en/gaming/stream-deck)
- [Stream Deck (software)](https://www.elgato.com/en/gaming/downloads) 4.1 or later.

### Inside Kruiz Control

Listen for `OnOBSCustomMessage` as described [here](https://github.com/Kruiser8/Kruiz-Control/blob/master/js/Documentation.md#onobscustommessage)

```
OnOBSCustomMessage "My Custom Message"
Chat Send "Responding to My Custom Message with {data}"
```

### Notes

If more than one instance of Kruiz Control is running at a time, only one will receive these messages.

### Support

- Found a bug? [Open an issue](https://github.com/mrgoodbytes8667/obsmessage/issues/new)!
- Need more help? Contact the author or get support from the Discord @ https://www.pipsqueek.net/support#contact

### Attribution

Icons are from [FontAwesome](https://fontawesome.com/) under the [CC BY 4.0 License](https://creativecommons.org/licenses/by/4.0/).