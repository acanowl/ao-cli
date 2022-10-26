
const fs = require('fs')
const createTable = require('../utils/table')
const templateData = require('../../template.json')
const path = require('path')
const chalk = require('chalk')

const failCallback = err => {
  console.log(chalk.red.bold(err))
  console.log('Please try again ~')
  process.exit()
}

// 把模板信息写入template.json
const writeFile = template => {
  return new Promise((resolve, reject) => {
    fs.writeFile(path.join(__dirname, '../../template.json'), JSON.stringify(template), 'utf-8', err => {
      if (err) {
        reject()
      } else {
        resolve()
      }
    })
  })
}

/**
 * 写入模板文件
 * @param {*} templateItem 
 * @returns 
 */
const writeInFile = async templateItem => {
  const [templateName] = Object.keys(templateItem)
  const templateList = { ...templateData, ...templateItem }
  try {
    await writeFile(templateList)
    console.log(`\r\nSuccessfully add template ${chalk.cyan(templateName)}\r\n`)
    createTable(templateList)
  } catch (error) {
    failCallback(error)
  }
  return templateList
}

/**
 * 移除指定模板
 * @param {*} templateName 
 * @returns 
 */
const writeOutFile = async templateName => {
  delete templateData[templateName]
  try {
    await writeFile(templateData)
    console.log(`\r\nSuccessfully remove template ${chalk.cyan(templateName)}\r\n`)
    if (Object.keys(templateData).length) {
      createTable(templateData)
    } else {
      console.log(chalk.red('Template not exist!\r\n'))
    }
  } catch (error) {
    failCallback(error)
  }
  return templateData
}

module.exports = { writeInFile, writeOutFile }