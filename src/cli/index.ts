import { cac } from 'cac'

import { name, version } from '../../package.json'

import checkNpmVersions from '@/lib/checkNpmVersions'

const [CLI_NAME, CLI_VERSIONS] = [name, version]
const cli = cac(CLI_NAME)

cli
  .command('ver [...nodeName]', '检查依赖版本')
  .option('-l, --list', '所有版本')
  .option('-r, --registry [path]', 'npm源')
  .action(checkNpmVersions)

cli.version(CLI_VERSIONS).help().parse()
