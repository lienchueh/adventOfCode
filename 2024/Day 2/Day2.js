/* Purpose: identify how many rows are "safe". A row is "safe" if BOTH of the following rules are true:
1. The numbers in the row are either all increasing or all decreasing.
2. Any two adjacent numbers differ by at least one and at most three.
*/

//Import the file
const fs = require("fs");
const input = fs.readFileSync("input.txt").toString().split("\r\n");

//Parse data into individual arrays
const delimitByQuotations = (arr) => {
    let newArr = arr.map((str) =>
        str
            .split(" ")
            .filter((s) => s.trim() !== "")
            .map(Number)
    );
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
console.log(`The number of safe reports are: ${ruleChecker(formattedArray)}`);

//--- Part 2 --- //
// If you removed a number from the array, would the array pass the two tests listed above?

const rulesOnlyCheck = (arr) => {
    let rulesTracker = {
        pass: true,
        indexOfCurrentNumber: -1,
        issue: "none",
    };

    for (let i = 1; i < arr.length; i++) {
        //Check if row is ascending or descending
        let ascending = arr[1] - arr[0] > 0;
        let prevNum = arr[i - 1];
        let currentNum = arr[i];

        //Checks for violation of rule #2: difference is outside of the allowed 1 to 3 threshold
        if (differenceChecker(prevNum, currentNum)) {
            rulesTracker.pass = false;
            rulesTracker.issue = "Failed difference test.";
            rulesTracker.indexOfCurrentNumber = i;
            break;
        }
        //If the difference between the first two numbers is positive, check if the row is ASCENDING
        else if (ascending && currentNum - prevNum <= 0) {
            rulesTracker.pass = false;
            rulesTracker.issue = "Failed ascending test.";
            rulesTracker.indexOfCurrentNumber = i;
            break;
        }
        //If the difference between the two numbers is negative, check if the row is DESCENDING
        else if (!ascending && currentNum - prevNum > 0) {
            rulesTracker.pass = false;
            rulesTracker.issue = "Failed descending test.";
            rulesTracker.indexOfCurrentNumber = i;
            break;
        }
    }
    return rulesTracker;
};

const removedCurrentNumArrResult = (arr, obj) => {
    //Check if it's the current number that's the issue
    let indexToRemove = obj.indexOfCurrentNumber;
    let removedCurrentNumArr = [...arr.slice(0, indexToRemove), ...arr.slice(indexToRemove + 1)];
    let removedCurrentNumArrResult = rulesOnlyCheck(removedCurrentNumArr);
    /* 
        console.log(
        `Current Number: Removed ${arr[indexToRemove]} to create ${removedCurrentNumArr} with result of ${removedCurrentNumArrResult}`
        ); 
    */
    return removedCurrentNumArrResult;
};

const removedPrevNumArrResult = (arr, obj) => {
    //Check if it's the previous number that's the issue
    let indexToRemove = obj.indexOfCurrentNumber - 1;
    let removedPrevNumArr = [...arr.slice(0, indexToRemove), ...arr.slice(indexToRemove + 1)];
    let removedPrevNumArrResult = rulesOnlyCheck(removedPrevNumArr);
    /*
        console.log(
        `Previous Number: Removed ${arr[indexToRemove]} to create ${removedPrevNumArr} with result of ${removedPrevNumArrResult}`
        ); 
    */
    return removedPrevNumArrResult;
};

const removedFirstNumArrResult = (arr) => {
    //Check if it's the first number that's the issue
    let removedFirstNumArr = [...arr.slice(0, 0), ...arr.slice(0 + 1)];
    let removedFirstNumArrResult = rulesOnlyCheck(removedFirstNumArr);
    return removedFirstNumArrResult;
};

const problemDampener = (arr) => {
    let counter = 0;

    for (let i = 0; i < arr.length; i++) {
        let passesTest = true;

        //Get results for current array
        let rulesTracker = rulesOnlyCheck(arr[i]);
        let ruleCheckResult = rulesTracker.pass;

        if (ruleCheckResult) {
            console.log(`${arr[i]} pass`);
        }
        //If the array failed the rule check, investigate if removing the CURRENT or PREVIOUS number will result in a pass
        if (!ruleCheckResult) {
            //Check if it's the current number that's the issue
            let currentNumObj = removedCurrentNumArrResult(arr[i], rulesTracker);
            let currentNumResult = currentNumObj.pass;

            //Check if it's the previous number that's the issue
            let prevNumObj = removedPrevNumArrResult(arr[i], rulesTracker);
            let prevNumResult = prevNumObj.pass;

            //Check if it's the first number that's the issue
            let firstNumObj = removedFirstNumArrResult(arr[i]);
            let firstNumResult = firstNumObj.pass;

            //If ANY result of removing the current number, previous number, or first number results in FAILS, then break
            if (!currentNumResult && !prevNumResult && !firstNumResult) {
                passesTest = false;
                console.log(`${arr[i]} ${rulesTracker.issue}`);
                continue;
            } else if (currentNumResult) {
                //If removing the current number results in a pass, log the result
                console.log(
                    `${arr[i]} passes if the number ${
                        arr[i][rulesTracker.indexOfCurrentNumber]
                    } at index ${rulesTracker.indexOfCurrentNumber} is removed`
                );
            } else if (prevNumResult) {
                //If removing the previous number results in a pass, log the result
                console.log(
                    `${arr[i]} passes if the number ${
                        arr[i][rulesTracker.indexOfCurrentNumber - 1]
                    } at index ${rulesTracker.indexOfCurrentNumber - 1} is removed`
                );
            } else {
                //If removing the first number results in a pass, log the result
                console.log(`${arr[i]} passes if the number ${arr[i][0]} at index 0 is removed`);
            }
        }
        if (passesTest) {
            counter += 1;
        }
    }
    return counter;
};

//Part 2 answer:
console.log(problemDampener(formattedArray));

/* Edge cases
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
1 4 3 2 1 - pass, remove first number  
1 6 7 8 9 - pass, remove first number 
1 2 3 4 3 - pass, remove last number
9 8 7 6 7 - pass, remove last number 
7 10 8 10 11 - pass - remove second number  
29 28 27 25 26 25 22 20 - pass, remove fourth number
*/
