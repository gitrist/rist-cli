[
    'exit',
    'logger',
    'spinner',
  ].forEach(m => {
    Object.assign(exports, require(`./lib/${m}`))
  })

exports.chalk = require('chalk');
exports.execa = require('execa');
exports.semver = require('semver');

// Object.defineProperties(exports,'installedBrowsers',{
//     enumerable: true,
//     get() {
//         return exports.getInstalledBrowsers()
//     }
// })

const installedBrowsersProps = new Proxy(exports, {
    get(obj, props) {
        if (props === 'installedBrowsers') {
            return obj.getInstalledBrowsers()
        }
    }
});