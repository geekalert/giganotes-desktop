const { IgnorePlugin } = require('webpack');

module.exports = {
    externals: {
        sqlite3: "require('sqlite3')",
        gigacore : "require('gigacore')"
    },
    plugins: [
        new IgnorePlugin(/^aws-sdk$/)
    ]
  };
