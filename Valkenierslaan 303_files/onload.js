
var wSize = 0;

$(function() {
	setInterval(function() {
		$.get('/lib/keepalive.php');
	}, 1000 * 60 * 5)


	$('.file-download a[href*="/secure/"]').click(function(e) {
		e.preventDefault();
		window.open(this.href, 'download', 'width=800,height=600,top=100,left=200,scrolling=auto');
	});


    $('.popup').click(function(e) {
        e.preventDefault();

        var href = $(this).attr('href');
        if (href.indexOf('?') >= 0) {
            href += '&popup=1';
        } else {
            href += '?popup=1';
        }

        window.open(href, 'popup', 'left=300,top=100,width=700,height=800,scrolling=auto');
    });


	$('.navbar-toggle').click(function() {
		var target = $(this).data('target');

		if (!$(target).is(':visible')) {
			$(this).addClass('open');
		} else {
			$(this).removeClass('open');
		}
	});


	// default zitten staan de forms op beide of beiden uit (splash/bog- en wonaanbod), middels click on page load triggeren dat de 1e actief is
	/*
	$('input[name=type]').each(function() {
		var inputForm = $(this).closest('form');
		var formType  = $(this).val();

		if (formType != 'won' && formType != 'bog') {
			inputForm.find('.btn-arrow[data-type=' + formType + ']').click();

		} else if (formType == 'won') { // click bij splash
			$('#splash-btn-' + formType).click();
		}
	});
	*/

	$('.footer-people').hover(function(){
		$(this).find('.overlay').slideToggle(200);
	});

});
