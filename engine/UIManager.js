class UIManager {
    constructor() {

    }

    drawGameHud() {
        let ctx = getCurrentContext();
        let playerAmmo = getGameManager().player.energyAmount;
        let hudAmmoImage = getSpriteManager().getSprite('energy1');
        let hudAmmoPadding = 20;
        let ammoPos = { x: hudAmmoPadding, y: getCurrentCanvas().height - hudAmmoPadding - hudAmmoImage.h };
        ctx.drawImage(getSpriteManager().image,
            hudAmmoImage.x,
            hudAmmoImage.y,
            hudAmmoImage.w,
            hudAmmoImage.h,
            ammoPos.x,
            ammoPos.y,
            hudAmmoImage.w,
            hudAmmoImage.h
        );
        let delta = hudAmmoImage.w + 5;
        ctx.font = '30px AllertaStencil';
        ctx.textBaseline = "top";
        context.textAlign = "left";
        ctx.fillStyle = 'white';
        ctx.fillText(playerAmmo, ammoPos.x + delta, ammoPos.y + hudAmmoImage.h / 4);

        // Drawing score
        ctx.font = '30px AllertaStencil';
        ctx.textBaseline = "top";
        context.textAlign = "left";
        ctx.fillStyle = 'white';
        ctx.fillText(getStatisticsManager().currentScore(), 20, 20);
    }

    drawText(text, size, x, y, baseline) {
        let ctx = getCurrentContext();
        ctx.font = `${size}px AllertaStencil`;
        ctx.textBaseline = baseline;
        context.textAlign = 'center';
        let lineheight = size;
        let lines = text.split('\n');
        for (let i = 0; i<lines.length; i++)
            ctx.fillText(lines[i], x, y + (i*lineheight) );
    }

    drawTitleText(text) {
        let ctx = getCurrentContext();
        ctx.fillStyle = 'white';
        this.drawText(text, 30, getCurrentCanvas().width / 2, getCurrentCanvas().height / 2, 'bottom');
    }

    drawSubtitleText(text) {
        getCurrentContext().fillStyle = 'white';
        this.drawText(text, 20, getCurrentCanvas().width / 2, getCurrentCanvas().height / 2, 'top');
    }

    drawPressFireText() {
        getCurrentContext().fillStyle = 'white';
        this.drawText('Press fire button', 18, getCurrentCanvas().width / 2, getCurrentCanvas().height - 30, 'bottom');
    }

    drawEndLevel() {
        this.drawTitleText('Great  job!');
        this.drawSubtitleText(
            `Enemies  killed:  ${getStatisticsManager().currentKills()}\n
            Time:  ${getStatisticsManager().getTimeString(getStatisticsManager().getCurrentTime())}\n
            Score:  ${getStatisticsManager().currentScore()}\n
            Total  score:  ${getStatisticsManager().getCurrentTotalScore()}`
        );
        this.drawPressFireText();
    }

    drawLoadingScreen() {
        getGameManager().clearScreen();
        this.drawTitleText(`Loading`);
        this.drawSubtitleText(`Please  wait`);
    }
}