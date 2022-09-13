const immer = require('immer');
// console.log(immer);
let state = {
    name: "Micheal",
    age: 32
};
immer.enablePatches();
state = immer.produce(state, draft => {
    draft.age = 40; // replace
    // draft.test = 1; // add
    // delete draft.name; // delete
}, (patches, inversePatches) => {
    console.log('redo',JSON.stringify(patches));
    console.log('undo',JSON.stringify(inversePatches));
});

const op = {
    "add": {
        "redo": [{"op":"add","path":["test"],"value":1}],
        "undo": [{"op":"remove","path":["test"]}],
    },
    "delete": {
        "redo": [{"op":"remove","path":["name"]}],
        "undo": [{"op":"add","path":["name"],"value":"Micheal"}],
    },
    "replace": {
        "redo": [{"op":"replace","path":["age"],"value":40}],
        "undo": [{"op":"replace","path":["age"],"value":32}],
    }
}
