// set up image cycler，load images1234，target html element，background=false
function setupImageCycler(images, targetElement, isBackground = false, interval = 1000) {
    //initialize variable，if default = 0，start 1st array
    let currentIndex = 0;
//check isbackground = true/false
//if true，image should be used as background
    if (isBackground) {
        document.body.style.backgroundImage = `url(${images[currentIndex]})`;//formats the image path as: url('image-path').
    } else if (targetElement)  {
        targetElement.src = images[currentIndex];  //gets the current image path from the images array.
    }
//updating displayed image
    function changeImage() {
        currentIndex = (currentIndex + 1) % images.length;//cycle through image array，currentIndex + 1 point to the next image.% images.length ensures the index wraps around to 0 when it exceeds the array length, creating a loop.
        //check isbackground true/fals
        if (isBackground) {
            document.body.style.backgroundImage = `url(${images[currentIndex]})`;
        } else if (targetElement) {
            targetElement.src = images[currentIndex];
        }//isbackground=false，targetelement YES，then target element，
    }
  //handle image cycling
    let intervalId = null;//set interval，initialize to null
    if (isBackground) {
        intervalId = setInterval(changeImage, interval);
    }//Creates an interval timer using setInterval to execute，Returns a unique interval ID

    //if targetelement，add a click event-click on targetelement，function，change image execute
    if (targetElement) {
        targetElement.addEventListener('click', () => {
            changeImage();
            // check & ensure isbackground & active interval time，if
    
            if (isBackground && intervalId) {
                clearInterval(intervalId);   } //stops auto bkg img when clicking
        });
    }
//ensure available，then return request
    return intervalId;
}

// add event listenener to listen for DOMContentLoaded：triggered when the HTML document has been completely loaded and parsed, but before external resources (like images and stylesheets) have finished loading.
document.addEventListener('DOMContentLoaded', () => {
    const pageTitle = document.title;// retrieves the title of the current HTML document and stores it in the variable pageTitle

    // load json
    fetch('class.json')//locate class.json file
        .then(response => response.json())//response object returned from the fetch() to json
        //callback function receives the parsed JSON as the data
        .then(data => {
            const pages = data.pages;//Accesses the pages property of JSON data.

            //checks if the current page corresponds to the Index page
            //if json title match with index title,if match, then user is on index page and if() execute
            if (pageTitle === pages.index.title) {
                //image cycle set up. argument pass: image array, no target html element bc isbackground true,    time interval.
                setupImageCycler(pages.index.images, null, true, 1000);
               //add event listener to body html:listen for click, if listened, call back 
                document.body.addEventListener('click', () => {
                    window.location.href = pages.index.redirect;//current page(index) to homepage
                });
            }

            //if documentation
            if (pageTitle === pages.documentation.title) {
                //store the event:document.getElementById---search element: id=photo, to photoElement, for later use.
                const photoElement = document.getElementById('photo');
                setupImageCycler(pages.documentation.images, photoElement);
            }

            //if finalvideo
            if (pageTitle === pages.finalVideo.title) {
               // Searches, select <iframe> element. from document
                const iframe = document.querySelector('iframe');
                //Refers to the src attribute of the <iframe> element
                iframe.src = pages.finalVideo.videoUrl;
            }

            //if homepage.

            if (pageTitle === pages.homepage.title) {
                // select container
                const container = document.querySelector('.vertical-text');
                //Loops through the array pages.homepage.links from class.json
                pages.homepage.links.forEach(link => {
                    //create anchor <a> element for each link in array
                    const a = document.createElement('a');
                    //link attributes
                    a.href = link.href;
                    a.textContent = link.name;
                    //Adds the anchor as a child element to the container.
                    container.appendChild(a);
                });
            }
             // if concept
            if (pageTitle === pages.concept.title) {
              //Select the Content Container:
                const contentContainer = document.querySelector('.content');//finds and returns the first matching element
               //Iterating Over Poem Sections: loops through pages.concept.poemSections
                pages.concept.poemSections.forEach(section => {
                    const sectionDiv = document.createElement('div');//Creates a new <div> element to act as a container for each poem section.
                    sectionDiv.className = 'poem';//Assigns the class poem
                    //Loops through each line in the current section array
                    section.forEach(line => {
                        //Creates a <p> for current line
                        const p = document.createElement('p');
                        //Assigns the text content
                        p.textContent = line;
                        //Add <p> to the sectionDiv.
                        sectionDiv.appendChild(p);
                    });
                    //adds sectionDiv to contentContainer
                    contentContainer.appendChild(sectionDiv);
                });
            }
        });
});
