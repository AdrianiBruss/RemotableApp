# remoteSite.js

## Introduction
Remote your website with remoteSite.js. Just plug the library in your site, download the app and enjoy !


## Usage
As you can see in the example files, you will need to include:
 - [jQuery library](http://jquery.com/). (1.6.0 minimum)
 - The JavaScript file `jquery.remoteSite.js` (or its minified version `jquery.remoteSite.min.js`)
 - The css file `jquery.remoteSite.css`


### Install using bower or npm
**Optionally**, you can install fullPage.js with bower or npm if you prefer:

Terminal:
```shell
// With bower
bower install remoteSite.js

// With npm
npm install remoteSite.js
```

###Including files:
```html
<link rel="stylesheet" type="text/css" href="jquery.remoteSite.css" />

<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>

<script type="text/javascript" src="jquery.remoteSite.js"></script>
```


###Initialization
All you need to do is call the plugin inside a `$(document).ready` function:

```javascript
$(document).ready(function() {
	$.remoteSite();
});
```

A more complex initialization with all options set could look like this:
```javascript
$(document).ready(function() {
	$.remoteSite({

		menu: false,
		sliderDraggable: [],
		sectionsName: false,
		slideShowIds: [],
		swipeSection: function(){},
		changeOrientation: function(){},
		galleryRemote: function(){},
		sliderDraggableRemote: function(){},
		videoRemote: function(){},
		buttonRemote: function(){}

	});
});
```


## Options

- `menu`: (default `false`) Define the menu you want to use on the mobile app to navigate trough it.

- `sectionsName`: (default `.section`) Defines the jQuery selector used for the name of your sections. It might need to be changed sometimes to avoid problem with other plugins.

- `sliderDraggable`: (default `[]`) Set an id array of range slider you want to control from the app.

- `sectionsName`: (default `false`) Whether you want to resize the text when the window is resized.


### changeSection()
Send to the app the section has changed on the site. The parameter is the next or previous index section according to direction
```javascript
$.remoteSite.changeSection(nextIndex);
```

## Callbacks
You can see them in action [here](http://alvarotrigo.com/fullPage/examples/callbacks.html).

###swipeSection (`anchorLink`, `index`)
Callback fired once the sections have been loaded, after the scrolling has ended.
Parameters:

- `anchorLink`: anchorLink corresponding to the section.
- `index`: index of the section. Starting from 1.

In case of not having anchorLinks defined in the plugin the `index` parameter would be the only one to use.

Example:

```javascript

	$.remoteSite({

		swipeSection: function(anchorLink, index){
			var loadedSection = $(this);

			//using index
			if(index == 3){
				alert("Section 3 ended loading");
			}

			//using anchorLink
			if(anchorLink == 'secondSlide'){
				alert("Section 2 ended loading");
			}
		}
	});
```
---
###onLeave (`index`, `nextIndex`, `direction`)
This callback is fired once the user leaves a section, in the transition to the new section.
Returning `false` will cancel the move before it takes place.

Parameters:

- `index`: index of the leaving section. Starting from 1.
- `nextIndex`: index of the destination section. Starting from 1.
- `direction`: it will take the values `up` or `down` depending on the scrolling direction.

Example:

```javascript
	$('#fullpage').fullpage({
		onLeave: function(index, nextIndex, direction){
			var leavingSection = $(this);

			//after leaving section 2
			if(index == 2 && direction =='down'){
				alert("Going to section 3!");
			}

			else if(index == 2 && direction == 'up'){
				alert("Going to section 1!");
			}
		}
	});
```

####Cancelling the scroll before it takes place
You can cancel the scroll by returning `false` on the `onLeave` callback:

```javascript
	$('#fullpage').fullpage({
		onLeave: function(index, nextIndex, direction){
			//it won't scroll if the destination is the 3rd section
			if(nextIndex == 3){
				return false;
			}
		}
	});
```

---
###afterRender()
This callback is fired just after the structure of the page is generated. This is the callback you want to use to initialize other plugins or fire any code which requires the document to be ready (as this plugin modifies the DOM to create the resulting structure).

Example:

```javascript
	$('#fullpage').fullpage({
		afterRender: function(){
			var pluginContainer = $(this);
			alert("The resulting DOM structure is ready");
		}
	});
```
---
###afterResize()
This callback is fired after resizing the browser's window. Just after the sections are resized.

Example:

```javascript
	$('#fullpage').fullpage({
		afterResize: function(){
			var pluginContainer = $(this);
			alert("The sections have finished resizing");
		}
	});
```
---
###afterSlideLoad (`anchorLink`, `index`, `slideAnchor`, `slideIndex`)
Callback fired once the slide of a section have been loaded, after the scrolling has ended.
Parameters:

- `anchorLink`: anchorLink corresponding to the section.
- `index`: index of the section. Starting from 1.
- `slideAnchor`: anchor corresponding to the slide (in case there is)
- `slideIndex`: index of the slide. Starting from 1. (the default slide doesn't count as slide, but as a section)

In case of not having anchorLinks defined for the slide or slides the `slideIndex` parameter would be the only one to use.
Example:

```javascript
	$('#fullpage').fullpage({
		anchors: ['firstPage', 'secondPage', 'thirdPage', 'fourthPage', 'lastPage'],

		afterSlideLoad: function( anchorLink, index, slideAnchor, slideIndex){
			var loadedSlide = $(this);

			//first slide of the second section
			if(anchorLink == 'secondPage' && slideIndex == 1){
				alert("First slide loaded");
			}

			//second slide of the second section (supposing #secondSlide is the
			//anchor for the second slide
			if(index == 2 && slideIndex == 'secondSlide'){
				alert("Second slide loaded");
			}
		}
	});
```


---
###onSlideLeave (`anchorLink`, `index`, `slideIndex`, `direction`, `nextSlideIndex`)
This callback is fired once the user leaves an slide to go to another, in the transition to the new slide.
Returning `false` will cancel the move before it takes place.

Parameters:

- `anchorLink`: anchorLink corresponding to the section.
- `index`: index of the section. Starting from 1.
- `slideIndex`: index of the slide. **Starting from 0.**
- `direction`: takes the values `right` or `left` depending on the scrolling direction.
- `nextSlideIndex`: index of the destination slide. **Starting from 0.**


Example:

```javascript
	$('#fullpage').fullpage({
		onSlideLeave: function( anchorLink, index, slideIndex, direction, nextSlideIndex){
			var leavingSlide = $(this);

			//leaving the first slide of the 2nd Section to the right
			if(index == 2 && slideIndex == 0 && direction == 'right'){
				alert("Leaving the fist slide!!");
			}

			//leaving the 3rd slide of the 2nd Section to the left
			if(index == 2 && slideIndex == 2 && direction == 'left'){
				alert("Going to slide 2! ");
			}
		}
	});
```


## Donations
Donations would be more than welcome :)

[![Donate](https://www.paypalobjects.com/en_US/GB/i/btn/btn_donateCC_LG.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=BEK5JQCQMED4J&lc=GB&item_name=fullPage%2ejs&currency_code=USD&bn=PP%2dDonationsBF%3abtn_donateCC_LG%2egif%3aNonHosted)


## License

(The MIT License)

Copyright (c) 2015 Adriani Bruss &lt;abrussolo@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.