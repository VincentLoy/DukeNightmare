/**
 * Created by Vincent on 06/04/2015.
 */

(function () {
    'use strict';
    //variables des touches
    var KEYCODE_SPACE = 32, KEYCODE_LEFT = 37, KEYCODE_RIGHT = 39, NB_ELT_TO_LOAD = 3,
        canvas,
        stage,
    //variables des chemins des images
        imgHero, imgBg, imgKey, imgDoor, imgCrate,
    //variables des objets
        hero, key, door, gameTxt, unePlateform,
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
    //variable permettant de charger les éléments sur la scène
        loaded = 0,
    //variable pour connaître le centre du hero
        heroCenter,
    //variable pour rejouer
        play = true,
    //Positions des plateformes
        platformW = [188, 82, 82, 82],
        platformX = [0, 188, 378, 462],
        platformY = [560, 468, 440, 500],
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
        trigger,
        triggers,
        sounds_triggers = [
            {
                height : 150,
                volume : 0.3,
                x : 200,
                y : 320
            }
        ],
        /* AUDIO */
        sound_AmbiancePath,
        sound_SpeakPath1,
        sound_horrorPath1,
        sound_ambiance,
        sound_voice1,
        sound_horror1;




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
        door.visible = true;
        key.visible = true;
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

            hero.x += vx;

            //vx=vx*0.5;
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
        for (j = 0; j < triggers.length; j += 1) {

            //while( i < platforms.length && inAir==true){ //la boucle while est plus efficace mais pas obligatoire pour vous
            if (hero.y >= triggers[j].y && hero.y <= (triggers[j].y + triggers[j].height) && hero.x > triggers[j].x && hero.x < (triggers[j].x + triggers[j].width)) {
                var that = triggers[j];
                console.log("sound collision");
                if (that.disabled === false) {
                    console.log("soundsdzdzdzdzsss");
                    that.sound.play();
                    that.disabled = true;
                }
            }
        }

        //le héros est il en bas du canvas
        if (hero.y > 610) {
            gameOver();
        }
    }

    function tick() {
        heroCenter = hero.y - 40;
        if (play) {
            deplacement();
            allCollisions();
        }
        stage.update();
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

        //une plateforme
        /* unePlateform = new Platform(300,20);

         stage.addChild(unePlateform);
         unePlateform.x = 40;
         unePlateform.y = 460;
         */



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
            trigger = new SoundTrigger(sounds_triggers[i].height, sound_horror1, sounds_triggers[i].volume);
            triggers.push(trigger);
            stage.addChild(trigger);
            trigger.x = sounds_triggers[i].x;
            trigger.y = sounds_triggers[i].y;
        }



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

    function speak() {
        hero.gotoAndStop('looking');
        sound_voice1.play();

        sound_voice1.onended = function () {
            hero.gotoAndStop('idle');
        };
    }

    function loadAudio(sound, volume, preloader) {
        var audio = new Audio(sound);
        audio.volume = volume;
        preloader.loadFile(sound);
        return audio;
    }


    function init() {
        canvas = document.getElementById("canvas");
        stage = new createjs.Stage(canvas);

        var preload = new createjs.LoadQueue();
        preload.addEventListener('fileload', chargement);

        imgBg = new Image();
        imgBg.src = "img/scene.jpg";
        preload.loadFile(imgBg.src);

        imgHero = new Image();
        imgHero.src = "img/player2.png";
        preload.loadFile(imgHero.src);

        // sounds
        sound_AmbiancePath = "audio/ambiance.mp3";
        sound_SpeakPath1 = "audio/voices/vacation.mp3";
        sound_horrorPath1 = "audio/horror-cry.mp3";

        sound_ambiance = loadAudio(sound_AmbiancePath, 0.5, preload);
        sound_voice1 = loadAudio(sound_SpeakPath1, 0.5, preload);
        sound_horror1 = loadAudio(sound_horrorPath1, 0.5, preload);

    }

    window.onload = init;
}());
