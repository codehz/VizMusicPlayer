const {screen: eScreen} = require('electron');

module.exports = currentWindow => ({
    methods: {
        hide() {
            currentWindow.minimize();
        },
        fullscreen() {
            currentWindow.setKiosk(this.isFullScreen = !currentWindow.isKiosk());
        },
        close() {
            currentWindow.close();
        }
    },
    data: {
        isFullScreen: false
    }
});
