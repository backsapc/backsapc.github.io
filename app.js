var gameSpeed = 20;
let levelBriefDuration = 500;

let mm = new mapManager();
let sm = new spriteManager();
let em = new eventsManager();
let pm = new physicManager();
let gm = new gameManager();
var hm  = new hudManager();
var am  = new audioManager();
//var scm = new scoreManager();

function getCurrentContext() { return context; }
function getCurrentCanvas() { return canvas; }
function getEventsManager() { return em; }
function getSpriteManager() { return sm; }
function getGameManager() { return gm; }
function getPhysicManager() { return pm; }
function getMapManager() { return mm; }
function getHudManager() { return hm; }
function getAudioManager() { return am; }
//function getScoreManager() { return scm; }



function startLevel(l) {
    if(l < gameScenes.length) {
        /*
        getAudioManager().stopAll();
        getAudioManager().play(gameScenes[l].music, { looping: true });
        getAudioManager().filter.frequency.value = getAudioManager().lowFrequency;

        getScoreManager().currentLevel = l;
        getScoreManager().save();
        */
        getGameManager().clearScreen();
        /*
        getHudManager().drawHero(gameScenes[l].hero);
        getHudManager().drawTitleText(gameScenes[l].title);
        getHudManager().drawSubtitleText(gameScenes[l].subtitle);
        getHudManager().drawLevelHint(gameScenes[l].hint)
        */
        setTimeout(() => {
            // getAudioManager().frequencyRamp(getAudioManager().defaultFrequency, 1);
            getGameManager().loadScene(gameScenes[0]);
        }, levelBriefDuration);

    } else {

        let totalScore = 0;
        for(let s of getScoreManager().storage) {
            totalScore += s.score;
        }

        getScoreManager().save();

        getGameManager().clearScreen();
        getHudManager().drawHero('endlevel');
        getHudManager().drawTitleText('CONGRATULATIONS,  YOU  FINISHED  THE  GAME!');
        getHudManager().drawSubtitleText(`Your total score: ${totalScore}`);

    }
}

function resourcesLoaded() {

    // Loading start level
    setTimeout(() => { startLevel(1) }, 100);

    console.log('loaded all');
    //getHudManager().drawHero('endlevel');
}

function loadAll() {
    getGameManager().loadResources();

    /*
    getMapManager().loadMap("resources/maps/another.json");
    getSpriteManager().loadAtlas("resources/images/spritesheet.png", "resources/images/sprites.json");
    getMapManager().parseEntities();
    getMapManager().draw(context);
    getEventsManager().setup(canvas);
    */
}

loadAll();
