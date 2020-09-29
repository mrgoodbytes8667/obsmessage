/**
 *
 */
class KC {

    /**
     * @param jsonObj
     */
    constructor(jsonObj) {
        this.context = jsonObj.context;
        this.origContext = jsonObj.context;
        this.message = jsonObj.payload.settings['message'] || '';
        this.data = jsonObj.payload.settings['data'] || '';
    }

    /**
     *
     * @return {{data: (*|string), context: *, message: (*|string)}}
     */
    settings() {
        return {
            'context': this.context,
            'message': this.message,
            'data': this.data
        };
    }

    /**
     * @param {ObsHandler} obs
     */
    send(obs) {
        return obs.send(this.message, this.data);
    }

}