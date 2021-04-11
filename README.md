# vite-plugin-react-svg

## Usage
```javascript
import svgPlugin from "vite-plugin-react-svg";


// vite.config.js
// ...
plugins: [
    svgPlugin()
]

// ...


```

```jsx
import svgUrl, { ReactComponent as SvgIcon } from '***.svg';
// ...
<SvgIcon style={{fontSize: 16}} />
// ...
<img src={svgUrl}  alt=""/>
// ...

```