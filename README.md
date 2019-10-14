# Angular translation tool, JSON file edit 

This project can manage a list of translation file
in the JSON with nested namespaces (Namespaced JSON) or JSON with namespaces in key (Flat JSON)

To run if you cloned this repo:

```
npm install
npm start
open http://localhost:3000
```

Otherwise install globally 

```
npm install -g blop-translations
translations -c <path to your config file>
```

The config file is a JSON file that should point to all your translation files:

```
{
  "locales": [
    './src/translation/en.json',
    './src/translation/fr.json'
  ]
}
```
