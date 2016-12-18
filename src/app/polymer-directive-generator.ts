import { Directive, ElementRef, Injector, EventEmitter, forwardRef, Renderer, IterableDiffers, KeyValueDiffers, DefaultIterableDiffer, NgZone, } from '@angular/core';
import { FormControlName, NG_VALUE_ACCESSOR } from '@angular/forms';
import { __platform_browser_private__ } from '@angular/platform-browser';
import { PolymerElement } from '@vaadin/angular2-polymer';

var Polymer: any = (<any>window).Polymer;
/** Highlight the attached element in gold */
export class PolymerDirectiveGenerator {
    private transformName(name: string): string {
        if (name.length > 1)
            name = name.substring(0, 1).toUpperCase() + name.substring(1);
        if (name.length > 2) {
            let indice: number = name.indexOf('-');
            while (indice >= 0 && indice + 2 < name.length) {
                name = name.substring(0, indice) + name.charAt(indice + 1).toUpperCase() + name.substring(indice + 2);
                indice = name.indexOf('-');
            }
        }
        return name;
    }
    private transformNameVariable(name: string): string {        
        if (name.length > 2) {
            let indice: number = name.indexOf('-');
            while (indice >= 0 && indice + 2 < name.length) {
                name = name.substring(0, indice) + name.charAt(indice + 1).toUpperCase() + name.substring(indice + 2);
                indice = name.indexOf('-');
            }
        }
        return name;
    }
    generateDirectivesCode(name: string): string {
        const propertiesWithNotify: Array<any> = [];
        const arrayAndObjectProperties: Array<any> = [];
        const proto: any = Object.getPrototypeOf(document.createElement(name));
        if (proto.is !== name) {
            //throw new Error(`The Polymer element "${name}" has not been registered. Please check that the element is imported correctly.`);
            return `The Polymer element "${name}" has not been registered. Please check that the element is imported correctly.`;
        }
        const isFormElement: boolean = Polymer && Polymer.IronFormElementBehavior && proto.behaviors.indexOf(Polymer.IronFormElementBehavior) > -1;
        const isCheckedElement: boolean = Polymer && Polymer.IronCheckedElementBehaviorImpl && proto.behaviors.indexOf(Polymer.IronCheckedElementBehaviorImpl) > -1;
        proto.behaviors.forEach((behavior: any) => configureProperties(behavior.properties));
        configureProperties(proto.properties);
        function configureProperties(properties: any) {
            if (properties) {
                Object.getOwnPropertyNames(properties)
                    .filter(name => name.indexOf('_') !== 0)
                    .forEach(name => configureProperty(name, properties))
            }
        }
        function configureProperty(name: string, properties: any) {
            var info = properties[name];
            //console.log("info=");
            //console.log(info);
            if (typeof info === 'function') {
                info = {
                    type: info
                };
            }
            if (info.type && !info.readOnly && (info.type === Object || info.type === Array)) {
                arrayAndObjectProperties.push(name);
            }
            if (info && info.notify) {
                propertiesWithNotify.push(name);
            }
        }
        //console.log(propertiesWithNotify);
        const eventNameForProperty = (property: string) => `${property}Change`;
        let hostBindingsD: any;
        const changeEventsAdapterDirective = Directive({
            selector: name,
            outputs: propertiesWithNotify.map(eventNameForProperty),
            host: propertiesWithNotify.reduce((hostBindings, property) => {
                hostBindings[`(${Polymer.CaseMap.camelToDashCase(property)}-changed)`] = `_emitChangeEvent('${property}', $event);`;
                hostBindingsD = hostBindings;
                return hostBindings;
            }, {})
        }).Class({
            constructor: function () {
                propertiesWithNotify
                    .forEach(property => this[eventNameForProperty(property)] = new EventEmitter<any>(false));
            },
            _emitChangeEvent(property: string, event: any) {
                // Event is a notification for a sub-property when `path` exists and the
                // event.detail.value holds a value for a sub-property.
                // For sub-property changes we don't need to explicitly emit events,
                // since all interested parties are bound to the same object and Angular
                // takes care of updating sub-property bindings on changes.
                if (!event.detail.path) {
                    this[eventNameForProperty(property)].emit(event.detail.value);
                }
            }
        });
        let code: string = "/* Suggested Name File: "+name+"-directives.ts */";
        code = code + "\n import { Directive, ElementRef, Input,EventEmitter,DoCheck,Renderer,forwardRef, OnInit, IterableDiffers, KeyValueDiffers, DefaultIterableDiffer, NgZone, Injector } from '@angular/core';";
        code = code + "\n import { FormControlName, NG_VALUE_ACCESSOR } from '@angular/forms';";
        code = code + "\n import { __platform_browser_private__ } from '@angular/platform-browser';";
        code = code + "\n import { PolymerElement } from '@vaadin/angular2-polymer';";
        code = code + "\n @Directive({ selector: '" + name + "', ";
        code = code + "\n outputs: " + JSON.stringify(propertiesWithNotify.map(eventNameForProperty)) + ",";
        code = code + "\n host: " + JSON.stringify(hostBindingsD) + " })";
        code = code + "\n export class " + this.transformName(name) + "ChangeEventsAdapterDirective {";
        code = code + "\n eventNameForProperty = (property: string) => `${property}Change`;";
        code = code + "\n constructor(){";
        propertiesWithNotify
            .forEach(property => code = code + "\n this[this.eventNameForProperty('" + property + "')]=new EventEmitter<any>(false);");
        code = code + "\n }";
        code = code + "\n_emitChangeEvent(property: string, event: any) {";
        code = code + "\n if (!event.detail.path) {"
        code = code + "\n this[this.eventNameForProperty(property)].emit(event.detail.value);";
        code = code + "\n }";
        code = code + "\n}";
        code = code + "\n}";
        //console.log(code);
        //code = code + "\n //===========================";
        const validationDirective = Directive({
            selector: name
        }).Class({
            constructor: [ElementRef, Injector, function (el: ElementRef, injector: Injector) {
                this._element = el.nativeElement;
                this._injector = injector;
            }],
            ngDoCheck: function () {
                const control = this._injector.get(FormControlName, null);
                if (control) {
                    this._element.invalid = !control.pristine && !control.valid;
                }
            }
        });
        //code = "import { Directive, ElementRef, Input,EventEmitter } from '@angular/core'";
        code = code + "\n";
        code = code + "\n @Directive({ selector: '" + name + "', ";
        code = code + "\n })";
        code = code + "\n export class " + this.transformName(name) + "ValidationDirective implements DoCheck{";
        code = code + "\n _element : any;";
        code = code + "\n constructor(el: ElementRef, public injector: Injector){";
        code = code + "\n this._element = el.nativeElement;";
        code = code + "\n }";
        code = code + "\n ngDoCheck() {";
        code = code + "\n const control = this.injector.get(FormControlName, null);"
        code = code + "\n if (control) {";
        code = code + "\n this._element.invalid = !control.pristine && !control.valid";
        code = code + "\n }";
        code = code + "\n }";
        code = code + "\n}";
        //code = code + "\n //===========================";
        const formElementDirective: any = Directive({
            selector: name,
            providers: [
                {
                    provide: NG_VALUE_ACCESSOR,
                    useExisting: forwardRef(() => formElementDirective),
                    multi: true
                }
            ],
            host: (isCheckedElement ? { '(checkedChange)': 'onValueChanged($event)' } : { '(valueChange)': 'onValueChanged($event)' })
        }).Class({
            constructor: [Renderer, ElementRef, function (renderer: Renderer, el: ElementRef) {
                this._renderer = renderer;
                this._element = el.nativeElement;
                this._element.addEventListener('blur', () => this.onTouched(), true);
            }],
            onChange: (_: any) => { },
            onTouched: () => { },
            writeValue: function (value: any): void {
                this._renderer.setElementProperty(this._element, (isCheckedElement ? 'checked' : 'value'), value);
            },
            registerOnChange: function (fn: (_: any) => void): void { this.onChange = fn; },
            registerOnTouched: function (fn: () => void): void { this.onTouched = fn; },
            onValueChanged: function (value: any) {
                this.onChange(value);
            }
        });
        code = code +"\n";
        code = code + "\n @Directive({ selector: '" + name + "', ";
        code = code + "\n providers : [ {provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => "+ this.transformName(name) +"FormElementDirective ), multi: true}], ";
        code = code + "\n host: "+(isCheckedElement ? "{ '(checkedChange)': 'onValueChanged($event)' }" : "{ '(valueChange)': 'onValueChanged($event)' }");
        code = code + "\n })";
        code = code + "\n export class " + this.transformName(name) + "FormElementDirective {";
        code = code + "\n _element : any;";
        code = code + "\n _renderer : any;";
        code = code + "\n constructor(renderer: Renderer, el: ElementRef){";
        code = code + "\n this._renderer = renderer;";
        code = code + "\n this._element = el.nativeElement;";
        code = code + "\n this._element.addEventListener('blur', () => this.onTouched(), true);";
        code = code + "\n }";
        code = code + "\n onChange(_?: any){ }";
        code = code + "\n onTouched(_?: any){ }";
        code = code + "\n writeValue(value: any):void{";
        code = code + "\n this._renderer.setElementProperty(this._element, "+(isCheckedElement ? 'checked' : 'value')+", value);"
        code = code + "\n }";
        code = code + "\n registerOnChange(fn: (_: any) => void): void{ this.onChange = fn; }";
        code = code + "\n registerOnTouched(fn: (_: any) => void): void{ this.onTouched = fn; }";
        code = code + "\n onValueChanged(value: any){ this.onChange(value); }";
        code = code + "\n}";
        //code = code + "\n //===========================";
        const notifyForDiffersDirective = Directive({
            selector: name,
            inputs: arrayAndObjectProperties,
            host: arrayAndObjectProperties.reduce((hostBindings, property) => {
                hostBindings[`(${Polymer.CaseMap.camelToDashCase(property)}-changed)`] = `_setValueFromElement('${property}', $event);`;
                hostBindingsD = hostBindings;
                return hostBindings;
            }, {})
        }).Class({
            constructor: [ElementRef, IterableDiffers, KeyValueDiffers, function (el: ElementRef, iterableDiffers: IterableDiffers, keyValueDiffers: KeyValueDiffers) {
                this._element = el.nativeElement;
                this._iterableDiffers = iterableDiffers;
                this._keyValueDiffers = keyValueDiffers;
                this._differs = {};
                this._arrayDiffs = {};
            }],
            ngOnInit() {
                var elm = (<any>this)._element;
                // In case the element has a default value and the directive doesn't have any value set for a property,
                // we need to make sure the element value is set to the directive.
                arrayAndObjectProperties.filter(property => elm[property] && !this[property])
                    .forEach(property => {
                        this[property] = elm[property];
                    });
            },
            _setValueFromElement(property: string, event: Event) {
                // Properties in this directive need to be kept synced manually with the element properties.
                // Don't use event.detail.value here because it might contain changes for a sub-property.
                var target: any = event.target;
                if (this[property] !== target[property]) {
                    this[property] = target[property];
                    (<any>this)._differs[property] = this._createDiffer(this[property]);
                }
            },
            _createDiffer(value: string) {
                var differ = Array.isArray(value) ? (<any>this)._iterableDiffers.find(value).create(null) : (<any>this)._keyValueDiffers.find(value || {}).create(null);
                // initial diff with the current value to make sure the differ is synced
                // and doesn't report any outdated changes on the next ngDoCheck call.
                differ.diff(value);
                return differ;
            },
            _handleArrayDiffs(property: string, diff: any) {
                if (diff) {
                    diff.forEachRemovedItem((item: any) => this._notifyArray(property, item.previousIndex));
                    diff.forEachAddedItem((item: any) => this._notifyArray(property, item.currentIndex));
                    diff.forEachMovedItem((item: any) => this._notifyArray(property, item.currentIndex));
                }
            },
            _handleObjectDiffs(property: string, diff: any) {
                if (diff) {
                    var notify = (item: any) => this._notifyPath(property + '.' + item.key, item.currentValue);
                    diff.forEachRemovedItem(notify);
                    diff.forEachAddedItem(notify);
                    diff.forEachChangedItem(notify);
                }
            },
            _notifyArray(property: string, index: number) {
                this._notifyPath(property + '.' + index, this[property][index]);
            },
            _notifyPath(path: string, value: any) {
                (<any>this)._element.notifyPath(path, value);
            },
            ngDoCheck() {
                arrayAndObjectProperties.forEach(property => {
                    var elm = (<any>this)._element;
                    var _differs = (<any>this)._differs;
                    if (elm[property] !== this[property]) {
                        elm[property] = this[property];
                        _differs[property] = this._createDiffer(this[property]);
                    } else if (_differs[property]) {
                        // TODO: these differs won't pickup any changes in need properties like items[0].foo
                        var diff = _differs[property].diff(this[property]);
                        if (diff instanceof DefaultIterableDiffer) {
                            this._handleArrayDiffs(property, diff);
                        } else {
                            this._handleObjectDiffs(property, diff);
                        }
                    }
                });
            }
        });
        code = code + "\n";
        code = code + "\n @Directive({ selector: '" + name + "', ";
        code = code + "\n inputs : "+JSON.stringify(arrayAndObjectProperties)+", ";
        code = code + "\n host: " + JSON.stringify(hostBindingsD) + " })";
        code = code + "\n export class " + this.transformName(name) + "NotifyForDiffersDirective implements OnInit, DoCheck {";
        code = code + "\n _element : any;";
        code = code + "\n _iterableDiffers : any;";
        code = code + "\n _keyValueDiffers : any;";
        code = code + "\n _differs : any;";
        code = code + "\n _arrayDiffs : any;";
        code = code + "\n arrayAndObjectProperties : any[] = "+JSON.stringify(arrayAndObjectProperties)+";";
        code = code + "\n constructor(el: ElementRef, iterableDiffers: IterableDiffers, keyValueDiffers: KeyValueDiffers){";
        code = code + "\n this._element = el.nativeElement;";
        code = code + "\n this._iterableDiffers = iterableDiffers;";
        code = code + "\n this._keyValueDiffers = keyValueDiffers;";
        code = code + "\n this._differs = {};";
        code = code + "\n this._arrayDiffs = {};";
        code = code + "\n }";
        code = code + "\n ngOnInit() {";
        code = code + "\n     var elm = (<any>this)._element;";
        code = code + "\n     this.arrayAndObjectProperties.filter(property => elm[property] && !this[property])";
        code = code + "\n         .forEach(property => {";
        code = code + "\n             this[property] = elm[property];";
        code = code + "\n         });";
        code = code + "\n }";
        code = code + "\n _setValueFromElement(property: string, event: Event) {";
        code = code + "\n     var target: any = event.target;";
        code = code + "\n     if (this[property] !== target[property]) {";
        code = code + "\n         this[property] = target[property];";
        code = code + "\n         (<any>this)._differs[property] = this._createDiffer(this[property]);";
        code = code + "\n     }";
        code = code + "\n }";
        code = code + "\n _createDiffer(value: string) {";
        code = code + "\n     var differ = Array.isArray(value) ? (<any>this)._iterableDiffers.find(value).create(null) : (<any>this)._keyValueDiffers.find(value || {}).create(null);";
        code = code + "\n     differ.diff(value);";
        code = code + "\n     return differ;";
        code = code + "\n }";
        code = code + "\n _handleArrayDiffs(property: string, diff: any) {";
        code = code + "\n     if (diff) {";
        code = code + "\n         diff.forEachRemovedItem((item: any) => this._notifyArray(property, item.previousIndex));";
        code = code + "\n         diff.forEachAddedItem((item: any) => this._notifyArray(property, item.currentIndex));";
        code = code + "\n         diff.forEachMovedItem((item: any) => this._notifyArray(property, item.currentIndex));";
        code = code + "\n     }";
        code = code + "\n }";
        code = code + "\n _handleObjectDiffs(property: string, diff: any) {";
        code = code + "\n     if (diff) {";
        code = code + "\n         var notify = (item: any) => this._notifyPath(property + '.' + item.key, item.currentValue);";
        code = code + "\n         diff.forEachRemovedItem(notify);";
        code = code + "\n         diff.forEachAddedItem(notify);";
        code = code + "\n         diff.forEachChangedItem(notify);";
        code = code + "\n     }";
        code = code + "\n }";        
        code = code + "\n _notifyArray(property: string, index: number) {";
        code = code + "\n     this._notifyPath(property + '.' + index, this[property][index]);";
        code = code + "\n }";
        code = code + "\n _notifyPath(path: string, value: any) {";
        code = code + "\n      (<any>this)._element.notifyPath(path, value);";
        code = code + "\n }";
        code = code + "\n ngDoCheck() {";
        code = code + "\n     this.arrayAndObjectProperties.forEach(property => {";
        code = code + "\n         var elm = (<any>this)._element;";
        code = code + "\n         var _differs = (<any>this)._differs;";
        code = code + "\n         if (elm[property] !== this[property]) {";
        code = code + "\n             elm[property] = this[property];";
        code = code + "\n             _differs[property] = this._createDiffer(this[property]);";
        code = code + "\n         } else if (_differs[property]) {";
        code = code + "\n             var diff = _differs[property].diff(this[property]);";
        code = code + "\n             if (diff instanceof DefaultIterableDiffer) {";
        code = code + "\n                 this._handleArrayDiffs(property, diff);";
        code = code + "\n             } else {";
        code = code + "\n                 this._handleObjectDiffs(property, diff);";
        code = code + "\n             }";
        code = code + "\n         }";
        code = code + "\n     });";
        code = code + "\n }";
        code = code + "\n}";
        //code = code + "\n //===========================";
        const reloadConfigurationDirective = Directive({
            selector: name
        }).Class({
            constructor: [ElementRef, NgZone, function (el: ElementRef, zone: NgZone) {
                if (!Polymer.Settings.useShadow) {
                    el.nativeElement.async(() => {
                        if (el.nativeElement.isInitialized()) {
                            // Reload outside of Angular to prevent unnecessary ngDoCheck calls
                            zone.runOutsideAngular(() => {
                                el.nativeElement.reloadConfiguration();
                            });
                        }
                    });
                }
            }],
        });
        code = code + "\n";
        code = code + "\n @Directive({ selector: '" + name + "', ";
        code = code + "\n })";
        code = code + "\n export class " + this.transformName(name) + "ReloadConfigurationDirective {";
        code = code + "\n constructor(el: ElementRef, zone: NgZone){";
        code = code + "\n let Polymer: any = (<any>window).Polymer;";
        code = code + "\n if (!Polymer.Settings.useShadow) {";
        code = code + "\n     el.nativeElement.async(() => {";
        code = code + "\n         if (el.nativeElement.isInitialized()) {";
        code = code + "\n             zone.runOutsideAngular(() => {";
        code = code + "\n                 el.nativeElement.reloadConfiguration();";
        code = code + "\n             });";
        code = code + "\n         }";
        code = code + "\n     });";
        code = code + "\n }";
        code = code + "\n }";
        code = code + "\n}";
        //code = code + "\n //===========================";
        var directives = [changeEventsAdapterDirective, notifyForDiffersDirective];
        let nomClase :string = this.transformName(name);
        let directivasValidas : string = "["+nomClase+"ChangeEventsAdapterDirective, "+nomClase+"NotifyForDiffersDirective";
        if (isFormElement) {
            directives.push(formElementDirective);
            directives.push(validationDirective);
            directivasValidas = directivasValidas + ", "+nomClase+"FormElementDirective, "+nomClase+"ValidationDirective";
        }
        // If the element has isInitialized and reloadConfiguration methods (e.g., Charts)
        if (typeof proto.isInitialized === 'function' &&
            typeof proto.reloadConfiguration === 'function') {
            directives.push(reloadConfigurationDirective);
            directivasValidas = directivasValidas + ", "+nomClase+"ReloadConfigurationDirective";
        }
        code = code+"\n export var "+this.transformName(name)+" = "+directivasValidas+"];";
        //return directives;
        return code;
    }
}