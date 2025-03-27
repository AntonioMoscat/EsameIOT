const path = require('path');
const _ = require('lodash');
const fs = require('fs');
const dummy = require('mongoose-dummy');
const appRoot = require('app-root-path');
require('@babel/register');

let allModels = {};

const docsDir = path.join(appRoot.toString(), './docs');
const entityDir = docsDir + '/entities';

if (!fs.existsSync(docsDir)) {
  fs.mkdirSync(docsDir);
}

fs.readdirSync(appRoot.toString() + '/src/api')
  .filter(f => !f.startsWith('_'))
  .map(f => ({
    name: f,
    module: path.join(appRoot.toString() + '/src/api', f)
  }))
  .filter(a => fs.statSync(a.module).isDirectory())
  .forEach(a => {
    if (fs.existsSync(path.join(a.module, '/model.js'))) {
      allModels[a.name] = require(path.join(a.module, '/model.js')).default;
    }
  });

const ignoredFields = ['_id', 'created_at', '__v', /detail.*_info/];
try {
  fs.mkdirSync(entityDir);
} catch (e) {
  console.log('Output directory already exists');
}

_.forEach(allModels, model => {
  let toWrite = '';
  let randomObject = dummy(model, {
    autoDetect: false,
    ignore: ignoredFields,
    returnDate: true
  });
  toWrite += JSON.stringify(randomObject, null, 2);

  fs.writeFile(path.join(entityDir, model.modelName + '.json'), toWrite, function (err) {
    if (err) {
      return console.log(err);
    }
    console.log(model.modelName + ' file was saved!');
  });
});
