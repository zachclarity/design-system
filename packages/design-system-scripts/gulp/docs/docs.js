/**
 * This task group generates our design system documentation. It handles things
 * like parsing our CSS/JSX comments, generating JSON data files, and ultimately
 * generating the HTML files which get published as the public site.
 */
const copyAssets = require('../common/copyAssets');
const cleanDist = require('../common/cleanDist');
const generatePages = require('./generatePages');
const getPackageJson = require('../common/getPackageJson');
const gulp = require('gulp');
const merge = require('gulp-merge-json');
const parseReactFile = require('./parseReactFile');
const path = require('path');
const streamPromise = require('../common/streamPromise');
const { CORE_PACKAGE_NAME } = require('../common/constants');
const { logTask } = require('../common/logUtil');
const { last } = require('lodash');
const { runWebpackStatically } = require('./runWebpackStatically');

const reactDataDirectory = `tmp/data`;
const reactDataFilename = 'react-doc.json';
const reactDataPath = path.resolve(reactDataDirectory, reactDataFilename);

/**
 * Parses our JSX files for relevant documentation information and stores it for
 * our other tasks to read later
 */
async function extractReactDocs(sourcePackageDirs, rootPath) {
  logTask('🌪 ', 'Generating React propType documentation and grabbing raw example code');

  const sources = sourcePackageDirs.map(dir => [`${dir}/src`]);
  const sourcesGlob = `{${sources.join(',')}}`;

  return streamPromise(
    gulp
      .src([`${sourcesGlob}/**/*.jsx`, `!${sourcesGlob}/**/*.test.jsx`])
      .pipe(parseReactFile(rootPath))
      .pipe(merge({ fileName: reactDataFilename }))
      .pipe(gulp.dest(reactDataDirectory))
  );
}

/**
 * Copies all the fonts and images from the source package and the core design system package
 */
function copySourcePackageAssets(sourcePackageDir, docsPackageDir) {
  logTask('🏞 ', `Copying fonts and images from source package into ${docsPackageDir}/dist`);
  return copyAssets(sourcePackageDir, docsPackageDir);
}

/**
 * Copies all the fonts and images from our docs packages
 */
function copyDocsPackageImages(docsPackageDir) {
  logTask('🏞 ', `Copying fonts and images from docs packages into ${docsPackageDir}/dist`);
  return copyAssets(docsPackageDir);
}

module.exports = {
  /**
   * Builds the docs site
   *
   * Note that the source package must be built before this in order to ensure
   * that the documentation reflects the most recent version of the source.
   */
  async buildDocs(sourcePackageDir, docsPackageDirs, options) {
    let message = 'Starting the documentation generation task';
    if (options.rootPath !== '') {
      message += ` with a root path of ${options.rootPath}`;
    }
    logTask('🏃 ', message);

    const pkg = await getPackageJson(sourcePackageDir);

    if (!options.githubUrl) {
      options.githubUrl = `https://github.com/${pkg.repository}`;
    }

    // This is the docs package that we will receive the output dist folder.
    const docsPackageDir = last(docsPackageDirs);
    const sourcePackageDirs =
      pkg.name === CORE_PACKAGE_NAME
        ? [sourcePackageDir]
        : [sourcePackageDir, `node_modules/${CORE_PACKAGE_NAME}`];

    await cleanDist(docsPackageDir);
    await extractReactDocs(sourcePackageDirs, options.rootPath);
    await generatePages(sourcePackageDirs, docsPackageDir, reactDataPath, options);
    await runWebpackStatically(sourcePackageDir, docsPackageDir, options.rootPath);
    await copySourcePackageAssets(sourcePackageDir, docsPackageDir);
    await copyDocsPackageImages(docsPackageDir);
  }
};
