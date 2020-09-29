/* global $SD */
$SD.on('connected', conn => connected(conn));
const obs = new ObsHandler();

/**
 * @param {Object} jsn
 */
function connected(jsn) {
    debugLog('Connected Plugin:', jsn);
    console.log('--- Connected Plugin ---', jsn);

    /** subscribe to the willAppear event */
    $SD.on('live.goodbytes.obsmessage.action.willAppear', jsonObj =>
        action.onWillAppear(jsonObj)
    );
    $SD.on('live.goodbytes.obsmessage.action.willDisappear', jsonObj =>
        action.onWillDisappear(jsonObj)
    );
    $SD.on('live.goodbytes.obsmessage.action.keyDown', jsonObj =>
        action.onKeyDown(jsonObj)
    );
    $SD.on('live.goodbytes.obsmessage.action.keyUp', jsonObj =>
        action.onKeyUp(jsonObj)
    );
    /**
     * Listen for the property inspector sending a payload
     */
    $SD.on('live.goodbytes.obsmessage.action.sendToPlugin', jsonObj =>
        action.onSendToPlugin(jsonObj)
    );
    $SD.on('live.goodbytes.obsmessage.action.propertyInspectorDidAppear', jsonObj =>
        action.onPropertyInspectorDidAppear(jsonObj)
    );
    $SD.on('didReceiveGlobalSettings', jsonObj =>
        action.onDidReceiveGlobalSettings(jsonObj)
    );
}

