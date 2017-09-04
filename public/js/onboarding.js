

// image preloader
$("#picture").change(function(){
	   readURL(this);
   });

   function readURL(input) {
   if (input.files && input.files[0]) {
	   var reader = new FileReader();

	   reader.onload = function (e) {
		   $('#picturePreview').attr('src', e.target.result).fadeIn('slow');
	   }
	   reader.readAsDataURL(input.files[0]);
   }
}


// pseudonyme availability
$("#pseudonyme").keyup(function() {
	setTimeout(function () {
		var pseudonyme = $("#pseudonyme").val();
		// console.log(pseudonyme);
		$.post( "/usernamecheck", {pseudonyme : pseudonyme} , function( data ) {
			console.log(data);
		   if (data === 'available') {
				$("#pseudonyme").removeClass('form-control-danger');
			   	$("#pseudonyme").addClass('form-control-success');
				$("#valid").removeClass('has-danger');
			   	$("#valid").addClass('has-success');
		   }
		   if (data === 'user exist') {
				$("#pseudonyme").removeClass('form-control-success');
		   		$("#pseudonyme").addClass('form-control-danger');
				$("#valid").removeClass('has-success');
		   		$("#valid").addClass('has-danger');
		   }
		});
	}, 500);
})

//
// $('.date-picker').each(function(){
// 	$(this).datepicker({
// 		templates:{
// 			leftArrow: '<i class="now-ui-icons arrows-1_minimal-left"></i>',
// 			rightArrow: '<i class="now-ui-icons arrows-1_minimal-right"></i>'
// 		}
// 	}).on('show', function() {
// 			$('.datepicker').addClass('open');
//
// 			datepicker_color = $(this).data('datepicker-color');
// 			if( datepicker_color.length != 0){
// 				$('.datepicker').addClass('datepicker-'+ datepicker_color +'');
// 			}
// 		}).on('hide', function() {
// 			$('.datepicker').removeClass('open');
// 		});
// });


$("#submit").click(function() {
	console.log('yo Submit');
	var profile = {};
	profile.img = $('.img-raised').attr('src');
	profile.pseudonyme = $('input[name="pseudonyme"]').val()
	profile.name = $('input[name="name"]').val()
	profile.firstName = $('input[name="firstName"]').val();
	profile.phone = $('input[name="phone"]').val();
	profile.email = $('input[name="email"]').val();
	profile.work = $('input[name="work"]').val();
	profile.birthdate = $('.date-picker').val();
	profile.gender = $('input[name="gender"]:checked').val()
	profile.about = $('textarea[name="about"]').val();
	profile.facebook = $('input[name="facebook"]').val();
	profile.twitter = $('input[name="twitter"]').val();
	profile.instagram = $('input[name="instagram"]').val();
	profile.github = $('input[name="github"]').val();
	profile.linkedin = $('input[name="linkedin"]').val();
	profile.dribbble = $('input[name="dribbble"]').val();
	if ($('.bootstrap-switch').hasClass('bootstrap-switch-off')) {
		profile.setting = false;
	}else {
		profile.setting = true;

	}


	$.post( "/onboarding", profile , function( data ) {
		if (data == "updated") {
			window.location = '/profile'
		}

	});

})
