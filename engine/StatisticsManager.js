class StatisticsManager {

    constructor() {
        this.storage = [];
        this.records = [];
        for(let i = 0; i < 5; i++) {
            this.records[i] = {};
            this.records[i].name = 'No record';
            this.records[i].total = 0;
        }
        this.clearAll();
        this.load();
        this.tempTimer = 0;
        this.pauseTimer = 0;
    }

    clearCurrentRecording() {
        this.storage[this.currentLevel].score = 0;
        this.storage[this.currentLevel].killed = 0;
        this.storage[this.currentLevel].time = 0;
        this.storage[this.currentLevel].total = 0;
    }

    enemyKilled(hardness) {
        this.storage[this.currentLevel].score += Math.floor(200 * hardness);
        this.storage[this.currentLevel].killed++;
    }

    currentScore() {
        return this.storage[this.currentLevel].score;
    }

    currentKills() {
        return this.storage[this.currentLevel].killed;
    }

    startTimer() {
        this.tempTimer = Date.now();
    }

    timerPause() {
        this.pauseTimer = Date.now();
    }

    timerUnpause() {
        this.tempTimer += Date.now() - this.pauseTimer;
        this.pauseTimer = 0;
    }

    recordTime() {
        this.storage[this.currentLevel].time = this.currentTime();
    }

    getCurrentTime() {
        return this.storage[this.currentLevel].time;
    }

    currentTime() {
        return Date.now() - this.tempTimer;
    }

    calculateTotal(energyAmount) {
        this.storage[this.currentLevel].total = this.storage[this.currentLevel].score +
            this.getCurrentEnergyBonus(energyAmount) +
            this.getCurrentTimeBonus();
    }

    getCurrentTotalScore() {
        return this.storage[this.currentLevel].total;
    }

    getCurrentEnergyBonus(energyAmount) {
        return energyAmount * 100;
    }

    getCurrentTimeBonus() {
        return  Math.floor(300 / ( div(this.getCurrentTime(), 1000) / 40 ));
    }

    clearAll() {
        this.storage = [];
        this.records = [];
        for(let i = 0; i < 5; i++) {
            this.records[i] = {};
            this.records[i].name = 'No record';
            this.records[i].total = 0;
        }
        for(let i = 0; i < gameScenes.length; i++) {
            this.storage[i] = {};
            this.storage[i].score = 0;
            this.storage[i].killed = 0;
            this.storage[i].time = 0;
            this.storage[i].total = 0;
        }

        this.currentLevel = 0;
    }

    save() {
        if(storageAvailable('localStorage')) {
            console.log(`Saving!`);
            localStorage.setItem('score_data', JSON.stringify(this.storage));
            localStorage.setItem('records', JSON.stringify(this.records));
            localStorage.setItem('current_level', this.currentLevel);
        } else {
            console.log(`Local storage is unsupported!`);
        }
    }

    load() {
        if(storageAvailable('localStorage')) {
            console.log(`Loading!`);
            let scoreData = localStorage.getItem('score_data');
            let currentLevel = localStorage.getItem('current_level');
            let records = localStorage.getItem('records');
            if(scoreData !== null && currentLevel !== null) {
                console.log(`Found saves!`);
                this.storage = JSON.parse(scoreData);
                this.currentLevel = currentLevel * 1;
                this.records = JSON.parse(records);
            } else {
                console.log(`Saves not found!`);
            }
        } else {
            console.log(`Local storage is unsupported!`);
        }
    }

    getTimeString(ms) {
        let timePassed = div( ms, 1000 );

        let hours = div( timePassed, 3600 );
        timePassed -= (3600 * hours);
        let minutes = div( timePassed, 60 );
        if(minutes < 10) minutes = '0' + minutes;
        timePassed -= (60 * minutes);
        if(timePassed < 10) timePassed = '0' + timePassed;

        if(hours > 0) {
            return `${hours}:${minutes}:${timePassed}`;
        } else {
            return `${minutes}:${timePassed}`;
        }
    }

    clearSaves() {
        if(!storageAvailable('localStorage')) {
            console.log(`Local storage is unsupported!`);
            return;
        }
        localStorage.removeItem('score_data');
        localStorage.removeItem('current_level');
        localStorage.removeItem('records')
    }

    calculateFinalGameScore(){
        let totalGameScore = 0;
        for(let storageItem of this.storage){
            totalGameScore += storageItem.total;
        }
    }

    shiftRecords(recordNumber){
        for(let i = this.records.length; i > recordNumber; i--){
            this.records[i] = this.records[i - 1];
        }
    }
}