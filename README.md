# GigaNotes

[GigaNotes](https://giganotes.com) is an open source data management and note taking app.

![Giganotes](/docs/giganotes.png)

## Features

* Note-taking app with faster and handier operation
* Notes can be taken work both in online and offline
* Able to work without the server ('offline' mode)
* Synchronizes notes among all connected devices
* Works in both Windows and Linux 
* Powerful searching capabilites that allow to reach any note pretty fast
* Rich editor for texts including cross-references
* Authoritative content manager
* Works as resourceful personal wiki
* Has a [web version](https://web.giganotes.com) that works directly from the browser
* Has a [mobile version](https://play.google.com/store/apps/details?id=com.thetapad.app) for Android

## Build

Giganotes is an Electron-based application. In order to build it, [Node.js](https://nodejs.org) is required.

To build GigaNotes, dependencies should be installed

```bash
npm install
```

### Windows

To produce a windows binaries, please run

```bash
npm run electron:windows
```

### Linux

To produce a linux binaries, please run

```bash
npm run electron:linux
```

## Development 

To run Giganotes in development mode please use the command

```bash
npm start
```