const action = {
    type: 'live.goodbytes.obsmessage.action',
    cache: {},

    /**
     * @param {string} ctx
     * @return {*}
     */
    getContextFromCache: function (ctx) {
        return this.cache[ctx];
    },

    /**
     * Listener for an action appearing on a Stream Deck, for example when the hardware is first
     * plugged in, or when a folder containing that action is entered
     * @param {object} jsn
     * @param {object} jsn.action
     * @param {object} jsn.event
     * @param {object} jsn.context
     * @param {object} jsn.payload
     * @param {object} jsn.payload.settings
     */
    onWillAppear: function (jsn) {

        if (!jsn.payload || !jsn.payload.hasOwnProperty('settings')) return;

        const kc = new KC(jsn);
        // cache the current KC
        this.cache[jsn.context] = kc;

        $SD.api.setSettings(jsn.context, kc.settings());

        $SD.api.sendToPropertyInspector(
            jsn.context,
            kc.settings(),
            this.type
        );

        $SD.api.getGlobalSettings();
    },

    /**
     * Listener for an action disappearing on a Stream Deck, for example when switching profiles or
     * folders, or the user deletes an action
     * @param {object} jsn
     * @param {string} jsn.action
     * @param {string} jsn.event
     * @param {string} jsn.context
     * @param {string} jsn.device
     * @param {object} jsn.payload
     * @param {object} jsn.payload.settings
     * @param {object} jsn.payload.coordinates
     * @param {number} jsn.payload.[state]
     * @param {boolean} jsn.payload.isInMultiAction
     */
    onWillDisappear: function (jsn) {
        let found = this.getContextFromCache(jsn.context);
        if (found) {
            delete this.cache[jsn.context];
        }
    },

    /**
     * Listener for button KeyDown
     * @param {object} jsn
     * @param {string} jsn.action
     * @param {string} jsn.event
     * @param {string} jsn.context
     * @param {string} jsn.device
     * @param {object} jsn.payload
     * @param {object} jsn.payload.settings
     * @param {object} jsn.payload.coordinates
     * @param {number} jsn.payload.[state]
     * @param {boolean} jsn.payload.isInMultiAction
     */
    onKeyDown: function (jsn) {
        console.log('--- onKeyDown ---', jsn);
    },

    /**
     * Listener for button KeyUp
     * @param {object} jsn
     * @param {string} jsn.action
     * @param {string} jsn.event
     * @param {string} jsn.context
     * @param {string} jsn.device
     * @param {object} jsn.payload
     * @param {object} jsn.payload.settings
     * @param {object} jsn.payload.coordinates
     * @param {number} jsn.payload.[state]
     * @param {boolean} jsn.payload.isInMultiAction
     */
    onKeyUp: function (jsn) {
        const kc = this.getContextFromCache(jsn.context);
        kc.send(obs)
            .then(data => {
                console.log(data);
                this.showOk(jsn.context);
            })
            .catch(err => { // Promise convention dictates you have a catch on every chain.
                console.log(err);
                this.showAlert(jsn.context);
            });
    },

    /**
     * Listener for the Property Inspector sending information back to the plugin
     * @param {object} jsn
     * @param {string} jsn.action
     * @param {string} jsn.event
     * @param {string} jsn.context
     * @param {Object} jsn.payload
     * @param {string} [jsn.payload.ipAddress]
     * @param {number} [jsn.payload.port]
     * @param {string} [jsn.payload.password]
     * @param {string} [jsn.payload.message]
     * @param {string} [jsn.payload.data]
     * @param {string} [jsn.payload.obsAction]
     */
    onSendToPlugin: function (jsn) {
        console.log('--- OnSendToPlugin ---', jsn, jsn.payload);
        if (!jsn.payload) return;

        const kc = this.getContextFromCache(jsn.context);
        if (kc) {
            const settings = jsn.payload;
            if (settings.hasOwnProperty('obsAction')) {
                switch (settings.obsAction) {
                    case 'obsdisconnect':
                        obs.disconnect();
                        break;
                    case 'obsconnect':
                        obs.connect().catch(err => console.error(err));
                        break;
                }
            } else {
                let obsChange = false;
                let localChange = false;
                if (settings.hasOwnProperty('ipAddress') && settings.ipAddress !== '' && settings.ipAddress !== obs.ipAddress) {
                    obs.ipAddress = settings.ipAddress;
                    obsChange = true;
                }
                if (settings.hasOwnProperty('port') && settings.port >= 0 && settings.port <= 65535 && settings.port !== obs.port) {
                    obs.port = settings.port;
                    obsChange = true;
                }
                if (settings.hasOwnProperty('password') && settings.password !== obs.password) {
                    obs.password = settings.password || '';
                    obsChange = true;
                }
                if (settings.hasOwnProperty('message')) {
                    kc.message = settings.message;
                    localChange = true;
                }
                if (settings.hasOwnProperty('data')) {
                    kc.data = settings.data;
                    localChange = true;
                }
                if(settings.hasOwnProperty('obsChange')) {
                    obsChange = true;
                }

                if (obsChange === true) {
                    $SD.api.setGlobalSettings(obs.settings());
                    this.globalSettingsChange(obs.settings(), obsChange).then(() => {}).catch(err => console.error(err));
                }
                if (localChange === true) {
                    $SD.api.setSettings(jsn.context, kc.settings());
                }
            }
        }
    },

    /**
     * Listener for the Property Inspector appearing
     * @param {object} jsn
     * @param {string} jsn.action
     * @param {string} jsn.event
     * @param {string} jsn.context
     * @param {string} jsn.device
     */
    onPropertyInspectorDidAppear(jsn) {
        console.log('--- onPropertyInspectorDidAppear ---', jsn);
        $SD.api.sendToPropertyInspector(jsn.context, {'obsDefaults': obs.defaultSettings()}, this.type);
        this.setObsStatus(jsn.context);
    },

    /**
     * Listener for global settings changes
     * @param {object} jsn
     * @param {string} jsn.event
     * @param {object} jsn.payload
     * @param {object} jsn.payload.settings
     */
    onDidReceiveGlobalSettings(jsn) {
        console.log('--- OnDidReceiveGlobalSettings ---', jsn, jsn.payload);
        this.globalSettingsChange(jsn.payload.settings).then(() => {}).catch(err => console.error(err));

    },

    /**
     * Shared function to process new global settings and connect/reconnect the OBS Websocket
     * @param settings
     * @param {boolean} [reconnect = false] If true, force a reconnect even if we are already connected
     * @return {Promise<void>}
     */
    async globalSettingsChange(settings, reconnect) {
        console.log('--- globalSettingsChange ---', settings);
        if(!reconnect) {
            reconnect = false;
        }
        if (jQuery.isEmptyObject(settings)) {
            settings = obs.settings(settings);
            $SD.api.setGlobalSettings(settings);
        }

        obs.settings(settings);
        if (obs.isValidOBSSettings()) {
            obs.connect(reconnect).catch(err => console.error(err));
        }

    },

    /**
     * Trigger the alert triangle on the passed context or all contexts
     * @param {string} [context]
     */
    showAlert(context) {
        if (context) {
            $SD.api.showAlert(context);
        } else {
            Object.keys(this.cache).forEach(context => $SD.api.showAlert(context));
        }
    },

    /**
     * Trigger the ok checkmark on the passed context or all contexts
     * @param {string} [context]
     */
    showOk(context) {
        if (context) {
            $SD.api.showOk(context);
        } else {
            Object.keys(this.cache).forEach(context => $SD.api.showOk(context));
        }
    },

    /**
     * Notify the Property Inspector about the current OBS connection status
     * @param {string} [context]
     */
    setObsStatus(context) {
        if (context) {
            $SD.api.sendToPropertyInspector(context, {'obsStatus': obs.connected}, this.type);
        } else {
            Object.keys(this.cache).forEach(context => {
                console.log('setObsStatus', context);
                $SD.api.sendToPropertyInspector(context, {'obsStatus': obs.connected}, this.type);
            });
        }
    }
};