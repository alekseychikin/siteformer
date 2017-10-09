import 'regenerator-runtime/runtime'

export function importAsync(path, name) {
  return new Promise(resolve => {
    const script = document.createElement('script')

    script.addEventListener('load', () => {
      const module = require(name)
      resolve(module && module.__esModule ? module : { default: module })
    })

    script.src = path
    document.body.appendChild(script)
  })
}

export function importAsyncDefault(path, name) {
  return importAsync(path, name)
  .then(module => module.default)
}
