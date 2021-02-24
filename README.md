# ChemReg 2.0 User Interface

## Developer Setup

We are using the [vuejs webpack template](https://vuejs-templates.github.io/webpack).
Our target browser is Chrome, you may experience problems with other browsers.  


## Have these packages installed
[NodeJS](https://nodejs.org/en/download/) `v13.7.0` Check with `node -v`  
NPM `v6.13.6 ` NPM is installed with NodeJS. Check with `npm -v` 


## To get started:
  
### Launch Ketcher

1. navigate to location of Dockerfile `cd ketcher/`
2. `docker build --tag ketcher .`
2. `docker run -d -p xxxx:8002 --name ketcher ketcher` where `xxxx` is the port number that you want to serve Ketcher.
3. Ensure that you have an .env file with the Ketcher URL set.
    * `VUE_APP_KETCHER_URL=http://localhost:xxxx`

### Launch MarvinJS

To get MarvinJS running in the application:

1. Go to Chemaxon and create an account [here](https://pass.chemaxon.com/login).
2. Pull the docker image from Chemaxon
    * Go [here](https://chemaxon.com/products/marvin-js/download).
    * Click on the "DOCKER" tab near the middle of the page.
    * This link will give you the commands to pull the image after you log into the repository with your public API key, then
    * `docker pull hub.chemaxon.com/cxn-docker-release/chemaxon/mjs-webservice:latest`
3. The user license is pinned to the `#workshop_chemreg` channel in Slack, download it from there and put it in the "marvin" directory at the root of this repository.
4. To build the image, use the `Dockerfile` in the "marvin" directory:
    * `cd marvin`
    * `docker build --tag marvin .`
5. Run the Dockerfile as a container
    * `docker run -d -p xxxx:8080 --name marvin marvin` 
    * where `xxxx` is the port number that you want to serve MarvinJS.
6. Ensure that you have an .env file with the Marvin URL set at port `xxxx`.
    * `VUE_APP_MARVIN_URL=http://localhost:xxxx`
 
### Clone the VueJS source repository

  Then:  
  ```bash
  git clone https://github.com/Chemical-Curation/chemcurator_vuejs.git 
  cd chemcurator_vuejs
  npm install
  ```

Make a copy of `template.env` in project root and call it `.env`.
  ```bash
  npm run serve
  ```

### Compiles and minifies for production
```
npm run build
```

### Run your unit tests
```
npm run test:unit
```

### Run your end-to-end tests
```
npm run test:e2e
```

### Lints and fixes files
```
npm run lint
```
 

To test out new features or deploy in `production`:

1. pull latest code
2. `docker build --no-cache . -t chemreg`
3. `docker run -p xxxx:8080 -d -l chemreg-ui --restart=unless-stopped chemreg` <- where xxxx is any port you want the container to run on

