//Import the file
const fs = require("fs");
let input = fs.readFileSync("input.txt").toString().split("\r\n");

//Format into an object
let formatCards = (arr) => {
    let newArr = arr;
    //Delimit by space to separate between card and bid amount
    for (let i = 0; i < newArr.length; i++) {
        newArr[i] = newArr[i].split(" ");
    }

    let formattedArr = [];
    for (let j = 0; j < newArr.length; j++) {
        let obj = {};
        obj.card = newArr[j][0];
        obj.bid = Number(newArr[j][1]);
        formattedArr.push(obj);
    }

    return formattedArr;
};

//Assigns values to letters
let letterValue = {
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    T: 10,
    J: 11,
    Q: 12,
    K: 13,
    A: 14,
};

//Return the hand type
let handType = (str) => {
    let counts = {};

    //Update an object with all the card types and the AMOUNT of each card type into an object
    for (let i = 0; i < str.length; i++) {
        let currentLetter = str[i];
        let current_count = counts[currentLetter] || 0; //If it returns undefined > falsy statement. The falsy statement will default to the 0 instead
        counts[currentLetter] = current_count + 1;
    }

    //Then convert to an array for ease of sorting. [CardType, Amount of that specific card type] --> E.g. ['2', 2] where there are 2 cards of '2'.
    let countsArr = [];
    for (const [key, value] of Object.entries(counts)) {
        countsArr.push([key, value]);
    }
    //Sort the converted array
    countsArr.sort(sortDescending);

    //Then iterate through the sorted array and check for: 5 of a kind, 4 of a kind, full house, etc (in order)
    for (let j = 0; j < countsArr.length; j++) {
        //Five of a kind
        if (countsArr[j][1] === 5) {
            return "Five of a kind";
            //Four of a kind
        } else if (countsArr[j][1] === 4) {
            return "Four of a kind";
            //Full house
        } else if (countsArr[j][1] === 3 && countsArr[j + 1][1] === 2) {
            return "Full house";
            //Three of a kind
        } else if (countsArr[j][1] === 3) {
            return "Three of a kind";
            //Two pair
        } else if (countsArr[j][1] === 2 && countsArr[j + 1][1] === 2) {
            return "Two pairs";
            //One pair
        } else if (countsArr[j][1] === 2) {
            return "One pair";
            //High card
        } else {
            return "High card";
        }
    }
};

//Create a compare function for use in the handType function
function sortDescending(a, b) {
    return b[1] - a[1];
}

//Update the object with the type of hand it is
let countCards = (arr) => {
    let formattedArr = formatCards(arr);

    for (let i = 0; i < formattedArr.length; i++) {
        for (let j = 0; j < formattedArr[i]["card"].length; j++) {
            formattedArr[i].handType = handType(formattedArr[i]["card"]);
            formattedArr[i].handTypeRank = handTypeRank(formattedArr[i].handType);
        }
    }
    return formattedArr;
};

//Add rank value to hand type
let handTypeRank = (str) => {
    if (str === "Five of a kind") {
        return 7;
    } else if (str === "Four of a kind") {
        return 6;
    } else if (str === "Full house") {
        return 5;
    } else if (str === "Three of a kind") {
        return 4;
    } else if (str === "Two pairs") {
        return 3;
    } else if (str === "One pair") {
        return 2;
    } else if (str === "High card") {
        return 1;
    } else {
        return 0;
    }
};

//Then SORT again and assign a rank to each hand (make sure to consider ranks amongst the same type of hand)
//E.g. sort all five of a kind against each other
//HINT: Create a compare function to INPUT into the Sort function > Check to see if they are the same type of hand > if they are, then loop over the cards within each hand to determine their ranking

let sortByHandType = (arr) => {
    let formattedArr = countCards(arr);
    formattedArr.sort(sortDescendingHandType);
    return formattedArr;
};

//Create a compare function for use in the sortByHandType function
function sortDescendingHandType(a, b) {
    //If the hand type is the same, sort by individual card strength from left to right
    if (a.handTypeRank === b.handTypeRank) {
        for (let i = 0; i < a["card"].length; i++) {
            //INSERT CHECK FOR INDIVIDUAL CARD RANKING HERE
            let aCard = a["card"][i];
            let bCard = b["card"][i];
            if (aCard !== bCard) {
                //RETURN VALUE
                let aCardValue = letterValue[aCard];
                let bCardValue = letterValue[bCard];
                return aCardValue - bCardValue;
            }
        }
    } else {
        return a.handTypeRank - b.handTypeRank;
    }
}

//Assign ranks to each hand
let assignRanks = (arr) => {
    let formattedArr = sortByHandType(input);

    for (let i = 1; i < formattedArr.length + 1; i++) {
        formattedArr[i - 1].rank = i;
    }
    return formattedArr;
};

