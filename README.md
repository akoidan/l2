# l2
Script bindings to send shorcuts from one PC to other. E.g. you press `alt+1` and on other PC shortcut like `F1` is triggered

## How to use

### Unified remote
In order to have control you need to install [Unified remote](https://www.unifiedremote.com/) on all PCs that you want to control
For each unified remote go it its settings at http://localhost:9510/web/#/settings/network and check **allow remote web access**


###

### Host PC

```bash
nvm use #or use node v20
yarn # install packages
```
 


```json
{
 "urls": {
   "bish": [],
   "sags": ["192.168.100.14", "192.168.100.9", "192.168.100.27"]
 },
 "combinations": [
   {
     "receiver": "sags",
     "shortCut": "Alt+1",
     "keySend": "F4"
   },
   {
     "receiver": "sags",
     "shortCut": "Alt+2",
     "keySend": "F5"
   }
 ]
}
```