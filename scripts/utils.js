/* eslint-disable no-plusplus */
/* eslint-disable no-unused-vars */
/* eslint-disable consistent-return */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const fs = require('fs-extra');

const writeToPath = async (directory, obj) => {
  if (Array.isArray(obj)) {
    await fs.ensureDir(directory);
    for (let i = 0; i < obj.length; i++) {
      const newDir = path.join(directory, `${i}`);
      await writeToPath(newDir, obj[i]);
    }
  } else if (typeof obj === 'object') {
    await fs.ensureDir(directory);
    for (const key of Object.keys(obj)) {
      const newDir = path.join(directory, key);
      await writeToPath(newDir, obj[key]);
    }
  } else if (typeof obj === 'string') {
    fs.writeFileSync(directory, obj);
  }
};

const readFromPath = async (directory) => {
  const pathExists = await fs.exists(directory);
  if (!pathExists) {
    return;
  }
  const dirStats = await fs.lstat(directory);
  if (!dirStats.isDirectory()) {
    const buf = await fs.readFile(directory);
    return buf.toString();
  }
  const files = await fs.readdir(directory);
  const accum = {};
  for (const fileName of files) {
    const fullPath = path.join(directory, fileName);
    const value = await readFromPath(fullPath);
    accum[fileName] = value;
  }
  return accum;
};

const writeEnvFile = async (envs, fileName = 'aws-exports.json') => {
  const envFile = path.join(__dirname, '..', 'outputs', fileName);
  await fs.ensureFile(envFile);
  fs.writeFile(envFile, envs);
};

const writeConfFile = async (envs, fileName = 'pinpoint/parameters.json') => {
  const envFile = path.join(__dirname, '..', 'resources', fileName);
  await fs.ensureFile(envFile);
  fs.writeFile(envFile, envs);
};

const copyFile = async (src, desc) => {
  fs.copyFile(src, desc);
};

module.exports = {
  writeEnvFile,
  writeConfFile,
  readFromPath,
  writeToPath,
  copyFile,
};
