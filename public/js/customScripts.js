//TODO: 
//1. add error checking
//2. if they choose 'definitely' indicate they need to enter guest info
//3. add db connections
//4. make db match current setup
$(document).ready(function(){
	$('.carousel').carousel('cycle');
	
	var activeurl = window.location.pathname;
	$('a[href="'+activeurl+'"]').parent('li').addClass('active');
	
	$('input#yes').click(function(){
		MainApp.addGuest();
	});
	$('input#no').click(function(){
		$('#attendeeDetails').empty();
	});
		
	$('#rsvp').submit(function(){
		MainApp.validateRSVP();
		return false;
	});
	
});

var MainApp={
	"numGuests":0,
	"meal1":"Chicken",
	"meal2":"Vegetarian",
	"guestString":"",
	"addGuest":function(){
		MainApp.numGuests++;
		MainApp.guestString = "";
		if (MainApp.numGuests < 6) {
			MainApp.createGuestString(true);
		} else {
			MainApp.createGuestString(false);
		}
		$('div#attendeeDetails').append(MainApp.guestString);
	},
	"createGuestString":function(more){
		MainApp.guestString = "<div id=\"guest" + MainApp.numGuests + "\" class=\"row-fluid\" \"guest\">";
		
		MainApp.guestString += "<div class=\"span2\"><div class=\"control-group\"><label";
		MainApp.guestString += " class=\"control-label\" for=\"lName" + MainApp.numGuests;
		MainApp.guestString += "\"> Last name</label><div class=\"controls\"><input id=\"lName" + MainApp.numGuests;
		MainApp.guestString += "\" type=\"text\" name=\"lName" + MainApp.numGuests + "\" class=\"input-auto\" lName>";
		MainApp.guestString += "</div></div></div>";
		
		MainApp.guestString += "<div class=\"span2\"><div class=\"control-group\"><label";
		MainApp.guestString += " class=\"control-label\" for=\"fName" + MainApp.numGuests;
		MainApp.guestString += "\"> First name</label><div class=\"controls\"><input id=\"fName" + MainApp.numGuests;
		MainApp.guestString += "\" type=\"text\" name=\"fName" + MainApp.numGuests + "\" class=\"input-auto\" fName>";
		MainApp.guestString += "</div></div></div>";
		
		MainApp.guestString += "<div class=\"span3\"><div class=\"control-group\"><label";
		MainApp.guestString += " class=\"control-label\" for=\"meal" + MainApp.numGuests;
		MainApp.guestString += "\"> Meal choice</label><div class=\"controls\"><select class=\"meal\" ";
		MainApp.guestString += "id=\"meal" + MainApp.numGuests + "\"><option value=\"" + MainApp.meal1 + "\">";
		MainApp.guestString += MainApp.meal1 + "</option><option value=\"" + MainApp.meal2 + "\">" + MainApp.meal2;
		MainApp.guestString += "</option></select></div></div></div>";

		MainApp.guestString += "<div class=\"span3\"><div class=\"control-group\"><label";
		MainApp.guestString += " class=\"control-label\" for=\"restriction" + MainApp.numGuests;
		MainApp.guestString += "\"> Dietary restriction</label><div class=\"controls\">";
		MainApp.guestString += "<input id=\"restriction" + MainApp.numGuests;
		MainApp.guestString += "\" type=\"text\" name=\"restriction" + MainApp.numGuests + "\"></div></div></div>";
		
		if (more === true) {
			MainApp.guestString += "<div id=\"changeGuest" + MainApp.numGuests + "\" class=\"changeGuest span1\">";
			MainApp.guestString += "<a href=\"javascript:MainApp.addGuest();void(0);";
			MainApp.guestString += "\"><img class=\"addGuest\" id=\"addGuest" + MainApp.numGuests + "\" src=\"/pics/add.png";
			MainApp.guestString += "\" alt=\"Add guest\"></a></div>";
		}
		
		if(MainApp.numGuests > 1) {
			var prevGuest = MainApp.numGuests - 1;
			var remID = 'div#changeGuest' + prevGuest + '.changeGuest.span1';
			$(remID).empty();
		}
							
		MainApp.guestString += "</div>";
	},
	"validateInputs":function(){
		var err = false;
		if(!$('#email').val()) {
			err = true;
		}
		if(!$('input[name="attending"]').val()) {
			err = true;
		}
		if($('input[class="lName"]').length > 0) {
			$('input[class="lName"]').each(function(lname){
				if(!lname.val()) {
					err = true;
				}
			});
		}
		if($('input[class="fName"]').length > 0) {
			$('input[class="fName"]').each(function(fname){
				if(!fname.val()) {
					err = true;
				}
			});
		}
		if($('select[class="meal"]').length > 0) {
			$('select[class="meal"]').each(function(meal){
				if(!meal.val()) {
					err = true;
				}
			});
		}

		return err;
	},
	"alertError":function(msg){
		$('#alertError').append('<div class="alert alert-error">' + msg + '</div>');
	},
	"validateRSVP":function(){
		if (MainApp.validateInputs() === false){
			alert('inputs are valid');
			$.post('/commitRSVP',rsvpValues).done(function(data){
				$('#rsvpContent').empty();
				$('#rsvpContent').append('<h2> Thank you for responding!! Feel free to investigate this site.</h2>');
			});
		} else {
			MainApp.alertError("Please fill in all the fields before submitting");
		}
	}
};