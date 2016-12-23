# JSXHint Loader for Webpack

Use existing [jshint](https://github.com/webpack/jshint-loader/) and [jsx-loader](https://github.com/petehunt/jsx-loader) and configuration for preloader hinting.

## Usage

```

jshint: {
  //Options to jshint-loader https://github.com/webpack/jshint-loader
},
jsx: {
  //Options to jsx-loader https://github.com/petehunt/jsx-loader
}
preLoaders: [
  {
    test: /\.jsx?/,
    exclude: __dirname + '/node_modules',
    loader: 'jsxhint-loader'
  }]

```
