//TODO: 
//1. add error checking
//2. if they choose 'definitely' indicate they need to enter guest info
//3. add db connections
//4. make db match current setup
$(function(){
	$('.carousel').carousel('cycle');
	
	var activeurl = window.location.pathname;
	$('a[href="'+activeurl+'"]').parent('li').addClass('active');
	
	$('input#yes').click(function(){
		$('#attendeeDetails').empty();
		MainApp.addGuest();
	});
	$('input#no').click(function(){
		$('#attendeeDetails').empty();
		MainApp.addNoGuest();
	});
	
	$('#rsvp').submit(function(){
		var valid = true;
		var errorMsg = "Please fill in all the fields before submitting";
		$('.required').each(function(num){
			var element = $('.required')[num];
			if(element.name === "attending" && $('input:radio[name="attending"]:checked').length === 0) {
				MainApp.alertError(errorMsg, '');
				valid = false;
				return false;
			} else if($('#' + element.id).val().length === 0) {
				MainApp.alertError(errorMsg, element.id);
				valid = false;
				return false;
			} else {
				if (element.name !== "attending") {
					MainApp.removeError(element.id);
				}
			}
		});
		
		if (valid === true) {
			MainApp.submitRSVP();
		}
		return false;
	});
	
});

var MainApp={
	"numGuests":0,
	"meal1":"Chicken",
	"meal2":"Vegetarian",
	"guestString":"",
	"noGuestString":"",
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
	"addNoGuest":function(){
		MainApp.numGuests++;
		MainApp.createNoGuestString();
		$('div#attendeeDetails').append(MainApp.noGuestString);
	},
	"createGuestString":function(more){
		MainApp.guestString = "<div id=\"guest" + MainApp.numGuests + "\" class=\"row-fluid guest\">";
		
		MainApp.guestString += "<div class=\"span2\"><div class=\"control-group\"><label";
		MainApp.guestString += " class=\"control-label\" for=\"lName" + MainApp.numGuests;
		MainApp.guestString += "\"> Last name</label><div class=\"controls\"><input id=\"lName" + MainApp.numGuests;
		MainApp.guestString += "\" type=\"text\" name=\"lName" + MainApp.numGuests + "\" class=\"input-auto";
		MainApp.guestString += " required\"></div></div></div>";
		
		MainApp.guestString += "<div class=\"span2\"><div class=\"control-group\"><label";
		MainApp.guestString += " class=\"control-label\" for=\"fName" + MainApp.numGuests;
		MainApp.guestString += "\"> First name</label><div class=\"controls\"><input id=\"fName" + MainApp.numGuests;
		MainApp.guestString += "\" type=\"text\" name=\"fName" + MainApp.numGuests + "\" class=\"input-auto";
		MainApp.guestString += " required\"></div></div></div>";
		
		MainApp.guestString += "<div class=\"span3\"><div class=\"control-group\"><label";
		MainApp.guestString += " class=\"control-label\" for=\"meal" + MainApp.numGuests;
		MainApp.guestString += "\"> Meal choice</label><div class=\"controls\"><select class=\"required\" ";
		MainApp.guestString += "id=\"meal" + MainApp.numGuests + "\"" + "name=\"meal" + MainApp.numGuests + "\">";
		MainApp.guestString += "<option value=\"" + MainApp.meal1 + "\">";
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
	"createNoGuestString":function(){
		MainApp.noGuestString = "<div id=\"guest\" class=\"row-fluid guest\">";
		
		MainApp.noGuestString += "<div class=\"span2\"><div class=\"control-group\"><label";
		MainApp.noGuestString += " class=\"control-label\" for=\"lName";
		MainApp.noGuestString += "\"> Last name</label><div class=\"controls\"><input id=\"lName";
		MainApp.noGuestString += "\" type=\"text\" name=\"lName\" class=\"input-auto required\"";
		MainApp.noGuestString += "></div></div></div>";
		
		MainApp.noGuestString += "<div class=\"span2\"><div class=\"control-group\"><label";
		MainApp.noGuestString += " class=\"control-label\" for=\"fName";
		MainApp.noGuestString += "\"> First name</label><div class=\"controls\"><input id=\"fName";
		MainApp.noGuestString += "\" type=\"text\" name=\"fName\" class=\"input-auto required\"";
		MainApp.noGuestString += "></div></div></div>";
		MainApp.noGuestString += "</div>";
	},
	"alertError":function(msg, id){
		if ($('#alertError').children().length === 0) {
			$('#alertError').append('<div class="alert alert-error">' + msg + '</div>');
		}
		if (id !== '') {
			$('#' + id).addClass('error');
		}
	},
	"removeError":function(id){
		$('#alertError').empty();
		if (id !== '') {
			$('#' + id).removeClass('error');
		}
	},
	"submitRSVP":function(){
		var groupInfo = [$('input[name="email"]').val(),$('input:radio[name="attending"]:checked').val(),
			MainApp.numGuests];
		var guestsInfo = [];
		if ($('input:radio[name="attending"]:checked').val() === "no") {
			var guestInfo = [$('input[name="lName"]').val(),$('input[name="fName"]').val()];
			groupInfo.push(guestInfo);
		} else {
			$('.guest').each(function(guest) {
				guestNum = guest + 1;
				var guestInfo = [$('input[name="lName' + guestNum + '"]').val(),
					$('input[name="fName' + guestNum + '"]').val(),$('#meal' + guestNum).val(), 
					$('input[name="restriction' + guestNum + '"]').val()];
				guestsInfo.push(guestInfo);
			});
			groupInfo.push(guestsInfo);
		}
		
		$.post("/commitGuest", {guests:groupInfo})
		.done(function(data) {
			$('#rsvpContent').empty();
			$('#rsvpContent').addClass('middle');
			$('#rsvpContent').append("<div class=\"hero-unit\"><h2> " + data + "</h2><p class=\"lead\"> Thank you for responding! Feel free to continue browsing the site!</div>");
		})
		.fail(function() { 
			$('#rsvpContent').empty();
			$('#rsvpContent').append("<h2> Oops something went wrong! Please try again");
		});
	}
};