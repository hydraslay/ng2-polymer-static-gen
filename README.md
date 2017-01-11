# ng2-polymer-static-gen

This project is a generator for make the static directives to build the polymer elements with angular2-cli.

There is already some elements that have been generated [here](https://github.com/hydraslay/ng2-polymer-static) you can use.

## Quick start

1. Install all dependencies.

 `npm install`

 `bower install`

2. Check src/index.html and bower.json if there is already including the polymer element you want.
  If not, add them just like the way you use in your app.
  
  - in src/index.html:
 `<link rel="import" href="assets/bower_components/paper-input/paper-input.html">`
  - in bower.json, run:
 `bower install --save paper-input`

3. Run the server

 `ng serve`

4. See "http://localhost:4200/" , input the name of the element and press button "Generate Code".

5. Copy the code to save a file named "xxxxx.directives.ts", just like the first line suggested.
6. Include the directive file to your module.ts.

 `import { PaperInput } from './polymer/paper-input-directives';`
 
 and add the directive as 
  `declarations: [`
  `   ...`
  `   PaperInput,`
  `   ...`
 
 see the [whole sample project of how to use static directives](https://github.com/hydraslay/ng2-polymer-static)
 
