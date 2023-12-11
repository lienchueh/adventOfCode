//Purpose: Determine if a certain combination of dice colours is possible

//Import the file
const fs = require("fs");
let input = fs.readFileSync("input.txt").toString().split("\r\n");

/*Parse each string so that it is formated as an array from:
Start: Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
End: 
Game = {
    Game: 1,
    Rounds: [3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green]
} 

Round = {
    red: 
    green:
    blue:
}
*/

//Create a function that splits the rounds into individual objects
let splitRounds = (arr) => {
    let newArr = [];
    for (let i = 0; i < arr.length; i++) {
        let roundObj = {
            red: 0,
            green: 0,
            blue: 0,
        };
        for (let j = 0; j < arr[i].length; j++) {
            //Get cube color
            let cubeColour = arr[i][j].split(" ")[1];
            //Get cube amount
            let cubeAmount = Number(arr[i][j].split(" ")[0]);
            roundObj[cubeColour] += cubeAmount;
        }
        newArr.push(roundObj);
    }
    return newArr;
};

//Create a Game object that includes the game number and the rounds array
let gameObj = (str) => {
    //Delimit string by Colon
    let delimitByColon = str.split(": ");

    //Remove the word "Game " to get only the game number
    let gameNumber = delimitByColon[0].split(" ")[1];

    //Separate the rounds within the string and then delimit by semi-colon
    let rounds = delimitByColon[1];
    rounds = rounds.split("; ");

    //Put each element within the array into an object
    let diceRounds = [];

    for (let i = 0; i < rounds.length; i++) {
        let dice = rounds[i].split(", ");
        diceRounds.push(dice);
    }

    //Create a new object
    let game = {
        Game: gameNumber,
        Rounds: splitRounds(diceRounds),
        PassCriteria: true,
        MinCubes: {
            red: 0,
            green: 0,
            blue: 0,
        },
    };
    return game;
};

//Convert an array into the newly formated gameObj format
let formatArr = (arr) => {
    let newArr = [];
    for (let i = 0; i < arr.length; i++) {
        newArr.push(gameObj(arr[i]));
    }
    return newArr;
};

//Part 1: Which games would be possible if the bag contained only 12 red cubes, 13 gree ncubes, and 14 blue cubes?
let maxCubes = {
    red: 12,
    green: 13,
    blue: 14,
};

//Evaluate which games within the array of objects satisfy the maxCubes condition
let checkGames = (arr) => {
    let formatedArray = formatArr(arr);
    //Step 1: Iterate through each object within the array
    for (let i = 0; i < formatedArray.length; i++) {
        //Step 2: Access only the ROUNDS within the object
        let rounds = formatedArray[i]["Rounds"];
        //Step 3: Step 3: Iterate through EACH round
        for (let j = 0; j < rounds.length; j++) {
            let round = rounds[j];
            //Step 4: Verify the cube count for each colour does not exceed maxCubes
            if (
                round["red"] > maxCubes["red"] ||
                round["green"] > maxCubes["green"] ||
                round["blue"] > maxCubes["blue"]
            ) {
                //Step 5: If step 4 is true, then change "PassCriteria" to be true for the game
                formatedArray[i]["PassCriteria"] = false;
            }
        }
    }
    return formatedArray;
};

//Loop through the results array and tally up all game numbers whose PassCriteria is true
let passedGames = (arr) => {
    let checkedArray = checkGames(arr);

    //Iterate through the array and filter for objects whose PassCriteria is true
    let sum = 0;
    for (let i = 0; i < checkedArray.length; i++) {
        if (checkedArray[i]["PassCriteria"]) {
            sum += Number(checkedArray[i]["Game"]);
        }
    }
    return sum;
};

//Part 2: What is the FEWEST number of cubes of each color that could have been in the bag to make the game possible?
let minCubes = (arr) => {
    let formatedArray = formatArr(arr);

    //Step 1: Iterate through each object within the array
    for (let i = 0; i < formatedArray.length; i++) {
        //Step 2: Access only the ROUNDS within the object
        let rounds = formatedArray[i]["Rounds"];

        //Step 3: Step 3: Iterate through EACH round
        for (let j = 0; j < rounds.length; j++) {
            let round = rounds[j];

            //Step 4: Verify if the current cube count is higher than the current MinCubes counter (
            if (round["red"] > formatedArray[i]["MinCubes"]["red"]) {
                //Step 5: If step 4 is true, then update maxCubes for the new minimum cube count for that color
                formatedArray[i]["MinCubes"]["red"] = round["red"];
            }
            if (round["green"] > formatedArray[i]["MinCubes"]["green"]) {
                formatedArray[i]["MinCubes"]["green"] = round["green"];
            }
            if (round["blue"] > formatedArray[i]["MinCubes"]["blue"]) {
                formatedArray[i]["MinCubes"]["blue"] = round["blue"];
            }
        }
    }
    return formatedArray;
};

//Loop through the results array and calculate the sum product of all MinCubes
let sumProductMinCubes = (arr) => {
    let checkedArray = minCubes(arr);
    let sum = 0;

    for (let i = 0; i < checkedArray.length; i++) {
        sum +=
            checkedArray[i]["MinCubes"]["red"] *
            checkedArray[i]["MinCubes"]["green"] *
            checkedArray[i]["MinCubes"]["blue"];
    }
    return sum;
};

console.log(sumProductMinCubes(input));
