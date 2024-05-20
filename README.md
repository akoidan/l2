# l2
Script bindings to send shorcuts from one PC to other. E.g. you press `alt+1` and on other PC shortcut like `F1` is triggered

## How to use

### Unified remote
In order to have control you need to install [Unified remote](https://www.unifiedremote.com/) on all PCs that you want to control
For each unified remote go it its settings at http://localhost:9510/web/#/settings/network and check **allow remote web access**

#### Alt-tab

In order for alt-tab to work we need a custom shorcut. Replace default examples with new alt-tab shorcut in remote PCS at: **C:\ProgramData\Unified Remote\Remotes\Bundled\Unified\Examples\Keys**

**remote.lua**:

```lua
actions.alt_tab = function ()
kb.stroke("alt", "tab");
end
```

**layout.xml**

```xml
<?xml version="1.0" encoding="utf-8"?>
<layout>
  <row>
    <button text="Alt Tab" ontap="alt_tab" />
  </row>
</layout>
```
**meta.prop**
```prop
meta.name: Custom Keys
meta.author: l2
meta.description: Strokes
meta.tags: example
```


### Host PC
You can use nodejs for windows v20. The default installation should come with build tools support for electron.

```bash
nvm use #or use node v20
yarn # install packages
yarn start
```


alt+a = heal all
alt+s = seb9
alt+d = target

alt+1 = attack
alt+2 = attack
alt+3 = use potions
alt+4 = use potions


alt+q = 
alt+z = get bish