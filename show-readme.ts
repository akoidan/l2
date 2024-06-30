import a from "./example.sags.json";

for (const k of a.combinations) {
    if (k.name) {
        console.log(`${k.shortCut} ${k.name}`)
    }
}