# CSS Circular Progress Bar

[![Build Status](https://travis-ci.org/cotag/orbicular.png?branch=master)](https://travis-ci.org/cotag/orbicular)
Based on the technique used at http://fromanegg.com/post/41302147556/100-pure-css-radial-progress-bar


## Installation

1. Open bower.json
2. Add `"orbicular": "~1.0.0"` to your dependency list
3. Run `bower install`
4. In your application you can now add:
   * `<script src="bower_components/orbicular/orbicular.js"></script>`
5. Copy the SCSS files into your project
   * Customise the styles using `_orbicular_config.scss`


## Usage

Create your progress element: 

```html
<orbicular progress="downloaded" total="size">Text in the circle</orbicular>
```

Where `$scope.downloaded` and `$scope.size` are the variables used in the example to track the progress of a download.

