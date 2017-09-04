$( document ).ready(function() {
	$('#comment').click(function() {

		var comment = {};
			comment.content =$('#commentContent').val();
			comment.pseudonyme =  $('#pseudonyme').val();
			comment.date = new Date;

		$.post( "/comments", {comment : comment} , function( data ) {
			console.log(data);
			// friends.innerHTML = "";
			// if (data.length < 1) {
			// 	// alert('yo')
			// 	friends.innerHTML ='<h3 class="text-primary" style="text-align: center;">Sorry no friends with this username</h3>';
			// }
			// new Friends(data);
		});
	});

});
