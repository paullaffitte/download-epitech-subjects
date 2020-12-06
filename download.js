const mkdirp = require('mkdirp');
const request = require('request');
const fs = require('fs');
const getCookie = require('./getCookie');

async function doInNewDirectory(directory, callback) {
  const cwd = process.cwd();
  mkdirp.sync(directory);
  process.chdir(directory);

  await callback();

  process.chdir(cwd);
}

async function downloadFile(file) {
  if (file.children) {
    await doInNewDirectory(file.name, () => downloadFiles(file.children));
  } else {
    return new Promise((resolve, reject) => {
      console.log('downloaing', file.name, 'in', process.cwd())
      const writeStream = fs.createWriteStream(file.name);
      const jsonCookie = getCookie();
      const cookie = request.cookie(`${jsonCookie.name}=${jsonCookie.value}`);
      const sendReq = request.get({
        url: `http://intra.epitech.eu${file.fullpath}`,
        method: 'GET',
        headers: { Cookie: cookie }
      });

      const onError = err => {
        fs.unlink(file.name);
        return reject(err);
      }

      sendReq.on('response', (response) => {
        if (response.statusCode !== 200) {
          return reject('HTTP error: ' + response.statusCode);
        }
        sendReq.pipe(writeStream);
      });
      writeStream.on('finish', () => writeStream.close(resolve));

      sendReq.on('error', onError);
      writeStream.on('error', onError);
    });
  }
}

async function downloadFiles(files) {
  for (file of files) {
    await downloadFile(file);
  }
}

async function retreiveProjects(projects) {
  for (project of projects) {
    await doInNewDirectory(project.name, () => downloadFiles(project.files));
  }
}

async function retreiveModules(modules) {
  for (module of modules) {
    await doInNewDirectory(module.year, () => {
      return doInNewDirectory(module.name, () => retreiveProjects(module.projects));
    });
  }
}

async function retreiveFiles(modules) {
  try {
    mkdirp.sync('./downloads');
    process.chdir('./downloads');
    await retreiveModules(modules);

  } catch (e) {
    console.error('could not download files:', e);
  }
}

module.exports = retreiveFiles;
