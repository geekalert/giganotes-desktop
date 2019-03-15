const { IgnorePlugin } = require('webpack');

module.exports = {
    externals: {
        sqlite3: "require('sqlite3')",
        nativeaddon: "require('nativeaddon')"
    },
    plugins: [
        new IgnorePlugin(/^aws-sdk$/)
    ]
  };