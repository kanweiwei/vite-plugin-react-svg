const ts = require("gulp-typescript");
const gulp = require("gulp");

exports.default = () => {
  return gulp
    .src("src/**/*.js")
    .pipe(
      ts({
        allowJs: true,
        target: "ES5",
        module: "commonjs",
      })
    )
    .pipe(gulp.dest("lib"));
};
