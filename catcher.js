var wordlen = 7;

$('#explain').bind("paste",function(e) {
	e.preventDefault();
});
$('#explain').focus();  
$(document).on('keyup', function(e){
	if(e.which == 13){
		var url = window.location.href;
		var uri = new URI(url),
            queryObj = URI.parseQuery(uri.query()),
            explain  = $("#explain")
            words    = explain.val();
		if(!Gibberish.isGibberish(words) && words.length > wordlen){
			chrome.runtime.sendMessage({redirect: queryObj['next']});
		} else {
			$("#explain").shake({speed: 40, distance: 8, times: 2}).val('');
		}
	}

})
