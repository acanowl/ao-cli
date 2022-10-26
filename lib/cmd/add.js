const { loading, sleep } = require('../utils/loading')
const { writeInFile } = require('../utils/file')
const { resetInquirer, setInquirer } = require('../utils')
const templateData = require('../../template.json')

// 设置模板名称
const setTemplateName = async () => {
  const templateName = await resetInquirer({ name: 'templateName', type: 'input', message: 'Please input template name' })
  return await checkTemplateNameRepeat(templateName)
}

// 判断模板名称是否重复
const checkTemplateNameRepeat = async temName => {
  if (templateData[temName]) {
    const isRepeat = await setInquirer({
      name: 'isRepeat', // 与返回值对应
      type: 'list', // list 类型
      message: 'Template name exists, Please choose an action',
      choices: [
        { name: 'Rename', value: true },
        { name: 'Cancel', value: false }
      ]
    })
    if (isRepeat) {
      temName = await setTemplateName()
    } else {
      process.exit()
    }
  }
  return temName
}

const setTemplateUrl = async () => {
  const reg = /^(https?|ftp)\:\/\/([^/]+)\/([^/]+)/
  let url = await resetInquirer({
    name: 'url',
    type: 'input',
    message: 'Please input Git https url',
    rules: u => reg.test(u)
  })
  url = url.replace(/[\u0000-\u0019]/g, '')
  const branch = await resetInquirer({ name: 'branch', type: 'input', message: 'Please input branch', default: 'master' })
  return { url, branch }
}

module.exports = async (hasReturn = false) => {
  const templateName = await setTemplateName()
  const { url, branch } = await setTemplateUrl()
  const description = await setInquirer({ name: 'description', type: 'input', message: 'Please input your template description' })
  const tems = await writeInFile({ [templateName]: { url, branch, description } })
  hasReturn && await loading('Writing, please wait a minute', sleep, 1500)
  return tems
}