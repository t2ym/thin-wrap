[![npm](https://img.shields.io/npm/v/thin-wrap.svg)](https://www.npmjs.com/package/thin-wrap)
[![Bower](https://img.shields.io/bower/v/thin-wrap.svg)](https://customelements.io/t2ym/thin-wrap/)

# thin-wrap

Thin Class Wrapper (experimental)

```javascript
function loggerForwarder(prop, f, args, self, newTarget) { 
  console.log('wrap: ' + (newTarget ? 'new ' : '') + f.name + ' is called for ', (self && self.name ? self.name : self), 'with arguments', args);
  return newTarget ? Reflect.construct(f, args) : f.apply(self, args);
}
wrap(XMLHttpRequest, loggerForwarder);
wrap(EventTarget, loggerForwarder);
```

## Install

### Browsers

```sh
  bower install --save thin-wrap
```

### NodeJS

```sh
  npm install --save thin-wrap
```

## Import

### Browsers

```html
<script src="path/to/bower_components/thin-wrap/wrap.js"></script>
```

### NodeJS

```javascript
const wrap = require('thin-wrap/wrap.js');
```

## API

TBD

## Advantages

- Small overheads

## Known Limitations

### Architectural Limitations

- `Class !== Class.prototype.constructor`
- `new Class()` is not trackable
- `new Class.prototype.constructor()` or `new (wrap(Class))()` is trackable
- Properties without setter/getter are not trackable

### Current Design Limitations

- Inherited properties are not tracked
- Generation of setter/getter for properties are not implemented

## License

[BSD-2-Clause](https://github.com/t2ym/thin-wrap/blob/master/LICENSE.md)
