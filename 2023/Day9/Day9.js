//Purpose: Find the next sequence of numbers in each row and take the sum of all the new numbers

//Import the file
const fs = require("fs");
const input = fs.readFileSync("input.txt").toString().split("\r\n");

//Delimit the input by space
const delimitBySpace = (arr) => {
    let newArr = [];
    for (let i = 0; i < arr.length; i++) {
        newArr.push(arr[i].split(" "));
    }

    //Convert each string into a number
    for (let j = 0; j < newArr.length; j++) {
        for (let k = 0; k < newArr[j].length; k++) {
            newArr[j][k] = Number(newArr[j][k]);
        }
    }
    return newArr;
};

//Sums all numbers in an array
const sumTotal = (arr) => {
    return arr.reduce((accumulator, currentValue) => accumulator + currentValue);
};

//Checks if an array only contains zeros
const checkZeros = (arr) => {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] !== 0) {
            return false;
        }
    }
    return true;
};

//Calculate the difference between elements within an array and return the array of differences
const differenceArray = (arr) => {
    let newArr = [];
    for (let i = 0; i < arr.length - 1; i++) {
        let difference = arr[i + 1] - arr[i];
        newArr.push(difference);
    }
    return newArr;
};

//Determine the next value in a sequence of values
const nextNumber = (arr) => {
    //Base case is when all  values are zero
    if (checkZeros(arr)) {
        return 0;
    }

    //Recursive case: Continue to create new arrays until the last array are all zeros
    else if (!checkZeros(arr)) {
        let nextArray = differenceArray(arr);
        return arr[arr.length - 1] + nextNumber(nextArray);
    }
};

//Formated input
let inputArr = delimitBySpace(input);

//Iterate through an array of numbers and return an array of their next sequence of values
const sequences = (arr) => {
    let sequenceArray = [];
    for (let i = 0; i < arr.length; i++) {
        sequenceArray.push(nextNumber(arr[i]));
    }
    return sequenceArray;
};

//Next values from each sequence
let nextSequenceValues = sequences(inputArr);

//Part II: Extrapolate for PREVIOUS value
//Determine the FIRST value in a sequence of values
const firstNumber = (arr) => {
    //Base case is when all  values are zero
    if (checkZeros(arr)) {
        return 0;
    }

    //Recursive case: Continue to create new arrays until the last array are all zeros
    else if (!checkZeros(arr)) {
        let nextArray = differenceArray(arr);
        return arr[0] - firstNumber(nextArray);
    }
};

//Iterate through an array of numbers and return an array of their FIRST sequence of values
const sequencesFirst = (arr) => {
    let sequenceArray = [];
    for (let i = 0; i < arr.length; i++) {
        sequenceArray.push(firstNumber(arr[i]));
    }
    return sequenceArray;
};

//First values from each sequence
let firstSequenceValues = sequencesFirst(inputArr);

console.log(sumTotal(firstSequenceValues));
