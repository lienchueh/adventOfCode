//Find the point farthest from the starting position

const fs = require("fs");
const input = fs.readFileSync("input.txt").toString().split("\r\n");

//Find the starting point "S"
const startingPoint = (arr) => {
    let startingCoordinates = {};
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i].length; j++) {
            let character = arr[i][j];
            if (character === "S") {
                //X coordinate is j
                startingCoordinates.X = j;
                //Y coordinate is i
                startingCoordinates.Y = i;
                console.log(`The starting point is X:${j} and Y:${i}`);
            }
        }
    }
    return startingCoordinates;
};

let startingCoordinates = startingPoint(input);

//Listing of all valid tile combinations
let validTileCombos = {
    "|": ["|", "J", "7", "F", "S"],
    "-": ["-", "J", "7", "F", "S"],
    L: ["|", "-", "J", "7", "F", "S"],
    J: ["|", "-", "J", "7", "F", "S"],
    7: ["|", "-", "J", "7", "F", "S"],
    F: ["|", "-", "J", "7", "F", "S"],
};

console.log(validTileCombos["|"].includes("7"));

//Check if a valid tile is adjacent to the current tile
let tileValidity = (arr, startingCoordinates) => {};

//Find the path of the loop
let mainLoop = (arr, startingCoordinates) => {
    let startingCoordinateX = startingCoordinates["X"];
    let startingCoordinateY = ["Y"];

    //Start iterating from the starting coordinate "S"
    for (let i = startingCoordinateY; i < arr.length; i++) {
        for (let j = startingCoordinateX; j < arr[i].length; j++) {
            console.log("PICK UP HERE");
        }
    }
};
