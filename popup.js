chrome.storage.sync.get('blocked', function(details){
	console.log(details);
	var websites = details['blocked'];
	if(!websites){
		chrome.storage.sync.set({'blocked': []}, function(){
			websites = [];
		})
	}
	setURLs(websites);
});


chrome.storage.onChanged.addListener(function(details){
	chrome.storage.sync.get('blocked', function(details){
		var websites = details['blocked'];
		setURLs(websites);

	});
});

function setURLs(arr){
	list = $("#url-list");
	list.empty();
	arr.forEach(function(current, index, arr){
		list.append($('<li class = "url">')
                .append($('<span class = "delete">')
                    .text('x'))
                .append($('<span class = "blocked">')
                        .text(current)));
			
	})
    $('.delete').on('click', function(e){
        console.log('clicked');
        var $this = $(this);
        chrome.tabs.query({
        "active": true,
        "currentWindow": true,
        "status": "complete",
        "windowType": "normal"}, function (tabs) {
            var currentDomain;
            for (i in tabs) {
                     currentDomain = tabs[i].url;
            }
            var rawDomain = $this.siblings('span').text(),
                storedDomain = URI(rawDomain),
                currentDomain = URI(currentDomain);

            var current = currentDomain.subdomain() + "." + currentDomain.domain(),
                stored = storedDomain.path();
            if(current == stored){
                chrome.runtime.sendMessage({removeStorage: stored});
            }
            else{
                $this.nextAll().remove()
                $this.after($('<span class = "warning">').text("Go to this domain before allowing it"));
            }


        });
        
})
}

$('#add').on('click', function(e){
    chrome.tabs.query({
        "active": true,
        "currentWindow": true,
        "status": "complete",
        "windowType": "normal"}, function (tabs) {
            for (i in tabs) {
                    chrome.runtime.sendMessage({storageUpdate: tabs[i].url});
        }
    });
});