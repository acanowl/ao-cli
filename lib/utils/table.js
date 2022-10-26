const chalk = require('chalk')
const Table = require('cli-table')

const createTable = rows => {
  return new Table({
    head: ['name', 'description', 'branch'],
    colWidths: [30, 50, 20],
    style: { head: ['green'] },
    rows
  })
}

module.exports = template => {
  const templateList = Object.entries(template)

  if (templateList.length) {
    const rows = templateList.map(([name, { description, branch }]) => ([name, description, branch]))
    console.log(createTable(rows).toString())
  } else {
    console.log(chalk.red('Template not exist!\r\n'))
    console.log(`Please run ${chalk.cyan('ao add')} ~`)
  }
}