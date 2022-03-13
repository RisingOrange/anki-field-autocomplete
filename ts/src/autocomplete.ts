import * as NoteEditor from "anki/NoteEditor";

export class Autocomplete {
    fields: NoteEditorAPI
    acByField = new Map();
    optionsByField = new Map();
    enabledFields = [];
    icons = [];
    looseSearch = false;

    constructor(fields) {
        this.fields = fields;
        Object.assign(globalThis, {
            fieldAutocomplete: this,
        });
    }

    setup(options) {
        this.enabledFields = options["ords"];
        // this.looseSearch = options['looseSearch']

        // this.setupAcs(this.enabledFields)
        this.setupIcons(this.enabledFields);
    }

    update(data) {
        const { ord, options } = data;
        this.optionsByField?.set(ord, options);
        const ac = this.acByField.get(ord);
        if (!ac.list.hasAttribute("hidden")) {
            ac.start();
        }
    }

    setupAcs(enabledFields) {
        if (this.acByField != null) {
            for (const ord of this.acByField.keys()) {
                this.removeAc(ord);
            }
        }

        this.acByField = new Map();
        this.optionsByField = new Map();

        forEditorField([], (field) => {
            const ord = field.editingArea.ord;
            if (!enabledFields.includes(ord)) return;

            // this.addAc(ord)
        });
    }

    // addAc(ord) {
    //     const field = globalThis.getEditorField(ord)
    //     const editable = field.editingArea.editable

    //     const listWrapper = field.editingArea.shadowRoot.querySelector('#list_wrapper')
    //     if (!listWrapper) {
    //         listWrapper = document.createElement('span')
    //         listWrapper.id = 'list_wrapper'
    //         field.editingArea.shadowRoot.appendChild(listWrapper)

    //         var style = document.createElement("style")
    //         style.innerHTML = css
    //         field.editingArea.shadowRoot.insertBefore(style, editable)
    //     }

    //     var ac = new Autocomplete({
    //         selector: () => { return editable },
    //         data: {
    //             src: () => { return this.optionsByField.get(ord) },
    //             filter: (options) => {
    //                 var result = options.filter(x => x.value.replace(' ', '') != '')
    //                 return result
    //             },
    //         },
    //         searchEngine: "loose" ? this.looseSearch : "strict",
    //         resultItem: {
    //             highlight: {
    //                 render: true
    //             }
    //         },
    //         wrapper: false,
    //         events: {
    //             input: {
    //                 init: (event) => {
    //                     globalThis.bridgeCommand(`this:{ "ord": ${ord}, "text" : "" }`)
    //                 },
    //                 focus: (event) => {
    //                     ac.start();
    //                 },
    //                 selection: (event) => {
    //                     const selection = event.detail.selection.value;
    //                     editable.fieldHTML = selection;
    //                 },
    //             },
    //         },
    //         threshold: 0,
    //         resultsList: {
    //             destination: () => {
    //                 return listWrapper
    //             },
    //             tag: "ul",
    //             class: "this_results",
    //             tabSelect: true,
    //             noResults: true,
    //             element: (list, data) => {
    //                 if (!data.results.length) {
    //                     const message = document.createElement("div");
    //                     message.setAttribute("class", "no_result");
    //                     message.innerHTML = `<span>no results</span>`;
    //                     list.appendChild(message);
    //                 }
    //             },
    //             maxResults: 10,
    //         },
    //         query: (input) => {
    //             return input.replace("<br>", "").replace('&nbsp;', ' ');
    //         },
    //     })

    //     ac.input.addEventListener('input', () => {
    //         if (ac.disabled) return
    //         globalThis.bridgeCommand(`this:{ "ord": ${ord}, "text" : ${JSON.stringify(editable.fieldHTML)} }`)
    //     })

    //     this.acByField.set(ord, ac)
    //     this.optionsByField.set(ord, [])
    // }

    removeAc(ord) {
        var ac = this.acByField.get(ord);
        ac.unInit();
        ac.list.remove();
        ac.disabled = true;

        this.acByField.delete(ord);
        this.optionsByField.delete(ord);
    }

    toggleAc(ord) {
        if (this.enabledFields.includes(ord)) {
            this.enabledFields.splice(this.enabledFields.indexOf(ord), 1);
            this.icons[ord].classList.remove("enabled");
            this.removeAc(ord);
            globalThis.bridgeCommand(
                `update_ac_settings:{"ord" : ${ord}, "val" : false}`,
            );
        } else {
            this.enabledFields.push(ord);
            this.icons[ord].classList.add("enabled");
            this.addAc(ord);
            globalThis.bridgeCommand(
                `update_ac_settings:{"ord" : ${ord}, "val" : true}`,
            );
        }
    }

    setupIcons(enabledFields) {
        for (const icon of this.icons) {
            icon.remove();
        }
        this.icons = [];

        globalThis.console.log("setup icons");

        for (const [ord, field] of this.fields.entries()) {
            field.element.then((fieldElement) => {
                globalThis.console.log(fieldElement);

                const icon = this.addIconToField(fieldElement)
                this.icons.push(icon)

                // if (enabledFields.includes(ord)) {
                //     icon.classList.add('enabled')
                // } else {
                //     icon.classList.add('disabled')
                // }
            });

        }
    }

    addIconToField(field: HTMLElement): HTMLElement {
        const icon = globalThis.document.createElement('span')
        icon.classList.add('ac-icon')
        icon.addEventListener('click', () => {
            this.toggleAc(ord)
        })

        const fieldState = field.getElementsByClassName("field-state")[0]
        fieldState.insertBefore(
            icon,
            fieldState.children[0]
        );

        return icon;
    }
}


const css = `
.no_result {
    padding: 10px 20px;
    list-style: none;
    text-align: left;
    font-size: 13px;
    font-style: italic;
    color: #747474;
    transition: all .1s ease-in-out;
    border-radius: 3px;
    background-color: #fff;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: all .2s ease
}

#list_wrapper {
    position: relative;
    display: block;
}

.this_results {
    position: absolute;
    max-height: 226px;
    overflow-y: scroll;
    top: 100%;
    left: 0;
    right: 0;
    padding: 0;
    margin: .15rem 0 0 0;
    border-radius: 4px;
    background-color: #fff;
    border: 1px solid rgba(33, 33, 33, .1);
    z-index: 1000;
    outline: 0
}

.this_results>li {
    padding: 10px 20px;
    list-style: none;
    text-align: left;
    font-size: 13px;
    color: #212121;
    transition: all .1s ease-in-out;
    border-radius: 3px;
    background-color: #fff;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: all .2s ease
}

.this_results>li::selection {
    color: rgba(#fff, 0);
    background-color: rgba(#fff, 0)
}

.this_results>li:hover {
    cursor: pointer;
    background-color: rgba(49, 49, 49, 0.2)
}

.this_results>li mark {
    background-color: transparent;
    color: #ff7a7a;
    font-weight: 700
}

.this_results>li mark::selection {
    color: rgba(#fff, 0);
    background-color: rgba(#fff, 0)
}

.this_results>li[aria-selected=true] {
    background-color: rgba(123, 123, 123, .4)
}

`;