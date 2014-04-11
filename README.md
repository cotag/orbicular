# CSS Circular Progress Bar

[![Build Status](https://travis-ci.org/cotag/orbicular.png?branch=master)](https://travis-ci.org/cotag/orbicular)


Based on the technique used at http://fromanegg.com/post/41302147556/100-pure-css-radial-progress-bar

For cool auto-scaling UI's that require circular progression

![image](https://cloud.githubusercontent.com/assets/368013/2675921/6a099290-c127-11e3-9643-29a8b7ec6a9d.png)


## Installation

1. Open bower.json
2. Add `"orbicular": "~2.0.0"` to your dependency list
3. Run `bower install`
4. In your application you can now add:
   * `<script src="bower_components/orbicular/orbicular/orbicular.js"></script>`
5. Copy / include the SCSS files into your project
   * Customise the styles using `_orbicular_config.scss`
6. The circle size is based on the parent elements width.


## Usage

Create your progress element: 

```html
<orbicular progression="downloaded" total="size">Text / HTML in the circle</orbicular>
```

Where `$scope.downloaded` (download progress) and `$scope.size` (total size of download) are the variables used in the example to track the progress of a download.


## Upgrading from version 1.x.x

There is a single breaking change: (resolving a conflict bootstrap UI)

* `progress="downloaded"` changes to `progression="downloaded"`


