# remoteSite.js

## Introduction
Remote your website with remoteSite.js. Just plug the library in your site, download the app and enjoy !


## Usage
As you can see in the example files, you will need to include:
 - [jQuery library](http://jquery.com/). (1.6.0 minimum)
 - The JavaScript file `jquery.remoteSite.js` (or its minified version `jquery.remoteSite.min.js`)
 - The css file `jquery.remoteSite.css`


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