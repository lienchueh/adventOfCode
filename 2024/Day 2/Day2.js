/* Purpose: identify how many rows are "safe". A row is "safe" if BOTH of the following rules are true:
1. The numbers in the row are either all increasing or all decreasing.
2. Any two adjacent numbers differ by at least one and at most three.
*/

//Import the file
const fs = require("fs");
const input = fs.readFileSync("input.txt").toString().split("\r\n");

//Parse data into individual arrays
const delimitByQuotations = (arr) => {
    let newArr = arr.map((str) => str.split(" ").map(Number));
    return newArr;
};

let formattedArray = delimitByQuotations(input);

//--- Part 1 --- //
const differenceChecker = (firstNum, secondNum) => {
    //Checks if the difference between the first number and second number is NOT between 1 to 3 (inclusive)
    let difference = Math.abs(firstNum - secondNum);
    if (difference === 0 || difference > 3) {
        return true;
    } else return false;
};

const ruleChecker = (arr) => {
    let counter = 0;

    for (let i = 0; i < arr.length; i++) {
        //Check if row is ascending or descending
        let ascending = arr[i][1] - arr[i][0] > 0;
        let passesTest = true;

        for (let j = 1; j < arr[i].length; j++) {
            let prevNum = arr[i][j - 1];
            let currentNum = arr[i][j];

            //Checks for violation of rule #2: difference is outside of the allowed 1 to 3 threshold
            if (differenceChecker(prevNum, currentNum)) {
                passesTest = false;
                break;
            }
            //If the difference between the first two numbers is positive, check if the row is ASCENDING
            else if (ascending && currentNum - prevNum <= 0) {
                passesTest = false;
                break;
            }
            //If the difference between the two numbers is negative, check if the row is DESCENDING
            else if (!ascending && currentNum - prevNum > 0) {
                passesTest = false;
                break;
            }
        }

        if (passesTest) {
            counter += 1;
        }
    }
    return counter;
};

//Part 1 answer:
//console.log(`The number of safe reports are: ${ruleChecker(formattedArray)}`);

//--- Part 2 --- //
// If you removed a number from the array, would the array pass the two tests listed above?

//To check the above, check if the subsequent number passes the above test, if it does, then continue on.

const ruleCheckerWithProblemDampener = (arr) => {
    let counter = 0;

    for (let i = 0; i < arr.length; i++) {
        //Check if row is ascending or descending
        let ascending = arr[i][1] - arr[i][0] > 0;
        let passesTest = true;

        for (let j = 1; j < arr[i].length; j++) {
            let prevNum = arr[i][j - 1];
            let currentNum = arr[i][j];
            let nextNum = arr[i][j + 1];

            //Check if it's the first number that's the issue, then the calculation for ascending should use the 1st and 2nd index instead
            if (j === 2) {
                //Scenario one: ASCENDING -> DESCENDING
                //Remove number at index 0 -> Calculation should be based off of index 1 and 2
                //E.g. 1 4 3 2 1 -> 4 3 2 1 (turns from ascending to descending)
                if (ascending && currentNum - prevNum < 0 && nextNum - currentNum < 0) {
                    ascending = arr[i][2] - arr[i][1] > 0;
                }
                //Scenario two: ASCENDING -> ASCENDING
                //Remove number at index 1 -> Calculation should be based off of index 0 and 2
                //E.g. 7 10 8 10 11 -> 7 8 10 11 (turns from ascending and remains as ascending)
                else if (ascending && currentNum - prevNum < 0 && nextNum - currentNum > 0) {
                    ascending = currentNum - arr[i][0] > 0;
                }
                //Scenario three: DESCENDING -> ASCENDING
                //Remove number at index 0 -> Calculation should be based off of index 1 and 2
                //E.g. 48 46 47 49 51 54 56
                else if (!ascending && currentNum - prevNum > 0 && nextNum - currentNum > 0) {
                    ascending = arr[i][2] - arr[i][1] > 0;
                }
                //Scenario four: DESCENDING -> DESCENDING
                //Remove number at index 1 -> Calculation should be based off of index 0 and 2
                // E.g. 9 6 8 7 6
                else if (!ascending && currentNum - prevNum > 0 && nextNum - currentNum < 0) {
                    ascending = currentNum - arr[i][0] > 0;
                }
            }

            //Checks for violation of rule #2: difference is outside of the allowed 1 to 3 threshold
            if (differenceChecker(prevNum, currentNum)) {
                //Edge case: If current number's index is 1, check to see if droping the number at index 0 works
                if (j === 1) {
                    //Check if the current number and next number passes
                    //E.g. 1 6 7 8 9
                    if (differenceChecker(currentNum, nextNum)) {
                        passesTest = false;
                        //console.log(`${arr[i]} failed difference test.`);
                        break;
                    }
                }
                //Check if the previous number and next number passes
                else if (differenceChecker(prevNum, nextNum)) {
                    passesTest = false;
                    //console.log(`${arr[i]} failed difference test.`);
                    break;
                }
            }
            //If the difference between the first two numbers is positive, check if the row is ASCENDING
            else if (ascending && currentNum - prevNum <= 0) {
                //Check if it's the previous number that is the issue
                if (ascending && nextNum - prevNum <= 0) {
                    //If the current number is removed, does the row pass?
                    if (ascending && nextNum - currentNum <= 0) {
                        passesTest = false;
                        //console.log(`${arr[i]} failed ascending test.`);
                        break;
                    }
                }
            }
            //If the difference between the two numbers is negative, check if the row is DESCENDING
            else if (!ascending && currentNum - prevNum > 0) {
                //Check if it's the previous number that is the issue
                if (!ascending && nextNum - prevNum > 0) {
                    //If the current number is removed, does the row pass?
                    if (!ascending && nextNum - currentNum > 0) {
                        passesTest = false;
                        //console.log(`${arr[i]} failed descending test.`);
                        break;
                    }
                }
            }
        }
        if (passesTest) {
            console.log(`${arr[i]} pass`);
            counter += 1;
        }
    }
    return counter;
};

