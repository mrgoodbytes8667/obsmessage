# OBS Message

[![Release](https://github.com/mrgoodbytes8667/obsmessage/workflows/Release/badge.svg)](https://github.com/mrgoodbytes8667/obsmessage/releases) ![CI](https://github.com/mrgoodbytes8667/obsmessage/workflows/CI/badge.svg)

A plugin for [Stream Deck](https://developer.elgato.com/documentation/stream-deck/) to interact with [Kruiz Control](https://github.com/Kruiser8/Kruiz-Control).

_**[If you use OBS v27 and earlier+ and/or OBS Websockets v4, this branch is not for you! Please visit the v0.1 branch!](https://github.com/mrgoodbytes8667/obsmessage/tree/0.1)**_

### Features

- Allows you to send a message via the OBS Websocket plugin that can be heard inside Kruiz Control
- Can be used in multi-actions

### Pre-requisites

- [Kruiz Control](https://github.com/Kruiser8/Kruiz-Control)
- [OBS Websocket Plugin v5](https://github.com/Palakis/obs-websocket/releases)
- [Stream Deck (hardware, mobile, or keyboard)](https://www.elgato.com/en/gaming/stream-deck)
- [Stream Deck (software)](https://www.elgato.com/en/gaming/downloads) 5.2 or later.

### Plugin Installation

Download the latest live.goodbytes.obsmessage.streamDeckPlugin file from the [Releases](https://github.com/mrgoodbytes8667/obsmessage/releases) page, and simply double click the file to be prompted to install the plugin in Stream Deck.

Alternatively, if you download the fully zipped source code:
- Unzip obsmessage-main.zip
- Open File Explorer and navigate to `%appdata%`
- Navigate to `Roaming\Elgato\StreamDeck\Plugins`
- Drag and drop the `live.goodbytes.obsmessage.sdPlugin` folder there
- Close and Reopen the Stream Deck software to see the plugin

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
