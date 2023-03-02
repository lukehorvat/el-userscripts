const gulp = require('gulp');
const concat = require('gulp-concat');
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
      return gulp
        .src(`${srcDir}/*.js`)
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
