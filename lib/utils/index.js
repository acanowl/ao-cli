const chalk = require('chalk')
const Inquirer = require('inquirer')
const templateData = require('../../template.json')

const setInquirer = async options => {
  const { name } = options
  const result = await new Inquirer.prompt([options])
  return result[name]
}

const resetInquirer = async options => {
  const { rules = () => true, ...option } = options
  const returnResult = await setInquirer(option)
  if (!returnResult || /\s+/g.test(returnResult) || !rules(returnResult)) {
    await resetInquirer(options)
  }
  return returnResult
}

const chooseTemplate = async ({ templates, message = 'Please choose a template' }) => {
  const templateList = Object.keys(templates || templateData)
  if (!templateList.length) {
    console.log(chalk.red.bold('Template not exists'))
    process.exit()
  }
  const templateName = await setInquirer({ name: 'templateName', type: 'list', message, choices: templateList })
  return templateName
}

module.exports = { chooseTemplate, setInquirer, resetInquirer }