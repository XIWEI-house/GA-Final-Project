// "use strict"

var Cylinder = function(location) {
	this.location = location;
  	this.ball = false;

  	// has ball 
  	Cylinder.prototype.hasBall = function(){
  		return this.ball;
  	}

  	// get current location
  	Cylinder.prototype.getLoc = function(){
  		return this.location;
  	}

  	// move to new location
  	Cylinder.prototype.move = function(loc){
  		this.location = loc;
  	}
}

var View = function(cylinder) {
	this.cylinder = cylinder;
  	this.$li = $('<li>');
  	var that = this;

  	this.$li.on('click', function(){
  		game.guess(that.cylinder.hasBall());
  	})

  	// render start page
  	View.prototype.render = function($ul, hasBall){
  		var $div = $('<div>')
  		this.$li.addClass(this.cylinder.getLoc());
  		if(hasBall) {
  			$div.addClass('ball')
  			this.$li.append($div);
  		} 
  		$ul.append(this.$li);
  	}

  	View.prototype.hideBall = function(children) {
		this.$li.children().fadeOut(function(){
			this.remove();
		})
  	}

  	View.prototype.showBall = function(children) {
  		if(this.cylinder.hasBall()){
  			
  			this.$li.append($('<div>').addClass('ball'));
  		}
  	}

  	View.prototype.getLoc = function(){
  		return this.cylinder.getLoc();
  	}

  	View.prototype.move = function(newLoc){
  		this.$li.removeClass(this.cylinder.getLoc());
  		this.$li.addClass(newLoc);
  		this.cylinder.move(newLoc);
  	}


}

var game = {
	locations: ['one', 'two', 'three'],
	$button: $('#button'),
	cylinders: [],
	played: false,
	interval: undefined,
	chooseColumn: false,



	guess: function(results) {
		if(this.chooseColumn) {
			if(results){
				this.display('You have got the ball!');
			} else {
				this.display('Oops, you missed it, please try it again.')
			}
			this.cylinders[1].showBall();
			this.chooseColumn = false;

		}
	},

	display: function(msg){
    	$('#display').text(msg);
  	},

  	choose: function(){
    	this.chooseColumn = true;
    	this.display('Choose');
  	},

	start: function() {

		var cylinderList = $('#choices');
		cylinderList.html('');
		for(var i=0; i<this.locations.length; i+=1) {
			var cylinder = new Cylinder(this.locations[i])
			if(this.locations[i] === 'two'){
				cylinder.ball = true;
			}
			var view = new View(cylinder);
			view.render(cylinderList, cylinder.ball);
			this.cylinders.push(view)
		}
		
	},

	buttonEvent: function() {
		var that = this;
		this.$button.on('click', function(){
			if(that.played){
				that.reset()
				that.played = false;
				that.$button.text('Start game!');
			} else {
				that.startGame(times);
				that.played=true;
				that.$button.text('Reset');

			}			
		})
	},

	reset: function() {
		clearInterval(this.interval);
		$('ul').children().remove();
		this.cylinders = [];
		this.start();
		$('#display').text('');
		times = 10;
		updateCount();
	},

	startGame: function() {
		var time = 1000;
		this.cylinders[1].hideBall(1);
		var swaps = times;
		var that = this;
		this.interval = setInterval(function(){
			if(swaps > 0) {
				that.swapAround();
			}else {
				clearInterval(that.interval);
				that.choose();
			}
			swaps-=1;
		}, time);
	},

	swapAround: function(){
		var cylinders = [];
		for(var i=0; i<this.cylinders.length; i+=1){
			cylinders.push(this.cylinders[i]);
		}
		var cylinder1 = cylinders.splice(Math.floor(Math.random() * cylinders.length), 1)[0];
		var cylinder2 = cylinders.splice(Math.floor(Math.random() * cylinders.length), 1)[0];
		var loc1 = cylinder1.getLoc();
		var loc2 = cylinder2.getLoc();
		cylinder1.move(loc2);
		cylinder2.move(loc1);
	}
}



$(function() {
	game.start();
	game.buttonEvent()
});

$('#new').on('submit', updateShuffleTimes);
var times = 10;

function updateShuffleTimes(event) {
	event.preventDefault();
	times = $('#times').val();
	updateCount();
}

function updateCount(){
	$('#count').html(times);
}