const fs = require('fs');
const puppeteer = require('puppeteer');
const fetch = require('node-fetch');

const WAIT_LONG = 2500;
const WAIT_NORMAL = 1000;
const WAIT_SHORT = 500;
const WAIT_VERYSHORT = 250;

const UM_LOGIN_PAGE = 'https://entrada.um.es/cas/login';
const UM_AULA_PAGE = 'https://aulavirtual.um.es/portal/login';
const UM_RESOURCE_PAGE = 'https://aulavirtual.um.es/access/content/group';

const RESOURCE_DOWNLOAD_FOLDER = './resources';

const getResourceLink = resource => `${UM_RESOURCE_PAGE}/${resource}/`;

const stringifyCookie = ({ name, value }) => `${name}=${value}`;

const streamCompletion = stream =>
  new Promise((resolve, reject) => {
    stream.on('end', resolve)
    stream.on('finish', resolve)
    stream.on('error', reject)
  });

const waitMs = async ms => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
};

const login = async (user, password) => {
  console.log('Starting the headless browser...');
  const browser = await puppeteer.launch();

  console.log('Loading the login page...');
  const page = await browser.newPage();
  await page.goto(UM_LOGIN_PAGE);

  console.log('Waiting for JS...');
  await waitMs(WAIT_LONG);

  console.log('Setting the "username" and "password" fields...');
  const pageForm = await page.$('#fm1');

  if (pageForm === null) {
    throw new Error('Couldn\'t find the page form');
  }

  const pageUsername = await pageForm.$('#username');
  const pagePassword = await pageForm.$('#password');
  const pageSubmit = await pageForm.$('.btn-submit');

  if (pageUsername === null || pagePassword === null || pageSubmit === null) {
    throw new Error('Cound\'t find the user/password/submit elements');
  }

  console.log('Logging in...');
  await pageUsername.type(user);
  await pagePassword.type(password);
  await pageSubmit.click();
  await waitMs(WAIT_LONG);

  return {browser, page};
};

const getSubjects = async page => {
  await page.goto(UM_AULA_PAGE);

  console.log('Waiting for the JS...');
  await waitMs(WAIT_LONG);

  console.log('Getting the subjects...');
  const leftCol = await page.$('.moresites-left-col');

  if (leftCol === null) {
    throw new Error('Couldn\'t find the left column...');
  }

  const sites = await leftCol.$$('.fav-title');

  if (leftCol === null) {
    throw new Error('Couldn\'t find the fav-title...');
  }

  for (const i in sites) {
    if (Object.prototype.hasOwnProperty.call(sites, i)) {
      const site = await sites[i].$eval('a', e => {
        const resourceLink = e.getAttribute('href').split('/');
        const title = e.getAttribute('title');

        return {
          resource: resourceLink[resourceLink.length - 1],
          title,
        };
      });
      sites[i] = site;
    }
  }

  // TODO: Handle error if a non-unique resource is found
  return sites
    .filter((value, index) => sites.findIndex(e => e.resource === value.resource) === index)
    .sort((a, b) => a.title > b.title ? 1 : -1);
};

const scrapResources = async page => {
  const files = await page.$$('li.file');
  const folders = await page.$$('li.folder');

  const fileLinks = [];
  for (const i in files) {
    fileLinks.push(await files[i].$eval('a', a => a.href));
  }

  const folderLinks = [];
  for (const i in folders) {
    folderLinks.push(await folders[i].$eval('a', a => a.href));
  }

  return {
    files: fileLinks,
    folders: folderLinks,
  };
};

// TODO: Use the power of async! Remove those awaits inside the loop!
const getAllLinks = async (page, resourceLink) => {
  let allLinks = [];

  console.log("Getting the page: " + resourceLink);

  const resources = await scrapResources(page);

  resources.files.forEach(f => allLinks.push(f));
  for (const f of resources.folders) {
    await page.goto(f);
    await waitMs(WAIT_SHORT);
    const res = await getAllLinks(page, f);
    page = res.page;
    allLinks = allLinks.concat(res.links);
  }

  return {
    page,
    links: allLinks,
  };
}

const formatLink = link => {
  // TODO: Remove that magic number
  return link
    .replace(/%20/g, '-')
    .split('/')
    .slice(6) // Why 6? Good question! Because of  ['https:', '', 'aulavirtual.um.es', 'access', 'content', 'group'] has a length of 6.
};

const getResources = async (browser, resource) => {
  console.log('Getting resources...');
  const resourceLink = getResourceLink(resource);
  const page = await browser.newPage();
  await page.goto(resourceLink);
  await waitMs(WAIT_SHORT);

  console.log('Scrapping page...');
  const {links} = await getAllLinks(page, resourceLink);

  console.log('Links found!');
  const formattedLinks = links.map(l => ({url: l, formatted: formatLink(l)}));

  await page.close();

  return formattedLinks;
};

const closeBrowser = async browser => {
  console.log('Closing the headless browser...');
  await browser.close();
};

const createFolderHierarchy = formatted => {
  let path = RESOURCE_DOWNLOAD_FOLDER;
  for (const p of formatted) {
    path += `/${p}`;
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }
  }

  return path;
};

const downloadList = async (cookies, list) => {
  for (const l of list) {
    const {url, formatted} = l;
    console.log(`Downloading: ${url}`);

    const res = await fetch(url, {
      headers: {
        Cookie: cookies,
        cookie: cookies, // TODO: Remove?
      },
    });

    if (res.status !== 200) {
      throw new Error(`Unexpected response code ${res.status}`);
    }

    const folder = createFolderHierarchy(formatted.slice(0, formatted.length - 1));
    const fileName = `${folder}/${formatted[formatted.length - 1]}`;
    const file = fs.createWriteStream(fileName);
    await streamCompletion(res.body.pipe(file));
  }
};

const getCookies = async page => {
  const cookies = await page.cookies();
  const cookiesString = cookies.map(c => stringifyCookie(c)).reduce((prev, curr) => `${curr}; ${prev}`, '');

  return cookiesString;
};

module.exports.login = login;
module.exports.closeBrowser = closeBrowser;
module.exports.getSubjects = getSubjects;
module.exports.getResources = getResources;
module.exports.downloadList = downloadList;
module.exports.getCookies = getCookies;
