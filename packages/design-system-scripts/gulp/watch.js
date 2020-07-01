/**
 * These watch tasks enable a powerful developer workflow where changes you
 * make to a component, a component's example code, or the documentation will
 * automatically be reflected in the browser when the changes are saved.
 */
const gulp = require('gulp');
const path = require('path');
const { logTask } = require('./common/logUtil');
const { compileSourceSass, compileDocsSass } = require('./sass');
const { copyAll, compileJs } = require('./build');
const { generatePages, copySourceAssets, copyDocsAssets } = require('./docs');
const { extractReactProps, extractReactExamples } = require('./docs/extractReactData');

// Use chokidar instance under gulp.watch to expose `path` of changed files
// https://gulpjs.com/docs/en/api/watch/#chokidar-instance
function watch(globs, task) {
  const watcher = gulp.watch(globs);

  watcher.on('change', function (path) {
    task(path);
  });
  watcher.on('add', function (path) {
    task(path);
  });
  watcher.on('unlink', function (path) {
    task(path);
  });
}

async function watchSource(sourceDir, docsDir, options, browserSync) {
  const src = path.join(sourceDir, 'src');

  // Source package assets
  gulp.watch([`${src}/{images,fonts}/*`, `${src}/**/*.json`], async () => {
    await copyAll(sourceDir);
    await copySourceAssets(sourceDir, docsDir);
  });

  // Source package Sass files
  gulp.watch(`${src}/**/*.scss`, async () => {
    await copyAll(sourceDir);
    await compileSourceSass(sourceDir);
    await compileDocsSass(docsDir, options, browserSync);
  });

  watch([`${src}/**/*.{jsx,tsx}`, `!${src}/**/*{.test,.spec}.{js,jsx,ts,tsx}`], async (path) => {
    await compileJs(sourceDir);
    await extractReactProps(sourceDir, options);
    await generatePages(sourceDir, docsDir, options, path);
  });
}

async function watchDocs(sourceDir, docsDir, options, browserSync) {
  const src = path.join(docsDir, 'src');

  // Docs assets
  gulp.watch(`${src}/{images,fonts}/*`, async () => {
    await copyDocsAssets(docsDir);
  });

  // Docs Sass files
  gulp.watch([`${src}/**/*.scss`, `!${src}/**/*.docs.scss`], async () => {
    await compileDocsSass(docsDir, options, browserSync);
  });

  // Docs Markdown files, KSS documentation files
  watch([`${src}/**/*.{md,mdx,docs.scss}`], async (path) => {
    await generatePages(sourceDir, docsDir, options, path);
  });

  // Docs HTML/React examples
  watch([`${src}/**/*.example.{html,jsx,tsx}`], async (path) => {
    await extractReactExamples(docsDir, options);
    await generatePages(sourceDir, docsDir, options, path);
  });
}

module.exports = {
  async watchDocs(sourceDir, docsDir, options, sync) {
    logTask('👀 ', 'Transpiling + watching files for future changes');

    watchSource(sourceDir, docsDir, options, sync);
    watchDocs(sourceDir, docsDir, options, sync);
  },
};