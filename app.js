let gameSpeed = 20;
let levelBriefDuration = 5000;

let mapManager = new MapManager();
let spriteManager = new SpriteManager();
let eventsManager = new EventsManager();
let physicsManager = new PhysicsManager();
let gameManager = new GameManager();
let uiManager = new UIManager();
let audioManager = new AudioManager();
let statisticsManager = new StatisticsManager();

function getCurrentContext() { return context; }
function getCurrentCanvas() { return canvas; }
function getEventsManager() { return eventsManager; }
function getSpriteManager() { return spriteManager; }
function getGameManager() { return gameManager; }
function getPhysicManager() { return physicsManager; }
function getMapManager() { return mapManager; }
function getUIManager() { return uiManager; }
function getAudioManager() { return audioManager; }
function getStatisticsManager() { return statisticsManager; }

function getGameSpeed() {
    return gameSpeed;
}

function completedLevel(l) {
    startLevel(l + 1);
}

let delayStart = function (l) {
    setTimeout(() => {
        getAudioManager().frequencyRamp(getAudioManager().defaultFrequency, 1);
        getGameManager().loadScene(gameScenes[l]);
    }, levelBriefDuration);
};

let showLevelDescription = function (l) {
    getUIManager().drawTitleText(gameScenes[l].title);
    getUIManager().drawSubtitleText(gameScenes[l].subtitle);
};

function startLevel(l) {
    if(l < gameScenes.length) {
        getAudioManager().stopAll();
        getAudioManager().play(gameScenes[l].music, { looping: true });
        getAudioManager().filter.frequency.value = getAudioManager().lowFrequency;
        getStatisticsManager().currentLevel = l;
        getStatisticsManager().save();
        getGameManager().clearScreen();
        showLevelDescription(l);
        delayStart(l);
    } else {
        let totalScore = 0;
        for(let s of getStatisticsManager().storage) {
            totalScore += s.score;
        }
        getStatisticsManager().save();
        getGameManager().clearScreen();
        getUIManager().drawTitleText("You've done it, awesome!");
        getUIManager().drawSubtitleText(`Total score: ${totalScore}`);
    }
}

function resourcesLoaded() {
    let currentLevel = getStatisticsManager().currentLevel;
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
    let storage = window[type];
    try {
        let x = '__storage_test__';
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
            scoreboardTextElement.innerHTML += (`Enemies killed: ${getStatisticsManager().storage[i].killed}<br />`);
            scoreboardTextElement.innerHTML += (`Shots fired: ${getStatisticsManager().storage[i].fired}<br />`);
            scoreboardTextElement.innerHTML += (`Time: ${getStatisticsManager().getTimeString(getStatisticsManager().storage[i].time)}<br />`);
            scoreboardTextElement.innerHTML += (`Score: ${getStatisticsManager().storage[i].total}<br /><br />`);
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
