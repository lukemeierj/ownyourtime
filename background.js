var currentBlocked = new Array();
var tempAllow = new Object();

chrome.storage.sync.get('blocked', function(details){
	currentBlocked = details['blocked'];
});

chrome.storage.onChanged.addListener(function(details){
	chrome.storage.sync.get('blocked', function(details){
		currentBlocked = details['blocked'];
	});
});

function endPermission(domain, wait){
	setTimeout(function(){ 
		tempAllow[domain] = false;
	}, wait);
}

chrome.webRequest.onHeadersReceived.addListener(
	function(details) {
		var uri = new URI(details.url),
			workingDomain = uri.subdomain() + '.' + uri.domain();

		if(tempAllow[workingDomain]){
			return {cancel: false}
		}
		else{
            index = currentBlocked.indexOf(workingDomain);
            if(index > -1){
                delete tempAllow[workingDomain];
                var url = chrome.runtime.getURL("catcher.html") + "?next=" + details.url;
                return {redirectUrl: url};
            }
            else{
                return {cancel: false};
            }
			
		}
},
    {urls: ["<all_urls>"], 
	types: ['main_frame']}, 
	["blocking"]);

chrome.runtime.onMessage.addListener(function(request, sender) {
	if(request.redirect){
		var uri = new URI(request.redirect),
            workingDomain = uri.subdomain() + '.' + uri.domain();
		tempAllow[workingDomain] = true;
		endPermission(workingDomain, 300000);
		chrome.tabs.update(sender.tab.id, {url: request.redirect});
	}
	if(request.storageUpdate){
		chrome.storage.sync.get('blocked', function(details){
            var websites = details['blocked'],
                uri = new URI(request.storageUpdate),
                workingDomain = uri.subdomain() + '.' + uri.domain();

                index = websites.indexOf(workingDomain);
            if(index == -1){
                websites.push(workingDomain);  
            }
			chrome.storage.sync.set({'blocked': websites}, function(){
				console.log('Blocked sites stored.');
			})
		});
	}
    if(request.removeStorage){
        chrome.storage.sync.get('blocked', function(details){
            var websites = details['blocked'],
                index = websites.indexOf(request.removeStorage);
            if (index > -1) {
                websites.splice(index, 1);
            }
			console.log('websites from bg', websites)
			chrome.storage.sync.set({'blocked': websites}, function(){
				console.log('all set!');
			})
		});
        
    }

});

// chrome.storage.onChanged.addListener(function(details){
// 	chrome.storage.sync.get('blocked', function(details){
// 		var websites = details['blocked'];
// 		chrome.runtime.sendMessage({newStorage: $('#url-field').val()})
		
// 		setURLs(websites);

// 	});
// });