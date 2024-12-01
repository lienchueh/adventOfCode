/* Purpose: Find the total distance between two columns.
1. Pair up the smallest number in the left list with the smallest number in the right list, then the second-smallest left number with the second-smallest right number, and so on.
2. Within each pair, figure out how far apart the two numbers are; you'll need to add up all of those distances.
*/

//Import the file
const fs = require("fs");
const input = fs.readFileSync("input.txt").toString().split("\r\n");

//Step 1: Format the data into two arrays
//Each value within the array is composed of two numbers, separated by a space.
const delimitBySpace = (arr) => {
    let newArr = [];
    for (let i = 0; i < arr.length; i++) {
        newArr.push(arr[i].split("   "));
    }
    return newArr;
};

//Convert string into text
const convertTextToNumber = (arr) => {
    let newArr = [];
    for (let j = 0; j < arr.length; j++) {
        let tempArr = [];
        for (let k = 0; k < arr[j].length; k++) {
            tempArr.push(Number(arr[j][k]));
        }
        newArr.push(tempArr);
    }
    return newArr;
};

//Reformat into two separate arrays
const separateIntoTwoArrays = (arr) => {
    let leftColumn = [];
    let rightColumn = [];
    for (let i = 0; i < arr.length; i++) {
        leftColumn.push(arr[i][0]);
        rightColumn.push(arr[i][1]);
    }
    //Sort the arrays
    let combinedArr = [];
    combinedArr.push(leftColumn.sort(), rightColumn.sort());
    return combinedArr;
};

let formattedArr = separateIntoTwoArrays(convertTextToNumber(delimitBySpace(input)));

// --- PART ONE --- //

//Step 2: Calculate the difference between the two arrays at their respective index
//Calculate the difference by index and push to new array
const arrayOfDifferences = (arr) => {
    let differenceArray = [];
    for (let i = 0; i < arr[0].length; i++) {
        differenceArray.push(Math.abs(arr[0][i] - arr[1][i]));
    }
    return differenceArray;
};

let differenceArr = arrayOfDifferences(formattedArr);

//Calculate the sum of the array
const summedArray = (arr) => {
    let total = arr.reduce((accumulator, currentValue) => accumulator + currentValue);
    return total;
};

console.log(`The solution to part 1 is: ${summedArray(differenceArr)}`);

// --- PART TWO --- //
//Purpose: Calculate similarity score

//Step 1: Create an object that lists the number of times each number from the left column appears in the right column
//Update the object with a list of all UNIQUE numbers from the left column (duplicates filtered out)
let uniqueNumbers = [...new Set(formattedArr[0])];

const convertArrayToObject = (array) => {
    let obj = array.reduce((acc, key) => {
        acc[key] = 0;
        return acc;
    }, {});
    return obj;
};

let legend = convertArrayToObject(uniqueNumbers);

//Step 2: Count how many times a number appears within the right column
const numberTracker = (arr, obj) => {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] in obj) {
            obj[arr[i]] += 1;
        }
    }
    return obj;
};

let numbersToCount = formattedArr[1];
legend = numberTracker(numbersToCount, legend);

//Step 3: Calculate similarity score using the legend
const calculatedTotal = (arr, obj) => {
    let productArr = [];
    for (let i = 0; i < arr.length; i++) {
        productArr.push(arr[i] * obj[arr[i]]);
    }
    let total = summedArray(productArr);
    return total;
};

let idArray = formattedArr[0];
console.log(`The solution to part 2 is: ${calculatedTotal(idArray, legend)}`);
