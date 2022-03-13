import StrikeThrough from "./StrikeThrough.svelte";
import { Autocomplete } from "./autocomplete.ts";

import * as NoteEditor from "anki/NoteEditor";
import "./styles/icon.scss";

// import type { NoteEditorAPI } from "@anki/editor/NoteEditor.svelte";
import type NoteEditorAPI from "@anki/editor/NoteEditor.svelte";
import type { EditorToolbarAPI } from "@anki/editor/editor-toolbar";

NoteEditor.lifecycle.onMount(({ toolbar, fields }: NoteEditorAPI): void => {

    toolbar.inlineButtons.append({ component: StrikeThrough }, 2);


    const ac = new Autocomplete(fields);

    // const fieldContents = ["", ""];
    // setTimeout(() => {
    //     // fields[1].editingArea.content.subscribe((content) => {
    //     //     globalThis.console.log(content);
    //     // });
    //     // for(const [i, field] of fields.entries()){
    //     //     field.editingArea.content.subscribe(content => {
    //     //         fieldContents[i] = content;
    //     //         globalThis.console.log(fieldContents);
    //     //     });
    //     // }
    //     fields[0].element.then((element) => {
    //         globalThis.console.log(element);
    //     });

    // }, 0)

});
