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
	"meal1":"Caesar Salad",
	"meal2":"Cheddar/Cauliflower Soup",
	"meal3":"Kids 5-12yrs",
	"meal4":"Kids < 5yrs",
	"guestString":"",
	"noGuestString":"",
	"addButtonString":"",
	"addGuest":function(){
		MainApp.numGuests++;
		MainApp.guestString = "";
		MainApp.removePrevAddButton();
		if (MainApp.numGuests < 6) {
			MainApp.createGuestString(true);
		} else {
			MainApp.createGuestString(false);
		}
		$('div#attendeeDetails').append(MainApp.guestString);
	},
	"deleteGuest":function(id){
		$('#addGuest' + (MainApp.numGuests - 1)).remove();
		MainApp.numGuests--;
		$('#' + id).remove();
		MainApp.addGuestButton();
		$('#changeGuest' + MainApp.numGuests).append(MainApp.addButtonString);
	},
	"addNoGuest":function(){
		MainApp.numGuests++;
		MainApp.createNoGuestString();
		$('div#attendeeDetails').append(MainApp.noGuestString);
	},
	"addGuestButton":function() {
		MainApp.addButtonString = "<div id=\"addGuest" + MainApp.numGuests + "\" class=\"span1 middle\">";
		MainApp.addButtonString += "<a href=\"javascript:MainApp.addGuest();void(0);";
		MainApp.addButtonString += "\"><img id=\"addGuestImg" + MainApp.numGuests + "\" src=\"/pics/add.png";
		MainApp.addButtonString += "\" alt=\"Add guest\"></a></div>";
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
		MainApp.guestString += "<option value=\"" + MainApp.meal3 + "\">" + MainApp.meal3 + "</option>";
		MainApp.guestString += "<option value=\"" + MainApp.meal4 + "\">" + MainApp.meal4 + "</option>";
		MainApp.guestString += "</select></div></div></div>";

		MainApp.guestString += "<div class=\"span3\"><div class=\"control-group\"><label";
		MainApp.guestString += " class=\"control-label\" for=\"restriction" + MainApp.numGuests;
		MainApp.guestString += "\"> Dietary restriction</label><div class=\"controls\">";
		MainApp.guestString += "<input id=\"restriction" + MainApp.numGuests;
		MainApp.guestString += "\" type=\"text\" name=\"restriction" + MainApp.numGuests + "\"></div></div></div>";
		
		MainApp.guestString += "<div id=\"changeGuest" + MainApp.numGuests + "\">";
		if (more === true) {
			MainApp.addGuestButton();
			MainApp.guestString += MainApp.addButtonString;
			MainApp.addButtonString = ""
		}
		if (MainApp.numGuests > 1) {
			MainApp.guestString += "<div id=\"deleteGuest" + MainApp.numGuests + "\" class=\"span1 middle\">";
			MainApp.guestString += "<a href=\"javascript:MainApp.deleteGuest('guest";
			MainApp.guestString += MainApp.numGuests + "');void(0);";
			MainApp.guestString += "\"><img id=\"deleteGuestImg" + MainApp.numGuests + "\" src=\"/pics/delete.png";
			MainApp.guestString += "\" alt=\"Delete guest\"></a></div>";
		}
		MainApp.guestString += "</div>";
							
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
	"removePrevAddButton":function() {
		$('#addGuest' + (MainApp.numGuests - 1)).remove();
	},
	"submitRSVP":function(){
		var groupInfo = [$('input[name="email"]').val(),$('input:radio[name="attending"]:checked').val(),
			MainApp.numGuests];
		var guestsInfo = [];
		if ($('input:radio[name="attending"]:checked').val() === "no") {
			var guestInfo = [$('input[name="lName"]').val(),$('input[name="fName"]').val()];
			groupInfo.push(guestInfo);
		} else {
			for(var i = 1; i <= MainApp.numGuests; i++) {
				var guestInfo = [$('input[name="lName' + i + '"]').val(),
					$('input[name="fName' + i + '"]').val(),$('#meal' + i).val(), 
					$('input[name="restriction' + i + '"]').val()];
				guestsInfo.push(guestInfo);
			}
			groupInfo.push(guestsInfo);
		}
		
		$('body').addClass('loading');
		$.post("/commitGuest", {guests:groupInfo})
		.done(function(data) {
			$('body').removeClass('loading');
			$('#rsvpContent').empty();
			$('#rsvpContent').addClass('middle');
			$('#rsvpContent').append("<div class=\"hero-unit\"><h2> " + data + "</h2><p class=\"lead\"> Thank you for responding! Feel free to continue browsing the site!</div>");
		})
		.fail(function() { 
			$('body').removeClass('loading');
			$('#rsvpContent').empty();
			$('#rsvpContent').append("<h2> Oops something went wrong! Please try again");
		});
	}
};