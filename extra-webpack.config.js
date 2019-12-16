const { IgnorePlugin } = require('webpack');

module.exports = {
    plugins: [
        new IgnorePlugin(/^aws-sdk$/)
    ]
  };
