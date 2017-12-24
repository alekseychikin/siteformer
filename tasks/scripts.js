const Bundler = require('parcel-bundler')

module.exports = async () => {
	const bundle = new Bundler('./modules/GUI/src/app.js', {
		outDir: './modules/GUI/dist',
		watch: true,
		cache: false,
		hmr: false,
		production: false
	})
	bundle.addAssetType('gutt', require.resolve('./gutt-asset'))
	const compiledBundle = await bundle.bundle()
}
