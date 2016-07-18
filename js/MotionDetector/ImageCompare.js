/**
 *
 * @project        Motion Detection in JS
 * @file           ImageCompare.js
 * @description    Compares two images on pixel level.
 * @author         Benjamin Horn
 * @package        MotionDetector
 * @version        -
 * 
 */

;(function(App) {

	"use strict";
	
	/*
	 * Compares to images and shows the difference starting
	 * from the top left to the bottom right.
	 *
	 * @return <Object> The initalized object.
	 *
	 */
	App.ImageCompare = function() {
		var sensitivity, temp1Canvas, temp1Context, temp2Canvas, temp2Context, topLeft, bottomRight;

		/*
		 * Initializes the object.
		 * Also used as a reset between image comparements.
		 *
		 * @return void.
		 *
		 */
		function initialize() {
			sensitivity = 40;

			if(!temp1Canvas) {
				temp1Canvas = document.createElement('canvas');
				temp1Context = temp1Canvas.getContext("2d");
			}

			if(!temp2Canvas) {
				temp2Canvas = document.createElement('canvas');
				temp2Context = temp2Canvas.getContext("2d");
			}

			topLeft = [Infinity,Infinity];
			bottomRight = [0,0];
		}

		/*
		 * Compares to images.
		 *
		 * @param <Element> image1 The canvas of the first image.
		 * @param <Element> image2 The canvas of the second image.
		 * @param <Int>		width  The width to compare.
		 * @param <Int>		height The height to compare
		 *
		 * @return <Object> The top left, and the bottom right pixels.
		 *
		 */
		function compare(image1, image2, width, height) {
			initialize();

			if(!image1 || !image2) {
				return;
			}

			temp1Context.clearRect(0,0,100000,100000);
			temp1Context.clearRect(0,0,100000,100000);

			temp1Context.drawImage(image1, 0, 0, width, height);
			temp2Context.drawImage(image2, 0, 0, width, height);


			for(var y = 0; y < height; y++) {
				for(var x = 0; x <  width; x++) {
					var pixel1 = temp1Context.getImageData(x,y,1,1);
					var pixel1Data = pixel1.data;

					var pixel2 = temp2Context.getImageData(x,y,1,1);
					var pixel2Data = pixel2.data;

					if(comparePixel(pixel1Data, pixel2Data) == false) {
						setTopLeft(x,y);
						setBottomRight(x,y);
					}					
				}
			}

			return {
				'topLeft': topLeft,
				'bottomRight': bottomRight
			}
		}

		/*
		 * Compares an individual pixel (within a range based on sensitivity).
		 *
		 * @param <Array> p1 The first pixel [r,g,b,a].
		 * @param <Array> p2 The second pixel [r,g,b,a].
		 *
		 * @return <Boolean> If they are the same.
		 *
		 */
		function comparePixel(p1, p2) {
			var matches = true;

			for(var i = 0; i < p1.length; i++) {
				var t1 = Math.round(p1[i]/10)*10;
				var t2 = Math.round(p2[i]/10)*10;

				if(t1 != t2) {
					if((t1+sensitivity < t2 || t1-sensitivity > t2)) {
						matches = false;
					}
				}
			}

			return matches;
		}

		/*
		 * Sets the top left pixel.
		 *
		 * @param <int> x The x position.
		 * @param <int> y The y position.
		 *
		 * @return void.
		 *
		 */
		function setTopLeft(x,y) {
			if(x < topLeft[0] ) {
				topLeft[0] = x;
			}
			if(y < topLeft[1]) {
				topLeft[1] = [y];
			}
		}

		/*
		 * Sets the bottom right pixel.
		 *
		 * @param <int> x The x position.
		 * @param <int> y The y position.
		 *
		 * @return void.
		 *
		 */
		function setBottomRight(x,y) {
			if(x > bottomRight[0]) {
				bottomRight[0] = [x];
			}
			if(y > bottomRight[1]) {
				bottomRight[1] = [y];
			}
		}

		// Initialize on creation.
		initialize();

		// Return public interface.
		return {
			compare: compare
		}
	};
})(MotionDetector);