const rulesOnlyCheck = (arr) => {
    for (let i = 0; i < arr.length; i++) {
        //Check if row is ascending or descending
        let ascending = arr[1] - arr[0] > 0;
        let prevNum = arr[i - 1];
        let currentNum = arr[i];

        //Checks for violation of rule #2: difference is outside of the allowed 1 to 3 threshold
        if (differenceChecker(prevNum, currentNum)) {
            return false;
        }
        //If the difference between the first two numbers is positive, check if the row is ASCENDING
        else if (ascending && currentNum - prevNum <= 0) {
            return false
        }
        //If the difference between the two numbers is negative, check if the row is DESCENDING
        else if (!ascending && currentNum - prevNum > 0) {
            return false
        }
    }
}

const problemDampener = (arr) => {
    let counter = 0;

    for (let i = 0; i < arr.length; i++) {
        //Check if row is ascending or descending
        let ascending = arr[i][1] - arr[i][0] > 0;
        let passesTest = true;
    }

    for (let j = 1; j < arr[i].length; j++) {
        let prevNum = arr[i][j - 1];
        let currentNum = arr[i][j];
        let nextNum = arr[i][j + 1];
    }

     //Checks for violation of rule #2: difference is outside of the allowed 1 to 3 threshold
     if (differenceChecker(prevNum, currentNum)) {
        //Identify if it's the previous number that is causing the error or if it's the current number
        //Drop previous number and perform difference
        passesTest = false;
        break;
    }
}

/*
7 6 4 2 1 - Pass
1 2 7 8 9 - Fail
9 7 6 2 1 - Fail
1 3 2 4 5 - Pass, remove second number
8 6 4 4 1 - Pass, remove third number
1 3 6 7 9 - Pass

48 46 47 49 51 54 56 Pass, remove first number
1 1 2 3 4 5 - Pass, remove second number
1 2 3 4 5 5 - Pass, remove last number
5 1 2 3 4 5 - Pass, remove first number 
1 4 3 2 1 - pass, remove first number  !!!
1 6 7 8 9 - pass, remove first number 
1 2 3 4 3 - pass, remove last number
9 8 7 6 7 - pass, remove last number 
7 10 8 10 11 - pass - remove second number  <- THIS IS BROKEN
29 28 27 25 26 25 22 20 - pass, remove fourth number
*/

/*
7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9
48 46 47 49 51 54 56 
1 1 2 3 4 5
1 2 3 4 5 5
5 1 2 3 4 5
1 4 3 2 1
1 6 7 8 9
1 2 3 4 3
9 8 7 6 7 
7 10 8 10 11 
29 28 27 25 26 25 22 20
*/
console.log(problemDampener(formattedArray));
