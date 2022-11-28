# docusaurus-theme-jarle-codeblock

A Docusaurus theme for editable live code examples using JARLE.

## Usage

Install

```sh
npm install docusaurus-theme-jarle-codeblock
```

Modify your `docusaurus.config.js`

```js
module.exports = {
  ...
+ themes: ['docusaurus-theme-jarle-codeblock'],
  presets: ['@docusaurus/preset-classic']
  ...
}
```

Example in your markdown

````
```jsx live
function Clock(props) {
  const [date, setDate] = useState(new Date());
  useEffect(() => {
    var timerID = setInterval(() => tick(), 1000);

    return function cleanup() {
      clearInterval(timerID);
    };
  });

  function tick() {
    setDate(new Date());
  }

  return (
    <div>
      <h2>It is {date.toLocaleTimeString()}.</h2>
    </div>
  );
}
```
````

## Handling local imports

By default `import` statements in a JARLE codeblock will use native
ESM imports, which lets you use dependencies from online repositories like
[skypack](https://www.skypack.dev/).

If you want to use _local_ dependencies bundling with your app instead, a "remark" plugin
is provided to do some processing on Markdown code blocks to enable this.

Modify your `docusaurus.config.js`

```js
module.exports = {
  themes: ['docusaurus-theme-jarle-codeblock'],
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
+          remarkPlugins: [require('docusaurus-theme-jarle-codeblock/remark')],
        },
        blog: {
+          remarkPlugins: [require('docusaurus-theme-jarle-codeblock/remark')],
        },
      },
    ],
  ],
  ...
};
```

This allows codeblocks like the following:

````
```jsx live
  import Button from '@site/src/components/Button';

  <Button>My Button</Button>
```
````
