const { writeOutFile } = require('../utils/file')
const { chooseTemplate } = require('../utils')

module.exports = async () => {
  const templateName = await chooseTemplate({ message: 'Preparing to remove, Please choose an action' })
  writeOutFile(templateName)
}