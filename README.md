# ng2-polymer-static-gen

This project is a generator for make the static directives to build the polymer elements with angular2-cli.

There is already some elements that have been generated [here](https://github.com/hydraslay/ng2-polymer-static) you can use.

## Quick start

1. Install all dependencies.

`npm install
bower install`

2. Check src/index.html and bower.json if there is already including the polymer element you want.
  If not, add them just like the way you use in your app.
  
  - in src/index.html:
`<link rel="import" href="assets/bower_components/paper-input/paper-input.html">`
  - in bower.json, run:
`bower install --save paper-input`

3. Run the server

`ng serve`

4. See "localhost:4200" , input the name of the element 
To generate other directives, 
import the element by adding to index.html
input the name of element in generater page
generate code and save to file.

## Development server
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

