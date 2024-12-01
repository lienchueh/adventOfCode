//Purpose: Determine how many points each scratch card earned

//Import the file
const { count } = require("console");
const fs = require("fs");
let input = fs.readFileSync("input.txt").toString().split("\r\n");

//Parse the data
let delimitByColon = (arr) => {
    let newArr = [];
    for (let i = 0; i < arr.length; i++) {
        //Delimit by colon
        let delimitByColon = arr[i].split(": ");
        newArr.push(delimitByColon);
    }
    return newArr;
};

let delimitByLine = (arr) => {
    let newArr = [];
    let formattedArr = delimitByColon(arr);

    for (let i = 0; i < formattedArr.length; i++) {
        for (let j = 0; j < formattedArr[i].length; j++) {
            //Delimit by | to split winning numbers from played numbers
            let delimitByLine = formattedArr[i][j].split(" | ");
            newArr.push(delimitByLine);
        }
    }
    return newArr;
};

let getNumbers = (arr) => {
    let newArr = [];
    let formattedArr = delimitByLine(arr);

    for (let i = 1; i < formattedArr.length; i += 2) {
        newArr.push(formattedArr[i]);
    }
    return newArr;
};

let getWinningNumbers = (arr) => {
    let winningNumbers = [];
    let scratchcardNumbers = [];
    let formattedArr = getNumbers(arr);

    for (let i = 0; i < formattedArr.length; i++) {
        for (let j = 0; j < formattedArr[i].length; j++)
            if (j % 2 === 0) {
                winningNumbers.push(formattedArr[i][j]);
            } else {
                scratchcardNumbers.push(formattedArr[i][j]);
            }
    }
    return winningNumbers;
};

let delimitWinningNums = (arr) => {
    let newArr = [];
    let formattedArr = getWinningNumbers(input);

    //Delimit by space
    for (let i = 0; i < formattedArr.length; i++) {
        for (let j = 0; j < formattedArr[i].length; j += 3) {
            newArr.push(Number(formattedArr[i].slice(j, j + 2)));
        }
    }
    return newArr;
};

let getScratchcardNumbers = (arr) => {
    let winningNumbers = [];
    let scratchcardNumbers = [];
    let formattedArr = getNumbers(arr);

    for (let i = 0; i < formattedArr.length; i++) {
        for (let j = 0; j < formattedArr[i].length; j++)
            if (j % 2 === 0) {
                winningNumbers.push(formattedArr[i][j]);
            } else {
                scratchcardNumbers.push(formattedArr[i][j]);
            }
    }
    return scratchcardNumbers;
};

let delimitScratchcardNums = (arr) => {
    let newArr = [];
    let formattedArr = getScratchcardNumbers(input);

    //Delimit by space
    for (let i = 0; i < formattedArr.length; i++) {
        for (let j = 0; j < formattedArr[i].length; j += 3) {
            newArr.push(Number(formattedArr[i].slice(j, j + 2)));
        }
    }
    return newArr;
};

let countPoints = (arr) => {
    let winningArr = delimitWinningNums(arr);
    let scractchcardArr = delimitScratchcardNums(arr);
    let sum = 0;

    for (let i = 0; i <= scractchcardArr.length / 25; i++) {
        //There are 10 winning numbers
        let winningNumbers = winningArr.slice(i * 10, i * 10 + 10);

        //There are 25 scratch card numbers per card
        let scratchcardNumbers = scractchcardArr.slice(i * 25, i * 25 + 25);
        let counterArr = [];
        for (let j = 0; j < scratchcardNumbers.length; j++) {
            if (winningNumbers.includes(scratchcardNumbers[j])) {
                counterArr.push(scratchcardNumbers[j]);
            }
        }
        let points = doublePoints(counterArr);
        sum += points;
    }
    return sum;
};

//Doubles the point count for every element within the array
let doublePoints = (arr) => {
    let sum = 0;
    if (arr.length >= 1) {
        sum++;
    }
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] > 0) {
            sum *= 2;
        }
    }
    return sum;
};

//Part II - Count the number of scratch tickets you won

//Delimits by space and converts string to numbers

let str = " 1 21 53 59 44";

let parseString = (str) => {
    let parsedArrNum = [];
    //Loop through array and convert to number
    for (let i = 0; i < str.length; i += 3) {
        parsedArrNum.push(Number(str.slice(i, i + 2)));
    }
    return parsedArrNum;
};

//Formats into an array of objects. Separated by card numbers.
let formatGame = (arr) => {
    let formattedArr = delimitByLine(arr);
    let newArr = [];

    //Formats the array into an Object
    for (let i = 0; i < formattedArr.length; i += 2) {
        let obj = {};

        //Even index are card numbers
        let card = formattedArr[i];
        let cardNumberSplit = card[0].split(" ");
        //Update the object for the card number
        obj.card = Number(cardNumberSplit[1]);

        //Odd index are numbers from the scratchcard's game
        obj.WinningNums = parseString(formattedArr[i + 1][0]);
        obj.ScratchcardNums = parseString(formattedArr[i + 1][1]);
        obj.CardCount = 1;
        newArr.push(obj);
    }
    return newArr;
};

//Count the number of matches between the ScratchcardNums and WinningNums array for each card
let matches = (arr) => {
    let formattedArr = formatGame(arr);

    //Loops through each card and return the number of matches between the winning numbers and scratch ticket
    for (let i = 0; i < formattedArr.length; i++) {
        let scratchcardNums = formattedArr[i].ScratchcardNums;
        let winningNums = formattedArr[i].WinningNums;
        let counter = 0;
        for (let j = 0; j < scratchcardNums.length; j++) {
            if (winningNums.includes(scratchcardNums[j])) {
                counter++;
            }
        }
        //Update the card for the number of matches
        formattedArr[i].Matches = counter;
    }
    return formattedArr;
};

//Count the number of winning cards won
let countCards = (arr) => {
    let formattedArr = matches(arr);

    //Loop through the array and update each card for the amount of cards won based upon the previous card's results
    for (let i = 1; i < formattedArr.length; i++) {
        //Start at card 2 since there will only ever be ONE Card 1
        let prevCardMatches = formattedArr[i - 1]["Matches"];
        let prevCardCount = formattedArr[i - 1]["CardCount"];

        if (prevCardMatches > 0) {
            //Add 1 to the next x card's count based upon prevCardMatches
            for (let j = 0; j < prevCardMatches; j++) {
                let cardCount = formattedArr[i + j]["CardCount"];
                formattedArr[i + j]["CardCount"] += 1 * prevCardCount;
                /*console.log(
                    `Card ${formattedArr[i + j]["card"]}'s count been updated to ${formattedArr[i + j]["CardCount"]}`
                );
                */
            }
        }
    }
    return formattedArr;
};

//Sum up all CartCounts within the array
let totalCards = (arr) => {
    let formattedArr = countCards(arr);
    let counter = 0;

    for (let i = 0; i < formattedArr.length; i++) {
        let cardCount = formattedArr[i]["CardCount"];
        counter += cardCount;
    }
    return counter;
};

//console.log(countCards(input));
console.log(totalCards(input));
