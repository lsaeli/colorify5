/************************************************************************************/
// boilerplate
/***********************************************************************************/
window.onload = function() {
    console.log("boilerplate profile");
    var colors = [];
    var colorsLinks = [];


    var selectedColor = "#0000ff";

    // doc elements
    var profileContainer = document.getElementById("profile"),
        postContainer = document.getElementById("posts"),
        colorContainer = document.getElementById("colorContainer"),

        // only classes can be looped through. IDs only go once

        watchingContainer = document.getElementById("watching"),
        watchingList = document.getElementById("watching_users"),
        postingInterface = document.getElementById("post_interface"),
        centralListContainer = document.getElementById("central_list");

    var url = window.location.toString(),
        archive = new DatArchive(url);

    // Area for re sorting posts but clicking on the colors

    // each color gets a click handler and a function call where you write the hex value into the sortColor function
    var elRed = document.getElementById("sortRed");
    elRed.addEventListener("click", function() { sortColors("#ff0000") }, false);

    // This is an example
    var elPink = document.getElementById("sortPink");
    elPink.addEventListener("click", function() { sortColors("#ffc0cb") }, false);

    var elOrange = document.getElementById("sortOrange");
    elOrange.addEventListener("click", function() { sortColors("#ffa500") }, false);

    var elYellow = document.getElementById("sortYellow");
    elYellow.addEventListener("click", function() { sortColors("#ffff00") }, false);

    var elGreen = document.getElementById("sortGreen");
    elGreen.addEventListener("click", function() { sortColors("#008000") }, false);

    var elBlue = document.getElementById("sortBlue");
    elBlue.addEventListener("click", function() { sortColors("#0000ff") }, false);

    var elPurple = document.getElementById("sortPurple");
    elPurple.addEventListener("click", function() { sortColors("#800080") }, false);

    var elBrown = document.getElementById("sortBrown");
    elBrown.addEventListener("click", function() { sortColors("#a52a2a") }, false);

    var elBlack = document.getElementById("sortBlack");
    elBlack.addEventListener("click", function() { sortColors("#000000") }, false);

    var elWhite = document.getElementById("sortWhite");
    elWhite.addEventListener("click", function() { sortColors("#ffffff") }, false);

    // make div to wrap none filter
    var elNone = document.getElementById("sortNone");
    elNone.addEventListener("click", function() { sortColors("none") }, false);

    // sortColors reloads your interface and hides and shows the posts depending on if they fall within the color bounds
    function sortColors(color) {
        //set the selected color
        selectedColor = color
        //delete the old stuff
        postContainer.innerHTML = ``
        //load in the new stuff
        initiateLoadPosts(archive)
    }



/************************************************************************************/
// overlay hexColors
/******************************************************************************/

    // elRedOverlay = code for the overlay menu only
    var elRedOverlay = document.getElementById("red-info");
    elRedOverlay.addEventListener("click", function() { sortOverlayColors("#ff0000") }, false);

    // This is an example
    var elPinkOverlay = document.getElementById("pink-info");
    elPinkOverlay.addEventListener("click", function() { sortOverlayColors("#ffc0cb") }, false);

    var elOrangeOverlay = document.getElementById("orange-info");
    elOrangeOverlay.addEventListener("click", function() { sortOverlayColors("#ffa500") }, false);

    var elYellowOverlay = document.getElementById("yellow-info");
    elYellowOverlay.addEventListener("click", function() { sortOverlayColors("#ffff00") }, false);

    var elGreenOverlay = document.getElementById("green-info");
    elGreenOverlay.addEventListener("click", function() { sortOverlayColors("#008000") }, false);

    var elBlueOverlay = document.getElementById("blue-info");
    elBlueOverlay.addEventListener("click", function() { sortOverlayColors("#0000ff") }, false);

    var elPurpleOverlay = document.getElementById("purple-info");
    elPurpleOverlay.addEventListener("click", function() { sortOverlayColors("#800080") }, false);

    var elBrownOverlay = document.getElementById("brown-info");
    elBrownOverlay.addEventListener("click", function() { sortOverlayColors("#a52a2a") }, false);

    var elBlackOverlay = document.getElementById("black-info");
    elBlackOverlay.addEventListener("click", function() { sortOverlayColors("#000000") }, false);

    var elWhiteOverlay = document.getElementById("white-info");
    elWhiteOverlay.addEventListener("click", function() { sortOverlayColors("#ffffff") }, false);

    // div wraps none filter
    var elNoneOverlay = document.getElementById("undefined-info");
    elNoneOverlay.addEventListener("click", function() { sortOverlayColors("none") }, false);


    function sortOverlayColors(color) {
        //set the selected color
        selectedColor = colorsLinks
        //delete the old stuff
        colorContainer.innerHTML = ``
        //load in the new stuff
        initiateOverlayPosts(archive)
    }


    /******************************************************************************/

    loadProfile(archive).then(function(userInfo) {
        var username = userInfo.profile.username,
            bio = userInfo.profile.bio,
            datUrl = userInfo.profile.datUrl,
            email = userInfo.profile.email;

        profileContainer.insertAdjacentHTML(
            "beforeend",
            `
            <h1>${username}</h1>
            <p>${bio}</p>
            `
        );

        var userCounter = 0,
            userList = userInfo.profile.users;

        usersProfiles(userCounter, userList, centralListContainer); // all users and a link to their site
        userAndTheirPosts(userCounter, userList, watchingContainer); // all users and their posts
    });


    // pass this function a hex value to get the hue - the hue is used to filter the posts
    function getHue(color) {
        var hex = color.substring(1);
        // var hex = color.substring(1);

        /* Get the RGB values to calculate the Hue. */
        var r = parseInt(hex.substring(0, 2), 16) / 255;
        var g = parseInt(hex.substring(2, 4), 16) / 255;
        var b = parseInt(hex.substring(4, 6), 16) / 255;

        var max = Math.max.apply(Math, [r, g, b]);
        var min = Math.min.apply(Math, [r, g, b]);


        /* Variables for HSV value of hex color. */
        var chr = max - min;
        var hue = 0;
        var val = max;
        var sat = 0;

        if (val > 0) {
            /* Calculate Saturation only if Value isn't 0. */
            sat = chr / val;
            if (sat > 0) {
                if (r == max) {
                    hue = 60 * (((g - min) - (b - min)) / chr);
                    if (hue < 0) {
                        hue += 360;
                    }
                } else if (g == max) {
                    hue = 120 + 60 * (((b - min) - (r - min)) / chr);
                } else if (b == max) {
                    hue = 240 + 60 * (((r - min) - (g - min)) / chr);
                }
            }
        }

        return hue
    }

    // pass the currently selected color and the posts color into this function to see if the post should display or not
    function checkifSelected(selectedColor, color) {
        // if I clicked no sorting or undefined - set all to true (display all)
        if (selectedColor == "none") {
            return true
        }

        // div wraps none filter
        // else do the sorting and checking

        selectedHue = getHue(selectedColor)
        console.log(selectedHue);
        postHue = getHue(color)
        console.log(postHue);

        if (postHue < selectedHue + 40 && postHue > selectedHue - 40) {
            return true // post will display
        } else {
            return false // post will not display
        }

        // this is out filtering algorithm - we choose to display values +/- 40 hue from the selected color
        // chang this for wider or narrower filtering  

    }

    // onclick of color
    //   set a new selectedColor
    //   call the loadposts function again to resort the display with the filter


    function initiateOverlayPosts(archive) {
        // load my posts forEach works like a for loop
        loadPosts(archive)
            .then(function(userPosts) {
                userPosts.posts.forEach(function(post) {
                    loadPostContent(archive, post)
                        .then(function(postAndArchive) {


                            if (postAndArchive.post.colorsLinks !== undefined) {
                                var shouldIdisplay = checkifSelected(selectedColor, postAndArchive.post.colorsLinks)
                                console.log(shouldIdisplay)
                            }

                            //shortcut if statement

                            //The variable to show and hide posts that we apply to the html
                            let showLink = shouldIdisplay ? "show" : "hide";

                            colorContainer.insertAdjacentHTML("beforeend", `
                            <li id="colorList"> 
                                <a href="./posts/post-${postAndArchive.post.timestamp}.json" id="hexColorLink" class=${showColors} style="color:${postAndArchive.post.colors};">${postAndArchive.post.colors}</a>
                            </li>
                            `)
                        })
                })
            });
    }


    function getOverlayHue(color) {
        var hexOverlay = colorOverlay.substring(1);
        // var hex = color.substring(1);

        /* Get the RGB values to calculate the Hue. */
        var rOverlay = parseInt(hexOverlay.substring(0, 2), 16) / 255;
        var gOverlay = parseInt(hexOverlay.substring(2, 4), 16) / 255;
        var bOverlay = parseInt(hexOverlay.substring(4, 6), 16) / 255;

        var maxOverlay = Math.max.apply(Math, [rOverlay, gOverlay, bOverlay]);
        var minOverlay = Math.min.apply(Math, [rOverlay, gOverlay, bOverlay]);


        /* Variables for HSV value of hex color. */
        var chrOverlay = maxOverlay - minOverlay;
        var hueOverlay = 0;
        var valOverlay = maxOverlay;
        var satOverlay = 0;

        if (valOverlay > 0) {
            /* Calculate Saturation only if Value isn't 0. */
            satOverlay = chrOverlay / valOverlay;
            if (satOverlay > 0) {
                if (rOverlay == maxOverlay) {
                    hueOverlay = 60 * (((gOverlay - minOverlay) - (bOverlay - minOverlay)) / chrOverlay);
                    if (hueOverlay < 0) {
                        hueOverlay += 360;
                    }
                } else if (gOverlay == maxOverlay) {
                    hueOverlay = 120 + 60 * (((bOverlay - minOverlay) - (rOverlay - minOverlay)) / chrOverlay);
                } else if (b == maxOverlay) {
                    hueOverlay = 240 + 60 * (((rOverlay - minOverlay) - (gOverlay - minOverlay)) / chrOverlay;
                }
            }
        }

        return hueOverlay
    }

    // pass the currently selected color and the posts color into this function to see if the post should display or not
    function checkifOverlaySelected(selectedOverlayColor, colorOverlay) {
        // if I clicked no sorting or undefined - set all to true (display all)
        if (selectedOverlayColor == "none") {
            return true
        }

        // div wraps none filter
        // else do the sorting and checking

        selectedOverlayHue = getHueOverlay(selectedOverlayColor)
        console.log(selectedOverlayHue);
        linkHue = getHueOverlay(colorOverlay)
        console.log(linkHue);

        if (linkHue < selectedOverlayHue + 40 && linkHue > selectedOverlayHue - 40) {
            return true // post will display
        } else {
            return false // post will not display
        }

        // this is out filtering algorithm - we choose to display values +/- 40 hue from the selected color
        // chang this for wider or narrower filtering  

    }


    /******************************************************************************/

    function initiateLoadPosts(archive) {
        // load my posts forEach works like a for loop
        loadPosts(archive)
            .then(function(userPosts) {
                userPosts.posts.forEach(function(post) {
                    loadPostContent(archive, post)
                        .then(function(postAndArchive) {


                            //checks if the color is applied and sets a boolean value that we will use as a class to show and hide posts
                            if (postAndArchive.post.colors !== undefined) {
                                var shouldIdisplay = checkifSelected(selectedColor, postAndArchive.post.colors)
                                console.log(shouldIdisplay)
                            }

                            //shortcut if statement
                            let showColors = postAndArchive.post.colors == undefined ? "hidden" : "colors";
                            let showEmoticon = postAndArchive.post.emoticon == undefined ? "hidden" : "emoticon";
                            let signatureImg = postAndArchive.post.signature == undefined ? "hidden" : "signature";

                            //The variable to show and hide posts that we apply to the html
                            let showPosts = shouldIdisplay ? "show" : "hide";

                            // if (showColors == "colors"){
                            //   colors.push(postAndArchive.post.colors)
                            //   console.log(colors)
                            // }


                            console.log("post", postAndArchive.post);

                            //console.log("post", postAndArchive.post);
                            //console.log("postsig", postAndArchive.post.signature);

                            var signature = ((postAndArchive.post.signature != undefined && postAndArchive.post.signature != null) ? postAndArchive.post.signature : "");

                            // console.log(signature)

                            var displayImage = (signature.includes("data:image")) ? "" : "display: none;";

                            // if (signature.includes("data:image")) {
                            //     console.log("this is an image")
                            // }

                            /******************************************************************************/
                            // inserts color labels into overlay menu
                            /******************************************************************************/
                            colorContainer.insertAdjacentHTML("beforeend", `
                           
                            <li id="colorList"> 
                                <a href="./posts/post-${postAndArchive.post.timestamp}.json" id="hexColorLink" class=${showColors} style="color:${postAndArchive.post.colors};">${postAndArchive.post.colors}</a>
                            </li>
                            `)


                            // colorGuide.insertAdjacentHTML("beforebegin", `
                            // <li id="colorList"> 
                            //     <p>./colorsDefs/post-${postAndArchive.post}.json" id="hexColorLink" class=${showColors} style="color:${postAndArchive.post.colors};">${postAndArchive.post.colors}</a>
                            // </li>
                            // `)

                            //post container archives and posts title, timestamp, content
                            //makes a tag that shows colors, and make your input the color of that tag
                            // showPosts is used to filter the post

                            postContainer.insertAdjacentHTML("beforeend", `

        <div id="postBackground" class=${showPosts}> 
              <div id="postText" >
                          <h2 id="postHeader" style="color:${postAndArchive.post.colors};">${postAndArchive.post.title}</h2>
                          <h4 id="timestamp">${postAndArchive.post.timestamp}</h4>
                            

                          <div class=displaySignature> 
                                      <img class=${signatureImg} style="${displayImage}" id=imgSign src="${signature}">
                                  </div>


                            <p id="postPara">${postAndArchive.post.content} <br></p>

                              <div id="hexColorIcon" style="background-color:${postAndArchive.post.colors};"></div>


                            <div id="postEmoticon">
                                <p class=${showEmoticon} style="color:${postAndArchive.post.colors};">${postAndArchive.post.emoticon}</p>
                            </div>

                            <div id="hexColor">
                                <p class=${showColors} style="color:${postAndArchive.post.colors};">${postAndArchive.post.colors}</p>
                            </div>

                          </div>
                        </div>

                `)
                        })
                })
            });

    }

    initiateLoadPosts(archive)
    /******************************************************************************/
    // isOwner
    /******************************************************************************/
    isOwner(archive).then(function(e) {
        if (e) {

            $("#col1").addClass("boxOwner");

            post_interface.insertAdjacentHTML(
                "beforeend",
                `
<h2 id="header">Post</h2>
      <form id="post_to" onsubmit="return validateForm()">
    <p>Title</p>
          <input type="text" name="Title" value=""><br><br>
          <p>Content</p>
          <textarea name="Content"  id="txtarea" rows="4" cols="30" value=""></textarea><br><br>


    <div class="featureBar">
                  <label for="featureInfo">Features
                  <div class="tooltip" style="font-size:16px;">&#9432;
                  <span class="tooltiptext" style="font-size: 14px;">Click on icons below to toggle more features!</span>
                  </div></div>


    <div id="iconBar">
                  <div class="tooltipFeature">
                    <div id="picker-ico" class="icons"><svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 497.02 497.02"><defs><style>.cls-1{fill:#84595a;stroke:##84595a;stroke-miterlimit:10;stroke-width:18px;}.cls-2{fill:#e6dfd3;}.cls-3{fill:#24354e;}</style></defs><title>c0ccad98ca62b7a29ee12690c7953029</title><circle class="cls-1" style="fill:#8a97b3;" cx="248.51" cy="248.51" r="239.51"/><path class="cls-2" d="M296.7,189.27a259.72,259.72,0,0,1,21.83,20.51L206.27,322c-1.24,1.23-5.11,3.64-10.26,4.87l-.09,0-.23.06c-.72.16-1.43.3-2.15.39l-1.06.14-1,.24c-2.05.46-4.32,1.08-6.73,1.88l-9.47,2.29,3-12.52c.53-1.67.95-3.24,1.28-4.69l.19-.82.13-.83c.08-.54.19-1.09.31-1.63l.06-.26v-.07c1.24-5.15,3.65-9,4.88-10.25L296.7,189.27M295.21,159l-126,126c-4.78,4.78-8.87,12.69-10.83,20.9l-.08-.06s0,.24-.06.65c-.24,1.06-.44,2.11-.6,3.17-1.17,5-4.46,14.35-14,23.88h0l-6.62,6.62c-8,8-9.74,19.37-3.8,25.31l7.59,7.59a12.8,12.8,0,0,0,9.24,3.55c5.3,0,11.28-2.54,16.08-7.35l6.61-6.61a49.05,49.05,0,0,1,23.66-13c1.4-.18,2.81-.45,4.21-.76l.66-.07-.07-.07c8.21-2,16.13-6.05,20.91-10.84L348.78,211.28c-14.46-20.28-34-36.62-53.57-52.28Z" transform="translate(-9 -5.98)"/><path class="cls-3" d="M383.76,134.12,373,123.37c-8.9-8.9-22.53-9.71-30.44-1.79l-25.48,25.48-10.68-10.68a15,15,0,0,0-21.17,0L274.65,147l-15.87,15.88,84.68,84.68,15.88-15.88,10.58-10.58a15,15,0,0,0,0-21.18l-9.85-9.84,25.48-25.48C393.47,156.65,392.67,143,383.76,134.12Z" transform="translate(-9 -5.98)"/></svg></div>
                    <span class="tooltiptextFeature" style="font-size: 14px;">Colorify feature</span>
                  </div>



    <div class="tooltipFeature">
          <div id="emoticon-ico" class="icons"><svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 497 497"><defs><style>.cls-1{fill:#3e4990;stroke:#e6dfd3;stroke-miterlimit:10;stroke-width:18px;}.cls-2{fill:#e0e0e0;}</style></defs><title>emoticon2</title><circle class="cls-1" cx="248.5" cy="248.5" r="239.5"/><path class="cls-2" d="M231.6,290.7c2.4-2.7,4.6-5.1,6.8-7.6-.4.6-.8,1.1-1.2,1.7,2.9,2.1,5.7,4.2,8.6,6.3,3.5,2.5,6.9,2.4,9.9-1a1.38,1.38,0,0,0,.3-.4c10.2-10.7,10.2-10.8,1.1-22.6-3.9-5-7.5-10.1-8.1-16.7-1.4-13.7,7.7-24.3,21.8-25.2a31.81,31.81,0,0,1,12.3,1.5c14.4,4.9,19.5,20.7,11.1,34a133,133,0,0,1-10.1,13.6c-2.2,2.6-2.2,4.6.1,7s4,5.1,6.1,7.5c4.2,4.9,8,5.1,12.7.7a76.84,76.84,0,0,0,5.5-6.6c2.3,2.5,4.5,5,6.9,7.7-5.2,7.9-11.1,13.9-21.4,13.3s-14.6-9-20.8-16.2c-6.1,9.3-12.5,17.9-25,16.1C240.6,302.7,236,297.4,231.6,290.7Z" transform="translate(-9 -6)"/><path class="cls-2" d="M123.8,221.8c-5.4-12.9-10.4-16.2-21.5-14.7-8.2,1.1-14.8,6.5-16,15.7a89.21,89.21,0,0,0,.1,25.8c2,11.7,11.2,17,22.9,15.4a22.48,22.48,0,0,1,2.6,0v37.6H99.8c0-7-.3-14.2.1-21.4.2-4.4-1.1-6-5.5-7-12.3-2.8-18.1-12.3-21.1-23.5a55.9,55.9,0,0,1,.8-31.9c4.6-14.3,18.7-23,34-21.4s22.8,7.2,26.5,19.2c1.2,3.8,0,5-3.6,5.2A72.64,72.64,0,0,0,123.8,221.8Z" transform="translate(-9 -6)"/><path class="cls-2" d="M406.4,301.7H394.3V263.8c2.4.2,4.4.6,6.5.6,9.4-.2,15.8-4.8,18.6-14a49.42,49.42,0,0,0,.2-29c-2.8-9.8-9.5-14.6-19.6-14.8-8-.1-13.1,3.9-16.8,13.4-.2.4-.4.9-.8,1.8-3.8-.6-7.6-1.3-11.4-1.9.8-10.7,7.5-19.3,17.5-22,21.2-5.7,44.1,2.5,45.9,32.6.7,11.6-.7,22.8-7.9,32.6-4.1,5.6-9.4,9.4-16.2,10.4-3.6.5-4,2.2-4,5.2C406.5,286.3,406.4,293.9,406.4,301.7Z" transform="translate(-9 -6)"/><path class="cls-2" d="M221.6,251.4a17.75,17.75,0,1,1-35.5-.5c.1-10.1,7.6-17.5,17.8-17.5C214.3,233.3,221.7,240.9,221.6,251.4Z" transform="translate(-9 -6)"/><path class="cls-2" d="M360.9,251a17.75,17.75,0,1,1-35.5.1c0-10.4,7.6-17.9,18-17.8C353.6,233.4,360.9,240.8,360.9,251Z" transform="translate(-9 -6)"/></svg></div>
              <span class="tooltiptextFeature" style="font-size: 14px;">Emoticon feature</span>
          </div>


              <div class="tooltipFeature">
                      <div id="more-ico" class="icons"><?xml version="1.0" encoding="utf-8"?> <!-- Generator: Adobe Illustrator 23.0.2, SVG Export Plug-In . SVG Version: 6.00 Build 0)  --> <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve"> <style type="text/css"> .st0{fill:#755984;stroke:#E6DFD3;stroke-width:18;stroke-miterlimit:10;} .st1{fill:#E0E0E0;} </style> <circle class="st0" cx="257.5" cy="254.5" r="239.5"/> <g> <path class="st1" d="M179,244.8c-0.1,14.5-11.6,25.9-26.1,25.9c-14.6,0-26.1-11.7-25.9-26.6c0.1-14.8,11.1-25.6,26.1-25.6 C168.3,218.3,179.1,229.4,179,244.8z"/> <path class="st1" d="M382.9,244.2c0,14.9-11.6,26.5-26.2,26.4c-14.5-0.1-25.8-11.7-25.8-26.2c0-15.2,11.1-26.2,26.4-26.1 C372.2,218.4,382.9,229.3,382.9,244.2z"/><path class="st1" d="M283.4,244.2c0,14.9-11.6,26.5-26.2,26.4c-14.5-0.1-25.8-11.7-25.8-26.2c0-15.2,11.1-26.2,26.4-26.1 C272.7,218.4,283.4,229.3,283.4,244.2z"/></g></svg> </div>
                      <span class="tooltiptextFeature" style="font-size: 14px;">Click to hide/show more features</span>
              </div>
              <br>


              <span id="secondIcoRow">
                  <div class="tooltipFeature">
                  <div id="signature-ico" class="icons"><svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 497 497"><defs><style>.cls-6{fill:#297580;stroke:#e6dfd3;stroke-miterlimit:10;stroke-width:18px;}.cls-2{fill:#e0e0e0;}</style></defs><title>upload</title><circle class="cls-1" style="fill: #297580;" cx="248.5" cy="248.5" r="239.5"/><path class="cls-2" d="M310,299.21H183.83l57.92-55.7L268,267.9l28.33-37.1C303.51,241.2,310,251,310,263.61,310,275.27,310,286.93,310,299.21Z" transform="translate(-9 -6)"/><path class="cls-2" d="M198.11,228.73a14.22,14.22,0,0,1,14.07-14.43,14.39,14.39,0,1,1,.11,28.77A14.28,14.28,0,0,1,198.11,228.73Z" transform="translate(-9 -6)"/><path class="cls-2" d="M352.26,269.44h-17.1v52.91l0-2.5H161.4v-128H267V171.56H260.3c-33.4,0-66.8.23-100.19-.16-8.57-.1-14.45,2.58-18,10.31V330.8c4.25,6.95,10.51,8.86,18.47,8.83,57.4-.23,114.81-.12,172.21-.12,1.67,0,3.35.06,5-.05,9.5-.6,14.76-6.18,14.78-15.76q0-24.42,0-48.85C352.58,273.05,352.37,271.24,352.26,269.44Z" transform="translate(-9 -6)"/><path class="cls-2" d="M352.14,241.33V186.08h36.63L344,135.64,297.61,186h37.53l0,55.36Z" transform="translate(-9 -6)"/></svg></div>
                            <span class="tooltiptextFeature" style="font-size: 14px;">Upload feature</span>
                  </div>
              </div>
</div>


            <div id="color-box">
                <div id="wellText"
                <label for="colorWell">Colorify
              
              <div class="tooltip">&#9432;
                <span class="tooltiptext" style="font-size: 14px;">Pick a color that represents this post. There are no wrong answers.</span>
                </div>
                </label>
              </div>
              
              <input name="Colors" type="color" value="#fba05e" id="colorWell" onchange="getColor(this.value)">
              </div>


              <div id="emoticonFeature">
                  <p id="featureInfo">Emoticons
                                <span class="tooltip6" style="font-size:16px;">&#9432;
                                <span class="tooltiptext6" style="font-size: 14px;">Add in a visual emotion</span>
                  </p>
       

  <div id="button-box">
    <div class="button flat" name="emoticon"  value="ʕ·ᴥ·ʔ ">
        <span id="emoticonText">ʕ·ᴥ·ʔ</span>
    </div>

    <div class="button flat" name="emoticon" value="(◕‿◕✿) ">
        <span id="emoticonText">(◕‿◕✿)</span>
    </div>

    <div class="button flat" name="emoticon" value="(✪‿✪)ノ ">
        <span id="emoticonText">(✪‿✪)ノ</span>
    </div><br>

    <div class="button flat" name="emoticon" value="(ಠ_ಠ) ">
        <span id="emoticonText">(ಠ_ಠ)</span>
    </div>

    <div class="button flat" name="emoticon" value="(¬_¬) ">
        <span id="emoticonText">(¬_¬)</span>
    </div>

    <div class="button flat" name="emoticon" value="(＾＾；) ">
        <span id="emoticonText">(＾＾；)</span>
    </div><br>

    <div class="button flat" name="emoticon" value="(ಥ_ಥ) ">
        <span id="emoticonText">(ಥ_ಥ)</span>
    </div>

    <div class="button flat" name="emoticon" value="(T⌓T) ">
        <span id="emoticonText">(T⌓T)</span>
    </div>

    <div class="button flat" name="emoticon" value="(⊙△⊙) ">
        <span id="emoticonText">(⊙△⊙)</span>
    </div><br><br><br><br>
  </div>
 </div>


<div id="uploadFeature">
           <div class="uploadContainer">
                <p id="featureInfo">Upload 
                            <span class="tooltip6" style="font-size:16px;">&#9432;
                            <span class="tooltiptext6" style="font-size: 14px;">Upload an experience</span>
                </p>

          <button class="signature-btn" type="button" onclick="$('.signature-input').trigger( 'click' )">

          <svg id="experience-ico" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 99.1 55.9"><title>icon_upload</title><path d="M90.4,52.38a8.8,8.8,0,1,1,8.8-8.8A8.69,8.69,0,0,1,90.4,52.38Zm0-14.4a5.5,5.5,0,1,0,5.5,5.5A5.48,5.48,0,0,0,90.4,38Z" transform="translate(-0.1 -12.28)"/><path d="M13.5,53.48a5.4,5.4,0,0,0-3.3-3.3v-3.5H6.9v3.5a5.4,5.4,0,0,0-3.3,3.3H.1v3.3H3.6a5.4,5.4,0,0,0,3.3,3.3v3.5h3.3v-3.5a5.4,5.4,0,0,0,3.3-3.3H17v-3.3Zm-4.9,4.1a2.5,2.5,0,0,1,0-5,2.5,2.5,0,1,1,0,5Z" transform="translate(-0.1 -12.28)"/><path d="M24.9,23.28a5.5,5.5,0,1,1,5.5-5.5A5.55,5.55,0,0,1,24.9,23.28Zm0-7.5a2.1,2.1,0,1,0,0,4.2,2.18,2.18,0,0,0,2.1-2.1A2.11,2.11,0,0,0,24.9,15.78Z" transform="translate(-0.1 -12.28)"/><path d="M41,48.38a6.6,6.6,0,1,1,6.6-6.6A6.66,6.66,0,0,1,41,48.38Zm0-9.9a3.3,3.3,0,1,0,3.3,3.3A3.33,3.33,0,0,0,41,38.48Z" transform="translate(-0.1 -12.28)"/><path d="M25.9,29v39.2H73.3V29Zm44.2,3.4v17.7l-4.8-4.8A4.26,4.26,0,0,0,61.8,44a4.86,4.86,0,0,0-3.3,1.5l-9.9,11.1L43,53.48a4.54,4.54,0,0,0-5.5.8l-8.1,8.3V32.38ZM56.8,64.88H31.5l8.3-8.4a1.08,1.08,0,0,1,1.5-.2Zm7,0-12.1-6.8,9.4-10.7a1.1,1.1,0,0,1,1-.5,3.81,3.81,0,0,1,1,.3l7.1,7.1V64.89Z" transform="translate(-0.1 -12.28)"/></svg>
          <span id="uploadExperience">Upload an experience</span></button>

            <div class="signature-btn">
                  <div class="dragUpload">
                     <input class="signature-input" type="file" name="Signature" value="" accept=".jpg, .jpeg, .png" onchange="readURL(this);"><br>
                     
                  <div class="drag-text"><h3>Drag and<br>drop a file</h3></div>
            </div>

           <div id="signatureContainer">
                  <img name="ActualSignature" id="signature-image" src="" alt="Image preview...">
                  <div class="image-title-wrap"><button type="button" onclick="removeUpload()" class="remove-image">Remove <span class="image-title">Uploaded Image</span></button>
          </div>
      </div>
</div>
</div>
</div>

      <br>

      <input type="submit" name="Post" >
      </form>
      `
            );

            /******************************************************************************/
            // toggle feature icons
            /******************************************************************************/
            $("#picker-ico").click(function() {
                $("#color-box").slideToggle("fast");
                $("#emoticonFeature").fadeOut("fast");
                $("#uploadFeature").fadeOut("fast");
            });

            $("#emoticon-ico").click(function() {
                $("#emoticonFeature").slideToggle("fast");
                $("#color-box").fadeOut("fast");
                $("#uploadFeature").fadeOut("fast");
            });

            $("#more-ico").click(function() {
                $("#secondIcoRow").toggle();
            });

            $("#secondIcoRow").click(function() {
                $("#uploadFeature").slideToggle("fast");
                $("#color-box").fadeOut("fast");
                $("#emoticonFeature").fadeOut("fast");
            });


            var postSubmission = document.getElementById("post_to");
            writePost(archive, postSubmission);


            /******************************************************************************/
            // not owner
            /******************************************************************************/
        } else {
            console.log(
                "isOwner returns: ",
                e,
                "\n it looks like you are not the owner of this site");



            $("#col1").addClass("notBoxOwner");
        }


        /******************************************************************************/
        // emoticon button
        /******************************************************************************/
        $(".button").click(function() {
            var emoticon = $(this)
            emoticon.siblings().removeClass('selected')
            emoticon.addClass('selected')

            var text = emoticon[0].innerText;

            $('#txtarea').val($('#txtarea').val() + " " + text)

            console.log(text)
        })
    });
};

/******************************************************************************/
// file reader
/******************************************************************************/
function readURL(input) {
    if (input.files && input.files[0]) {

        var reader = new FileReader();

        reader.onload = function(e) {
            $('.dragUpload').hide();
            $('#signature-image').attr('src', e.target.result);
            $('.signatureContainer').show();
            $('.image-title').html(input.files[0].name);
        };

        reader.readAsDataURL(input.files[0]);

    } else {
        removeUpload();
    }
}
/******************************************************************************/
// remove upload
/******************************************************************************/
function removeUpload() {
    $('.signature-input').replaceWith($('.signature-input').clone());
    $('.signatureContainer').hide();
    $('.dragUpload').show();
    $('#signature-image').removeAttr('src');
    $('.image-title').html("");
    // $('.image-title').hide();
}
/******************************************************************************/
// drag and drop file
/******************************************************************************/
$('.dragUpload').bind('dragover', function() {
    $('.dragUpload').addClass('image-dropping');
});

$('.dragUpload').bind('dragleave', function() {
    $('.dragUpload').removeClass('image-dropping');
});



function getColor(val) {
    console.log("got color", val)
}