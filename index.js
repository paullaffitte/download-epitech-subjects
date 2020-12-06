const puppeteer = require('puppeteer');
const fs = require('fs');
const getCookie = require('./getCookie');
const { getModules, getProjects, getFiles, } = require('./listFiles');
const download = require('./download');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setCookie(getCookie());

  const modules = await getModules(page);

  for (module of modules) {
    module.projects = await getProjects(page, module)

    for (project of module.projects) {
      project.files = await getFiles(page, project.url);
      console.log(project.name, project.files)
    }
  }

  await browser.close();

  fs.writeFileSync('./data.json', JSON.stringify(modules))
  await download(modules);
})();
