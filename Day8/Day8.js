//Purpose: Find the number of steps to reach ZZZ

//Import the file
const fs = require("fs");
let input = fs.readFileSync("input.txt").toString().split("\r\n");

//Convert the map into an object
let parseMap = (arr) => {
    let mapArr = arr.slice(2, arr.length);

    //Delimit by = , ( )
    for (let i = 0; i < mapArr.length; i++) {
        mapArr[i] = mapArr[i].match(/[A-Za-z0-9]+/g);
    }

    //Convert array into object
    let obj = {};
    for (let j = 0; j < mapArr.length; j++) {
        obj[mapArr[j][0]] = mapArr[j].slice(1, 3);
    }

    return obj;
};

//Shifts the first letter of a string to the back of the string
function rotate(str) {
    return str.substring(1) + str[0];
}

//Map "L" and "R" instructions to which index of the array to reference to
let translateInstructions = (str) => {
    if (str === "L") {
        return 0;
    } else return 1;
};

let instructions = input[0]; //Directional instructions
let mapObj = parseMap(input); //Map

//Iterate through the map usin the instructions until you land at ZZZ coordinate
let numSteps = (map, instructions) => {
    let currentPosition = "AAA";
    let mapInstructions = instructions;
    let counter = 0;
    while (currentPosition !== "ZZZ") {
        //Increment the counter
        counter++;

        //Get first direction instruction
        let directionToTurn = translateInstructions(mapInstructions[0]);

        //Move coordinates based upon map instructions
        currentPosition = map[currentPosition][directionToTurn];
        //console.log(`Took a ${mapInstructions[0]} turn and moved to position ${currentPosition}`);

        //Pop the direction to the back of the string
        mapInstructions = rotate(mapInstructions);
    }
    console.log(`Total steps taken is ${counter}`);
    return counter;
};

//Part 1 solution:
//console.log(numSteps(mapObj, instructions))

//Part II: Simulatenously start on every node that ends with A and find out how many steps it takes before you're only on nodes that end with Z

//Find all nodes that end with A
const findANodes = (obj) => {
    //Get the keys of the object
    let array = Object.keys(obj);
    let aNodesArray = [];

    //Loop through the array and return only the nodes that end in "A"
    for (let i = 0; i < array.length; i++) {
        if (array[i][2] === "A") {
            aNodesArray.push(array[i]);
        }
    }
    return aNodesArray;
};

let aNodes = findANodes(mapObj); //All nodes that end in "A"

//Find the number of steps required for each A node
let numStepsANodesTotal = (arr, map, instructions) => {
    let numStepsArr = [];
    for (let i = 0; i < arr.length; i++) {
        let numSteps = numStepsANodes(arr[i], map, instructions);
        numStepsArr.push(numSteps);
    }
    return numStepsArr;
};

//Iterate through the map using the instructions until you land at a node that ends with Z
let numStepsANodes = (currentPosition, map, instructions) => {
    let mapInstructions = instructions;
    let counter = 0;
    while (currentPosition[2] !== "Z") {
        //Increment the counter
        counter++;

        //Get first direction instruction
        let directionToTurn = translateInstructions(mapInstructions[0]);

        //Move coordinates based upon map instructions
        currentPosition = map[currentPosition][directionToTurn];
        //console.log(`Took a ${mapInstructions[0]} turn and moved to position ${currentPosition}`);

        //Pop the direction to the back of the string
        mapInstructions = rotate(mapInstructions);
    }
    //console.log(`Total steps taken is ${counter}`);
    return counter;
};

let stepsReqForEachANode = numStepsANodesTotal(aNodes, mapObj, instructions); //Returns an array that states the number of steps required for each 'A' node found

//Find the lowest common multiple across an array of numbers
const lowestCommonMultiple = (arr) => {
    const gcd = (x, y) => (!y ? x : gcd(y, x % y)); //gcd = greatest common denominator
    const _lcm = (x, y) => (x * y) / gcd(x, y); //lcm = lowest common multiple
    return [...arr].reduce((a, b) => _lcm(a, b));
};

console.log(lowestCommonMultiple(stepsReqForEachANode));
