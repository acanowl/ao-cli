#! /usr/bin/env node

const { Command } = require('commander')
const chalk = require('chalk')
const figlet = require('figlet')
const packageInfo = require('../../package.json')

const program = new Command()

program
  .name('ao')
  .usage(`< command > [option]`)
  .version(`ao - cli ${packageInfo.version} `)

// program.option('-f, --force', 'overwrite target directory if it exists') // 强制覆盖
// program
//   .command('config [value]') // config 命令
//   .description('inspect and modify the config')
//   .option('-g, --get <key>', 'get value by key')
//   .option('-s, --set <key> <value>', 'set option[key] is value')
//   .option('-d, --delete <key>', 'delete option by key')
//   .action((value, keys) => {
//     // value 可以取到 [value] 值，keys会获取到命令参数
//     console.log(value, keys)
//   })

program
  .command('create [projectName]') // ao create
  .description('create a project')
  .alias('c') // 简写
  .option('-f, --force', 'overwrite target directory if it exists') // 强制覆盖
  .action((projectName, options) => {
    // 处理用户输入create 指令附加的参数
    require('../cmd/create')(projectName, options)
  })

program
  .command('add') // ao add
  .description('add new template')
  .alias('a') // 简写
  .action(() => {
    require('../cmd/add')()
  })

program
  .command('list') // ao list
  .description('check template list')
  .alias('l') // 简写
  .action(() => {
    require('../cmd/list')()
  })

program
  .command('remove') // ao rm
  .description('remove template')
  .aliases(['r', 'rm']) // 简写
  .action(() => {
    require('../cmd/remove')()
  })

const automatedHelp = `
${figlet.textSync('ao-cli', {
  font: Math.random() > 0.5 ? 'Alligator2' : '3D-ASCII',
  horizontalLayout: 'default',
  verticalLayout: 'default',
  width: 80,
  whitespaceBreak: true
})}

  Run ${chalk.cyan('ao <command> --help')} for detailed usage of given command.`

program.addHelpText('afterAll', automatedHelp)

// 解析用户执行时输入的参数
program.parseAsync(process.argv)

if (!program.args.length) {
  console.log(program.helpInformation())
  console.log(automatedHelp)
}
