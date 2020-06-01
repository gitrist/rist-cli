
const fs = require('fs-extra')
const path = require('path')
const inquirer = require('inquirer')
const { clearConsole } = require('./util/clearConsole')
const { chalk, stopSpinner, exit, error, log } = require('@rist/cli-shared-utils')
const validateProjectName = require('validate-npm-package-name')
// const log = console.log;
// const error = console.error;
async function create (projectName, options){
    if(options.proxy) {
        process.env.HTTP_PROXY = options.proxy
    }
    const cwd = options.cwd || process.cwd()
    const inCurrent = projectName === '.'
    const name = inCurrent ? path.relative('../',cwd) : projectName
    const targetDir = path.resolve(cwd,projectName||'.')
    
    const result = validateProjectName(name)
    if(!result.validForNewPackages){
        error(chalk.red(`Invalide project name: "${name}"`))
        result.errors && result.errors.forEach(err => {
            error(chalk.red.dim('Error: '+err))
        })
        result.warnings&&result.warnings.forEach(warn => {
            error(chalk.red.dim('Warning: ' + warn))
        })
        exit(1)
    }

    if (fs.existsSync(targetDir) && !options.merge){
        log(targetDir)
        if(options.force){
            await fs.remove(targetDir)
        } else {
            await clearConsole()
            if(inCurrent){
                const { ok } = await inquirer.prompt([
                    {
                        name: 'ok',
                        type: 'confirm',
                        message: 'Generate project in current directory'
                    }
                ])
                if(!ok){
                    return
                }
            }else{
                const {action} = await inquirer.prompt([
                    {
                        name: 'action',
                        type: 'list',
                        message: `Target directory ${chalk.cyan(targetDir)} already exists. pick an action`,
                        choices: [
                            {name: 'Overwrite', value: 'overwrite'},
                            {name: 'Merge', value: 'Merge'},
                            {name: 'Cancle', value: false},
                        ]
                    }
                ])
                if(!action){
                    return
                }else if(action === 'overwrite'){
                    log(`\nRemoving ${chalk.cyan(targetDir)}...`)
                    await fs.remove(targetDir)
                }
            }
        }
    }

}

module.exports = (...args) => {
    return create(...args).catch(err => {
        stopSpinner(false) // do not persist
        error(chalk.red(err))
        if(!process.env.RIST_CLI_TEST){
            process.exit(1);
        }
    })
}