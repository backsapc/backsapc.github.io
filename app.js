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
        let records = getStatisticsManager().records;
        for(let s of getStatisticsManager().storage) {
            totalScore += s.total;
        }

        for(let i = 0; i < 5; i++){
            if(totalScore < records[i])
                continue;
            getStatisticsManager().shiftRecords(i);
            records[i] = totalScore;
            let name = getNewHeroName();
            records[i].name = name;
            break;
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

function getNewHeroName() {
    let username = prompt('What a hero! You\'ve beaten one of the record. Enter your name.', 'username');
    if(username === null || username === ''){
        username = 'undefined user';
    }
    return username;
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
    hideAll();
    let scoreboardElement = document.getElementById('scoreboard');
    let scoreboardTextElement = document.getElementById('scoreboard-text');
    if(en) {
        scoreboardTextElement.innerHTML = '';
        scoreboardElement.style.display = 'block';
        let records = getStatisticsManager().records;
        if(records.length === 0){
            scoreboardTextElement.innerHTML = "There're no records!";
            return;
        }
        for(let i = 0; i < records.length; i++) {
            scoreboardTextElement.innerHTML += (`Name: ${records[i].name} Score: ${records[i].total}<br />`);
        }
    } else {
        scoreboardElement.style.display = 'none';
    }
}

function clearRecords() {
    getStatisticsManager().clearAll();
    getStatisticsManager().save();
    scoreboard(true);
}

function backToMain() {
    scoreboard(false);
    menu.style.display = 'block';
}


function hideAll() {
    menu.style.display = 'none';
    canvas.style.display = 'none';
    scoreboardElement.style.display = 'none';
}

function loadAll() {
    menu.style.display = 'none';
    canvas.style.display = 'block';
    getGameManager().loadResources();
}
