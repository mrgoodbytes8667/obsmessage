/**
 * @property {string} ipAddress
 * @property {number} port
 * @property {string} password
 * @property {OBSWebSocket} obs
 * @property {boolean} connected
 */
class ObsHandler {

    /**
     * @param [jsonObj]
     */
    constructor(jsonObj) {
        this.obs = new OBSWebSocket();

        // You must add this handler to avoid uncaught exceptions.
        this.obs.on('error', err => {
            console.error('socket error:', err);
        });

        this.obs.on('ConnectionOpened', data => {
            this.connected = false;
            console.log(`OBS Websocket: Connection opening...`, data);
            action.setObsStatus(); // action.setState();
        });
        this.obs.on('ConnectionClosed', data => {
            this.connected = false;
            console.log(`OBS Websocket: Connection terminated.`, data);
            action.setObsStatus(); // action.setState();
        });
        this.obs.on('AuthenticationSuccess', data => {
            this.connected = true;
            console.log(`OBS Websocket: Success! We're connected & authenticated.`, data);
            action.setObsStatus(); // action.setState();
        });
        this.obs.on('AuthenticationFailure', data => {
            this.connected = false;
            console.error(`OBS Websocket: Authentication FAILED.`, data);
            action.setObsStatus(); // action.setState();
        });
    }

    /**
     * @param {Object} [settings]
     * @param {string} [settings.ipAddress]
     * @param {number} [settings.port]
     * @param {string} [settings.password]
     * @return {{password: string, port: number, ipAddress: string}}
     */
    settings(settings) {
        if(settings !== null && settings !== undefined)
        {
            this.ipAddress = settings['ipAddress'] || '127.0.0.1';
            this.port = settings['port'] || 4444;
            this.password = settings['password'] || '';
        }
        return {
            'ipAddress': this.ipAddress,
            'port': this.port,
            'password': this.password
        };
    }

    /**
     * @return {{password: string, port: number, ipAddress: string}}
     */
    defaultSettings() {
        return {
            'ipAddress': '127.0.0.1',
            'port': 4444,
            'password': ''
        };
    }

    /**
     * Checks to see if we have SOMETHING entered for the OBS Websockets IP and Port. Password being blank is fine.
     * @return {boolean}
     */
    isValidOBSSettings() {
        return (this.ipAddress !== '' && this.port >= 0 && this.port <= 65535);
    }

    /**
     * @return {string}
     */
    getOBSAddress() {
        return 'ws://' + this.ipAddress + ':' + this.port.toString();
    }

    /**
     * @param {boolean} [reconnect = false] Force a reconnect if we are already connected?
     * @return {Promise<*>}
     */
    connect(reconnect) {
        if (this.connected === true && reconnect !== true) {
            return new Promise((resolve, reject) => { resolve(); })
        }
        let password = null;
        if (this.password !== '') {
            password = this.password;
        }
        console.log('--- OBS Websocket: connect() ---', this.getOBSAddress(), password);
        return this.obs.connect(this.getOBSAddress(), password);
    }

    /**
     *
     */
    disconnect() {
        if (this.connected === true) {
            this.obs.disconnect();
        }
    }

    /**
     * @param {string} message
     * @param {string} [data]
     * @return {Promise<*|Promise|void>}
     */
    async send(message, data) {
        if(!this.connected) {
            await this.connect();
        }
        return this.obs.call('BroadcastCustomEvent', {
            'eventData': {
                'realm': 'kruiz-control',
                'data': {
                    'message': message,
                    'data': (data || '')
                }
            }
        });
    }

}