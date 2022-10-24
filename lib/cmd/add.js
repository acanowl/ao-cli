const fs = require('fs')
const Inquirer = require('inquirer')

const createTable = require('../utils/table')
const templates = require('../../template.json')
const path = require('path')

const writeFile = () => {
  // 把模板信息写入template.json
  const ts = { "v3": { "url": "https://github.com/acanowl/ao-v3-template.git", "branch": "main", "description": "test" } }
  fs.writeFile(path.join(__dirname, '../../template.json'), JSON.stringify(ts), 'utf-8', err => {
    console.log(err, 'err')
  })
}

// TODO 模板名称 地址 分支 描述
// 判断地址名称是否重复
module.exports = () => {
  // createTable(template)
  // console.log(path.join(__dirname, '../../template.json'))
  writeFile()
}