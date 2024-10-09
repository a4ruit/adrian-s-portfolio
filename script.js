let minimizedWindows = [];
// You can choose to have an element with the class "window-top" inside of your draggable window that will act as the "handle" for the window or it will attach to the element itself

function makeDraggable (element) {
    // Make an element draggable (or if it has a .window-top class, drag based on the .window-top element)
    let currentPosX = 0, currentPosY = 0, previousPosX = 0, previousPosY = 0;
    let ghostElements = [];

		// If there is a window-top classed element, attach to that element instead of full window
    if (element.querySelector('.window-top')) {
        // If present, the window-top element is where you move the parent element from
        element.querySelector('.window-top').onmousedown = dragMouseDown;
    } 
    else {
        // Otherwise, move the element itself
        element.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e.preventDefault();
        previousPosX = e.clientX;
        previousPosY = e.clientY;
        element.classList.add('glitch');
        element.style.zIndex = 1000;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;

        // Create a ghost element
        createGhostElement(element);
    }

    function elementDrag (e) {
        // Prevent any default action on this element (you can remove if you need this element to perform its default action)
        e.preventDefault();
        // Calculate the new cursor position by using the previous x and y positions of the mouse
        currentPosX = previousPosX - e.clientX;
        currentPosY = previousPosY - e.clientY;
        // Replace the previous positions with the new x and y positions of the mouse
        previousPosX = e.clientX;
        previousPosY = e.clientY;
        // Set the element's new position
        element.style.top = (element.offsetTop - currentPosY) + 'px';
        element.style.left = (element.offsetLeft - currentPosX) + 'px';

         // Create a ghost element
         createGhostElement(element);
    }

    function closeDragElement () {
        // Stop moving when mouse button is released and release events
        document.onmouseup = null;
        document.onmousemove = null;
         // Remove glitch effect on mouseup
         element.classList.remove('glitch');
     
         
           // Fade out all ghost elements
        fadeOutGhostElements();
    
    }

    function createGhostElement(element) {
        const ghost = element.cloneNode(true);
        ghost.className = 'ghost';
        ghost.style.position = 'absolute';
        ghost.style.top = element.getBoundingClientRect().top + 'px';
        ghost.style.left = element.getBoundingClientRect().left + 'px';
        ghost.style.width = element.offsetWidth + 'px';
        ghost.style.height = element.offsetHeight + 'px';
        ghost.style.opacity = '0.5';
        document.body.appendChild(ghost);
        ghostElements.push(ghost);
    }

    function fadeOutGhostElements() {
        ghostElements.forEach(ghost => {
            ghost.style.transition = 'opacity 4s ease-out';
            ghost.style.opacity = '0';
            setTimeout(() => ghost.remove(), 4000);
        });
        ghostElements = [];
    }
}


// Make myWindow and myWindow2 draggable in different ways...

// myWindow will only be able to be moved via the top bar (.window-top element). The main element does nothing on mouse down.
makeDraggable(document.querySelector('#myWindow'));
makeDraggable(document.querySelector('#myWindow2'));
makeDraggable(document.querySelector('#myWindow3'));
makeDraggable(document.querySelector('#myWindow4'));
makeDraggable(document.querySelector('#musicPlayerWindow'));
makeDraggable(document.querySelector('#videoPlayerWindow'));
makeDraggable(document.querySelector('#videoPlayerWindow2'));
makeDraggable(document.querySelector('#sketchfabWindow'));
makeDraggable(document.querySelector('#visualizerWindow'));
makeDraggable(document.querySelector('#pictochatWindow'));

//Close the window on click of an x button
document.addEventListener('click', e => {
    if (e.target.closest('.close-btn')) {
        const windowElement = e.target.closest('.window, .window2, .window3, .window4, .musicPlayerWindow, .videoPlayerWindow, .videoPlayerWindow2, .sketchfabWindow, .visualizerWindow');
        if (windowElement) {
            windowElement.remove();
        }
    }
});

