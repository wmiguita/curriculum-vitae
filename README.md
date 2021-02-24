# curriculum-vitae
Simple static HTML generator with JS for personal CV display, works for any list of skills with progress of each one.

## Packages used
  * Bootstrap as design system
  * Nunjucks as template generator
  * SCSS as css "language"/transpiler, I don't know the correct name
  * Gulp to automate tasks like CSS transpiling, HTML generation

## Usage

1. First you need to know the file structure that was envisioned so "everything" works =P
```
root directory
|
└───src                     # source files and root folder of dev server #to be changed
     └───css                # css folder served
       └───theme.css        # * build, transpiled from gulp css task 
     └───data               # JSON file with the list of
       └───data.json        # this one also has also it's own structure
     └───js                 # place of all JS including vendor packages
       └───main.js          # extra JS
     └───pages              # each {page-name}.njk will generate a {page-name}.html on src
     └───scss               # for scss lovers
       └───theme.scss       # general design
       └───_variables.scss  # bootstrap variales
     └───pages              # each {page-name}.njk will generate a {page-name}.html on src
     └───templates          # .njk files with HTML common across all pages
       └───partials         # .njk files with small portions of HTML that keep repeating
```

2. to run dev server
```Bash
npm start
```

# ROADMAP ¯\_(ツ)_/¯

* refactor serverd root directory away from src to something else
* improve data import in gulp task
* make a deploy task on gulp to deploy
* bundle all JS and minify for production
*

# References

  * [Tutorial for nunjucks introductions] (https://zellwk.com/blog/nunjucks-with-gulp/ "Consulted tutorial")
  * [Bootstrap 5 beta] (https://getbootstrap.com/docs/5.0/getting-started/introduction/ "Bootstrap docs")
  * [Nunjucks Docs] (https://mozilla.github.io/nunjucks/api.html "Nunjucks API Docs")
