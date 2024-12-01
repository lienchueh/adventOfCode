const fs = require("fs");
let input = fs.readFileSync("input.txt").toString().split("\n");

//Purpose: Find the first digit and last digit to form a two-digit number from a list of strings

//Extract all numbers from a string
let extractNums = (str) => {
    let regex = /\d/g;
    let matches = str.match(regex); // creates array from matches
    return matches;
};

//Extract the first number from a string
let strFirstNumber = (str) => {
    let firstNumber = extractNums(str)[0];
    return firstNumber;
};

//Extract the last number from a string
let strLastNumber = (str) => {
    let lastNumberIndex = extractNums(str).length - 1;
    let lastNumber = extractNums(str)[lastNumberIndex];
    return lastNumber;
};

//Concatenate the first number and last number from a string together
let concatNumbers = (str) => {
    let firstNum = strFirstNumber(str);
    let lastNum = strLastNumber(str);
    let concatNum = Number("" + firstNum + lastNum);
    return concatNum;
};

//Create a function that iterates through an array of strings and pushes them to a new array the first number
const arrNumbers = (arr) => {
    let numberArr = [];
    for (let i = 0; i < arr.length; i++) {
        numberArr.push(concatNumbers(arr[i]));
    }
    return numberArr;
};

//Sums up an array of numbers
const arrTotal = (arr) => {
    let array = arrNumbers(arr);

    let sum = (accumulator, currentValue) => {
        return accumulator + currentValue;
    };
    let total = array.reduce(sum);
    return total;
};

//Replace words with numbers within a string
const numberReplace = (str) => {
    let replacedStr = str;
    replacedStr = replacedStr.replaceAll("one", "one1one");
    replacedStr = replacedStr.replaceAll("two", "two2two");
    replacedStr = replacedStr.replaceAll("three", "three3three");
    replacedStr = replacedStr.replaceAll("four", "four4four");
    replacedStr = replacedStr.replaceAll("five", "five5five");
    replacedStr = replacedStr.replaceAll("six", "six6six");
    replacedStr = replacedStr.replaceAll("seven", "seven7seven");
    replacedStr = replacedStr.replaceAll("eight", "eight8eight");
    replacedStr = replacedStr.replaceAll("nine", "nine9nine");
    return replacedStr;
};

//Update an array of strings to convert numbers in word format to regular numbers
const arrNumReplace = (arr) => {
    let newArr = [];
    for (let i = 0; i < arr.length; i++) {
        newArr.push(numberReplace(arr[i]));
    }
    return newArr;
};

//Sums up an array of numbers that also include words
const arrTotalConverted = (arr) => {
    //Convert numbers in word format to regular numbers array
    let arrayConverted = arrNumReplace(arr);
    let array = arrNumbers(arrayConverted);

    let sum = (accumulator, currentValue) => {
        return accumulator + currentValue;
    };
    let total = array.reduce(sum);
    return total;
};

console.log(arrTotalConverted(input));
