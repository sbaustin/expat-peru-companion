chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    if (request.method == "getLocalStorage")
      sendResponse({data: localStorage[request.key]});
    else
      sendResponse({}); // snub them.

});

function getCookie(name) {
    var dc = document.cookie;
    var prefix = name + "=";
    var begin = dc.indexOf("; " + prefix);
    if (begin == -1) {
        begin = dc.indexOf(prefix);
        if (begin != 0) return null;
    }
    else
    {
        begin += 2;
        var end = document.cookie.indexOf(";", begin);
        if (end == -1) {
        end = dc.length;
        }
    }
    return unescape(dc.substring(begin + prefix.length, end));
} 

function hasLogout(data) {
	return $(data).find('li.icon-logout');
}



function pollData(storedItems){

	 	//  do an ajax get   http://www.expatperu.com/expatforums/search.php?search_id=newposts

		$.get('http://www.expatperu.com/expatforums/search.php?search_id=newposts', function(data){
	
			if (hasLogout(data)) {
	
			var $topics = $(data).find('li.row a.topictitle:lt(11)');
			var items = [];
			$topics.each(function(i){
				items.push({href: 'http://www.expatperu.com/expatforums/' + $(this).attr('href'), title: $(this).text()});
			});
			
			var isequal = _.isEqual(storedItems, items);

			chrome.browserAction.setBadgeText({text: "" + $topics.length});
			

		

			if (!isequal) {
				var diff = _.difference(items , storedItems);
				

		 	 	chrome.storage.sync.set({'topics': JSON.stringify(items)}, function() {
		 	 		var messages = [];
		 	 		_.each(diff, function(item) {
		 	 			messages.push({title: item.title, message: "click here to open"});

		 	 		});
					var opt = {
 					  type: "list",
					  title: "Expat Peru Posts",
					  message: "New Posts",
					  items: messages,
					  iconUrl: "/img/icons/icon_128.png"
					}	
				chrome.notifications.create("one", opt, function(notificationId) {
					chrome.notifications.onClicked.addListener(function(string notificationId) {
						
					});
				});



	    	    });

			}
		} else {
			chrome.browserAction.setBadgeText({text: ""});
		}
	
		}); 
	
}

var intervalPoll;


	
	/*intervalPoll = setInterval(function() {
	 chrome.storage.sync.get({topics: "[]"}, function(items) {
	 	//first get the last stored topics
	 	var stuff = JSON.parse(items.topics);
		pollData(stuff);

	 })}, 60000);
	
	 chrome.storage.sync.get({topics: "[]"}, function(items) {
	 	//first get the last stored topics
	 	var stuff = JSON.parse(items.topics);
		pollData(stuff);

	 })
	*/




