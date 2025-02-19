"use strict";


$(function () {

    // init Fancybox Gallery
    if (typeof Fancybox !== "undefined" && Fancybox !== null) {
        Fancybox.bind("[data-fancybox]", {
            dragToClose: false,
            closeButton: false
        });
    }



    // Detect user Device
    const isMobile = {
        Android: function () {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function () {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function () {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function () {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function () {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function () {
            return (
                isMobile.Android() ||
                isMobile.BlackBerry() ||
                isMobile.iOS() ||
                isMobile.Opera() ||
                isMobile.Windows());
        },
    };

    function getNavigator() {
        if (isMobile.any() || window.innerWidth < 768) {
            $("body").removeClass("_pc").addClass("_touch");
        } else {
            $("body").removeClass("_touch").addClass("_pc");
        }
    }
    getNavigator();
    $(window).on('resize', () => {
        getNavigator();
    });


    // event handlers

    $(document).on('click', (e) => {

        const $target = $(e.target);

        // open menu 3 lvl
        if ($target.is('.submenu__arrow')) {
            e.preventDefault()
            $target.parent().toggleClass('active').next().slideToggle()
        }

        //  tabs
        if ($target.is('.tabs__btn')) {
            $target.addClass("active")
                .siblings()
                .removeClass("active")
                .closest(".tabs")
                .find(".tabs__content")
                .removeClass('active')
                .eq($target.index())
                .addClass('active')
        }

        // arrow top
        if ($target.hasClass('arrow-top-btn')) {
            $("html, body").animate({
                scrollTop: 0
            }, 300);
            return false;
        }


        // favorite btn
        if ($target.is('.favorite-btn')) {
            $target.toggleClass('active');
        }

        // open submenu 
        if ($target.closest('.menu__arrow').length && $target.closest('.menu__item.has-child').length) {
            e.preventDefault();
            const $menuArrow = $target.closest('.menu__arrow');
            const $submenu = $menuArrow.next('.submenu');

            const isActive = $menuArrow.hasClass('active');

            $('.menu__arrow').removeClass('active');
            $('.submenu').removeClass('active');

            if (!isActive) {
                $menuArrow.addClass('active');
                $submenu.addClass('active');
            }
        }

        // open mobile menu
        if ($target.closest('.mobile-menu__btn').length) {
            $('.menu').addClass('active');
            $('body').addClass('lock-menu');
        }
        if ($target.is('.menu__close')) {
            $('.menu').removeClass('active');
            $('body').removeClass('lock-menu');
        }


        // show more items in catalog
        if ($target.is('.catalog-card__more')) {
            $target.toggleClass('active');
            $target.prev().toggleClass('full');
            if ($target.hasClass('active')) {
                $target.text("Свернуть")
            } else {
                $target.text("Показать еще")
            }
        }

        // show full catalog in product page
        if ($target.is('.product-card__sidebar-catalog')) {
            $target.next().slideToggle()
        }

    });


    $(window).on("scroll", function (e) {
        if (scrollY < 2 * document.documentElement.clientHeight) {
            $('.arrow-top-btn').addClass('hidden');
        } else {
            $('.arrow-top-btn').removeClass('hidden');
        }
    })



    // Input type="tel" Mask
    if ($('input[type="tel"]').length > 0) {
        $('input[type="tel"]').each(function (idx, input) {

            const cyrillicCountries = ['AM', 'AZ', 'BY', 'GE', 'KZ', 'KG', 'MD', 'RU', 'TJ', 'TM', 'UZ',];

            const iti = intlTelInput(input, {
                utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@18.2.1/build/js/utils.js",
                initialCountry: "ru",
                onlyCountries: cyrillicCountries,
                preferredCountries: ['ru'],
                autoPlaceholder: false,
            });


            function setMask() {
                const mask = getFormattedNumber("9");
                const formattedExampleNumber = getFormattedNumber();

                $(input).inputmask('remove');
                $(input).inputmask({
                    "mask": mask,
                    showMaskOnHover: false,
                })

                $(input).attr('placeholder', formattedExampleNumber);

                $(input).on('blur', function () {
                    $(input).attr('placeholder', formattedExampleNumber);
                })

            }

            function getFormattedNumber(symbol = "_") {
                const countryData = iti.getSelectedCountryData();


                const dialCode = symbol == '9' ? countryData.dialCode.replace(/./g, '\\$&') : countryData.dialCode;

                const exampleNumber = intlTelInputUtils.getExampleNumber(
                    countryData.iso2,
                    false,
                    intlTelInputUtils.numberFormat.INTERNATIONAL
                );

                const numberWithoutDialCode = exampleNumber.replace(/^\+\d{1,3}/, '');
                const formattedNumber = numberWithoutDialCode.replace(/\d/g, symbol);

                return `+${dialCode}${formattedNumber}`;
            }


            $(input).on('countrychange', function () {
                setMask();
            });

            iti.promise.then(function () {
                setMask();
            });


        });
    }


    // sliders 

    if ($('.promo__slider').length) {
        new Swiper('.promo__slider', {
            slidesPerView: 1,
            autoplay: true,
            loop: true,
            navigation: {
                nextEl: ".promo__next",
                prevEl: ".promo__prev"
            },
            pagination: {
                el: '.promo__pagination',
                clickable: true
            }
        });
    }

    if ($('.about__slider').length) {
        new Swiper('.about__slider', {
            slidesPerView: 1,
            navigation: {
                nextEl: ".about__next",
                prevEl: ".about__prev"
            },
        });
    }

    if ($('.products__slider').length) {

        $('.products__slider').each((index, slider) => {

            const next = slider.querySelector('.products__next');
            const prev = slider.querySelector('.products__prev');



            new Swiper(slider, {
                spaceBetween: 13,
                watchSlidesProgress: true,
                navigation: {
                    nextEl: next,
                    prevEl: prev
                },
                breakpoints: {
                    767.98: {
                        slidesPerView: 2,
                        spaceBetween: 13,
                    },
                    1199.98: {
                        slidesPerView: 3,
                        spaceBetween: 20,
                    }
                }
            });
        })
    }

    if ($('.product-card__slider').length) {

        const mainSlider = new Swiper('.product-card__slider-main', {
            loop: true,

            navigation: {
                nextEl: '.product-card__next',
                prevEl: '.product-card__prev',
            },
            thumbs: {
                swiper: {
                    el: '.product-card__slider-thumbs',
                    slidesPerView: "auto",
                    spaceBetween: 5,
                    watchSlidesVisibility: true,
                    watchSlidesProgress: true,
                },
            },
        });

        new Swiper('.product-card__slider-thumbs', {
            loop: true,
            slidesPerView: "auto",
            spaceBetween: 5,
            watchSlidesVisibility: true,
            watchSlidesProgress: true,
        });

        const thumbSlides = document.querySelectorAll('.product-card__slider-thumb');
        thumbSlides.forEach((thumb, index) => {
            thumb.addEventListener('mouseenter', () => {
                mainSlider.slideTo(index);
            });
        });
    }

    // quantity block

    if ($('.quantity-block').length > 0) {

        const minQuantity = 1;

        $('.quantity-block').on('click', '.plus', function () {
            const $block = $(this).closest('.quantity-block');
            const $input = $block.find('.quantity-block__input');
            let currentValue = parseInt($input.val(), 10);


            $input.val(currentValue + 1);
        });


        $('.quantity-block').on('click', '.minus', function () {
            const $block = $(this).closest('.quantity-block');
            const $input = $block.find('.quantity-block__input');
            let currentValue = parseInt($input.val(), 10);


            if (currentValue > minQuantity) {
                $input.val(currentValue - 1);
            }
        });


        $('.quantity-block').on('input', '.quantity-block__input', function () {
            const $input = $(this);
            let value = parseInt($input.val(), 10);


            if (isNaN(value) || value < minQuantity) {
                value = minQuantity;
            }

            $input.val(value);
        });

    }



});


