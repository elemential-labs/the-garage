const Task = require('data.task')

const tryCatch = (f) => {
  try {
    return Task.of(f())
  } catch (e) {
    return Task.rejected(e)
  }
}

const log = x => {
  console.log(x)
  return x
}

module.exports = { tryCatch, log }
