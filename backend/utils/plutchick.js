const PLUTCHIK_EMOTIONS = {
    JOY: { name: 'Joy', imagePath: '../images/emojis/joy.png' },
    TRUST: { name: 'Trust', imagePath: '../images/emojis/trust.png' },
    FEAR: { name: 'Fear', imagePath: '../images/emojis/fear.png' },
    SURPRISE: { name: 'Surprise', imagePath: '../images/emojis/surprise.png' },
    SADNESS: { name: 'Sadness', imagePath: '../images/emojis/sadness.png' },
    DISGUST: { name: 'Disgust', imagePath: '../images/emojis/disgust.png' },
    ANGER: { name: 'Anger', imagePath: '../images/emojis/anger.png' },
    ANTICIPATION: { name: 'Anticipation', imagePath: '../images/emojis/anticipation.png' },
};
  
module.exports = {
    PLUTCHIK_EMOTIONS,
    getEmotionByName: (name) => Object.values(PLUTCHIK_EMOTIONS).find(e => e.name.toLowerCase() === name.toLowerCase()),
};
