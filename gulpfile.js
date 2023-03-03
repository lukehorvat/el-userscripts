const gulp = require('gulp');
const concat = require('gulp-concat');
const sort = require('gulp-sort');
const { PassThrough } = require('node:stream');
const Vinyl = require('vinyl');
const merge = require('merge2');
const del = require('del');

const userscripts = ['greypal-querybot-enhancer', 'players-online-enhancer'];

const gulpTasks = userscripts.reduce((obj, userscript) => {
  return { ...obj, ...userscriptTasks(userscript) };
}, {});

exports.clean = gulp.parallel(
  ...userscripts.map((userscript) => gulpTasks[`${userscript}:clean`])
);

exports.build = gulp.parallel(
  ...userscripts.map((userscript) =>
    gulp.series(
      gulpTasks[`${userscript}:clean`],
      gulpTasks[`${userscript}:build`]
    )
  )
);

exports.watch = gulp.parallel(
  ...userscripts.map((userscript) => gulpTasks[`${userscript}:watch`])
);

function userscriptTasks(userscript) {
  const srcDir = `${userscript}/src`;
  const destDir = `${userscript}/dist`;
  const tasks = {
    [`${userscript}:clean`]() {
      return del([destDir]);
    },

    [`${userscript}:build`]() {
      return merge(
        gulp.src(`${srcDir}/.meta.js`),
        gulp.src(`${srcDir}/**/!(.meta|.main).js`).pipe(sort()),
        gulp.src(`${srcDir}/.main.js`),
        vinylAdapter(
          new Vinyl({
            path: 'run-main.js',
            contents: Buffer.from(`modulejs.require('main');\n`),
          })
        )
      )
        .pipe(concat('script.user.js'))
        .pipe(gulp.dest(destDir));
    },

    [`${userscript}:watch`]() {
      gulp.watch(
        srcDir,
        { ignoreInitial: false },
        gulp.series(tasks[`${userscript}:clean`], tasks[`${userscript}:build`])
      );
    },
  };

  return tasks;
}

function vinylAdapter(file) {
  if (!Vinyl.isVinyl(file)) {
    throw new Error('The specified file is not a Vinyl.');
  }

  const stream = new PassThrough({ objectMode: true });
  stream.end(file);
  return stream;
}