// Maximize the window on click of the maximize button
document.addEventListener('click', e => {
    if (e.target.closest('.maximize-btn')) {
        const windowElement = e.target.closest('.window, .window2, .window3, .window4, .musicPlayerWindow, .videoPlayerWindow, .videoPlayerWindow2, .sketchfabWindow');
        const extraContent = windowElement.querySelector('.extra-content');
        
        if (!windowElement.dataset.originalWidth) {
            // Store original dimensions and position
            windowElement.dataset.originalWidth = windowElement.style.width;
            windowElement.dataset.originalHeight = windowElement.style.height;
            windowElement.dataset.originalTop = windowElement.style.top;
            windowElement.dataset.originalLeft = windowElement.style.left;
        }

        if (windowElement.classList.contains('maximized')) {
            // Restore original dimensions and position
            windowElement.classList.remove('maximized');
            windowElement.style.width = windowElement.dataset.originalWidth;
            windowElement.style.height = windowElement.dataset.originalHeight;
            windowElement.style.top = windowElement.dataset.originalTop;
            windowElement.style.left = windowElement.dataset.originalLeft;
            if (extraContent) extraContent.style.display = 'none';
        } else {
            // Maximize window
            windowElement.classList.add('maximized');
            windowElement.style.width = '50%';
            windowElement.style.height = '70%';
            windowElement.style.top = '0';
            windowElement.style.left = '0';
            if (extraContent) extraContent.style.display = 'block';
        }
    }
});

// Minimize the window on click of the minimize button
document.addEventListener('click', e => {
    if (e.target.closest('.minimize-btn')) {
        const windowElement = e.target.closest('.window, .window2, .window3, .window4, .musicPlayerWindow, .videoPlayerWindow, .videoPlayerWindow2, .sketchfabWindow, .drawingWindow, .visualizerWindow');
        
        if (windowElement.classList.contains('minimized')) {
            // Restore original dimensions and position
            windowElement.classList.remove('minimized');
            windowElement.style.width = windowElement.dataset.originalWidth;
            windowElement.style.height = windowElement.dataset.originalHeight;
            windowElement.style.top = windowElement.dataset.originalTop;
            windowElement.style.left = windowElement.dataset.originalLeft;

            // Remove from minimized windows array
            minimizedWindows = minimizedWindows.filter(win => win !== windowElement);
        } else {
            // Minimize window
            if (!windowElement.dataset.originalWidth) {
                // Store original dimensions and position
                windowElement.dataset.originalWidth = windowElement.style.width;
                windowElement.dataset.originalHeight = windowElement.style.height;
                windowElement.dataset.originalTop = windowElement.style.top;
                windowElement.dataset.originalLeft = windowElement.style.left;
            }
            windowElement.classList.add('minimized');
            windowElement.style.width = '200px';
            windowElement.style.height = '40px';
            windowElement.style.top = 'calc(100% - 40px)';
            windowElement.style.left = `${minimizedWindows.length * 210}px`;

            // Add to minimized windows array
            minimizedWindows.push(windowElement);
        }
    }
});



// Resize the window on dragging the resize handle
document.addEventListener('mousedown', e => {
    if (e.target.classList.contains('resize-handle')) {
        const windowElement = e.target.closest('.window, .window2, .window3, .window4, .musicPlayerWindow, .videoPlayerWindow, .videoPlayerWindow2, .sketchfabWindow, .drawingWindow');
        const startX = e.clientX;
        const startY = e.clientY;
        const startWidth = parseInt(document.defaultView.getComputedStyle(windowElement).width, 10);
        const startHeight = parseInt(document.defaultView.getComputedStyle(windowElement).height, 10);

        function doDrag(e) {
            windowElement.style.width = (startWidth + e.clientX - startX) + 'px';
            windowElement.style.height = (startHeight + e.clientY - startY) + 'px';
        }

        function stopDrag() {
            document.documentElement.removeEventListener('mousemove', doDrag, false);
            document.documentElement.removeEventListener('mouseup', stopDrag, false);
        }

        document.documentElement.addEventListener('mousemove', doDrag, false);
        document.documentElement.addEventListener('mouseup', stopDrag, false);
    }
});







document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('drawingCanvas');
    const ctx = canvas.getContext('2d');
    let drawing = false;

    canvas.addEventListener('mousedown', (e) => {
        drawing = true;
        ctx.beginPath();
        ctx.moveTo(e.offsetX, e.offsetY);
    });

    canvas.addEventListener('mousemove', (e) => {
        if (drawing) {
            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.stroke();
        }
    });

    canvas.addEventListener('mouseup', () => {
        drawing = false;
    });

    canvas.addEventListener('mouseout', () => {
        drawing = false;
    });

    // Add event listeners for the drawing window
    const drawingWindow = document.getElementById('drawingWindow');
    const minimizeBtn = drawingWindow.querySelector('.minimize-btn');
    const closeBtn = drawingWindow.querySelector('.close-btn');

    minimizeBtn.addEventListener('click', () => {
        drawingWindow.classList.add('minimized');
        drawingWindow.style.width = '200px';
        drawingWindow.style.height = '40px';
        drawingWindow.style.top = 'calc(100% - 40px)';
        drawingWindow.style.left = `${minimizedWindows.length * 210}px`;
        minimizedWindows.push(drawingWindow);
    });

    closeBtn.addEventListener('click', () => {
        drawingWindow.style.display = 'none';
    });

    // Make the drawing window draggable
    makeDraggable(drawingWindow);
});




