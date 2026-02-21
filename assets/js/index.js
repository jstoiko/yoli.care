/**
 * Main JS file for GhostScroll behaviours
 */

var $post = $(".post");
var $first = $(".post.first");
var $last = $(".post.last");
var $fnav = $(".fixed-nav");
var $tmenu = $(".top-menu");
var $postholder = $(".post-holder");
var $sitehead = $("#site-head");

/* Globals jQuery, document */
(function ($) {
  "use strict";
  function srcTo(el, dur = 1000) {
    $("html, body").animate(
      {
        scrollTop: el.offset().top,
      },
      dur,
      function() {
        window.location.hash = el.attr("id");
      }
    );
  }
  function srcToAnchorWithTitle(str) {
    var $el = $("#" + str);
    if ($el.length) {
      srcTo($el);
    }
  }
  $(document).ready(function () {
    // fallback to jQuery animate if smooth scrolling is not supported
    if (!"scrollBehavior" in document.documentElement.style) {
      // Cover buttons
      $("a.btn.site-menu").click(function (e) {
        e.preventDefault();
        srcToAnchorWithTitle($(e.target).data("title-anchor"));
      });

      // cover arrow button
      $("#header-arrow").click(function (e) {
        e.preventDefault()
        srcTo($first);
      });
    }

    $last.next(".post-after").hide();

    if ($sitehead.length) {
      $(window).scroll(function () {
        var w = $(window).scrollTop();
        var g = $sitehead.offset().top;
        var h = $sitehead.offset().top + $sitehead.height() - 100;

        if (w >= Math.floor(g) && w <= Math.ceil(h)) {
          $fnav.fadeOut("fast");
          $tmenu.fadeOut("fast");
        } else {
          $fnav.css("display", "flex").fadeIn("fast");
          $tmenu.css("display", "flex").fadeIn("fast");
        }

        $post.each(function () {
          if (($(window).height() + w) > ($(document).height() - $(".site-footer").height())) {
            var l = $postholder.length;
            $(".fn-item").removeClass("active")
            $(".fn-item[item_index='" + (l) + "']").addClass("active")
          } else {
            var f = $(this).offset().top;
            var b = $(this).offset().top + $(this).height();
            var t = $(this).parent(".post-holder").index();
            var i = $(".fn-item[item_index='" + t + "']");
            var a = $(this)
              .parent(".post-holder")
              .prev(".post-holder")
              .find(".post-after");

            $(this).attr("item_index", t);

            if (w >= f && w <= b) {
              i.addClass("active");
              a.fadeOut("slow");
            } else {
              i.removeClass("active");
              a.fadeIn("slow");
            }
        }
        });
      });
    }

    /* Modified to support per-list icon overrides via CSS variables */
    $('ul').each(function() {
      var $this = $(this);
      
      // Get the icon from the element's computed style (allows class overrides)
      // If not set on the element, it inherits from root/parent automatically in CSS logic,
      // but getComputedStyle resolves that.
      // We strip quotes if they exist because CSS content/strings often have them.
      var icon = getComputedStyle(this).getPropertyValue('--ul-li-icon').trim().replace(/['"]+/g, '');

      // If an icon is defined (and not "none" or empty)
      if (icon && icon !== 'none' && icon.length > 0) {
        $this.addClass("fa-ul");
        // Only prepend if we haven't already (in case of double execution or nested/weird structures)
        $this.find('> li').each(function() {
            if ($(this).find('> .fa-li').length === 0) {
                $(this).prepend('<span class="fa-li"><i class="fa ' + icon + '"></i></span>');
            }
        });
      }
    });
    $("blockquote p").prepend('<span class="quo fa fa-quote-left"></span>');
    $("blockquote p").append('<span class="quo fa fa-quote-right"></span>');
  });
})(jQuery);
