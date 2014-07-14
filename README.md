# CSS Circular Progress Bar

Based on the techniques used at http://fromanegg.com/post/41302147556/100-pure-css-radial-progress-bar and https://medium.com/@andsens/radial-progress-indicator-using-css-a917b80c43f9

For cool auto-scaling UI's that require circular progression

![image](https://cloud.githubusercontent.com/assets/368013/2675921/6a099290-c127-11e3-9643-29a8b7ec6a9d.png)

Also have a look at this [fiddle](http://jsfiddle.net/jD74M/7/)


## Installation

1. Open bower.json
2. Add `"orbicular": "~3.0.0"` to your dependency list
3. Run `bower install`
4. In your application you can now add:
   * `<script src="bower_components/orbicular/orbicular.js"></script>`
5. Import the SCSS files into your SCSS using the `@import` directive i.e.
   * `@import "../../bower_components/orbicular/orbicular.scss"`
6. Include the CSS using the orbicular mixin
   * `@include orbicular(options: opt-value, ..)`


## Usage

### Create your progress element

```html
<orbicular progression="downloaded" total="size" resize>Text / HTML in the circle</orbicular>
```

Where `$scope.downloaded` (download progress) and `$scope.size` (total size of download) are the variables used in the example to track the progress of a download. `resize` is optional and the circle will resize on window resize / rotate etc


Configure your circle using the mixin options

```scss
// All the defaults except shadow which isn't set by default
@include orbicular(
    $barColor:  #50a6d3,    // The completed progress color
    $barBg:     #EEE,       // The remaining progress color
    $barWidth:  8,          // The bar width is defined as a percentage of the width of the circle
    $contentBg: #2b383f,    // The circle center
    $fontSize:  8,          // Content font-size as a percentage of the circle size
    $fontColor: #FFF,       // Content text color
    $transTime: 0.3s,       // Time to animate the movement
    $transFunc: linear,     // transition timing
    $shadow: 6px 6px 10px rgba(0,0,0,0.2)  // optional shadow (not default)
);

// for further customizations to the circle content use:
// You can add your own id's and classes to the element too
div.co-circle-progress {
    div.co-content > div > div > div {
        font-weight: bold;
        // and any other divs' etc.
    }
}
```


### Element size

The circles size is based on the width of the parent element.
This size is static and is set at the following times:

* when the directive is linked
* on the $broadcast of `'orb width'` to the elements scope

if you set the optional `resize` attribute on the element then it'll also resize on

* on mobile device rotation
* when the browser window is resized

Broadcasting or emitting should be used to programmatically resize circles


## Upgrading from version 2.x.x to 3.x.x

* Change the SCSS to use the mixin
* Add a `resize` attribute if it should resize automatically

## Upgrading from version 1.x.x to 2.x.x

There is a single breaking change: (resolving a conflict with bootstrap UI)

* `progress="downloaded"` changes to `progression="downloaded"`
