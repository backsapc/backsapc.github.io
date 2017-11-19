const image = new Image(); // Ñîçäàíèå îáúåêòà èçîáðàæåíèÿ
image.onload = function () { // Ñîõðàíåíèå ññûëêè íà ôóíêöèþ
    setInterval(move, 1); // Ñîçäàíèå èíòåðâàëà â 100 ìñåê äëÿ
    //çàïóñêà move
};
let x = 10; // Êîîðäèíàòà x èçîáðàæåíèÿ
let velocity = 1;
function move() { // Ôóíêöèÿ, âûçûâàåìàÿ ïî òàéìåðó
    checkVelocity(x);
    x += velocity;
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Î÷èñòèòü õîëñò
    ctx.drawImage(image, x, 10, 80, 80); // Ïðîðèñîâêà èçîáðàæåíèÿ
}

function checkVelocity(x) {
    if(x < 200 && velocity > 0)
        return;
    if(x > 0 && velocity < 0)
        return;
    velocity = -velocity;
}
image.src = 'https://images.duckduckgo.com/iu/?u=http%3A%2F%2Fimages2.fanpop.com%2Fimages%2Fphotos%2F8300000%2FSmile-Wallpaper-keep-smiling-8317565-1024-768.jpg&f=1';


