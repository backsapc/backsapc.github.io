class EventsManager {
    constructor() {
        this.bind = [];
        this.action = [];
        this.mouse = { x: 0, y: 0 };
    }

    setup(canvas) {
        this.bind[87] = 'up';
        this.bind[65] = 'left';
        this.bind[83] = 'down';
        this.bind[68] = 'right';
        this.bind[32] = 'fire';
        this.bind[82] = 'restart';
        this.bind[80] = 'pause';
        this.bind[27] = 'pause';
        window.addEventListener('mousedown', this.onMouseDown);
        window.addEventListener('mouseup', this.onMouseUp);
        window.addEventListener('mousemove', this.onMouseMove);
        window.addEventListener('keydown', this.onKeyDown);
        window.addEventListener('keyup', this.onKeyUp);
        // document.body.addEventListener('keydown', this.onKeyDown);
        // document.body.addEventListener('keyup', this.onKeyUp);
    }

    getMouseDelta() {
        let mouseDeltaX = this.mouse.x - getGameManager().playerPosOnScreen().x;
        let mouseDeltaY = this.mouse.y - getGameManager().playerPosOnScreen().y;
        return { x: mouseDeltaX, y: mouseDeltaY };
    }

    onMouseDown(event) {
        if(getGameManager().pause)
            return;
        getEventsManager().action['fire'] = true;
    }

    onMouseUp(event) {
        getEventsManager().action['fire'] = false;
    }

    onMouseMove(event) {
        if(getGameManager().pause)
            return;
        getEventsManager().mouse = { x: event.clientX, y: event.clientY };
    }

    onKeyDown(event) {
        if(getGameManager().pause)
            return;
        let action = getEventsManager().bind[event.keyCode];
        if(action === undefined) {
            return;
        }
        getEventsManager().action[action] = true;
    }

    onKeyUp(event) {
        if(getGameManager().pause)
            return;
        let action = getEventsManager().bind[event.keyCode];
        if(action === undefined) {
            return;
        }
        getEventsManager().action[action] = false;
    }
}