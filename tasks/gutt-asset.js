const gutt = require('gutt')
const browserStringifier = require('gutt-browser-stringifier')
const JSAsset = require('parcel-bundler/src/assets/JSAsset')

module.exports = class GuttAsset extends JSAsset {
  async parse(code) {
    this.contents = gutt.parse(code, this.name).stringifyWith(browserStringifier)

    return await super.parse(this.contents)
  }
}
