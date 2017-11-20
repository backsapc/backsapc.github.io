var gameSpeed = 20;
let levelBriefDuration = 5000;

let mm = new mapManager();
let sm = new spriteManager();
let em = new eventsManager();
let pm = new physicManager();
let gm = new gameManager();
let hm = new hudManager();
let am = new audioManager();
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
        getAudioManager().stopAll();
        getAudioManager().play(gameScenes[l].music, { looping: true });
        getAudioManager().filter.frequency.value = getAudioManager().lowFrequency;
     //   getScoreManager().currentLevel = l;
      //  getScoreManager().save();
        getGameManager().clearScreen();
        getHudManager().drawTitleText(gameScenes[l].title);
        getHudManager().drawSubtitleText(gameScenes[l].subtitle);
        setTimeout(() => {
            getAudioManager().frequencyRamp(getAudioManager().defaultFrequency, 1);
            getGameManager().loadScene(gameScenes[0]);
        }, levelBriefDuration);

    } else {
        let totalScore = 0;
        for(let s of getScoreManager().storage) {
            totalScore += s.score;
        }
        getScoreManager().save();
        getGameManager().clearScreen();
        getHudManager().drawTitleText("You've done it, awesome!");
        getHudManager().drawSubtitleText(`Total score: ${totalScore}`);
    }
}

function resourcesLoaded() {

    // Loading start level
    setTimeout(() => { startLevel(0) }, 100);
    console.log('loaded all');
}

function loadAll() {
    menu.style.display = 'none';
    canvas.style.display = 'block';
    getGameManager().loadResources();
}
