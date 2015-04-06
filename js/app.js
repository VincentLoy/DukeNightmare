/**
 * Created by Vincent on 06/04/2015.
 */

(function () {
    'use strict';
    //variables des touches
    var KEYCODE_SPACE = 32, KEYCODE_LEFT = 37, KEYCODE_RIGHT = 39, NB_ELT_TO_LOAD = 2,
        canvas,
        stage,
    //variables des chemins des images
        imgHero, imgBg, imgKey, imgDoor, imgCrate,
    //variables des objets
        hero, key, door, gameTxt, unePlateform,
    //variables contenant des tableaux
        crates, platforms,
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
        platformY = [560, 468, 440, 500];

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

    function end() {
        play = false;

        hero.visible = false;
        stage.update();
    }
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
    function jump() {
        if (jumping === false && inAir === false) {
            hero.gotoAndStop("jump");
            hero.y -= 20;
            vy = -25;
            jumping = true;
            animPersonnage = false;
        }
    }

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

    function allCollisions() {
        var i;
        inAir = true;

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
        for (i = 0; i < platformW.length; i += 1) {
            platform = new Platform(platformW[i], 20);
            platforms.push(platform);
            stage.addChild(platform);
            platform.x = platformX[i];
            platform.y = platformY[i];
        }


        //register key functions
        document.onkeydown = handleKeyDown;
        document.onkeyup = handleKeyUp;

        //Ticker.setFPS(30);
        createjs.Ticker.addEventListener("tick", tick);
        stage.update();
    }

    function chargement() {
        loaded += 1;
        console.log('loading');
        if (loaded === NB_ELT_TO_LOAD) {
            console.log('loaded');
            jouer();
        }
    }


    function init() {

        canvas = document.getElementById("canvas");
        stage = new createjs.Stage(canvas);

        imgBg = new Image();
        imgBg.onload = chargement;
        imgBg.src = "img/scene.jpg";

        imgHero = new Image();
        imgHero.onload = chargement;
        imgHero.src = "img/player.png";

    }

    window.onload = init;
}());
