$(document).ready(function () {

    let url = window.location.hash; //Return current URL anchor after hash
    checkurl(url); //Run Function that checks the URL

    //Keeps checking if the window has changes to retreive the updated URL and run the checkurl function again
    $(window).bind('hashchange', function () {
        url = window.location.hash;
        checkurl(url);
    });

    //Adds selected class to the first button element when the window is loaded
    $('.buttons button:first-of-type').addClass('selected');

    // On click on any button
    $('div.button-filter div.buttons button').click(function () {
        var $button = $(this);
        var $section = $button.closest('.button-filter');  // Find the closest parent section for the clicked button

        $section.find('button').removeClass('selected');  // Remove 'selected' class from all buttons in this section
        $button.addClass('selected');  // Add 'selected' class to the clicked button in this section

        var iframe = $section.find('#iframe')[0];  // Use the closest section to find the iframe within it
        if (iframe) {
            var newSrcEmbed = $button.data('url');
            iframe.src = newSrcEmbed;
        }

        // Get the new images array from the clicked button's data-images attribute
        var newImages = $button.data('images');

        if (newImages) {
            // Update the image container within this section
            $section.find('.images').html(''); // Clear the existing images in this section

            var dynamicClass = $button.attr('data-class');
            var $imageContainer = $section.find('.images');
            // Remove old dynamic classes, only keeping the base 'image-text' class
            $imageContainer.removeClass().addClass('images');

            // Add the dynamic class if it's present
            if (dynamicClass) {
                $imageContainer.addClass(dynamicClass);
            }
            // Add new images to the container in this section
            $.each(newImages, function (index, image) {
                var imgElement = $("<img>").attr("src", image.src).attr("alt", image.alt);
                $section.find('.images').append(imgElement);
            });
        }
        if ($button.is('[data-image-text]')) { // Check if the attribute exists
            var newContent = JSON.parse($button.attr('data-image-text'));
        }

        // Clear existing content
        $section.find('.image-text').html('');


        if (newContent) {

            var dynamicClass = $button.attr('data-class');
            var $imageTextContainer = $section.find('.image-text');
            // Remove old dynamic classes, only keeping the base 'image-text' class
            $imageTextContainer.removeClass().addClass('image-text');

            // Add the dynamic class if it's present
            if (dynamicClass) {
                $imageTextContainer.addClass(dynamicClass);
            }

            $.each(newContent, function (index, content) {
                // Append text, allowing HTML
                var textsContainer = $("<div>").addClass("text");
                $.each(content.texts, function (i, text) {
                    textsContainer.append($("<p>").html(text)); // Use .html() to parse HTML entities
                });

                // Append images
                var imagesContainer = $("<div>").addClass("image");
                $.each(content.images, function (i, image) {
                    imagesContainer.append(
                        $("<img>")
                            .attr("src", image.src)
                            .attr("alt", image.alt)
                    );
                });

                $section.find('.image-text').append(textsContainer, imagesContainer);
            });
        }

        // Get the new table-text data from the button
        var newTableText = $button.data('table-text');

        // Update the table container within this section
        $section.find('.table-text > .text > p').html('');
        $section.find('.table-text > .table-container').html('');

        // Populate the new content
        if (newTableText) {
            $.each(newTableText, function (index, tableText) {
                $section.find(".table-text > .text > p").text(tableText.text);

                var tableElement = $("<table>");
                $.each(tableText.table, function (rowIndex, row) {
                    var rowElement = $("<tr>");
                    $.each(row, function (cellIndex, cell) {
                        if (rowIndex === 0) {
                            rowElement.append($("<th>").text(cell));
                        } else {
                            rowElement.append($("<td>").text(cell));
                        }
                    });
                    tableElement.append(rowElement);
                });
                $section.find('.table-text > .table-container').append(tableElement);
            });
        }

        var video = $section.find('.video > video')[0];  // Use the closest section to find the iframe within it
        if (video) {
            var newSrcVideo = $button.data('video');
            video.src = newSrcVideo;
        }

        var $content = $section.find('.content'); // Select the .content div inside the section
        var $videoSrc = $section.find('.videoSrc'); // Check if .videoSrc already exists
        var newVideoSrc = $button.data('videosrc'); // Get the new video source

        if (newVideoSrc) {
            // If a new video source exists, ensure .videoSrc exists
            if ($videoSrc.length === 0) {
                // If .videoSrc does not exist, create it
                $videoSrc = $('<div class="videoSrc"><iframe frameborder="0" allowfullscreen></iframe></div>');
                $content.append($videoSrc); // Append it to the .content div
            }
            // Set the iframe src
            $videoSrc.find('iframe').attr('src', newVideoSrc);
        } else {
            // If no video source is provided, remove the .videoSrc container
            $videoSrc.remove();
        }

    });


    $('div.user-scenarios div.title').click(function () {
        // Toggle font-weight of the h3
        var $h3 = $(this).find('h3');
        var currentFontWeight = $h3.css('font-weight'); // Get the current font-weight
        var isBold = currentFontWeight === '500' || currentFontWeight === 500;
        $h3.css('font-weight', isBold ? '400' : '500');

        // Set border-bottom for div.title based on h3 font-weight
        $(this).css('border-bottom', isBold ? 'solid 1px #003820' : 'solid 2px #003820');

        // Retrieve current svg rotation angle and update it
        var $svg = $(this).find('svg');
        var currentRotation = $svg.data('rotation') || 0;
        var newRotation = currentRotation === 0 ? 180 : 0;
        $svg.css('transform', 'rotate(' + newRotation + 'deg)');
        $svg.data('rotation', newRotation);

        // Adjust svg path stroke-width based on h3 font-weight
        $svg.find('path').css('stroke-width', isBold ? '2px' : '3px');

        // Toggle 'p' visibility
        $(this).next('p').toggle();
    });

    //Function that checks the URL
    function checkurl(url) {

        //Depending on the current URL hash, runs the filterProjects function, that  filters the projects through categories on the homepage
        //It  then runs the scroll function, that navigates the user to the apropriate scroll position
        if (url == "#interaction") {
            filterProjects("Interaction");
            scroll()
        } else if (url == "#branding") {
            filterProjects("Branding");
            scroll()
        } else if (url == "#editorial") {
            filterProjects("Editorial");
            scroll()
        } else if (url == "#all") {
            filterProjects("All");
            scroll()
        }
    }

    //Function that Checks Scroll Position of the Project Section on the Home Page
    function scroll() {

        //Toggle projectHeader position from sticky to relative to calculate it's offset position and allow the calculation of the scroll position.
        const projectHeader = $('#project-section-header');

        projectHeader.css('position', 'relative');
        const headerOffset = projectHeader.offset().top + 50;
        projectHeader.css('position', 'sticky');

        $('html, body').animate({ scrollTop: headerOffset }, 500);
    }

    //Function that Filters Projects on the Home Page
    function filterProjects(category) {

        $('#navigation button').removeAttr('id'); //Remove ID ("selected") from all the navigation itens
        $(`.${category}`).attr('id', 'selected'); //Add ID "selected" to the li iten of the category that is filtering projets

        //Check the class of the projects divs to see if they match the category that is filtering projects
        $('#projects > div').each(function () {
            const projectCategories = $(this).attr('class').split(' '); //If a project has more than one category, split them.

            //Display projects with matching category class, hide the others
            if (category === 'All' || projectCategories.includes(category)) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    }

    $('#navigation button').on('click', function () {
        const className = $(this).attr('class').toLowerCase(); // Get the class and convert to lowercase
        window.location.href = `${window.location.origin}${window.location.pathname}#${className}`;
    });
    

});



