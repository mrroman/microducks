Simple application to get random restaurants from the Wrocław city.  
Powerd by MicroDucks.


Development
-----------

**Instalation**:

  - `nvm install`
  - `npm install`
  - `npm start`

**Devlopment**:

`npm start` - Serve project at localhost:9000


Testing
-----------
`gulp test` - run tests (mocha + chai) from "./src/js/\*\*/\*.spec.js"  
`gulp tdd` - watch changes in the *.js files and rerun tests
npm test, npm run tdd - task aliases


Deploy
-----------
`npm run distro` - Create dist/ folder. Ready to upload on the web server. (required npm version 2.x)
