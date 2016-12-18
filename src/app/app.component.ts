import { Component, OnInit, ViewChild } from '@angular/core';
import { PolymerElement } from '@vaadin/angular2-polymer';
import { PolymerDirectiveGenerator } from './polymer-directive-generator';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'polymer-directive-generator, install component previously';
  myValue: string = 'vaadin-combo-box';
  sourceCode :string = "";
  generator = new PolymerDirectiveGenerator();
  constructor() {
    this.generator = new PolymerDirectiveGenerator();
  }
  // Add some example data as an array.
  ngOnInit() {

    this.sourceCode = this.generator.generateDirectivesCode(this.myValue);
  }
  generateCode(event) {
    this.sourceCode = "...";
    event.preventDefault();
    if (this.myValue == null || this.myValue == "") {
      alert("must a component name");
    } else {
      this.sourceCode = this.generator.generateDirectivesCode(this.myValue);
    }
  }
  copyToClipboard() {
     window.prompt("Copy to clipboard: Ctrl+C, Enter", this.sourceCode);
  }
  selectText( ) {

        var node = document.getElementById( 'divCode' );

        /*if ( document.selection!==undefined ) {
            var range = document.body.createTextRange();
            range.moveToElementText( node  );
            range.select();
        } else*/ 
        if ( window.getSelection ) {
            var range = document.createRange();
            range.selectNodeContents( node );
            window.getSelection().removeAllRanges();
            window.getSelection().addRange( range );
        }else{
          alert("selection not avaliable");
        }
    }
}