document.addEventListener('DOMContentLoaded', () => {
    // Initialize Webamp
    const webamp = new Webamp({
        initialTracks: [
            {
                metaData: {
                    artist: "Centrelink",
                    title: "Waiting on the line"
                },
                url: "video/centrelink.mp3",
                duration: 123 // Duration in seconds
            }
        ],
        initialSkin: {
             url: "/winamp/MIcrosoft_Windows_98_Amp.wsz" 
           /*  url: "/winamp/kirby_by_ningyotsukai-d60kue9.zip" */
        },
        
    });

   // Render Webamp
   webamp.renderWhenReady(document.getElementById('webamp-container'));

   // Initialize the visualizer
   const audioContext = new (window.AudioContext || window.webkitAudioContext)();
   const canvas = document.getElementById('visualizerCanvas');
   const ctx = canvas.getContext('2d');
   const analyser = audioContext.createAnalyser();
   analyser.fftSize = 256;
   const bufferLength = analyser.frequencyBinCount;
   const dataArray = new Uint8Array(bufferLength);

   // Capture all audio from the page
   const audioElements = document.querySelectorAll('audio, video');
   audioElements.forEach(audioElement => {
       const source = audioContext.createMediaElementSource(audioElement);
       source.connect(analyser);
       analyser.connect(audioContext.destination);
   });

   /* 
   
   // Connect Webamp audio to the visualizer
    webamp.onReady(() => {
    const audioNode = webamp.getMediaElementSource();
        audioNode.connect(analyser);
        analyser.connect(audioContext.destination);
    });

    */

   // Resize visualizer when window is resized
   window.addEventListener('resize', () => {
       canvas.width = canvas.clientWidth;
       canvas.height = canvas.clientHeight;
   });

    // Render a frame
    function renderFrame() {
        requestAnimationFrame(renderFrame);

        analyser.getByteFrequencyData(dataArray);

        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const barWidth = (canvas.width / bufferLength) * 2.5;
        let barHeight;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i];

            ctx.fillStyle = 'rgb(' + (barHeight + 100) + ',200,0)';
            ctx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2);

            x += barWidth + 1;
        }
    }

    renderFrame();



// Drawing functionality
const drawingCanvas = document.getElementById('drawingCanvas');
const drawingCtx = drawingCanvas.getContext('2d');
const backgroundCanvas = document.getElementById('backgroundCanvas');
const backgroundCtx = backgroundCanvas.getContext('2d');
let drawing = false;

function startDrawing(e) {
    drawing = true;
    draw(e);
}

function endDrawing() {
    drawing = false;
    drawingCtx.beginPath();
    updateBackground();
}

function draw(e) {
    if (!drawing) return;

    const rect = drawingCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    drawingCtx.lineWidth = 1;
    drawingCtx.lineCap = 'round';
    drawingCtx.strokeStyle = '#000';

    drawingCtx.lineTo(x, y);
    drawingCtx.stroke();
    drawingCtx.beginPath();
    drawingCtx.moveTo(x, y);
}

function updateBackground() {
    backgroundCtx.drawImage(drawingCanvas, 0, 0, backgroundCanvas.width, backgroundCanvas.height);
}

drawingCanvas.addEventListener('mousedown', startDrawing);
drawingCanvas.addEventListener('mouseup', endDrawing);
drawingCanvas.addEventListener('mousemove', draw);

// Resize background canvas to full screen
function resizeBackgroundCanvas() {
    backgroundCanvas.width = window.innerWidth;
    backgroundCanvas.height = window.innerHeight;
    updateBackground(); // Ensure the background is updated when the canvas is resized
}

window.addEventListener('resize', resizeBackgroundCanvas);
resizeBackgroundCanvas();

});

document.addEventListener('DOMContentLoaded', () => {
    const pictochatInput = document.getElementById('pictochatInput');
    const sendButton = document.getElementById('sendButton');
    const consoleOutput = document.getElementById('consoleOutput');

    function sendMessage() {
        const message = pictochatInput.value.trim();
        if (message) {
            const messageElement = document.createElement('div');
            messageElement.classList.add('message-line');
            messageElement.textContent = message;
            consoleOutput.appendChild(messageElement);
            consoleOutput.scrollTop = consoleOutput.scrollHeight; // Scroll to the bottom
            pictochatInput.value = ''; // Clear the input
        }
    }

    sendButton.addEventListener('click', sendMessage);
    pictochatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});

