import component from "./predefined.js";
import randomFormat from "./format.js";

let greeting = ["hello", "hey", "hi", "yo", "howdy"];

let botGreetings = ["hello", "hey", "hi", "hii", "howdy"];

let indents = [
    { query: ['hi', 'hello', 'howdy', 'hey', 'yo', 'bhai', 'bro', 'greetings', 'sup', 'what’s up', 'namaste', 'hola', 'bonjour', 'ciao', 'konichiwa', 'salaam', 'shalom'], indent: 'greeting' },
    { query: ['yes', 'yeah', 'yup', 'sure', 'okay', 'ok', 'affirmative', 'correct', 'right'], indent: 'affirmation' },
    { query: ['no', 'nah', 'nope', 'negative', 'never', 'wrong'], indent: 'negation' },
    { query: ['thank you', 'thanks', 'thx', 'appreciate', 'much obliged', 'gracias', 'merci', 'danke'], indent: 'gratitude' },
    { query: ['bye', 'goodbye', 'see ya', 'later', 'farewell', 'adios', 'ciao', 'sayonara'], indent: 'farewell' },
    { query: ['help', 'assist', 'support', 'aid', 'guide', 'how to', 'tutorial', 'explain'], indent: 'assistance' },
    { query: ['weather', 'temperature', 'forecast', 'climate', 'rain', 'sunny', 'storm', 'humidity'], indent: 'weather' },
    { query: ['math', 'algebra', 'geometry', 'calculus', 'equation', 'integral', 'derivative', 'pi', 'probability'], indent: 'mathematics' },
    { query: ['computer', 'CPU', 'RAM', 'GPU', 'SSD', 'motherboard', 'processor', 'hardware', 'software'], indent: 'technology' },
    { query: ['space', 'NASA', 'Mars', 'galaxy', 'black hole', 'star', 'planet', 'orbit', 'astronomy', 'exoplanet', 'cosmos'], indent: 'space' },
    { query:['solve', 'evaluate', 'calculate', 'find', 'compute', 'math'], indent: 'math' },
  ];
  

// Conversation history for context
let conversationHistory = [];

// Levenshtein Distance Function
function levenshteinDistance(a, b) {
    let dp = Array(a.length + 1).fill(null).map(() => Array(b.length + 1).fill(0));

    for (let i = 0; i <= a.length; i++) dp[i][0] = i;
    for (let j = 0; j <= b.length; j++) dp[0][j] = j;

    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            let cost = a[i - 1] === b[j - 1] ? 0 : 1;
            dp[i][j] = Math.min(
                dp[i - 1][j] + 1, // Deletion
                dp[i][j - 1] + 1, // Insertion
                dp[i - 1][j - 1] + cost // Substitution
            );
        }
    }
    return dp[a.length][b.length];
}

// Get Trigrams (Only for words longer than 2 letters)
function getTrigrams(word) {
    let trigrams = new Set();
    if (word.length < 3) return trigrams; // Ignore small words
    for (let i = 0; i < word.length - 2; i++) {
        trigrams.add(word.slice(i, i + 3));
    }
    return trigrams;
}

// Best Match Finder (Levenshtein + Trigram Hybrid)
function getBestMatch(query, dataset) {
    let bestMatch = query;
    let highestScore = -1;

    let queryTrigrams = getTrigrams(query);

    for (let word of dataset) {
        let wordTrigrams = getTrigrams(word);
        let commonTrigrams = [...queryTrigrams].filter(tri => wordTrigrams.has(tri)).length;

        let trigramScore = (query.length > 2 && word.length > 2) ?
            (commonTrigrams / Math.max(queryTrigrams.size, wordTrigrams.size)) : 0;

        let levenshteinScore = 1 - (levenshteinDistance(query, word) / Math.max(query.length, word.length));

        let finalScore = (trigramScore * 0.5) + (levenshteinScore * 0.5);

        // Direct match if Levenshtein score is 60%+
        if (levenshteinScore >= 0.6) return word;

        if (finalScore > highestScore) {
            highestScore = finalScore;
            bestMatch = word;
        }
    }

    return highestScore > 0.4 ? bestMatch : query;
}

function randomBata(kiska) {
    let nikalna = Math.floor(Math.random() * kiska.length);
    return kiska[nikalna];
}

// Sentence Correction
function correctSentence(sentence, dataset) {
    let words = sentence.split(" ");
    let correctedWords = words.map(word => getBestMatch(word, dataset));
    return correctedWords.join(" ");
}

// Top-k Sampling Function for NLG
function topKSampling(probabilities, k) {
    // Sort probabilities and pick top-k
    let sorted = probabilities
        .map((prob, index) => ({ prob, index }))
        .sort((a, b) => b.prob - a.prob)
        .slice(0, k);

    // Normalize probabilities
    let totalProb = sorted.reduce((sum, item) => sum + item.prob, 0);
    sorted = sorted.map(item => ({ ...item, prob: item.prob / totalProb }));

    // Pick a random index based on probabilities
    let random = Math.random();
    let cumulative = 0;
    for (let item of sorted) {
        cumulative += item.prob;
        if (random < cumulative) {
            return item.index;
        }
    }
    return sorted[0].index; // Fallback to the highest probability
}

