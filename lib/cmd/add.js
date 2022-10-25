const fs = require('fs')
const Inquirer = require('inquirer')
const createTable = require('../utils/table')
const { loading, sleep } = require('../utils/loading')
const templates = require('../../template.json')
const path = require('path')
const chalk = require('chalk')

// 设置模板名称
const setTemplateName = async () => {
  let { templateName } = await new Inquirer.prompt([
    { name: 'templateName', type: 'input', message: 'Please input template name' }
  ])
  return await checkTemplateNameRepeat(templateName)
}

// 判断模板名称是否重复
const checkTemplateNameRepeat = async temName => {
  if (!temName) {
    return await setTemplateName()
  }
  if (templates[temName]) {
    const { isRepeat } = await new Inquirer.prompt([
      {
        name: 'isRepeat', // 与返回值对应
        type: 'list', // list 类型
        message: 'Template name exists, Please choose an action',
        choices: [
          { name: 'Rename', value: true },
          { name: 'Cancel', value: false }
        ]
      }
    ])
    if (isRepeat) {
      temName = await setTemplateName()
    } else {
      process.exit()
    }
  }
  return temName
}

// 把模板信息写入template.json
const writeFile = async tem => {
  const [templateName] = Object.keys(tem)
  const templateList = { ...templates, ...tem }
  fs.writeFile(path.join(__dirname, '../../template.json'), JSON.stringify(templateList), 'utf-8', err => {
    if (err) {
      console.log(chalk.red.bold(err))
      console.log('Please try again ~')
      process.exit()
    } else {
      console.log(`\r\nSuccessfully add template ${chalk.cyan(templateName)}\r\n`)
      createTable(templateList)
    }
  })
  return templateList
}

// TODO 缺少校验（github地址，分支）
module.exports = async (hasReturn = false) => {
  // const ts = { "v3": { "url": "https://github.com/acanowl/ao-v3-template.git", "branch": "main", "description": "test" } }
  let templateName = await setTemplateName()
  const { url, branch, description } = await new Inquirer.prompt([
    { name: 'url', type: 'input', message: 'Please input Git https url' },
    { name: 'branch', type: 'input', message: 'Please input branch', default: 'master' },
    { name: 'description', type: 'input', message: 'Please input your template description' }
  ])
  const tems = await writeFile({ [templateName]: { url, branch, description } })
  hasReturn && await loading('Writing, please wait a minute', sleep, 1500)
  return tems
}