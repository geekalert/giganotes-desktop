const { IgnorePlugin } = require('webpack');

module.exports = {
    externals: {
        sqlite3: "require('sqlite3')"
    },
    plugins: [
        new IgnorePlugin(/^aws-sdk$/)
    ]
  };