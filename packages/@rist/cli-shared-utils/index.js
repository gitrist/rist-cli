exports.chalk = require('chalk');

// Object.defineProperties(exports,'installedBrowsers',{
//     enumerable: true,
//     get() {
//         return exports.getInstalledBrowsers()
//     }
// })

const exports = new Proxy(exports, {
    get(obj, props) {
        if (props === 'installedBrowsers') {
            return obj.getInstalledBrowsers()
        }
    }
});