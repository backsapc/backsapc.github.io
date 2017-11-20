var gameSpeed = 20;
let levelBriefDuration = 5000;

let mm = new mapManager();
let sm = new spriteManager();
let em = new eventsManager();
let pm = new physicManager();
let gm = new gameManager();
let hm = new hudManager();
let am = new audioManager();
var scm = new scoreManager();

function getCurrentContext() { return context; }
function getCurrentCanvas() { return canvas; }
function getEventsManager() { return em; }
function getSpriteManager() { return sm; }
function getGameManager() { return gm; }
function getPhysicManager() { return pm; }
function getMapManager() { return mm; }
function getHudManager() { return hm; }
function getAudioManager() { return am; }
function getScoreManager() { return scm; }


function completedLevel(l) {
    startLevel(l + 1);
}

function startLevel(l) {
    if(l < gameScenes.length) {
        getAudioManager().stopAll();
        getAudioManager().play(gameScenes[l].music, { looping: true });
        getAudioManager().filter.frequency.value = getAudioManager().lowFrequency;
        getScoreManager().currentLevel = l;
        getScoreManager().save();
        getGameManager().clearScreen();
        getHudManager().drawTitleText(gameScenes[l].title);
        getHudManager().drawSubtitleText(gameScenes[l].subtitle);
        setTimeout(() => {
            getAudioManager().frequencyRamp(getAudioManager().defaultFrequency, 1);
            getGameManager().loadScene(gameScenes[l]);
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
    let currentLevel = getScoreManager().currentLevel;
    currentLevel = currentLevel === undefined ? 0 : currentLevel;
    // Loading start level
    setTimeout(() => { startLevel(currentLevel) }, 100);
    console.log('loaded all');
}

function togglePause() {
    switchGlobalUI();
    switchInnerMenu();
    getGameManager().togglePause();
}

function switchInnerMenu(){
    mainMenu.style.display = mainMenu.style.display === 'none' ? 'block' : 'none';
    inGameMenu.style.display = inGameMenu.style.display === 'block' ? 'none' : 'block';
}

function toMainMenu() {
    switchGlobalUI();
    switchInnerMenu();
    clearInterval(getGameManager().worldUpdateTimer);
}

function switchGlobalUI() {
    menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
    canvas.style.display = canvas.style.display === 'block' ? 'none' : 'block';
}


function storageAvailable(type) {
    try {
        var storage = window[type],
            x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return e instanceof DOMException && (
                // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            storage.length !== 0;
    }
}

function div(val, by){
    return (val - val % by) / by;
}

function scoreboard(en) {
    let scoreboardElement = document.getElementById('scoreboard');
    let scoreboardTextElement = document.getElementById('scoreboard-text');
    if(en) {
        scoreboardTextElement.innerHTML = '';
        scoreboardElement.style.display = 'block';

        for(let i = 0; i < gameScenes.length; i++) {
            scoreboardTextElement.innerHTML += (`<b>${gameScenes[i].title}</b><br />`);
            scoreboardTextElement.innerHTML += (`Enemies killed: ${getScoreManager().storage[i].killed}<br />`);
            scoreboardTextElement.innerHTML += (`Shots fired: ${getScoreManager().storage[i].fired}<br />`);
            scoreboardTextElement.innerHTML += (`Time: ${getScoreManager().getTimeString(getScoreManager().storage[i].time)}<br />`);
            scoreboardTextElement.innerHTML += (`Score: ${getScoreManager().storage[i].total}<br /><br />`);
        }

    } else {
        scoreboardElement.style.display = 'none';
    }
}


function loadAll() {
    menu.style.display = 'none';
    canvas.style.display = 'block';
    getGameManager().loadResources();
}
