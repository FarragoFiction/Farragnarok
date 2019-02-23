
var firstFrame = true;
//if this is slow we can have a queue of different images we want to have displayed
//once we have an image at all we can fire up another 'thread' and have it start making them
//and then just throw them away when the image changes? can't hurt to pursue

function lookForCharImages(){
    var elements = document.getElementsByClassName("chara_img");
    for(var element in elements){
        try{
            censor(elements[element],10);
        }catch(err){
            //no worries, just wasn't an image or something
        }
    }
    setTimeout(lookForCharImages, 60);
}

function censor(imageElement ,  size){
    var buffer = document.createElement('canvas');
    buffer.width = imageElement.width;
    buffer.height = imageElement.height;

    var canvas = document.createElement('canvas');
    canvas.width = imageElement.width;
    canvas.height = imageElement.height;
    buffer.getContext("2d").drawImage(imageElement,0,0);
    if(firstFrame){
         firstFrame = false;
         pixilifyIt(canvas, buffer,size);
   }else{
       impressionism(canvas, buffer,size);
   }
   imageElement.src = canvas.toDataURL();
}

function makeTestCanvas(){
    var output = document.getElementById("output");
    var canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    canvas.style.border   = "1px solid";
    output.append(canvas);
    return canvas;
}

function sampleImageCanvas(canvas){
    var buffer = document.createElement('canvas');
    buffer.width = 400;
    buffer.height = 400;
    var img = new Image();
    img.addEventListener('load', function() {
      // execute drawImage statements here
       buffer.getContext("2d").drawImage(img,0,0);
       fuckshitup(canvas, buffer,20);

    }, false);
    img.src = './data/fgimage/chara/1/Prince_of_Life.png';

}

function impressionism(canvas,source, size){
    var context = canvas.getContext("2d");
    context.drawImage(source,0,0);
    var imgData = source.getContext("2d").getImageData(0, 0, source.width, source.height);
    //100 at a time?
    for(var i = 0; i<500; i++){
        var x = Math.random()*canvas.width;
        var y = Math.random()*canvas.height;
        var new_color =  colorAtPixelRandomAlpha(canvas.width,imgData.data, x,y);
        context.fillStyle = new_color;
        context.beginPath();
        context.rect(x, y, size, size);
        context.fill();
    }

}

function pixilifyIt(canvas,source, size){
    var context = canvas.getContext("2d");
    //context.drawImage(source,0,0);
    var imgData = source.getContext("2d").getImageData(0, 0, source.width, source.height);
    for(var x = 0 ; x < canvas.width; x+=size){
        for(var y = 0; y< canvas.height; y+=size){
            new_color = colorAtPixel(canvas.width,imgData.data, x,y);
            context.fillStyle = new_color;
            context.beginPath();
            context.rect(x, y, size, size);
            context.fill();
        }

    }
}

function ohgoditsmelting(canvas,source, size){
    var context = canvas.getContext("2d");
    //context.drawImage(source,0,0);
    var imgData = source.getContext("2d").getImageData(0, 0, source.width, source.height);
    for(var x = 0 ; x < canvas.width; x+=1+Math.floor(Math.random() * 10)){
        for(var y = 0; y< canvas.height; y+=1+Math.floor(Math.random() * 10) ){
        new_color = colorAtPixel(canvas.width,imgData.data, x,y);
        context.fillStyle = new_color;
        //TODO fill is expensive so only call it when the color changes (  i think)
        context.beginPath();
        context.rect(x, y, size, size);
        context.fill();
        }

    }
}

//turns things into weird post it grids
function gridify(canvas,source, size){
    var context = canvas.getContext("2d");
    //context.drawImage(source,0,0);
    var imgData = source.getContext("2d").getImageData(0, 0, source.width, source.height);
    for(var x = 0 ; x < canvas.width; x+=size+Math.floor(Math.random() * 10)){
        for(var y = 0; y< canvas.height; y+=size+Math.floor(Math.random() * 10) ){
        new_color = colorAtPixel(canvas.width,imgData.data, x,y);
        context.fillStyle = new_color;
        //TODO fill is expensive so only call it when the color changes (  i think)
        context.beginPath();
        context.rect(x, y, size, size);
        context.fill();
        }

    }
}

function test(){
    console.log("hello world");
    var canvas = makeTestCanvas();
    sampleImageCanvas(canvas);
}

function colorAtPixel(width,image_data, x,y){
    y = Math.floor(y)
	x = Math.floor(x)
	var i = (y * width + x)* 4; //array is in sets of rgba
	//rgba(255, 255, 255, 0.5)"
	return createRGB(image_data[i],image_data[i+1] ,image_data[i+2],image_data[i+3]/255);
}

function colorAtPixelRandomAlpha(width,image_data, x,y){
    y = Math.floor(y)
	x = Math.floor(x)
	var i = (y * width + x)* 4; //array is in sets of rgba
	//rgba(255, 255, 255, 0.5)"
	var alpha = image_data[i+3]/255
	if(alpha != 0){
	    alpha = Math.random();
	}
	return createRGB(image_data[i],image_data[i+1] ,image_data[i+2],alpha);
}

function antiColorAtPixel(width,image_data, x,y){
    y = Math.floor(y)
	x = Math.floor(x)
	var i = (y * width + x)* 4; //array is in sets of rgba
	//rgba(255, 255, 255, 0.5)"
	return createRGB(255-image_data[i],255-image_data[i+1] ,255-image_data[i+2],image_data[i+3]/255);
}



//~~~~~~~~~~~~~~~~thanks past jr from pre SBURBSim, ModernArtSim is valid

function createRGB(red, green, blue, alpha){
   return "rgb(" + red + "," + green + "," + blue + ","+alpha +")";
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function createHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}



//I need to turn an x,y coordinate into a location in an array.
//from 2d to 1d.
//if i assume each array takes up an equal amount of physical space,
//then I know when the 'row' ends.
function coordToArrayElement(num_rows, num_columns, cell_width, cell_height, x,y,array){
	//first, how far down are we?
	//the row I fall in ends after I end, and starts before I start.

	var row = Math.ceil(y/cell_height) - 1;
	var column = Math.ceil(x/cell_width) - 1;
	//console.log("y is: " + y + " so I think I'm at row: " + row + " because cell_height is: " + cell_height);
	//console.log("x is: " + x + " so I think I'm at column: " + column + " because cell_width is: " + cell_width);
	//first element is zero, second is 1. if 3 columns, then fourth element will be 3, or 3 columns * 1st row + zero)
	var ret = row*num_columns + column;
	if(ret > array.length - 1 || ret < 0){
		return 0;
	}

	return array[ret];
}
