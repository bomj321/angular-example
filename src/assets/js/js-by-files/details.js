"use strict";


 $('.slider-for2').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        fade: true,
        asNavFor: '.slider-nav2',
        adaptiveHeight: true,
        autoplay: true,
        autoplaySpeed: 5000
    });

    $('.slider-nav2').slick({
        slidesToShow: 5,
        slidesToScroll: 1,
        arrows: false,
        asNavFor: '.slider-for2',
        dots: false,
        centerMode: false,
        focusOnSelect: true,
        adaptiveHeight: false,
        fade: false,
        autoplay: true,
        autoplaySpeed: 5000,
        vertical: true,
        verticalSwiping: true,
        responsive: [
            {
                breakpoint: 767,
                settings: {
                    vertical: false,
                    slidesToShow: 4,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 575,
                settings: {
                    vertical: false,
                    slidesToShow: 3,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 480,
                settings: {
                    vertical: false,
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            }
        ]
    });
