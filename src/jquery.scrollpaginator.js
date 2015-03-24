/*!
 * jQuery Scroll Paginator Plugin v1.0.0
 * https://github.com/mygu/scrollpaginator.git
 *
 * Copyright 2015 Mingyu Gu
 * Released under the MIT license
 */

;
(function ($, window, document) {
    var scrollPaginator = function (el, opts) {
        this.$element = el;
        this.defaults = {
            "contentPage": null,
            "contentData": {},
            "beforeLoad": null,
            "afterLoad": null,
            "scrollTarget": null,
            "heightOffset": 0,
            "locked": false,
            "trigger": true
        };
        this.options = $.extend({}, this.defaults, opts);
    };

    scrollPaginator.prototype = {
        init: function () {
            var self = this;
            var el = this.$element;
            var opts = this.options;

            $(el).attr("scrollPagination", "enabled");

            $(opts.scrollTarget).scroll(function (event) {
                if ($(el).attr("scrollPagination") == "enabled") {
                    self.loadContent(self, el, opts);
                }
                else {
                    event.stopPropagation();
                }
            });

            self.loadContent(self, el, opts);
        },
        loadContent: function (self, el, opts) {
            var target = opts.scrollTarget;
            var clean = false;
            var mayLoadContent = $(target).scrollTop() + opts.heightOffset >= $(document).height() - $(target).height();

            if (mayLoadContent) {
                self.ajaxSearch(el, opts, clean);
            }
        },
        ajaxSearch: function (el, opts, clean) {
            if (opts.locked == false) {
                if (opts.trigger == true) {
                    if (opts.beforeLoad != null) {
                        opts.beforeLoad(opts, clean);
                    }
                    if (opts.trigger == true) {
                        $(el).children().attr("rel", "loaded");

                        $.ajax({
                            type: "POST",
                            dataType: "html",
                            url: opts.contentPage,
                            data: opts.contentData,
                            beforeSend: function (xhr) {
                                xhr.setRequestHeader("X-CSRFToken", $.cookie("csrftoken"));
                                opts.locked = true;
                            },
                            success: function (data) {
                                opts.locked = false;
                                if (clean) {
                                    $(el).html(data);
                                } else {
                                    $(el).append(data);
                                }
                                var result = $(el).children("[rel!=loaded]");
                                if (opts.afterLoad != null) {
                                    opts.afterLoad(opts, clean, result);
                                }
                            },
                            error: function () {
                                opts.locked = false;
                            }
                        });
                    }
                }
            }
        },
        stop: function (el) {
            $(el).attr("scrollPagination", "disabled");
        },
        version: function () {
            return "v1.0.0";
        }
    };

    $.fn.scrollPaginator = function (options) {
        var paginator = new scrollPaginator(this, options);
        paginator.init();
        return paginator;
    };
})(jQuery, window, document);
