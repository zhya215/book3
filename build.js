var metalsmith = require('metalsmith')
var watch = require('metalsmith-watch')
var markdown = require('metalsmith-markdown')
var serve = require('metalsmith-serve')

metalsmith(__dirname)

    .use(markdown({
      smartypants: true,
      gfm: true,
      tables: true
    }))
    .use(watch({
      paths: {
        "${source}/**/*": true,
        "templates/**/*": "**/*.md",
      },
      livereload: true,
    }))
    .use(serve({port:8081}))
    .build(function(err) {
        if (err) throw err;
        console.log(err)
    });
