
var buttonGroup = document.getElementById('buttons');
var figureGroup = document.getElementById('figures');
var $buttonGroup = $('#buttons');
var $figureGroup = $('#figures');
var elButton = document.getElementById('buttons');

function moveKeys() {
    $figureGroup.children().css('background-color', 'black');
    figureGroup.style.position = 'relative';
    $('#figures').animate({
        top: '400px'
    }, 700);

    buttonGroup.style.position = 'relative';
    $('#buttons').animate({
        top: '400px'
    }, 600);
}

function removeElement(identifier) {
    identifier.parentNode.removeChild(identifier);
}

function colorRandomizer(object) {
    var hexNumb = Math.floor(Math.random() * 16777215).toString(16);
    var color = "#" + hexNumb;
    object.style.backgroundColor = color;
}

function $colorRandomizer($object) {
    var hexNumb = Math.floor(Math.random() * 16777215).toString(16);
    var color = "#" + hexNumb;
    $object.css('background-color', color);

}


function randomMode() {

    $('#sect1').replaceWith($('<div><label>SELECT NUMBER OF TILES</label><input type="range" id="scalerbar" min="1" max="6" step="1" /></div>')
        .css({
            'display': 'flex', 'flex-direction': 'column', 'font-size': '2em',
            'color': 'black', 'font-family': 'monospace', 'font-weight': 'bold',
            'margin' : '60px'
        })
    );
    $('#sect2').replaceWith($('<button id="randomForm">SCRAMBLE</button>').css({
        'width': '40%', 'height': '15%', 'color': 'black',
        'font-family': 'monospace', 'font-weight': 'bold'
    })
    );
    $('form').append($('<button id=startGame>START GAME</button>').css({
        'width': '40%', 'height': '15%', 'color': 'black',
        'font-family': 'monospace', 'font-weight': 'bold',
        'margin' : '10%'
    })
    );


    $('form').css({
        'display': 'flex', 'flex-direction': 'column', 'align-items': 'center'
    });


    $('#scalerbar').on('input change', function () {
        for (var i = $('#scalerbar').val(); i < 6; i++) {
            $figureGroup.children().eq(i).hide();
            $buttonGroup.children().eq(i).hide();
        }
        for (var i = 0; i < $('#scalerbar').val(); i++) {
             $figureGroup.children().eq(i).show();
             $buttonGroup.children().eq(i).show();
        }

    })
    $('#randomForm').on('click', function (e) {
        var possibleChars = "abcdefghijklmnopqrstuvwxyz";
        var numberOfChars = 26;
        e.preventDefault();
        $buttonGroup.children().each(function (){
            randomChar = possibleChars.charAt(Math.floor(Math.random() * numberOfChars));
            numberOfChars--;
            possibleChars=possibleChars.replace(randomChar, "");
            $(this).text(randomChar);
        })

    })
    $('form').append($('<h1 id="scrambleNotice">SCRAMBLE FIRST</h1>').css({
        'font-size': '2em',
        'color': 'black', 'font-family': 'monospace', 'font-weight': 'bold'
    })
    );
    $('#scrambleNotice').hide();
    $('#startGame').on('click', function (e) {
        e.preventDefault();
        if (!/[a-z]/.test($buttonGroup.children().eq(0).text())) {
            $('#scrambleNotice').show();
        } else {
            counter = $('#scalerbar').val();
            $('form').remove();
            moveKeys();
            setTimeout(gameMode, 2000);
        }
    })
    
}





function manualMode() {

    removeElement(document.getElementById('sect1'));
    removeElement(document.getElementById('sect2'));


    var limitNotice = document.createElement('h1');
    limitNotice.textContent = 'Choose up to 6 different keys';
    limitNotice.setAttribute('id', 'limitNotice');
    document.getElementsByTagName('body')[0].appendChild(limitNotice);

    counter = 0
    chosenKeys =''
    keyFaciliator();
    function keyFaciliator() {
        document.addEventListener('keypress', displayKeys, false);
        function displayKeys(e) {
          /*  if (chosenKeys.includes(String.fromCharCode(e.keyCode))){
                limitNotice.textContent = 'Choose up to 6 DIFFERENT keys';
            }*/
            if (counter < 6 && e.code !== 'Enter') {
          //      chosenKeys = chosenKeys + String.fromCharCode(e.keyCode);
                colorRandomizer(figureGroup.children[counter]);
                var keyEl = document.createElement('h1');
                var key = String.fromCharCode(e.keyCode);
                var keyText = document.createTextNode(key);
                keyEl = keyEl.appendChild(keyText);
                buttonGroup.children[counter].appendChild(keyEl);
                counter++
            } else if (e.code == 'Enter' && counter == 0) {
                limitNotice.textContent = 'Select at least 1 key';
            } else if (e.code == 'Enter') {
                try {
                    while (counter < 6) {
                        removeElement(buttonGroup.children[counter]);
                        removeElement(figureGroup.children[counter]);
                    }
                } catch (ignore) { }
                moveKeys();
                removeElement(limitNotice);
                document.removeEventListener('keypress', displayKeys, false);
                setTimeout(gameMode, 2000);
            } else {
                document.removeEventListener('keypress', displayKeys, false);
                removeElement(limitNotice);
                moveKeys();
                setTimeout(gameMode, 2000);
            }
        }
    }
}