//Calculate total winnings
let totalWinnings = (arr) => {
    let formattedArr = assignRanks(arr);
    let counter = 0;
    for (let i = 0; i < formattedArr.length; i++) {
        let rank = formattedArr[i].rank;
        let bid = formattedArr[i].bid;
        counter += rank * bid;
    }
    return counter;
};

//Part II: J cards are now Jokers and can act like whatever card that would make the hand the strongest type possible
//However, J cards are now the WEAKEST individual cards (weaker than 2)

//Assigns values to letters but J is now Joker and is the lowest value
const letterValueJokers = {
    J: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    T: 10,
    Q: 12,
    K: 13,
    A: 14,
};

//Converts hand into an array with the count of each type of card present
let handArray = (str) => {
    let counts = {};

    //Update an object with all the card types and the AMOUNT of each card type into an object
    for (let i = 0; i < str.length; i++) {
        let currentLetter = str[i];
        let current_count = counts[currentLetter] || 0; //If it returns undefined > falsy statement. The falsy statement will default to the 0 instead
        counts[currentLetter] = current_count + 1;
    }

    //Then convert to an array for ease of sorting. [CardType, Amount of that specific card type] --> E.g. ['2', 2] where there are 2 cards of '2'.
    let countsArr = [];
    for (const [key, value] of Object.entries(counts)) {
        countsArr.push([key, value]);
    }
    //Sort the converted array
    countsArr.sort(sortDescending);

    return countsArr;
};

//Loops through an array and searches to see if a J card exists
let findJokers = (arr) => {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i][0] === "J") {
            return true;
        }
    }
    return false;
};

//Loops through a string and finds the card that is the highest value
let bestCard = (str) => {
    let bestCard = str[0];
    let bestCardValue = letterValueJokers[bestCard];
    for (let j = 1; j < str.length; j++) {
        //Iterate through the cards and find the card with the highest value
        let nextCard = str[j];
        let nextCardValue = letterValueJokers[nextCard];

        if (nextCardValue > bestCardValue) {
            bestCard = nextCard;
        }
    }
    return bestCard;
};

//Remove J cards from the array
let removeJCards = (arr) => {
    let newArr = [];
    for (let i = 0; i < arr.length; i++) {
        if (arr[i][0] !== "J") {
            newArr.push(arr[i]);
        }
    }
    return newArr;
};

//Loops through a string and finds the card that has the SECOND highest count AND card value
let secondBestCard = (str) => {
    let handArr = handArray(str);
    let slicedArr = [];

    //If the array is FIVE Jacks
    if (handArr[0][0] === "J" && handArr[0][1] === 5) {
        slicedArr = handArr;
    } else {
        slicedArr = removeJCards(handArr);
    }
    let bestCard = slicedArr[0][0];
    let bestCardCount = slicedArr[0][1];
    let bestCardValue = letterValueJokers[bestCard];

    for (let i = 0; i < slicedArr.length; i++) {
        //Iterate through the cards and find the card with the highest count and highest value
        let nextCard = slicedArr[i][0];
        let nextCardCount = slicedArr[i][1];
        let nextCardValue = letterValueJokers[nextCard];

        if (nextCardCount >= bestCardCount && nextCardValue > bestCardValue) {
            bestCard = nextCard;
        }
    }
    return bestCard;
};

//Return an array and finds the index of the card type
let cardIndex = (arr, cardType) => {
    for (let i = 0; i < arr.length; i++) {
        if (cardType === arr[i][0]) {
            return arr.indexOf(arr[i]);
        }
    }
};

//Create a compare function for use in the sortByHandType function
function sortDescendingHandTypeJokers(a, b) {
    //If the hand type is the same, sort by individual card strength from left to right
    if (a.handTypeRank === b.handTypeRank) {
        for (let i = 0; i < a["card"].length; i++) {
            //INSERT CHECK FOR INDIVIDUAL CARD RANKING HERE
            let aCard = a["card"][i];
            let bCard = b["card"][i];
            if (aCard !== bCard) {
                //RETURN VALUE
                let aCardValue = letterValueJokers[aCard];
                let bCardValue = letterValueJokers[bCard];
                return aCardValue - bCardValue;
            }
        }
    } else {
        return a.handTypeRank - b.handTypeRank;
    }
}

