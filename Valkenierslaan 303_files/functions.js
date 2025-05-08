
function openPopup(pUrl, pWidth, pHeight) {
    if (!pWidth)  pWidth = 800;
    if (!pHeight) pHeight = 600;

    var sWidth  = screen.availWidth;
    var sHeight = screen.availHeight;
    var pTop    = sHeight / 2 - pHeight / 2;
    var pLeft   = sWidth / 2 - pWidth / 2;

    console.log(pWidth, pHeight, pTop, pLeft);

    window.open(pUrl, 'popup', 'toolbar=no,location=0,status=no,menubar=no,scrollbars=yes,resizable=yes' +
                    ',width=' + pWidth + ',height=' + pHeight + ',top=' + pTop + ',left=' + pLeft);
}


function checkSidebarHeight() {
	$('.sidebar').each(function() {
		var sidebarHeight = $(this).outerHeight(true);
		var windowHeight  = $(window).height();

		windowHeight -= $('.navbar-fixed-top').outerHeight();

		if (sidebarHeight > windowHeight) {
			$(this).addClass('no-affix');
		} else {
			$(this).removeClass('no-affix');
		}
	});
}


function initSearchForm(formSelector, resultsSelector, searchUrl, onLoad) {
    $(formSelector).submit(function(e) {
        e.preventDefault();

        var args = $(this).serialize();
		$('.splash-search-results').html('');

        $.getJSON('/site/ajax/search_locations.php', args, function (data) {
            var prevId = 0;
            var resultIds = [];
			var count = 1;

            for (var key in data.items) {
                var item     = data.items[key];
                var id       = item.id;
                var $element = $(item.html);

                resultIds.push(id);

                if ($(resultsSelector + ' > div[data-item_id=' + id + ']').length > 0) {
                    continue;
                }

                if (prevId == 0) {
                    $element.prependTo(resultsSelector);
                } else {
                    $element.insertAfter(resultsSelector + ' > div[data-item_id=' + prevId + ']');
                }

                $element.hide();
                prevId = id;

				if (count <= 5) {
					$element.slideDown();
				}

				count++;
            }

            $(resultsSelector + ' > div').each(function() {
                var itemId = $(this).attr('data-item_id');

                if ($.inArray(itemId, resultIds) < 0) {
                    $(this).slideUp('fast', function() {
                        $(this).remove();
                    });
                }
            });

			if (typeof onLoad == 'function') {
				onLoad(data);
			}
        });
    });
}



function showSplashBlock(type, initfunc) {
	$('.splash-nav a, .splash-block').removeClass('active');
	$('.splash-nav a[href="#' + type + '"], #type-' + type).addClass('active');

	// window.dispatchEvent(new Event('resize')); // is niet < IE11 compatible
	// $(window).trigger('resize'); // werkt het kaartje niet meer op andere tab

	if (initfunc == 0 || initfunc == 1) {
		initialize1();
	}
	if (initfunc == 0 || initfunc == 2) {
		initialize2();
	}
}



function createCookie(name, value, days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days * 24 * 60 * 60 * 1000));
		var expires = "; expires="+date.toGMTString();
	} else {
	    var expires = "";
    }
	document.cookie = name + "=" + value + expires + "; path=/";
}


function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1, c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
	}
	return null;
}


function eraseCookie(name) {
	createCookie(name, "", -1);
}