
const { chalk, error, stopSpinner, exit } = require('@vue/cli-shared-utils')
const log = console.log;

async function create (projectName, options){
    log(projectName,options);
}

module.exports = (...args) => {
    return create(...args).catch(err => {
        stopSpinner(false) // do not persist
        errro(err)
        if(!process.env.RIST_CLI_TEST){
            process.exit(1);
        }
    })
}