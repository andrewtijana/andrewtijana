$(function(){
	function stripTrailingSlash(str) {
		if(str.substr(-1) == '/') {
			return str.substr(0, str.length - 1);
		}
		return str;
	}

	var activePage = stripTrailingSlash(window.location.pathname);

	$('.nav li a').each(function(){  
		var currentPage = stripTrailingSlash($(this).attr('href'));
		if ((activePage == currentPage) || (activePage.indexof('#') != -1)) {
			$(this).parent().addClass('active'); 
		}
	});
});