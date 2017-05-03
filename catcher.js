var wordlen = 15;

$('#explain').bind("paste",function(e) {
	e.preventDefault();
});
$('#explain').focus();  
$(document).on('keyup', function(e){
	if(e.which == 13){
		var url = window.location.href;
		uri = new URI(url);
		queryObj = URI.parseQuery(uri.query());
		var words = $("#explain").val(),
			wordList = words.split(/\s+/),
			short = true;
		for(var i = 0; i < wordList.length; i++){
			if(wordList[i].length > words.length*.7){
				short = false;
				break;
			}
		}
		if(words.length >= wordlen && short){
			chrome.runtime.sendMessage({redirect: queryObj['next']});

		} 
	}

})