//Function that calculates the number of Jacks found and adds them to the card with the highest count
//If there is a tie, go with the card that is valued higher
let revisedJokerHand = (str) => {
    let counts = {};

    //Update an object with all the card types and the AMOUNT of each card type into an object
    for (let i = 0; i < str.length; i++) {
        let currentLetter = str[i];
        let current_count = counts[currentLetter] || 0; //If it returns undefined > falsy statement. The falsy statement will default to the 0 instead
        counts[currentLetter] = current_count + 1;
    }

    //Then convert to an array for ease of sorting. [CardType, Amount of that specific card type] --> E.g. ['2', 2] where there are 2 cards of '2'.
    let countsArr = [];
    for (const [key, value] of Object.entries(counts)) {
        countsArr.push([key, value]);
    }
    //Sort the converted array
    countsArr.sort(sortDescending);

    //If J card exists, add the count of J cards to the card that has the highest count
    if (findJokers(countsArr)) {
        //If there is a tie, go with the card that is valued higher
        //EDGE CASE: FIVE OF A KIND - ALL J CARDS
        if (countsArr[0][0] === "J" && countsArr[0][1] === 5) {
            countsArr;
        } else if (countsArr[0][1] === 1) {
            //SCENARIO 1: HIGH CARD
            //If the hand is a High Card with a J, iterate through the hand to find the card with the highest value
            let bestCardFound = bestCard(str);
            //Add the J card to the bestCard count
            let indexOfBestCard = cardIndex(countsArr, bestCardFound);
            countsArr[indexOfBestCard][1]++;

            //Remove the J card from the array
            countsArr = removeJCards(countsArr);
        } else if (countsArr[0][0] === "J") {
            //SCENARIO 2: J Cards represent the HIGHEST card count
            //Find the next card with the highest value AND highest count
            let secondBestCards = secondBestCard(str);

            //Add the J cards to the secondBestCards count
            let indexOfSecondBestCard = cardIndex(countsArr, secondBestCards);
            let jCardsCount = countsArr[0][1];
            countsArr[indexOfSecondBestCard][1] += jCardsCount;

            //Remove the J card from the array
            countsArr = removeJCards(countsArr);
        } else {
            //SCENARIO 3: If the hand type is not a High Card AND J cards do NOT have the highest card count within the hand
            let indexOfJCard = cardIndex(countsArr, "J");
            let jCardsCount = countsArr[indexOfJCard][1];

            //Increment the card count of the card that has the highest card count AND highest value
            let bestCards = secondBestCard(str);
            let indexOfBestCard = cardIndex(countsArr, bestCards);
            countsArr[indexOfBestCard][1] += jCardsCount;

            //Remove the J card from the array
            countsArr = removeJCards(countsArr);
        }
        //Sort the converted array again
        countsArr.sort(sortDescending);
    }

    return countsArr;
};

//Return the hand type
let handTypeJoker = (str) => {
    let newArrNoJoker = revisedJokerHand(str);

    //Iterate through the sorted array and check for: 5 of a kind, 4 of a kind, full house, etc (in order)
    for (let j = 0; j < newArrNoJoker.length; j++) {
        //Five of a kind
        if (newArrNoJoker[j][1] === 5) {
            return "Five of a kind";
            //Four of a kind
        } else if (newArrNoJoker[j][1] === 4) {
            return "Four of a kind";
            //Full house
        } else if (newArrNoJoker[j][1] === 3 && newArrNoJoker[j + 1][1] === 2) {
            return "Full house";
            //Three of a kind
        } else if (newArrNoJoker[j][1] === 3) {
            return "Three of a kind";
            //Two pair
        } else if (newArrNoJoker[j][1] === 2 && newArrNoJoker[j + 1][1] === 2) {
            return "Two pairs";
            //One pair
        } else if (newArrNoJoker[j][1] === 2) {
            return "One pair";
            //High card
        } else {
            return "High card";
        }
    }
};

//Update the object with the type of hand it is
let countCardsJokers = (arr) => {
    let formattedArr = formatCards(arr);

    for (let i = 0; i < formattedArr.length; i++) {
        for (let j = 0; j < formattedArr[i]["card"].length; j++) {
            formattedArr[i].handType = handTypeJoker(formattedArr[i]["card"]);
            formattedArr[i].handTypeRank = handTypeRank(formattedArr[i].handType);
        }
    }
    return formattedArr;
};

//Sort again and assign a rank to each hand
let sortByHandTypeJokers = (arr) => {
    let formattedArr = countCardsJokers(arr);
    formattedArr.sort(sortDescendingHandTypeJokers);
    return formattedArr;
};

//Assign ranks to each hand
let assignRanksJokers = (arr) => {
    let formattedArr = sortByHandTypeJokers(input);

    for (let i = 1; i < formattedArr.length + 1; i++) {
        formattedArr[i - 1].rank = i;
    }
    return formattedArr;
};

//Calculate total winnings
let totalWinningsJokers = (arr) => {
    let formattedArr = assignRanksJokers(arr);
    let counter = 0;
    for (let i = 0; i < formattedArr.length; i++) {
        let rank = formattedArr[i].rank;
        let bid = formattedArr[i].bid;
        counter += rank * bid;
    }
    return counter;
};

//console.log(assignRanksJokers(input));
console.log(totalWinningsJokers(input));
