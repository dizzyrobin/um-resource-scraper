const puppeteer = require('puppeteer');
const {user, password} = require('./key');

const WAIT_LONG = 5000;
const WAIT_NORMAL = 2000;
const WAIT_SHORT = 1000;

const UM_LOGIN_PAGE = 'https://entrada.um.es/cas/login';
const UM_AULA_PAGE = 'https://aulavirtual.um.es/portal/login';

const waitMs = async ms => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, ms);
  })
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
}

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

  // console.log('Printing the sites...');
  // sites.forEach(e => {
  //   console.log(JSON.stringify(e));
  // });

  return sites;

};

const closeBrowser = async () => {
  console.log('Closing the headless browser...');
  await browser.close();
}

module.exports.login = login;
module.exports.closeBrowser = closeBrowser;
module.exports.getSubjects = getSubjects;


  // console.log('Taking screenshot...');
  // await page.screenshot({path: 'example.png'});