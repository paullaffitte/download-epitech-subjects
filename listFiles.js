const path = require('path');

async function getModules(page) {
  await page.goto('https://intra.epitech.eu/user/#!/notes/all');
  await page.waitForSelector('#user-module td')
  return await page.evaluate(_ => {
    return $('#user-module td a:not(.module_rating)').map((i, link) => ({
      name: link.innerText,
      url: link.href,
      year: link.href.match(/module\/([0-9]{4})/)[1]
    })).toArray()
  });
}

async function getProjects(page, module) {
  console.log(module)
  await page.goto(module.url);

  return await page.evaluate(_ => {
    return $('.item.project[data-project-title]').map((i, project) => ({
      name: project.dataset['projectTitle'],
      url: $(project).find('div.links a')[0].href.replace('#!/group', 'file/?format=json')
    })).toArray();
  });
}

async function getFiles(page, url) {
  await page.goto(url);

  const files = await page.evaluate(() =>  {
    const files = JSON.parse(document.querySelector("body").innerText);
    return Array.isArray(files) ? files : []
  });

  for (file of files) {
    if (file.type == 'd') {
      file.children = await getFiles(page, `https://intra.epitech.eu${file.fullpath}?format=json`);
    }
  }

  return files.map(({ fullpath, children }) => ({
    name: path.basename(fullpath),
    fullpath,
    children,
  }));
}

module.exports = {
	getModules,
	getProjects,
	getFiles,
};
