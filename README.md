# EquinoxDrive &middot; [![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://github.com/RihamMoh/EquinoxDrive/blob/main/LICENSE)

A personal cloud storage website called ExuinoxDrive was created with the intention of being altered by others and learning more about react JS development. However, this website can only be used with Linux.

## Features

- The frontend is developed with React JS.
- The backend is developed with Node.js.
- Use some Bootstrap CSS and other CSS files to get a pretty look.
- The code is written in a clean manner, and it is easy to understand and make changes to.
- well-organised component tree.

## Functions

- Get the names of all files and folders in the provided directory in the server.
- see information about files and folders in the provided server.
- Select multiple files and folders at once and be able to make changes.
- Travel through folders and be able to make changes.
- create, download, rename, remove, create new folders, and upload files to the server.

## User guide

We want to install some modules. For run this website. they are:

```
NodeJs
Npm ( must be 5.2 or above )
Mysql
Git
```

And Docker if needed.

### Installing Steps

1. After installing all requirements,make an empty directory for the app installation.And make it as the working directory.

```
mkdir equinox-drive-app
cd equinox-drive-app
```

2. Clone the 'EqunioxDrive' repository to the "equinox-drive-app' directory.

```
git clone https://github.com/RihamMoh/EquinoxDrive.git .
```

### For only use

Make sure the current directory is the newly created 'equinox-drive-app' directory.And run following command to build up:

```
API_LOCAL_EXPRESS_PORT=8008 API_LOCAL_WS_PORT=9999 APP_LOCAL_PORT=[EquinoxDrive website port] docker-compose up
```

If there are any problems downloading node_modules in frontend or backend, run **npm install --save-exact** in **[equinox-drive-app path]/app/** for frontend and **[equinox-drive-app path]/api/javascript/api/** for backend.

### For use and development

Make sure the current directory is the newly created 'equinox-drive-app' directory.And run following commands:

##### For backend

```
cd api/javascript/api/
npm install --save-exact
```

##### For frontend

```
cd app/
npm install --save-exact
```

Use the following command in the 'equinox-drive-app' directory to start the app:

```
sh run.sh
```
