const { IgnorePlugin } = require('webpack');

module.exports = {
    externals: {
        electron: "require('electron')",
        buffer: "require('buffer')",
        child_process: "require('child_process')",
        crypto: "require('crypto')",
        events: "require('events')",
        fs: "require('fs')",
        http: "require('http')",
        https: "require('https')",
        assert: "require('assert')",
        dns: "require('dns')",
        net: "require('net')",
        os: "require('os')",
        path: "require('path')",
        querystring: "require('querystring')",
        readline: "require('readline')",
        repl: "require('repl')",
        stream: "require('stream')",
        string_decoder: "require('string_decoder')",
        url: "require('url')",
        util: "require('util')",
        zlib: "require('zlib')",
        ffi: "require('ffi')",
        sqlite3: "require('sqlite3')"
    },
    plugins: [
        new IgnorePlugin(/^aws-sdk$/)
    ]
  };