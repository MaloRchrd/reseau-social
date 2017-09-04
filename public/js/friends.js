$( document ).ready(function() {
	var friends = document.querySelector('#friends')
	// data -->  array of friends
	var Friends = function(data) {
		for (var i = 0; i < data.length; i++) {
			this.container = document.createElement('div');
			this.container.setAttribute('class', 'col-md-4')
			this.user = document.createElement('div');
			this.user.setAttribute('class','team-player')
			this.img = document.createElement('img');
			this.img.setAttribute('class','rounded-circle img-fluid img-raised')
			this.img.src = data[i].profile.img;
			this.pseudonyme = document.createElement('p');
			this.pseudonyme.setAttribute('class','category text-primary');
			this.pseudonyme.innerHTML = data[i].profile.pseudonyme;
			this.work = document.createElement('p');
			this.work.setAttribute('class','category');
			this.work.innerHTML = data[i].profile.work;
			this.about = document.createElement('p');
			this.about.setAttribute('class','description');
			this.about.innerHTML = data[i].profile.about;
			this.profile = document.createElement('a');
			this.profile.setAttribute('class','btn btn-primary btn-icon btn-icon-mini btn-round')
			this.profile.setAttribute('href', '/profile/' + data[i].profile.pseudonyme);
			this.profile.setAttribute('rel', 'tooltip"');
			this.profile.setAttribute('data-original-title', data[i].profile.pseudonyme + "'s profile");
			this.profile.setAttribute('data-placement', 'bottom');
			this.profileIcon = document.createElement('i')
			this.profileIcon.setAttribute('class', 'fa fa-user-circle-o');
			this.profile.appendChild(this.profileIcon)
			this.chat = document.createElement('a');
			this.chat.setAttribute('class','btn btn-success btn-icon btn-icon-mini btn-round')
			this.chat.setAttribute('href', '/chat/' + data[i].profile.pseudonyme);
			this.chat.setAttribute('rel', 'tooltip"');
			this.chat.setAttribute('data-original-title','chat with ' + data[i].profile.pseudonyme);
			this.chat.setAttribute('data-placement', 'bottom');
			this.chatIcon = document.createElement('i')
			this.chatIcon.setAttribute('class', 'fa fa-comments');
			this.chat.appendChild(this.chatIcon)
			this.remove = document.createElement('a');
			this.remove.setAttribute('class','btn btn-danger btn-icon btn-icon-mini btn-round')
			this.remove.setAttribute('href', '/remove/' + data[i]._id);
			this.chat.setAttribute('rel', 'tooltip"');
			this.chat.setAttribute('data-original-title','Remove ' + data[i].profile.pseudonyme + 'from friends');
			this.chat.setAttribute('data-placement', 'bottom');
			this.removeIcon = document.createElement('i')
			this.removeIcon.setAttribute('class', 'fa fa-user-times');
			this.remove.appendChild(this.removeIcon)
			this.container.appendChild(this.user);
			this.user.appendChild(this.img);
			this.user.appendChild(this.pseudonyme);
			this.user.appendChild(this.work);
			this.user.appendChild(this.about);
			this.user.appendChild(this.profile);
			this.user.appendChild(this.chat);
			this.user.appendChild(this.remove);
			friends.appendChild(this.container);
		}
	};

	$('#search').keyup(function() {
		setTimeout(function () {
			var friendsSearch = $('#search').val();

			$.post( "/friendsSearch", {friendsSearch : friendsSearch} , function( data ) {
				console.log(data);
				friends.innerHTML = "";
				if (data.length < 1) {
					// alert('yo')
					friends.innerHTML ='<h3 class="text-primary" style="text-align: center;">Sorry no friends with this username</h3>';
				}
				new Friends(data);
			});
		}, 500);
	})
});
