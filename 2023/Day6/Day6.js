//Purpose: Calculate all possible win conditions

//Import the file
const fs = require("fs");
let input = fs.readFileSync("input.txt").toString().split("\r\n");

//Parse the input
let parseInput = (arr) => {
    //Delimit by colon
    let delimitByColon = [];
    for (let i = 0; i < arr.length; i++) {
        delimitByColon.push(arr[i].split(":"));
    }

    //Delimit by space
    let delimitBySpace = [];
    for (let j = 0; j < delimitByColon.length; j++) {
        delimitBySpace.push(delimitByColon[j][1].split(" "));
    }

    //Remove any blanks
    for (let k = 0; k < delimitBySpace.length; k++) {
        let newArr = [];
        for (let l = 0; l < delimitBySpace[k].length; l++) {
            if (delimitBySpace[k][l] !== "") {
                newArr.push(Number(delimitBySpace[k][l]));
            }
        }
        delimitBySpace[k] = newArr;
    }

    return delimitBySpace;
};

let boatDistance = (arr) => {
    let formattedArr = parseInput(arr);
    let totalPotentialWins = [];

    //Iterate through each time and determine if the potential the total number of different ways that can be won for that round
    for (let i = 0; i < 1; i++) {
        for (let j = 0; j < formattedArr[i].length; j++) {
            let time = formattedArr[0][j];
            let distanceToBeat = formattedArr[1][j];
            let potentialWins = 0;

            //For every millisecond the button is held, the boat's speed increases by 1 millimeter per 1 millisecond
            for (let k = 1; k < time; k++) {
                let distanceTravelled = (time - k) * k;
                if (distanceTravelled > distanceToBeat) {
                    potentialWins++;
                }
            }
            totalPotentialWins.push(potentialWins);
        }
    }
    console.log(`Winning potential per round are:`);
    console.log(totalPotentialWins);
    console.log(`Product of all potential wins are:`);
    return sumProduct(totalPotentialWins);
};

let sumProduct = (arr) => {
    let total = arr.reduce((acc, current) => acc * current);
    return total;
};

//Part 2 Correct the kerning from part 1. Ignore the spaces between the numbers on each line
let parseInputNoSpace = (arr) => {
    let formattedArr = parseInput(arr);
    let newArr = [];

    for (let i = 0; i < formattedArr.length; i++) {
        let newNum = "";
        for (let j = 0; j < formattedArr[i].length; j++) {
            let number = formattedArr[i][j];
            newNum = newNum.concat(number.toString());
        }
        newArr.push(Number(newNum));
    }
    return newArr;
};

let boatDistancePartTwo = (arr) => {
    let formattedArr = parseInputNoSpace(arr);
    let potentialWins = [];

    let time = formattedArr[0];
    let distanceToBeat = formattedArr[1];

    //For every millisecond the button is held, the boat's speed increases by 1 millimeter per 1 millisecond
    for (let k = 1; k < time; k++) {
        let distanceTravelled = (time - k) * k;
        if (distanceTravelled > distanceToBeat) {
            potentialWins++;
        }
    }

    console.log(`Total potential wins are:`);
    return potentialWins;
};

console.log(boatDistancePartTwo(input));
