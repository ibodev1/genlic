#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import inquirer from 'inquirer';
import chalk from 'chalk';
import fetch from 'node-fetch';
export interface License {
  key: string;
  name: string;
  spdx_id: string;
  url: string;
  node_id: string;
}

let licenses: License[] = [];
const licenseNames: string[] = [];

const getLicenseList = async () => {
  try {
    const response: License[] | unknown = await fetch('https://api.github.com/licenses').then(async res => res.json());
    if (Array.isArray(response)) {
      licenses = response;
      response?.forEach((lic: License) => {
        licenseNames.push(lic.name);
      });
    }
  } catch (error) {
    throw new Error(chalk.red(error));
  }
};

const getLicense = async (licenseName: string): Promise<License | undefined> => {
  try {
    const license: License | undefined = licenses.find((lic: License) => lic.name === licenseName);
    return license;
  } catch (error) {
    throw new Error(chalk.red(error));
  }
};

const getGithubDetails = async (userName: string) => {
  try {
    const githubDetails: any | unknown = await fetch(`https://api.github.com/users/${userName}`).then(async (res: any) => res.json());
    return githubDetails;
  } catch (error) {
    throw new Error(chalk.red(error));
  }
};

const createLicenseFile = async (license: License, userName: string) => {
  try {
    const licenseDetails: any | unknown = await fetch(license.url).then(async res => res.json());
    const year = new Date().getFullYear();
    const githubDetails = await getGithubDetails(userName);
    const licenseBody = licenseDetails?.body.replace('[year]', year).replace('[fullname]', githubDetails?.name ?? userName);
    await fs.writeFile(path.join(process.cwd(), 'LICENSE'), licenseBody);
    return licenseDetails;
  } catch (error) {
    throw new Error(chalk.red(error));
  }
};

const writePackageJson = async (license: License) => {
  try {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJsonFile = await fs.readFile(packageJsonPath, { encoding: 'utf-8' });
    const packageJson = JSON.parse(packageJsonFile);
    packageJson.license = license.spdx_id;
    await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));
  } catch (error: any) {
    if (error.path) {
      console.error(chalk.red('Not exist package.json : ' + error.path));
      throw new Error(chalk.red(error));
    } else {
      throw new Error(chalk.red(error));
    }
  }
};

const infoMessage = (licenseDetails: any) => {
  const messageTemplate = `
${chalk.green(">")} ${chalk.bold(chalk.white(licenseDetails.name))} - [${chalk.bold(chalk.red(licenseDetails.spdx_id))}]
${chalk.green(">")} ${chalk.gray(licenseDetails.description)}
${chalk.green(">")} ${chalk.green(licenseDetails.html_url)}
  `;
  console.log(messageTemplate);
}

(async () => {
  try {
    await getLicenseList();
    console.log(chalk.yellow(chalk.green('Gen') + 'erate ' + chalk.green('Lic') + 'ense ' + chalk.green(':)')));
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'githubUserName',
        message: 'Github username?',
        default: 'ibodev1',
      },
      {
        type: 'list',
        name: 'licenseName',
        message: 'Select license...',
        choices: licenseNames,
        default: 'MIT License',
      },
      {
        type: 'confirm',
        name: 'packageJson',
        message: 'Write package.json',
        default: true,
      },
    ]);
    const license: License = await getLicense(answers.licenseName) ?? {
      key: '',
      name: '',
      node_id: '',
      spdx_id: '',
      url: '',
    };
    const licenseDetails = await createLicenseFile(license, answers.githubUserName);
    if (answers.packageJson) {
      await writePackageJson(license);
    }
    infoMessage(licenseDetails);
  } catch (error: any) {
    const error_ = error.isTtyError ? new Error(chalk.red('isTtyError')) : new Error(chalk.red(error));
    throw error_;
  }
})();
