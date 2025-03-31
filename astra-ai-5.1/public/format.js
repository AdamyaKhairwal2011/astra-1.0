let randomFormat = (indent) => {
    let format = [
        {
            intent: "greeting",
            formation: [
                `Greeting! How can I assist you today? Do you want to chat about your interests or something?`,
                `Greeting, would you like to explore or just chill? I'm always here!`,
                `Greeting! How's life going?`
            ]
        },
        {
            intent: "affirmation",
            formation: [
                `Great! Let’s proceed then.`,
                `Awesome! What’s next?`,
                `Cool! Let me help you with that.`
            ]
        },
        {
            intent: "negation",
            formation: [
                `Alright, let me know if you change your mind.`,
                `No worries! I’m here if you need anything.`,
                `Got it! Let me know how I can assist in another way.`
            ]
        },
        {
            intent: "gratitude",
            formation: [
                `You're welcome! Always happy to help.`,
                `No problem! If you need anything else, just ask.`,
                `Glad to assist! Let me know if there’s anything else.`
            ]
        },
        {
            intent: "farewell",
            formation: [
                `Goodbye! Have a great day ahead!`,
                `See you soon! Take care.`,
                `Farewell! Hope to chat again.`
            ]
        },
        {
            intent: "assistance",
            formation: [
                `How can I assist you today?`,
                `Need help with something? I’m here!`,
                `Let me know what you need assistance with!`
            ]
        },
        {
            intent: "weather",
            formation: [
                `The weather is currently {answer}.`,
                `It looks like {answer} outside.`,
                `Here's the weather update: {answer}.`
            ]
        },
        {
            intent: "datetime",
            formation: [
                `The current date and time is {answer}.`,
                `Right now, it's {answer}.`,
                `Here's the current date and time: {answer}.`
            ]
        },

        {
            intent: "math",
            formation: [
                `I evaluated and got {answer} as the answer`,
                `The solution is {answer}`,
                `I calculated and found {answer}`,
                `The answer is {answer}`,
                `I solved the problem and got {answer}`,
                `The result is {answer}`
            ]
        },

        {
            intent: "default",
            formation: [``]
        }
    ];

    let RandomFormat;

    format.forEach((intentSearchBasedFormat) => {
        if (indent == intentSearchBasedFormat.intent) {
            RandomFormat = intentSearchBasedFormat.formation[Math.floor(Math.random() * intentSearchBasedFormat.formation.length)];
        }
    });

    return RandomFormat;
};

export default randomFormat;