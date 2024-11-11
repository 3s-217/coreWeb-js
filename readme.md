# coreWeb

version: ```0.13.3```

A JavaScript library for manipulating the HTML DOM, offering multiple build types for flexible integration.

## Build Types

CoreWeb is available in three build types to accommodate different use cases:

- CJS (CommonJS): For use with Node.js and other CommonJS environments.
- ESM (ES Modules): For use with modern browsers and ES module-aware build systems.
- IIFE (Immediately Invoked Function Expression): For use with older browsers and environments that don't support ES modules.

## Using coreWeb

To use coreWeb, you can download the prebuilt files from the GitHub releases page. The library is not available on npm.

___

### Installing Locally

For local installation and using a bundler, you have access to submodules:

```bash
npm install https://github.com/3s-217/coreweb-js/releases/latest/download/coreweb-js.tar.gz
```

CJS with Bundlers:

```js
const { __o, _c } = require('coreweb'); 
new __o(arg) || _c(arg) // returns __o instance
```

ESM with Bundlers

```js
import { __o, _c } from 'coreweb'; 
new __o(arg) || _c(arg) // returns __o instance
```

___

### Using with Web

For web usage, you can include the script directly:

Global (window):

```html
<script src="https://github.com/3s-217/coreweb-js/releases/latest/download/core-min.js"></script>
<script>
    new __o(arg) || _c(arg) // returns __o instance
</script>
```

esm:

```html
<script type="module">
    import { __o, _c } from "https://github.com/3s-217/coreweb-js/releases/latest/download/core.es-min.js"
    new __o(arg) || _c(arg) // returns __o instance
</script>
```

#### Chaining Example (inst __o)

Here's a detailed example demonstrating some of the capabilities of coreWeb, with comments explaining each method and how different arguments are used:

```html
<script src="https://github.com/3s-217/coreweb-js/releases/latest/download/core-min.js"></script>

<div id="root" remove>
    <h1></h1>
    <p></p>
</div>
<script>
  var el=  new __o("#root h1");// you can use _c too 
  el.attr('style',"color:red")
  .attr({
    // it use css js api
    style:{backgroundColor:"darkblue"},
    //! use { text or html } dont use both
    text:"Added as innerText",
    html:"<i>Added as innerHTML</i>"
  }) 
  //remove attribute 2nd arg is ignored
  .attr('remove','','r')
  // html class editing single action
  .class("add"||"remove"||"toggle","icon","more")
   // html class editing multi action
  .class({add:""||[],toggle:""||[],remove:""|[]})
  // on(name,cb,opt)
  .on('click', e => {
      const target=_c(e.target);
      alert(`${target.gt.TagName}-textContent :${target.txt()}`)
    },
    {}// event listerner options (optional)
    )
  // change element
    ._("#root p")
  //  on(obj,opt)
  // options common for all event listerner (optional)
  .on(
    {
      click(e){
        const target=_c(e.target);
        alert(`${target.gt.TagName}-textContent :${target.txt()}`)
      },
      keydown(e){
        const target=_c(e.target);
        alert(`${target.gt.TagName}-textContent :${target.txt()}`)
      }
    },
    {
         passive: true
    }
    )
    //single value use css js api names
    .css("color","green")
    // multi value setter
    .css({
        backgroundColor:"black",
        borderRadius:"25px"
    })

</script>
```

___

#### __Getter Methods Example__

Here's a separate example to demonstrate the getter methods:

```html
<script src="https://github.com/3s-217/coreweb-js/releases/latest/download/core-min.js"></script> 
<div id="root" remove> 
    <h1 class="header">Hello</h1>
    <p id="paragraph">World</p>
</div>
<script>
var el = new __o("#root h1"); // You can use _c too 
// Getting class list 
var classList = el.class(); 
console.log(classList); // Output: ["header"] 
// Getting an attribute by name 
var attrValue = el.attr('class'); 
console.log(attrValue); // Output: "header" 
// Getting all attributes 
var attributes = el.attr(); 
console.log(attributes); // Output: NamedNodeMap {0: class, class: class, length: 1}
</script>
```

___

#### Create Element

```js
let el=_c('a').mk({ class:"link" })
_c('#root').append(el);

// or

_c("#root").append("a", { class:"link" })

```

#### Create Node

```js
const { mkEl:e,mknode:mk}=__o;

let el= e('div',{}
    e('a.link#sub1',{
        // you can use onClick too (camel case for events)
         onclick(e){} 
        // class||className both work + if type arg has a .class all will be combined
         class:"color-red"
        // if id is declared in both type and attr it will use the attr.id's values
      },
      e('.link.text',{},'subNode-1.1')
    ),
    e('a.link#sub2',{},'subNode-2')
)
_c("#root").append(mknode(el))
```

#### Use diffing algorithm to update, comparing real DOM node to virtual DOM

<i style="color:red">This is new</i> not all edge case have been tested

```js
const { mkEl:e, vdom }=__o;

// e(type, {attrs}, {str|another node} )
// type: can be a query string structure. 
// if only .class &| #id exist the default type defaults to div 
// vdom use mknode to create the element

let vel= e('div',{}
    e('a.link#sub1',{
        // you can use onClick too (camel case for events)
         onclick(e){} 
        // class||className both work
         class:"color-red"
        // if id is declared in both type and attr it will use the attr.id's values
      },
      e('.link.text',{},'subNode-1.1')
    ),
    e('a.link#sub2',{},'subNode-2')
)
// query str | el inst of __o | actual dom element
const root="#root";
// renders and rerenders are manual calls
// can pass a 3 arg with {dbg} it will log the steps
vdom(root , vel);
```

## Submodules and Plugins

CoreWeb includes submodules and plugins that can be used to extend its functionality. These are prebuilt and included in the prebuilt folder ```build/parts/```. To use them, simply import the desired submodule or plugin in your code.

- ws ```coreweb/ws``` ```_WS```
  
  esm:

  ```js
    import { _ws } from "coreweb/ws"
  ```

  cjs:

  ```js
    const _ws = require("coreweb/ws") 
  ```

  ___

  Browser
  ___

  Global (window):

  ```html
   <script src="https://github.com/3s-217/coreweb-js/releases/latest/download/ws-min.js"></script> 
  ```
  
  esm:

  ```js
    import { _ws } from "https://github.com/3s-217/coreweb-js/releases/latest/download/ws-min.js"
  ```

  ___

  Usage:

  ```js
  _ws("example.com"|"ws://example.com")
  _ws({li: "example.com"|"ws://example.com"})
  _ws({li: "example.com", p: "ws",ex: {}})
  ```

  ```js
  // _ws is just a simplifier class the web api websocket obj can be accessed inst property _ws._w
  // url if ws/wss not defined it will use the page's protocal (http-ws)|(https-wss)
  let ws= new _ws(url);
  ws.on("open"||"opn",() => {
          if(ws.state==1)
            console.log("connection open")
    })
    .on("cl"|"close",() => {
          if(ws.state==2)
            console.log("connection closing")
         else if(ws.state==3)
            console.log("connection closed")
    })
    .on("err"|"error", err => console.log(err))
    .on("mgs"|"msg"|"message",evt => {
       console.log(evt.data)
    });
  ```

  ___

- webaudio ```coreweb/wa``` ```_WA```

### Prebuilt Folder

The prebuilt folder contains prebuilt versions of the lib and it submodules. These files can be used with a build system or imported directly in your code.

## License

coreWeb is licensed under MIT.
