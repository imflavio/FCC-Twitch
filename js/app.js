var App = (function(){
	function ajaxCall( api, streamer ){

			$.ajax({
				url: 'https://api.twitch.tv/kraken/' + api + streamer + '?callback=?',
	    		dataType: 'jsonp',
	    		type: 'POST',
				success: function( data ){
					if(api === 'streams/'){
						if(data.stream === null){
							return ajaxCall( 'channels/', streamer);
						}	
							var online = {
								logo: data.stream.channel.logo,
								displayName: data.stream.channel.display_name,
								viewers: data.stream.viewers,
								game: data.stream.channel.game.toUpperCase(),
								status: data.stream.channel.status,
								followers: data.stream.channel.followers,
								language: data.stream.channel.language.toUpperCase(),
								views: data.stream.channel.views,
								channelUrl: data.stream.channel.url
							};
							var htmlOnline = 
							'<li class="collection-item avatar row">' +
							'<img src="' + online.logo + '" alt="" class="preview col s2">' +
							'<div class="content-row col s5">' +
							'<span id="title">' + online.displayName + '</span>' +
							'<p><b>Viewers: </b>' + online.viewers + '</p>' +
							'<p><b>Game: </b>' + online.game + '</p>' +
							'<p class="status truncate">' + online.status + '</p>' +
							'</div>' +
							'<div class="content-row second-content col s5">' +
							'<p><b>Followers: </b>' + online.followers + '</p>' +
							'<p><b>Language: </b>' + online.language + '</p>' +
							'<p><b>Views: </b>' + online.views + '</p>' +
							'<a href="' + online.channelUrl + '" class="secondary-content"><i class="online material-icons">play_circle_filled</i></a>' +
							'</div>' +
							'</li>';

							$('.collection').append(htmlOnline);
					}else{
						var offline = {
							logo: data.logo,
							displayName: data.display_name,
							game: data.game.toUpperCase(),
							status: data.status,
							followers: data.followers,
							language: data.language.toUpperCase(),
							views: data.views,
							channelUrl: data.url
						};
						var htmlOffline = 
						'<li class="collection-item avatar row">' +
						'<img src="' + offline.logo + '" alt="" class="preview col s2">' +
						'<div class="content-row col s5">' +
						'<span id="title">' + offline.displayName + '</span>' +
						'<p><b>Game: </b>' + offline.game + '</p>' +
						'<p class="status truncate">' + offline.status + '</p>' +
						'</div>' +
						'<div class="content-row second-content col s5">' +
						'<p><b>Followers: </b>' + offline.followers + '</p>' +
						'<p><b>Language: </b>' + offline.language + '</p>' +
						'<p><b>Views: </b>' + offline.views + '</p>' +
						'<a href="' + offline.url + '" class="secondary-content"><i class="offline material-icons">play_circle_filled</i></a>' +
						'</div>' +
						'</li>';

						$('.collection').append(htmlOffline);
					}
				},
				error: function(){
					alert( 'Error' );
				}
			});
		}
	var duplicate = [];
	
	function ajaxSearch( query ){

		function renderSearch( data ){
			duplicate.length = 0;
			for(var key in data.channels){

				var channelName = data.channels[key].display_name;
				//checks if the channel name contains the query
				if(!channelName.toLowerCase().indexOf(query.toLowerCase())){
					duplicate.push(channelName);
					$('.results').empty();
					for(var i = 0; i < duplicate.length; i++){
						// ADD SEARCH SUGESTIONS HTML HERE
						$('.results').append('<li><a value="' + duplicate[i] + '" class="search-link">' + duplicate[i] + '</a></li>');

						
					}
					
				}
				
			}
			$('.search-link').on('click', function(){
							var searchValue = $(this)
								.val($(this)
								.text());
							$('#add-stream').val(searchValue[0].innerHTML);
						});
		}

		$.ajax({
			url: 'https://api.twitch.tv/kraken/search/channels?q=' + query,
			dataType: 'jsonp',
			type: 'POST',
			success: function( data ){
				renderSearch( data );
			},
			error: function() {
				alert('Error with ', query);
			}
		});
	}

	var streamers = ['freecodecamp', 'summit1g', 'tsm_dyrus', 'flosd', 'wingsofdeath'];
	var searchResults = [];

	function init(){

		(function ajax(){
			for(var key in App.streamers){
	    		ajaxCall( 'streams/', App.streamers[key] );}
		})();

		

		$('#add-stream').keyup(function() {
				$('.results').empty();
				setTimeout( function(){ 
					ajaxSearch( $('#add-stream').val() ); 
				}, 500);
		});


		
	}

	return{
		start: init,
		streamers: streamers
	};
})();

$(document).ready( App.start );