// Example Dataset & Query
let dataset = component.text.split(" ");
let userQuery = "ho is te good of teknologie";

let correctedSentence = correctSentence(userQuery, dataset);

// Function to check if a query contains a mathematical expression
function isMathQuery(query) {
    const mathKeywords = ['solve', 'evaluate', 'calculate', 'find', 'compute', 'math'];
    const mathExpressionRegex = /[-+*/^()0-9\s.=]/; // Regex to detect math expressions
    return mathKeywords.some(keyword => query.toLowerCase().includes(keyword)) && mathExpressionRegex.test(query);
}

// Function to extract and solve mathematical expressions
function solveMathExpression(query) {
    try {
        // Extract the mathematical expression from the query
        const mathExpression = query.replace(/solve|evaluate|calculate|find|compute/gi, "").trim();
        const sanitizedExpression = mathExpression.replace(/[^0-9+\-*/().\s]/g, "").trim(); // Remove invalid characters

        if (!sanitizedExpression) {
            return "I couldn't find a valid mathematical expression in your query.";
        }

        const result = eval(sanitizedExpression); // Evaluate the expression

        // Ensure randomFormat is a function or handle it as a string
        let format = typeof randomFormat === "function" ? randomFormat("math") : "The result is {answer}.";
        format = format.replaceAll("{answer}", result);

        return format; // Return the formatted result
    } catch (error) {
        console.error("Error evaluating math expression:", error);
        return "I couldn't evaluate the mathematical expression. Please check the syntax.";
    }
}

// Updated fetchAnswer function
async function fetchAnswer(query) {
    // Add the user's query to the conversation history
    conversationHistory.push({ user: query });

    // Check if the query is a mathematical query
    if (isMathQuery(query)) {
        return solveMathExpression(query);
    }

    // Combine conversation history into a single context
    let stopwords = ['what ', 'who ', 'how ', 'where ', 'when ', 'why ', 'which ', 'are ', 'the ', 'a ', 'an ', 'is ', 'at '];
    stopwords.forEach((word) => {
        query = query.replaceAll(word, "");
        query = query.replaceAll("  ", "");
    });
    console.log(correctSentence(query, dataset));
    var indent;
    var format;
    var predefinedAnswer = component.predefined.find(item => item.keyword.some(k => levenshteinDistance(query, k) < 3));

    if (predefinedAnswer || randomFormat(indent)) {
        console.log("X")
    } else{
        for (let indentObj of indents) {
            for (let key of indentObj.query) {
                if (correctSentence(query, dataset).toLowerCase().includes(key)) {
                    indent = indentObj.indent;
                    format = randomFormat(indent);
                    if (format) {
                        format = format.replaceAll("Greeting", randomBata(botGreetings));
                    }
                    break;
                }
            }
            if (indent) break;
        }
    }

    const proxies = [
        "https://corsproxy.io/?", // Most stable
        "https://api.allorigins.win/raw?url=",
        "https://thingproxy.freeboard.io/fetch/"
    ];

    const corsProxy = proxies[2]; // Change index if needed

    const duckDuckGoAPI = `https://api.duckduckgo.com/?q=${encodeURIComponent(correctSentence(query, dataset))}&format=json&no_redirect=1;`
    const wikiAPI = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(correctSentence(query, dataset))};`

    // Return predefined answer if available, otherwise use format
    let responseAnswer = predefinedAnswer ? predefinedAnswer.answer : format;

    if (responseAnswer) {
        return responseAnswer;
    } else {
        try {
            // DuckDuckGo API Request
            let response = await fetch(corsProxy + encodeURIComponent(duckDuckGoAPI), { mode: 'cors' });
            let data = await response.json();

            if (data.AbstractText) {
                conversationHistory[conversationHistory.length - 1].bot = data.AbstractText; // Save bot response
                return data.AbstractText;
            }

            // Wikipedia API Request (Fallback)
            response = await fetch(corsProxy + encodeURIComponent(wikiAPI), { mode: 'cors' });
            data = await response.json();

            if (data.extract) {
                conversationHistory[conversationHistory.length - 1].bot = data.extract; // Save bot response
                return data.extract;
            }

            return "No relevant answer found!";
        } catch (error) {
            console.error("Error fetching answer:", error);
            return "Error fetching answer!";
        }
    }
}

// Example Usage
async function run(ques) {
    try {
        let answer = await fetchAnswer(ques);
        console.log(answer);
    } catch (error) {
        console.error("Error getting AI response:", error);
    }
}

run("solve 2+2+2")