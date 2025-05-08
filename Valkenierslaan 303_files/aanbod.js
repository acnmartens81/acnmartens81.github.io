$(function() {
	showAanbodBlockLoader();

	var extendedForm  = $('form[name=aanbod-search-extended]');
	var applyTimeout  = false;
	var searchRequest = false;
	var pageRefresh   = false;

	extendedForm.find('select.filter').change(function() { extendedForm.submit(); });
	extendedForm.find('input[type=checkbox].filter').click(function() { extendedForm.submit(); });
	extendedForm.find('input[type=text].filter').keyup(function(e) {
		if (e.keyCode == 13) {
			return;
		}

		if (applyTimeout) {
			clearTimeout(applyTimeout);
		}

		if ($(this).data('filter-delay')) {
			applyTimeout = setTimeout(function() { extendedForm.submit(); }, $(this).data('filter-delay'));

		} else {
			form.submit();
		}
	});

	$('.submit-form').on('click',function(){

		pageRefresh = true;

		extendedForm.submit();
	});

	extendedForm.submit(function(e) {
		if (window.history.pushState) {

			if (!pageRefresh) {
				e.preventDefault();
			}

			var formDataStr = $(this).serialize();
			$('.search-results').css('min-height', $('.search-results').outerHeight());

			searchRequest = $('.search-results').load('/site/ajax/search_results.php?' + formDataStr, function(data) {
				window.history.pushState({url: '?' + formDataStr}, '', '?' + formDataStr);
				showAanbodBlockLoader();
			});
		}
	});

	window.onpopstate = function(e) {
		if (e.state && typeof e.state.url != 'undefined') {
			document.location = e.state.url;
			return false;
		}
	};

	$('.filters .panel-header').click(function(e) {
		e.preventDefault();

		var panel     = $(this).closest('.panel');
		var panelBody = $(this).siblings('.panel-body');

		if (panelBody.is(':visible')) {
			panelBody.slideUp(200, function() {
				panel.addClass('closed');
			});
		} else {
			panelBody.slideDown(200, function() {
				panel.removeClass('closed');
			});
		}
	});

	if($(document).width() < 992) {
		$('.filters .panel').addClass('closed');
	}

	// filters afvangen
	$('.aanbod-search-splash .filter').on('change keyup', function() {
		var splashForm  = $(this).closest('form');
		var splashBtn   = splashForm.find('[type=submit]');
		var formType    = splashForm.data('type');
		var formDataStr = splashForm.serialize();

		searchRequest = splashBtn.find('.results-count-' + formType).load('/site/ajax/search_results.php?show_count=1&search_type=' + formType + '&' + formDataStr);
	}).first().change();


	// o.a. in aanbod-search-splash
	$('.btn-arrow[data-type]').click(function(e) {
		e.preventDefault();

		var formType = $(this).data('type');

		if (formType == 'won' || formType == 'bog') {
			$('#splash-buttons').find('.btn-arrow').removeClass('arrow-active');
			$(this).addClass('arrow-active');

			$('.splash-form').hide();

			$('#splash-form-' + formType).show();
		}
	});


	// afvangen button click ipv filter klik. met name nodig voor BOG.
	$('#splash-btn-won, #splash-btn-bog').click(function() {
		var formType    = $(this).data('type');
		var formDataStr = $('#splash-form-' + formType).serialize();

		searchRequest = $('.results-count-' + formType).load('/site/ajax/search_results.php?show_count=1&search_type=' + formType + '&' + formDataStr);
	});


	$('.aanbod-block').hover(function() {
		$(this).find('.more-info').slideToggle(200);
	});

});



function showAanbodBlockLoader() {
	$('.aanbod-block:not(.loaded)').each(function() {
		var result       = $(this);
		var resultVisual = result.find('.visual');
		var imageSrc     = result.data('img');
		var resultBg     = new Image();

		resultBg.onload = function() {
			resultVisual.css('background-image', 'url(' + imageSrc + ')');
			result.addClass('loaded');
		};

		resultBg.onerror = function() {
			result.addClass('loaded');
		}

		resultBg.src = imageSrc;
	});
}