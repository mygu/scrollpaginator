Scroll Paginator
================

Scroll Paginator is a jquery plugins for supports infinite scrolling page.

https://github.com/mygu/scrollpaginator.git

Copyright 2015 Mingyu Gu

Released under the MIT license


Installatione
------------

clone from github:

    $ git clone git://github.com/mygu/scrollpaginator.git


Example:
------------

    $("#people_list div.people_family_list").scrollPaginator({
        "contentPage": "/people/search/",
        "contentData": {},
        "scrollTarget": $(window),
        "heightOffset": 10,
        "beforeLoad": function (opts, clean) {
            $("#loading").fadeIn();
            opts.contentData = (function () {
                var page = clean ? 1 : parseInt($("input[name='people_page_number']:last").val()) + 1;
                people_data_dict.page = page;
                return people_data_dict;
            }());
        },
        "afterLoad": function (opts, clean, result) {
            $("#loading").fadeOut();
            $(result).fadeInWithDelay();
            if (result.length <= 0) {
                opts.trigger = false;
            }
        }
    });
    
    $.fn.fadeInWithDelay = function () {
        var delay = 0;
        return this.each(function () {
            $(this).delay(delay).animate({opacity: 1}, 200);
            delay += 100;
        });
    };
