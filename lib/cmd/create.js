const path = require('path')
const fs = require('fs-extra')
const chalk = require('chalk')
const exec = require('child_process').exec

const { loading } = require('../utils/loading')
const { chooseTemplate, resetInquirer, setInquirer } = require('../utils')
const templateData = require('../../template.json')

// 项目名是否存在, 存在需判断是否复写
const checkProjectName = async (projectName, options) => {
  // 获取当前工作目录
  const cwd = process.cwd()
  // 拼接得到项目目录
  const targetDirectory = path.join(cwd, projectName)
  // 判断目录是否存在
  if (fs.existsSync(targetDirectory)) {
    // 判断是否使用 --force 参数
    if (options.force) {
      // 删除重名目录(remove是个异步方法)
      await fs.remove(targetDirectory)
    } else {
      const isOverwrite = await setInquirer({
        name: 'isOverwrite', // 与返回值对应
        type: 'list', // list 类型
        message: 'Target directory exists, Please choose an action',
        choices: [
          { name: 'Overwrite', value: true },
          { name: 'Cancel', value: false }
        ]
      })
      // 选择 Cancel
      if (!isOverwrite) {
        console.log('Cancel')
        return
      } else {
        // 选择 Overwirte ，先删除掉原有重名目录
        await loading(
          `Removing ${projectName}, please wait a minute`,
          fs.remove,
          targetDirectory
        )
      }
    }
  }
}

const downloadTemplate = async options => {
  const { url, branch, projectName, } = options
  // git命令，远程拉取项目并自定义项目名
  const cmdStr = `git clone ${url} ${projectName} && cd ${projectName} && git checkout ${branch}`

  await loading(
    `Downloading ${projectName}, please wait a minute`,
    exec,
    cmdStr,
    (err) => afterDownload(err, projectName)
  )
}

const afterDownload = (err, projectName) => {
  if (err) {
    console.log(chalk.red(err))
    process.exit()
  }
  // 模板使用提示
  console.log(`
Successfully created project ${chalk.cyan(projectName)}
    
  cd ${chalk.cyan(projectName)}
  npm install
  npm run dev`)
}

/**
 * 选择模板 (无模板则新增模板, 存在模板则选择)
 * 判断是否有项目名称 (无则命名, 有无均判断是否存在)
 * 下载模板创建项目
 */
module.exports = async (projectName, options) => {
  let templates = templateData
  if (!Object.keys(templates).length) {
    const isAdd = await setInquirer({
      name: 'isAdd', // 与返回值对应
      type: 'list', // list 类型
      message: 'Template not exists, Please choose an action',
      choices: [
        { name: 'Add Template', value: true },
        { name: 'Cancel', value: false }
      ]
    })
    if (isAdd) {
      templates = await require('./add')(true)
      console.log('\r\n')
    } else {
      process.exit()
    }
  }

  // 选择模板
  let templateName = await chooseTemplate({ templates })
  // 是否存在项目名称
  if (!projectName) {
    projectName = await resetInquirer({ name: 'proName', type: 'input', message: 'Please input your project name' })
  }
  // 检查项目名称
  await checkProjectName(projectName, options)
  // 下载模板
  await downloadTemplate({ projectName, ...templateData[templateName] })
}
