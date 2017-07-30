var wordlen = 15;

$('#explain').bind("paste",function(e) {
	e.preventDefault();
});
$('#explain').focus();  
$(document).on('keyup', function(e){
	if(e.which == 13){
		var url = window.location.href;
		var uri = new URI(url),
            queryObj = URI.parseQuery(uri.query()),
            words = $("#explain").val();
		if(!Gibberish.isGibberish(words)){
			chrome.runtime.sendMessage({redirect: queryObj['next']});

		} 
	}

})