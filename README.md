# Angular translation tool, JSON file edit 

This project can manage a list of translation file
in the JSON with nested namespaces (Namespaced JSON) or JSON with namespaces in key (Flat JSON)

To run:

```
npm install
npm start
open http://localhost:3000
```

Or install globally 

```
translations -c <path to config file>
```

A config file is a JSON file that should point to all your translation files:

```
{
  "locales": [
    './src/translation/en.json',
    './src/translation/fr.json'
  ]
}
```
