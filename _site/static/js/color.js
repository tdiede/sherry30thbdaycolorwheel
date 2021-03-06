"use strict";


// set canvas and ctx
var canvas = document.getElementById('canvas-picker');
var ctx = canvas.getContext('2d');
// create an image object
var img = new Image();
img.onload = addImageToCanvas;
// set img source
// img.src = 'static/img/poraschaudhary-photo-21.jpg';
// img.src = 'static/img/Dhuleti-Pictures-Photos-color-festival-india.jpg';
img.src = 'static/img/koli_hand.jpg';
console.log(img.height+'x'+img.width);


var width = $(window).width();
$(document).ready( setCanvas(width) );
$(document).ready( function() {
    var opacity = $('#opacity-range').val();
    setOpacity(opacity);
});
$(window).resize(function() {
    if ($(this).width() != width) {
        width = $(this).width();
        console.log(width);
        resizeCanvas(width);
    }
});


// set initial canvas dimensions
function setCanvas(width) {
    canvas.width = width;
    canvas.height = 0.5 * width;
    console.log(width+'x'+canvas.height);
}

// resize canvas, if change detected on window.width
function resizeCanvas(width) {
    canvas.width = width;
    canvas.height = (img.height/img.width) * width;
    addImageToCanvas();
}


// copy the image to the canvas
function addImageToCanvas() {
    img.width = canvas.width;
    img.height = canvas.height;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    placeDot(img.width/2, img.height/2);
}


function placeDot(x,y) {
    // console.log(x,y);
    var centerX = x;
    var centerY = y;
    var radius = 5;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'rgba(200,200,200, 0.5)';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'white';
    ctx.stroke();
}

function moveDot(x,y) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, img.width, img.height);
    placeDot(x,y);
}

function calculateColor(e) {
// getting user coordinates
var x = event.pageX - this.offsetLeft;
var y = event.pageY - this.offsetTop;
// getting image data and RGB values
var imgData = ctx.getImageData(x, y, 1, 1).data;
var R = imgData[0];
var G = imgData[1];
var B = imgData[2];
var rgb = R + ',' + G + ',' + B;
// convert RGB to HEX
var hex = rgbToHex(R,G,B);
// making the color the value of the input
$('#rgb').val(rgb);
$('#hex').val('#'+hex);
// change color of div
changeColor(rgb);
moveDot(x,y);
}

function changeColor(color) {
    $('#sample-box').css('background-color', 'rgb('+color+')');
    $('h1').css('color', 'rgb('+color+')');
    $('h1').css('text-shadow', '3px 3px 1px white');
}

function updateRGBValue(result) {
    var color = $('#rgb').val();
    var RGB = color.split(',');
    var R = RGB[0];
    var G = RGB[1];
    var B = RGB[2];
    var hexConverted = rgbToHex(R,G,B);
    $('#hex').val('#'+hexConverted);
    // return rgb('rgb')
    changeColor(color);
}

function updateHEXValue(result) {
    var hexInput = $('#hex').val();
    var color = hexToRGB(hexInput);
    $('#rgb').val(color);
    // return rgb('rgb')
    changeColor(color);
    if (hexInput[0] !== '#') {
        var hexText = '#'+hexInput.toUpperCase();
    } else {
        var hexText = hexInput.toUpperCase();
    }
    $('#hex').val(hexText);
}

function rgbToHex(R,G,B) {return toHex(R)+toHex(G)+toHex(B)}
function toHex(n) {
n = parseInt(n,10);
if (isNaN(n)) return "00";
n = Math.max(0,Math.min(n,255));
return "0123456789ABCDEF".charAt((n-n%16)/16)  + "0123456789ABCDEF".charAt(n%16);
}

function hexToRGB(hex) {
    if (hex[0] === '#') {
        var hexStripped = hex.substring(1);
    } else {
        var hexStripped = hex;
    }
    var bigint = parseInt(hexStripped, 16);
    var R = (bigint >> 16) & 255;
    var G = (bigint >> 8) & 255;
    var B = bigint & 255;

    return R + "," + G + "," + B;
}

function setOpacity(opacity) {
    $('#sample-box').css('opacity', opacity/100);
    $('#opacity-range-label').html(opacity + '%');
    $('#happy-birthday').css('opacity', opacity/100);
}

function updateOpacity(e) {
    var opacity = $('#opacity-range').val();
    setOpacity(opacity);
}

$(document).ready(function() {
    $('#opacity-range').change(updateOpacity);

    $('#canvas-picker').click(calculateColor);

    $('#hex').change(updateHEXValue);
    $('#rgb').change(updateRGBValue);

});
