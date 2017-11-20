var gameScenes = [
    {
        sceneName: 'the-beginning',
        title: 'Level 1: get skills up',
        subtitle: "So, hello, I'm James. You're here to participate\n" +
        "in the Great Experiment.\n" +
        "Test your skills, you can control time now.\n",
        map: 'beginning.json',
        music: 'resources/sounds/game-music.mp3',
        hero: 'hero-1',
        hint: "Destroy your enemies. Time goes with your moves.",
        walkable: [21]
    },
    {
        sceneName: 'dark-time',
        title: 'Level 2: dark time is here',
        subtitle: "Now you know as no one, time's relative... But...\n" +
        "Does we have right to control it?... Don't think so..\n" +
        "Here's gun for you, but I don't have energy for it.\n" +
        "You have to leave the lab now, run!",
        map: 'dark-time.json',
        music: 'resources/sounds/game-music.mp3',
        hero: 'hero-2',
        hint: 'Find energy for your gun. Escape the lab.',
        walkable: [21]
    },

    {
        sceneName: 'weak',
        title: 'Level 3: pull yourself together!',
        subtitle: "Good! If you are reading this, then you must be tired, but alive.\n" +
        "Here's no time to complain. We can't allow them to destroy us.",
        map: 'weak.json',
        music: 'resources/sounds/game-music.mp3',
        hero: 'hero-3',
        hint: 'Kill your enemies. Do not die.',
        walkable: [21]
    },

    {
        sceneName: 'final',
        title: 'Level 4: final',
        subtitle: "It's time for the attack.. They aren't ready for you.\n Save world from thing I've created.\n" +
        "Destroy the lab. There're tens of enemies. Good luck!",
        map: 'final.json',
        music: 'resources/sounds/game-music.mp3',
        hero: 'hero-4',
        hint: 'Destroy the lab.',
        walkable: [21]
    },
];
