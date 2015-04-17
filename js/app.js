/**
 * Created by Vincent on 06/04/2015.
 */

(function () {
    'use strict';
    //variables des touches
    var KEYCODE_SPACE = 32, KEYCODE_LEFT = 37, KEYCODE_RIGHT = 39, NB_ELT_TO_LOAD = 15,
        canvas,
        stage,
    //variables des chemins des images
        imgHero, imgBg, imgPrincess,
    //variables des objets
        hero, gameTxt, princess,
    //variables de direction
        left, right,
    //deplacement en y
        vy = 0,
    //deplacement en x
        vx = 0,
    //gravité
        gravity = 2,
    //variable pour le saut
        jumping = false,
    //variable indiquant si le héros est dans les air(true)
        inAir = false,
    //variable permettant d'animer le héros
        animPersonnage = false,
        speaking = false,
    //variable permettant de charger les éléments sur la scène
        loaded = 0,
    //variable pour rejouer
        play = true,

        // Coins
        coins_array,
        coinPath,
        coin,
        coinsPositions = [
            {
                x : 50,
                y : 50
            },
            {
                x : 150,
                y : 150
            },
            {
                x : 250,
                y : 250
            }
        ],
    //Positions des plateformes
        platforms,
        platforms_datas = [
            {
                width : 188,
                x : 0,
                y : 560
            },
            {
                width : 82,
                x : 188,
                y : 468
            },
            {
                width : 82,
                x : 378,
                y : 440
            },
            {
                width : 82,
                x : 462,
                y : 500
            },
            {
                width : 260,
                x : 640,
                y : 380
            },
            {
                width : 260,
                x : 260,
                y : 248
            },
            {
                width : 260,
                x : 0,
                y : 176
            },
            {
                width : 220,
                x : 460,
                y : 79
            },
            {
                width : 260,
                x : 680,
                y : 100
            }
        ],
    /* AUDIO */
        sound_AmbiancePath,
        voices_array,
        sound_SpeakPath1,
        sound_SpeakPath2,
        sound_SpeakPath3,
        sound_SpeakPath4,
        sound_SpeakPath5,
        sound_horrorPath1,
        sound_coin_path,
        sound_ambiance,
        sound_voice1,
        sound_voice2,
        sound_voice3,
        sound_voice4,
        sound_voice5,
        sound_cry_path_1,
        sound_cry_path_2,
        sound_cry_1,
        sound_cry_2,
        sound_horror1,
        sound_help_path,
        sound_help,
        sound_walking_path,
        sound_walking,
        sound_coin,
        trigger,
        triggers,
        sounds_triggers;




    /**
     * Gestion du clavier
     * @param e
     */
    function handleKeyDown(e) {
        if (!e) {
            e = window.event;
        }
        switch (e.keyCode) {
        case KEYCODE_LEFT:
            left = true;
            break;
        case KEYCODE_RIGHT:
            right = true;
            break;
        case KEYCODE_SPACE:
            jump();
            break;
        }
    }

    /**
     * Gestion du clavier
     * @param e
     */
    function handleKeyUp(e) {
        if (!e) { e = window.event; }
        switch (e.keyCode) {
        case KEYCODE_LEFT:
            left = false;
            break;
        case KEYCODE_RIGHT:
            right = false;
            break;
        case 83:
            speak();
            hero.gotoAndPlay('looking');
            break;
        }

        animPersonnage = false;
        if (jumping === false) {
            hero.gotoAndStop("idle");
        }
        vx = 0;
    }

    /**
     * end of game
     */
    function end() {
        play = false;

        hero.visible = false;
        stage.update();
    }

    /**
     * replay function
     */
    function rejouer() {
        canvas.onclick = null;
        hero.visible = true;
        hero.x = 80;
        hero.y = 400;
        stage.removeChild(gameTxt);
        play = true;
        jumping = false;
        inAir = false;
        animPersonnage = false;
        vy = 0;
        vx = 0;
        hero.gotoAndStop("idle");
        stage.update();
    }

    /**
     * game over
     */
    function gameOver() {
        gameTxt = new createjs.Text("Game Over\n\n", "36px Arial", "#000");
        gameTxt.text += "Click to play again.";
        gameTxt.textAlign = "center";
        gameTxt.x = canvas.width / 2;
        gameTxt.y = canvas.height / 4;
        stage.addChild(gameTxt);
        end();
        canvas.onclick = rejouer;
    }

    /**
     * Collision avec le joueur
     * @param xPos
     * @param yPos
     * @param Radius
     * @returns {boolean}
     */
    /*function collisionHero(xPos, yPos, Radius) {
     var distX = xPos - hero.x,
     distY = yPos - heroCenter,
     distR = Radius + 20;
     if (distX * distX + distY * distY <= distR * distR) {
     return true;
     }
     }*/

    /**
     * Jump function
     */
    function jump() {
        if (jumping === false && inAir === false) {
            hero.gotoAndStop("jump");
            hero.y -= 20;
            vy = -29;
            jumping = true;
            animPersonnage = false;
        }
    }

    /**
     * Movements function
     */
    function deplacement() {
        if (play) {
            vy += gravity; //apply gravity to downward motion
            if (inAir) {//if not touching platform apply gravity to hero
                hero.y += vy;
            }
            if (vy > 15) {//limit falling speed
                vy = 15;
            }
            //move left and right
            if (left) {
                vx = -5;
            }
            if (right) {
                vx = 5;
            }
            if (left && animPersonnage === false && inAir === false && jumping === false) {
                console.log("ff");
                hero.gotoAndPlay("walk");
                hero.scaleX = -1;
                animPersonnage = true;
            }
            if (right && animPersonnage === false  &&  inAir === false && jumping === false) {
                hero.gotoAndPlay("walk");
                hero.scaleX = 1;

                animPersonnage = true;
            }

            if (speaking) {
                hero.gotoAndPlay('looking');
            }

            hero.x += vx;

            if (animPersonnage) {
                sound_walking.play();
            } else {
                sound_walking.pause();
            }
        }

    }

    function loadPrincess() {
        if (!stage.contains(princess)) {
            princess = new Hero(imgPrincess);
            princess.x = 800;
            princess.y = 380;
            stage.addChild(princess);

            setTimeout(function () {
                console.log('have to fade out princess');
                createjs.Tween.get(princess).to({alpha: 0}, 1000);
            }, 3000);
        }
    }

    /**
     * allCollisions
     */
    function allCollisions() {
        var i, j;
        inAir = true;

        /**
         * Collision w/ platforms
         */
        for (i = 0; i < platforms.length; i += 1) {
            //while( i < platforms.length && inAir==true){ //la boucle while est plus efficace mais pas obligatoire pour vous
            if (hero.y >= platforms[i].y && hero.y <= (platforms[i].y + platforms[i].height) && hero.x > platforms[i].x && hero.x < (platforms[i].x + platforms[i].width)) {
                hero.y = platforms[i].y; // remise en positin du héro sur la plateforme
                vy = 0; // remise à zéro de la gravité

                if (jumping === true) {
                    jumping = false;
                    hero.gotoAndStop("idle");
                }
                if (inAir === false) {
                    hero.gotoAndStop("idle");
                }
                inAir = false;

            }/*else{
             inAir = true;
             }*/

            //i++; //pour la boucle while
        }

        /**
         * Collision w/ platforms
         */
        var that;
        for (j = 0; j < triggers.length; j += 1) {

            //while( i < platforms.length && inAir==true){ //la boucle while est plus efficace mais pas obligatoire pour vous
            if (hero.y >= triggers[j].y && hero.y <= (triggers[j].y + triggers[j].height) && hero.x > triggers[j].x && hero.x < (triggers[j].x + triggers[j].width)) {
                that = triggers[j];
                if (that.disabled === false) {
                    that.sound.play();
                    that.disabled = true;
                }

                if (that.special === 'loadPrincess') {
                    loadPrincess();
                }
            }
        }

        //le héros est il en bas du canvas
        if (hero.y > 610) {
            gameOver();
        }
    }

    function tick() {
        //heroCenter = hero.y - 40;
        if (play) {
            deplacement();
            allCollisions();
        }
        stage.update();
    }

    /**
     *
     * @returns Audio
     */
    function speakRandom() {
        var min = 0,
            max = voices_array.length,
            random = Math.floor(Math.random() * max) + min;

        return voices_array[random];
    }

    function speak() {
        var sentence = speakRandom();

        speaking = true;
        sentence.play();

        sentence.onended = function () {
            hero.gotoAndStop('idle');
            speaking = false;
        };
    }

    function jouer() {

        console.log('function jouer');

        //creation de la scene
        var bg = new createjs.Bitmap(imgBg), i, platform;
        stage.addChild(bg);

        //insertion du heros
        hero = new Hero(imgHero);
        hero.x = 30;
        hero.y = 550;
        stage.addChild(hero);

        sounds_triggers = [
            {
                height : 150,
                x : 200,
                y : 320,
                sound : sound_cry_1,
                special : null
            },
            {
                height : 150,
                x : 400,
                y : 290,
                sound : sound_cry_2,
                special : null
            },
            {
                height : 150,
                x : 650,
                y : 230,
                sound : sound_help,
                special : 'loadPrincess'
            }
        ];

        //creation des plateformes
        platforms = [];
        for (i = 0; i < platforms_datas.length; i += 1) {
            platform = new Platform(platforms_datas[i].width, 20);
            platforms.push(platform);
            stage.addChild(platform);
            platform.x = platforms_datas[i].x;
            platform.y = platforms_datas[i].y;
        }

        triggers = [];
        for (i = 0; i < sounds_triggers.length; i += 1) {
            trigger = new SoundTrigger(sounds_triggers[i].height, sounds_triggers[i].sound);
            triggers.push(trigger);
            stage.addChild(trigger);
            trigger.x = sounds_triggers[i].x;
            trigger.y = sounds_triggers[i].y;
            trigger.special = sounds_triggers[i].special;
        }

        coins_array = [];
        for (i = 0; i < coinsPositions.length; i += 1) {
            coin = new Coin(coinPath);
            coins_array.push(coin);
            stage.addChild(coin);
            coin.x = coinsPositions[i].x;
            coin.y = coinsPositions[i].y;

            coin.sound = sound_coin;

            coin.gotoAndPlay('rotate');
        }

        console.log(triggers);



        //register key functions
        document.onkeydown = handleKeyDown;
        document.onkeyup = handleKeyUp;

        //Ticker.setFPS(30);
        createjs.Ticker.addEventListener("tick", tick);
        createjs.Ticker.setFPS(28);
        stage.update();

        setTimeout(function () {
            speak();
        }, 750);
    }

    function chargement() {
        loaded += 1;
        console.log('loading');
        if (loaded === NB_ELT_TO_LOAD) {
            console.log('loaded');
            jouer();
            sound_ambiance.play();
        }
    }

    /**
     * return an Audio Object
     * @param sound
     * @param volume
     * @param preloader
     * @param repeat
     * @param type_voice
     * @returns {Audio}
     */
    function loadAudio(sound, volume, preloader, repeat, type_voice) {
        var audio = new Audio(sound);
        audio.volume = volume;
        if (repeat) {
            audio.repeat = true;
        }
        if (type_voice) {
            voices_array.push(audio);
        }
        preloader.loadFile(sound);
        return audio;
    }


    function init() {
        canvas = document.getElementById("canvas");
        stage = new createjs.Stage(canvas);

        voices_array = [];

        var preload = new createjs.LoadQueue();
        preload.addEventListener('fileload', chargement);

        imgBg = new Image();
        imgBg.src = "img/scene.jpg";
        preload.loadFile(imgBg.src);

        imgHero = new Image();
        imgHero.src = "img/player2.png";
        preload.loadFile(imgHero.src);

        imgPrincess = new Image();
        imgPrincess.src = "img/princess.png";
        preload.loadFile(imgPrincess.src);

        coinPath = new Image();
        coinPath.src = "img/coin.png";
        preload.loadFile(coinPath.src);

        // sounds
        sound_AmbiancePath = "audio/ambiance.mp3";
        sound_coin_path = "audio/get-coin.mp3";

        sound_SpeakPath1 = "audio/voices/vacation.mp3";
        sound_SpeakPath2 = "audio/voices/du_letsrock.mp3";
        sound_SpeakPath3 = "audio/voices/iamtheking.mp3";
        sound_SpeakPath4 = "audio/voices/timeto.mp3";
        sound_SpeakPath5 = "audio/voices/ballsofsteel.mp3";
        sound_walking_path = "audio/step.mp3";

        sound_cry_path_1 = "audio/cry-1.mp3";
        sound_cry_path_2 = "audio/cry-2.mp3";
        sound_help_path = "audio/help-me.mp3";

        sound_ambiance = loadAudio(sound_AmbiancePath, 0.5, preload, true, false);
        sound_coin = loadAudio(sound_coin_path, 0.2, preload, false, false);

        sound_voice1 = loadAudio(sound_SpeakPath1, 0.2, preload, false, true);
        sound_voice2 = loadAudio(sound_SpeakPath2, 0.2, preload, false, true);
        sound_voice3 = loadAudio(sound_SpeakPath3, 0.2, preload, false, true);
        sound_voice4 = loadAudio(sound_SpeakPath4, 0.2, preload, false, true);
        sound_voice5 = loadAudio(sound_SpeakPath5, 0.2, preload, false, true);
        sound_walking = loadAudio(sound_walking_path, 0.2, preload, true, false);

        sound_cry_1 = loadAudio(sound_cry_path_1, 0.5, preload, false, false);
        sound_cry_2 = loadAudio(sound_cry_path_2, 0.5, preload, false, false);
        sound_help = loadAudio(sound_help_path, 0.5, preload, false, false);
    }

    window.onload = init;
}());