function gameMode() {
    clearTimeout(2000);
    decrementor = 1500;
    scoreNumber = 0;
    $scoreBoard = $('<h1>Score:<em>0</em></h1>').css({
        'position': 'absolute', 'left': '120px', 'width': '20px',
        'color': 'white', 'weight': 'bold', 'size': '3em',
        'font-family': 'monospace'
    });
    $('body').prepend($scoreBoard);
    $fallingBlock = $('<section id="fallingBlock">');
    $fallingBlock.css({ 'position': 'absolute', 'bottom': '+=1000px', 'display': 'flex', 'flex-direction': 'row' });
    $('body').prepend($fallingBlock);
    for (var i = 0; i < counter; i++) {
        var className = figureGroup.children[i].getAttribute('class');
        var $fallingDivs = $('<div>').addClass(className + 0);
        $colorRandomizer($fallingDivs);
        $fallingBlock.append($fallingDivs);
    }
    gameLogic();
    blockGravity();
}
function blockGravity() {
    var animationDuration = Math.floor(Math.random() * (500) + decrementor);
    if (decrementor > 1020) {
        decrementor -= 30;
    }
    var j = Math.floor(Math.random() * counter);
    $fallingSegment = $fallingBlock.children().eq(j);
    $fallingSegment.css('position', 'relative');
    $fallingSegment.animate({ top: '+=1000px' }, {
        duration: animationDuration,
        easing: 'linear',
        progress: function () {
            if ($fallingSegment.offset().top > $figureGroup.offset().top - 50
                && $fallingSegment.offset().top < $figureGroup.offset().top + 50
                && $figureGroup.children().eq(j).css('background-color') == 'rgb(255, 255, 255)') {
                $fallingSegment.stop();
                var $replaceFallingDivs = $('<div>').addClass($(this).attr('class'));
                $colorRandomizer($replaceFallingDivs);
                $(this).replaceWith($replaceFallingDivs);

                scoreNumber += 10;
                $scoreBoard.text('Score: ' + scoreNumber + '');
                blockGravity();
            }
            else if ($fallingSegment.offset().top - 100 > $figureGroup.offset().top) {
                $fallingSegment.stop();
                $('body').append($('<h1>GAME OVER!</h1>').css({ 'color': 'white', 'font-size': '4em', 'font-family': 'monospace' }))
            }
            else if (scoreNumber!=0 && scoreNumber%250==0) {
                $fallingSegment.stop();
                $('body').append($('<h1>YOU WIN!</h1>').css({ 'color': 'white', 'font-size': '4em', 'font-family': 'monospace' }))
            }
        },
        complete: function () {
                var $replaceFallingDivs = $('<div>').addClass($(this).attr('class'));
                $colorRandomizer($replaceFallingDivs);
                console.log($fallingSegment.offset().top);
                $(this).replaceWith($replaceFallingDivs);
                blockGravity();
        }
    })

  }
function gameLogic() {
    function buttonPress(e) {
        for (var i = 0; i < counter; i++) {
            if (String.fromCharCode(e.which) == $.trim($buttonGroup.children().eq(i).text())) {
                $figureGroup.children().eq(i).css('background-color', 'white');
                setTimeout(revertColor, 100);
                function revertColor() {
                    clearTimeout(100);
                    $figureGroup.children().eq(i).css('background-color', 'black');
                }
                break;
            }
        }
    }
    $(document).one('keypress', buttonPress).on('keyup', function (e) {
        $(document).one('keypress', buttonPress)
    });
}







var identifier;
var optChoose = document.getElementById('choose');
var optRandom = document.getElementById('random');

optChoose.addEventListener('click', manualMode, false);

optRandom.addEventListener('click', randomMode, false);