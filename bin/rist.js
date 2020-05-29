const {chalk,semver} = require('@rist/cli-shared-utils');
const requireVersion = require('../package.json').engines.node;
const log = console.log;
function checkNodeVersion(wanted,id){
    if(!semver.satisfies(process.version,wanted)){
        log(chalk.red(
            'You are using Node ' + process.version + ', but this version of ' + id +
            ' requires Node ' + wanted + '.\nPlease upgrade your Node version.'
        ))
        process.exit(1)
    }
}
checkNodeVersion(requireVersion,'@rist/cli');
if (semver.satisfies(process.version, '9.x')) {
    log(chalk.red(
      `You are using Node ${process.version}.\n` +
      `Node.js 9.x has already reached end-of-life and will not be supported in future major releases.\n` +
      `It's strongly recommended to use an active LTS version instead.`
    ))
}

const fs = require('fs');
const path = require('path');
const slash = require('slash');
const minimist = require('minimist');

//debug mode when creating test repo
if(
    slash(process.cwd()).indexOf('/packages/test') > 0 && (
        fs.existsSync(path.resolve(process.cwd(), '../@rist'))||
        fs.existsSync(path.resolve(process.cwd(), '../../@rist'))
    )
){
    process.env.RIST_CLI_DEBUG = true
}

const program = require('commander');

program
    .version(`@rist/cli ${require('../package').version}`)
    .usage('<command> [options]')

program
    .command('create <app-name>')
    .description('create a new project powered by rist-cli-service')
    .option('-p, --preset <presetName>', 'Skip prompts and use saved or remote preset')
    .option('-d, --default', 'Skip prompts and use default preset')
    .option('-i, --inlinePreset <json>', 'Skip prompts and use inline JSON string as preset')
    .option('-m, --packageManager <command>', 'Use specified npm client when installing dependencies')
    .option('-r, --registry <url>', 'Use specified npm registry when installing dependencies (only for npm)')
    .option('-g, --git [message]', 'Force git initialization with initial commit message')
    .option('-n, --no-git', 'Skip git initialization')
    .option('-f, --force', 'Overwrite target directory if it exists')
    .option('--merge', 'Merge targe directory if it exists')
    .option('-c, --clone', 'Use git clone when fetching remote preset')
    .option('-x, --proxy', 'Use specified proxy when creating project')
    .option('-b, --bare', 'Scaffold project without beginner instructions')
    .option('--skipGetStarted', 'Skip displaying "Get started" instructions')
    .action((name, cmd) => {
        const options = cleanArgs(cmd)
        if(minimist(process.argv.slice(3))._.length > 1){
            log(chalk.yellow('\n Info: You provided more than one argument. The first one will be used as the app\'s name, the rest are ignored.'))
        }
        // --git makes commander to default git to true
        if(process.argv.includes('-g') || process.argv.includes('--git')){
            options.forceGit = true
        }
        require('../lib/create')(name,options)
    })

// add some useful info on help
program.on('--help', () => {
    console.log()
    console.log(`  Run ${chalk.cyan(`rist-cli <command> --help`)} for detailed usage of given command.`)
    console.log()
})
program.parse(process.argv)

function camelize(str){
    return str.replace(/-(\w)/g,(_,c)=> c ? c.toUpperCase():'')
}

function cleanArgs(cmd){
    const args = {}
    cmd.options.forEach(o => {
        const key = camelize(o.long.replace(/^--/,''))
        if(typeof cmd[key] !== 'function' && typeof cmd[key] !== 'undefined'){
            args[key] = cmd[key]
        }
    })
    return args;
}
