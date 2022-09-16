const chalk = require('chalk')

function dim() {
  if (!process.env.HIDE_DEPLOY_LOG) {
    console.log(chalk.dim.call(chalk, ...arguments))
  }
}

function cyan() {
  if (!process.env.HIDE_DEPLOY_LOG) {
    console.log(chalk.cyan.call(chalk, ...arguments))
  }
}

function yellow() {
  if (!process.env.HIDE_DEPLOY_LOG) {
    console.log(chalk.yellow.call(chalk, ...arguments))
  }
}

function green() {
  if (!process.env.HIDE_DEPLOY_LOG) {
    console.log(chalk.green.call(chalk, ...arguments))
  }
}

function displayResult(name: string, result) {
  if (!result.newlyDeployed) {
    yellow(`Re-used existing ${name} at ${result.address}`)
  } else {
    green(`${name} deployed at ${result.address}`)
  }
}

const chainName = (chainId) => {
  switch (chainId) {
    case 3:
      return 'Ropsten'
    case 4:
      return 'Rinkeby'
    case 42:
      return 'Kovan'
    case 31337:
      return 'HardhatEVM'
    case 80001:
      return 'Mumbai'
    default:
      return 'Unknown'
  }
}

module.exports = {
  dim,
  cyan,
  yellow,
  green,
  displayResult,
  chainName
}
