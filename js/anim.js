(function () {
    'use strict';

    //variables des touches
    var KEYCODE_SPACE = 32, KEYCODE_UP = 38, KEYCODE_LEFT = 37, KEYCODE_RIGHT = 39,
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
        platformW = [300, 100, 180, 260, 260, 100, 100],
        platformX = [40, 220, 320, 580, 700, 760, 760],
        platformY = [460, 380, 300, 250, 550, 350, 450];


    function init() {

        canvas = document.getElementById("canvas");
        stage = new createjs.Stage(canvas);

        imgBg = new Image();
        imgBg.onload = this.chargement; //start preloading big images
        imgBg.src = "img/scene.jpg";

        imgKey = new Image();
        imgKey.onload = this.chargement;
        imgKey.src = "img/key.png";

        imgDoor = new Image();
        imgDoor.onload = this.chargement;
        imgDoor.src = "img/door.jpg";

        imgHero = new Image();
        imgHero.onload = this.chargement;
        imgHero.src = "img/hero.png";

        imgCrate = new Image();
        imgCrate.onload = this.chargement;
        imgCrate.src = "img/crate.jpg";

    }

    function end() {
        play = false;
        var l = crates.length, i, c;
        for (i = 0; i < l; i += 1) {
            c = crates[i];
            resetCrates(c);
        }
        hero.visible = false;

        stage.update();
    }

    function nextLevel() {
        gameTxt = new createjs.Text("Well Done\n\n", "36px Arial", "#000");
        gameTxt.text += "Prepare for Level 2";
        gameTxt.textAlign = "center";
        gameTxt.x = canvas.width / 2;
        gameTxt.y = canvas.height / 4;
        stage.addChild(gameTxt);
        end();
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

    function collisionHero(xPos, yPos, Radius) {
        var distX = xPos - hero.x,
            distY = yPos - heroCenter,
            distR = Radius + 20;
        if (distX * distX + distY * distY <= distR * distR) {
            return true;
        }
    }


    function resetCrates(crt) {
        crt.x = canvas.width * Math.random() || 0;
        crt.y = -Math.random() * 500;
        crt.speed = (Math.random() * 5) + 8;
    }

    function jump() {
        if (jumping === false && inAir === false) {
            hero.gotoAndStop("jump");
            hero.y -= 20;
            vy = -25;
            jumping = true;
            animPersonnage = false;
        }
    }

    //allow for arrow control scheme
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

    function jouer() {

        //creation de la scene
        var bg = new createjs.Bitmap(imgBg), i, j, platform, crate;
        stage.addChild(bg);

        door = new createjs.Bitmap (imgDoor);
        door.x = 131;
        door.y = 384;
        stage.addChild(door);

        key = new createjs.Bitmap(imgKey);
        key.x = 900;
        key.y = 490;
        stage.addChild(key);


        //insertion du heros
        hero = new Hero(imgHero);
        hero.x = 80;
        hero.y = 450;
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
            platform = new Platform(platformW[i],20);
            platforms.push(platform);
            stage.addChild(platform);
            platform.x = platformX[i];
            platform.y = platformY[i];
        }


        //creations des caisses
        crates = [];
        for (j = 0; j < 5; j += 1) {
            crate = new Crate(imgCrate);
            crates.push(crate);
            stage.addChild(crate);
            resetCrates(crate);
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
        if (loaded === 5) {
            jouer();
        }
    }


    function deplacement(){
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
                hero.scaleX -= 1;
                animPersonnage = true;
            }
            if(right && animPersonnage === false  &&  inAir === false && jumping === false){
                hero.gotoAndPlay("walk");
                hero.scaleX = 1;

                animPersonnage = true;
            }


            hero.x += vx;

            //vx=vx*0.5;
        }

    }

    function allCollisions() {
        //une plateforme
        /*if (hero.y >=unePlateform.y && hero.y<= (unePlateform.y+unePlateform.height) && hero.x > unePlateform.x && hero.x<(unePlateform.x+unePlateform.width)){
         //hero.y=unePlateform.y; // set x pos of hero to platforms x
         vy=0; // switch gravity off

         if(jumping==true)
         {
         jumping = false;
         hero.gotoAndStop("idle");
         }
         inAir = false;

         }else{
         inAir = true;
         }

         */


        //Collisions entre héros et toutes les plateformes


        var i, j, ct;
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

        //Descente des caisses et collisions entre les caisses et le héros
        for (j = 0; j < crates.length; j += 1) {//move crates
            ct = crates[j];
            ct.y += ct.speed;
            ct.rotation += 3;
            if (ct.y > 650) {
                resetCrates(ct);
            }
            if (collisionHero(ct.x, ct.y, 20)) {//collision detect hero with each falling box
                gameOver();
            }
        }


        //collission entre la clé et le heros
        if (collisionHero(key.x + 20, key.y + 20, 20)) {
            key.visible = false;
            //door.visible=true;
        }

        //collission entre la porte et le heros
        if (collisionHero(door.x + 20, door.y + 40, 20) && key.visible === false) {
            nextLevel();
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

    window.onload = init;
}());