/*
@license https://github.com/t2ym/scenarist/blob/master/LICENSE.md
Copyright (c) 2017, Tetsuya Mori <t2y3141592@gmail.com>. All rights reserved.
*/
(function (root, factory) {
  'use strict';
  /* istanbul ignore if: AMD is not tested */
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], function () {
      return (root.wrap = root.wrap || factory());
    });
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like enviroments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    // Browser globals
    root.wrap = root.wrap || factory();
  }
}(this, function () {
// UMD Definition above, do not remove this line
const originalFunctions = new WeakMap();
const wrappedFunctions = new WeakMap();

function _wrap(_prop, f, forwarder) {
  let wrapped = new Function('prop', 'f', 'forwarder',
    'return function (...args) { return forwarder(prop, f, args, this, new.target); }'
  )(_prop, f, forwarder);
  Object.defineProperty(wrapped, 'name', {
    configurable: true, enumerable: false, writable: false, value: f.name.replace(/^(class|get|set|bound) /, '')
  });
  return wrapped;
}

function wrap(target, forwarder, catcher) {
  try {
    forwarder = forwarder || wrap.defaultForwarder;
    if (target && (typeof target === 'function' || typeof target === 'object')) {
      if (typeof target === 'function') {
        let tmp = wrap.wrappedFunctions.get(target);
        if (tmp) {
          return tmp;
        }
      }
      function wrapDesc(target, prop, desc, wrappedConstructor) {
        let wrapped = null;
        if (typeof desc === 'object') {
          [ 'get', 'set', 'value' ].forEach(p => {
            if (typeof desc[p] === 'function' && !wrap.originalFunctions.get(desc[p])) {
              wrapped = _wrap(prop, desc[p], forwarder);
              wrap.originalFunctions.set(wrapped, desc[p]);
              wrap.wrappedFunctions.set(desc[p], wrapped);
              desc[p] = wrapped;
            }
          });
          if (wrapped && desc.configurable) {
            Object.defineProperty(target, prop, desc);
          }
          if (wrappedConstructor && desc.configurable) {
            Object.defineProperty(wrappedConstructor, prop, desc);
          }
        }
      }
      let cDesc = Object.getOwnPropertyDescriptors(target);
      let oDesc = target.prototype ? (Object.getOwnPropertyDescriptors(target.prototype) || {}) : {};
      if (target.prototype && oDesc.constructor) {
        wrapDesc(target.prototype, 'constructor', oDesc.constructor);
      }
      for (let sprop in cDesc) {
        wrapDesc(target, sprop, cDesc[sprop], target.prototype && oDesc.constructor ? target.prototype.constructor : null);
      }
      for (let oprop in oDesc) {
        if (oprop !== 'constructor') {
          wrapDesc(target.prototype, oprop, oDesc[oprop]);
        }
      }
    }
  }
  catch (e) {
    if (typeof catcher === 'function') {
      return catcher(target, e);
    }
  }
  finally {
    return target.prototype && target.prototype.constructor && wrap.originalFunctions.get(target.prototype.constructor) ? target.prototype.constructor : target;
  }
}

wrap.defaultForwarder = function defaultForwarder(prop, f, args, self, newTarget) { return newTarget ? Reflect.construct(f, args) : f.apply(self, args); };

wrap.loggerForwarder = function loggerForwarder(prop, f, args, self, newTarget) { 
  console.log('wrap: ' + (newTarget ? 'new ' : '') + prop + ' ' + f.name + ' is called for ', (self && self.name ? self.name : self), 'with arguments', args);
  return newTarget ? Reflect.construct(f, args) : f.apply(self, args);
}

wrap.originalFunctions = originalFunctions;
wrap.wrappedFunctions = wrappedFunctions;

return wrap;
}));
