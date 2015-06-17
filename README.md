# remoteSite.js

## Introduction
Remote your website with remoteSite.js. Just plug the library into your website, download the app and enjoy !


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
		slideShow: [],
		swipeSection: function(){},
		changeOrientation: function(){},
		galleryRemote: function(){},
		dragRemote: function(){},
		videoRemote: function(){},
		buttonRemote: function(){}

	});
});
```


## Options

- `menu`: (default `false`) Define the menu you want to use on the mobile app to navigate with.

- `sliderDraggable`: (default `[]`) Set an id array of range slider you want to control from the app.

- `sectionsName`: (default `.section`) Defines the jQuery selector used for the name of your sections. It might need to be changed sometimes to avoid problem with other plugins.

- `slideShow`: (default `[]`) Set an array of id of slideshows you want to remote from the app.



### changeSection()
Send to the app the section has changed on the site. The parameter is the next or previous index section according to direction
```javascript
$.remoteSite.changeSection(nextIndex);
```

## Callbacks

###swipeSection ()
Callback fired once the user swiped on app.
Values returned:

- `this.direction`: corresponding to the direction the mobile swiped : ` 'up' , 'down', 'left', 'right' `

Example:

```javascript

	$.remoteSite({

		swipeSection: function () {

			switch(this.direction) {

				case 'up':
					...
				break;
				case 'down':
					...
				break;

			}

		}
	});
```

###changeOrientation ()
Callback fired once the user change the mobile's orientation.
Values returned:

- `this.data.orientation`: corresponding to the mobile's orientation : ` 'landscape',  'portrait' `
- `this.data.section`: corresponding to the section's number : ` 1,2,3 ... `

Example:

```javascript

	$.remoteSite({

		changeOrientation: function(){

			if ( this.data.orientation == 'landscape' ) {

			 	...
			}

		}
	});
```


###galleryRemote ()
If you want to remote an image carousel, you'll need to trigger your slideshow's arrows
Values returned:

- `this.data.arrow`: fired when left or right arrow is tapped on mobile app : ` 'left',  'right' `
- `this.data.section`: corresponding to the section's number : ` 1,2,3 ... `

Example:

```javascript

	$.remoteSite({

		changeOrientation: function(){

			if ( this.data.orientation == 'landscape' ) {

			 	...
			}

		}
	});
```


###dragRemote ()
If you need some drag gesture in order to remote a slider or a stop motion, use this callback.
Values returned:

- `this.data.drag`: return a range of values : `between  -200 and 200 `
- `this.data.direction`: corresponding to the direction the mobile was dragged : ` 'up',  'down',  'left',  'right' `
- `this.data.section`: corresponding to the section's number : ` 1,2,3 ... `

Example:

```javascript

	$.remoteSite({

		dragRemote: function(){

			...

		}
	});
```


###videoRemote ()
This callback allows you to control a YouTube video from the mobile app.
Values returned:

- `this.data.command`: return the command corresponding to the user tapped on mobile : ` 'playVideo', 'pauseVideo', 'mute', 'unMute', 'fullscreen', 'unfullscreen'  `
- `this.data.section`: corresponding to the section's number : ` 1,2,3 ... `

Example:

```javascript

	$.remoteSite({

		videoRemote: function(){

			var $video = $('#video-youtube');

		    	if (this.data.command == 'fullscreen' || this.data.command == 'unfullscreen') {

		    		...

		    	} else {

		    		$video[0].contentWindow.postMessage('{"event":"command","func":"' + this.data.command + '","args":""}', '*');

		    	}

		}
	});
```



## Donations
Donations would be more than welcome :)

[![Donate](https://www.paypalobjects.com/en_US/GB/i/btn/btn_donateCC_LG.gif)]


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
