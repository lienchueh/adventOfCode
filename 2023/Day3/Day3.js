//Purpose: Sum up the numbers adjacent to a symbol

//Import the file
const fs = require("fs");
let input = fs.readFileSync("input.txt").toString().split("\r\n");

//Regex expression to test for numbers
function checkString(string) {
    return /^[0-9]*$/.test(string);
}

//Accumulator function
let sumTotal = (arr) => {
    return arr.reduce((accumulator, currentValue) => accumulator + currentValue);
};

//Iterate until a number is found.
let numFind = (arr) => {
    let coordinatesArray = [];
    for (let i = 0; i < arr.length; i++) {
        let xBegin = 0;
        let xEnd = -1;
        let y = 0;
        for (let j = 0; j < arr[i].length; j++) {
            //If the previous x coordinate was NOT a number but the current x coordinate IS a number, then return that number
            if (checkString(arr[i][j]) && !checkString(arr[i][j - 1])) {
                //When a number is found, save the X and Y coordinates.
                xBegin = j;
                y = i;
                let counter = 1;
                //Find x coordinate of the last digit
                if (!checkString(arr[i][j + 1])) {
                    //If single digit, then return the digit
                    xEnd = j;
                } else {
                    //If not single digit, iterate until the last digit is found
                    while (checkString(arr[i][j + counter])) {
                        counter++;
                        xEnd = j + counter - 1;
                    }
                }
                let number = arr[i].slice(xBegin, xEnd + 1);
                coordinatesArray.push([Number(number), xBegin, xEnd, y]);
            }
        }
    }
    console.log(
        `Legend: Number, x Coordinate of first digit, x Coordinate of Last Digit, y Coordinate`
    );
    console.log(coordinatesArray);
    return coordinatesArray;
};

//Part 1: Check the adjacent cells around the number for any symbols. If symbols are present, then save the number to an array
let checkSymbols = (arr) => {
    let coordinatesArray = numFind(arr);
    let sum = 0;
    for (let i = 0; i < coordinatesArray.length; i++) {
        let number = coordinatesArray[i][0];
        let xBegin = coordinatesArray[i][1];
        let xEnd = coordinatesArray[i][2];
        let y = coordinatesArray[i][3];

        //If y coordinate is zero, no need to check the row above
        if (y === 0) {
            //Check current y coordinate row. Left cell of first digit.
            let leftOfFirstDigit = input[y][xBegin - 1];
            if (leftOfFirstDigit !== "." && leftOfFirstDigit !== undefined) {
                sum += number;
            }
            //Check current y coordinate row. Right cell of last digit.
            let rightOfLastDigit = input[y][xEnd + 1];
            if (rightOfLastDigit !== "." && rightOfLastDigit !== undefined) {
                sum += number;
            }
            //Check y coordinate row below.
            let numLength = xEnd - xBegin + 1;
            for (let j = -1; j < numLength + 1; j++) {
                let xCoordinate = [xBegin + j];
                let yCoordinateBelow = [y + 1];
                let cellToCheckBelow = arr[yCoordinateBelow][xCoordinate];

                //Check y coordinate row below.
                if (cellToCheckBelow !== "." && cellToCheckBelow !== undefined) {
                    sum += number;
                    break;
                }
            }
        }
        //If y coordinate is the last row, no need to check the row below
        if (y === arr.length - 1) {
            //Check current y coordinate row. Left cell of first digit.
            let leftOfFirstDigit = input[y][xBegin - 1];
            if (leftOfFirstDigit !== "." && leftOfFirstDigit !== undefined) {
                sum += number;
            }
            //Check current y coordinate row. Right cell of last digit.
            let rightOfLastDigit = input[y][xEnd + 1];
            if (rightOfLastDigit !== "." && rightOfLastDigit !== undefined) {
                sum += number;
            }
            //Check y coordinate row above.
            let numLength = xEnd - xBegin + 1;
            for (let j = -1; j < numLength + 1; j++) {
                let xCoordinate = [xBegin + j];
                let yCoordinateAbove = [y - 1];
                let cellToCheckAbove = arr[yCoordinateAbove][xCoordinate];

                //Check y coordinate row above.
                if (cellToCheckAbove !== "." && cellToCheckAbove !== undefined) {
                    sum += number;
                    break;
                }
            }
        }

        //If y coordinate is not the first or last row, check everything
        if (!(y === arr.length - 1) && !(y === 0)) {
            //Check current y coordinate row. Left cell of first digit.
            let leftOfFirstDigit = input[y][xBegin - 1];
            if (leftOfFirstDigit !== "." && leftOfFirstDigit !== undefined) {
                sum += number;
            }
            //Check current y coordinate row. Right cell of last digit.
            let rightOfLastDigit = input[y][xEnd + 1];
            if (rightOfLastDigit !== "." && rightOfLastDigit !== undefined) {
                sum += number;
            }

            //Check y coordinate row above AND below.
            let numLength = xEnd - xBegin + 1;
            for (let j = -1; j < numLength + 1; j++) {
                let xCoordinate = [xBegin + j];
                let yCoordinateAbove = [y - 1];
                let yCoordinateBelow = [y + 1];
                let cellToCheckAbove = arr[yCoordinateAbove][xCoordinate];
                let cellToCheckBelow = arr[yCoordinateBelow][xCoordinate];

                //Check y coordinate row above.
                if (cellToCheckAbove !== "." && cellToCheckAbove !== undefined) {
                    sum += number;
                    break;
                } else if (cellToCheckBelow !== "." && cellToCheckBelow !== undefined) {
                    //Check y coordinate row below.
                    sum += number;
                    break;
                }
            }
        }
    }
    return sum;
};

//Part II: Find gears and check if there are at least two numbers adjacent to the gear

//Find gears "*"
let gearFind = (arr) => {
    let coordinatesArray = [];
    for (let i = 0; i < arr.length; i++) {
        let x = 0;
        let y = 0;
        for (let j = 0; j < arr[i].length; j++) {
            //If the character is a "*", then save the X and Y coordinates
            if (arr[i][j] === "*") {
                x = j;
                y = i;
                let gear = arr[i][j];
                coordinatesArray.push([gear, x, y]);
            }
        }
    }
    console.log(`Legend: Gear, x Coordinate of gear, y Coordinate of gear`);
    console.log(coordinatesArray);
    return coordinatesArray;
};

//Check if there are EXACTLY two numbers adjacent to the gear
let checkNums = (arr) => {
    //Coordinates of the gears
    let gearsArray = gearFind(arr);
    let sumProduct = 0;
    let numbersToTotal = [];

    for (let i = 0; i < gearsArray.length; i++) {
        //Get the details of the gears
        let gearX = gearsArray[i][1];
        let gearY = gearsArray[i][2];

        //Iterate to find the full length of a number
        let findNumBelowGear = () => {
            let xBegin = 0;
            let xEnd = 0;
            let y = gearY + 1;
            for (let j = 0; j < arr[0].length; j++) {
                let leftCoordinateToCheck = arr[y][gearX - j];
                //Iterate until a number is not found
                if (!checkString(leftCoordinateToCheck)) {
                    //Return the X coordinate of the first digit
                    xBegin = gearX - j + 1;
                    break;
                }
            }
            for (let j = 0; j < arr[0].length; j++) {
                let rightCoordinateToCheck = arr[y][gearX + j];
                //Find the X coordinate of the last digit
                if (!checkString(rightCoordinateToCheck)) {
                    //Return the X coordinate of the last digit
                    xEnd = gearX + j - 1;
                    break;
                }
            }
            //Return the full number
            let number = arr[y].slice(xBegin, xEnd + 1);
            return number;
        };

        let findNumBelowGearLeft = () => {
            let xBegin = 0;
            let xEnd = 0;
            let y = gearY + 1;
            for (let j = 1; j < arr[0].length + 1; j++) {
                let leftCoordinateToCheck = arr[y][gearX - j];
                //Iterate until a number is not found
                if (!checkString(leftCoordinateToCheck)) {
                    //Return the X coordinate of the first digit
                    xBegin = gearX - j + 1;
                    break;
                }
            }
            for (let j = 0; j < arr[0].length; j++) {
                let rightCoordinateToCheck = arr[y][gearX + j];
                //Find the X coordinate of the last digit
                if (!checkString(rightCoordinateToCheck)) {
                    //Return the X coordinate of the last digit
                    xEnd = gearX + j - 1;
                    break;
                }
            }
            //Return the full number
            let number = arr[y].slice(xBegin, xEnd + 1);
            return number;
        };

        let findNumBelowGearRight = () => {
            let xBegin = 0;
            let xEnd = 0;
            let y = gearY + 1;
            for (let j = 0; j < arr[0].length; j++) {
                let leftCoordinateToCheck = arr[y][gearX - j];
                //Iterate until a number is not found
                if (!checkString(leftCoordinateToCheck)) {
                    //Return the X coordinate of the first digit
                    xBegin = gearX - j + 1;
                    break;
                }
            }
            for (let j = 1; j <= arr[0].length + 1; j++) {
                let rightCoordinateToCheck = arr[y][gearX + j];
                //Find the X coordinate of the last digit
                if (!checkString(rightCoordinateToCheck)) {
                    //Return the X coordinate of the last digit
                    xEnd = gearX + j - 1;
                    break;
                }
            }
            //Return the full number
            let number = arr[y].slice(xBegin, xEnd + 1);
            return number;
        };

        let findNumAboveGear = () => {
            let xBegin = 0;
            let xEnd = 0;
            let y = gearY - 1;
            for (let j = 0; j < arr[0].length; j++) {
                let leftCoordinateToCheck = arr[y][gearX - j];
                //Iterate until a number is not found
                if (!checkString(leftCoordinateToCheck)) {
                    //Return the X coordinate of the first digit
                    xBegin = gearX - j + 1;
                    break;
                }
            }
            for (let j = 0; j < arr[0].length; j++) {
                let rightCoordinateToCheck = arr[y][gearX + j];
                //Find the X coordinate of the last digit
                if (!checkString(rightCoordinateToCheck)) {
                    //Return the X coordinate of the last digit
                    xEnd = gearX + j - 1;
                    break;
                }
            }
            //Return the full number
            let number = arr[y].slice(xBegin, xEnd + 1);
            return number;
        };

        let findNumAboveGearLeft = () => {
            let xBegin = 0;
            let xEnd = 0;
            let y = gearY - 1;
            for (let j = 1; j < arr[0].length + 1; j++) {
                let leftCoordinateToCheck = arr[y][gearX - j];
                //Iterate until a number is not found
                if (!checkString(leftCoordinateToCheck)) {
                    //Return the X coordinate of the first digit
                    xBegin = gearX - j + 1;
                    break;
                }
            }
            for (let j = 0; j < arr[0].length; j++) {
                let rightCoordinateToCheck = arr[y][gearX + j];
                //Find the X coordinate of the last digit
                if (!checkString(rightCoordinateToCheck)) {
                    //Return the X coordinate of the last digit
                    xEnd = gearX + j - 1;
                    break;
                }
            }
            //Return the full number
            let number = arr[y].slice(xBegin, xEnd + 1);
            return number;
        };

        let findNumAboveGearRight = () => {
            let xBegin = 0;
            let xEnd = 0;
            let y = gearY - 1;
            for (let j = 0; j < arr[0].length; j++) {
                let leftCoordinateToCheck = arr[y][gearX - j];
                //Iterate until a number is not found
                if (!checkString(leftCoordinateToCheck)) {
                    //Return the X coordinate of the first digit
                    xBegin = gearX - j + 1;
                    break;
                }
            }
            for (let j = 1; j < arr[0].length + 1; j++) {
                let rightCoordinateToCheck = arr[y][gearX + j];
                //Find the X coordinate of the last digit
                if (!checkString(rightCoordinateToCheck)) {
                    //Return the X coordinate of the last digit
                    xEnd = gearX + j - 1;
                    break;
                }
            }
            //Return the full number
            let number = arr[y].slice(xBegin, xEnd + 1);
            return number;
        };

        let findNumRightOfGear = () => {
            //Given that the beginning digit is to the immediate right of the gear, we know what xBegin is and just need to find the X coordinate of the last digit
            let xBegin = gearX + 1;
            let xEnd = 0;
            for (let j = 2; j < arr[0].length + 2; j++) {
                //Iterate until a number is not found
                //j begins at two to begin checking the character AFTER the first digit
                if (!checkString(arr[gearY][gearX + j])) {
                    //Return the X coordinate of the last digit
                    xEnd = gearX + j - 1;
                    break;
                }
            }
            //Return the full number
            let number = arr[gearY].slice(xBegin, xEnd + 1);
            return number;
        };

        let findNumLeftOfGear = () => {
            //Given that the last digit is to the immediate left of the gear, we know what xEnd is and just need to find the X coordinate of the first digit
            let xBegin = 0;
            let xEnd = gearX - 1;
            for (let j = 2; j < arr[0].length + 2; j++) {
                //Iterate until a number is not found
                //j begins at two to begin checking the character BEFORE the last digit
                let characterToCheck = arr[gearY][gearX - j];
                if (!checkString(characterToCheck)) {
                    //Return the X coordinate of the last digit
                    xBegin = gearX - j + 1;
                    break;
                }
            }
            //Return the full number
            let number = arr[gearY].slice(xBegin, xEnd + 1);
            return number;
        };

        //If y coordinate is zero, no need to check the row above
        if (gearY === 0) {
            //Counter will tally the number of numbers adjacent to the "*" gear
            let counter = 0;
            let product = 0;
            let adjNumbers = [];

            //Check current y coordinate row. Left cell of first digit.
            let leftOfFirstGear = arr[gearY][gearX - 1];
            if (checkString(leftOfFirstGear)) {
                counter++;
                adjNumbers.push(findNumLeftOfGear());
            }

            //Check current y coordinate row. Right cell of last digit.
            let rightOfLastGear = arr[gearY][gearX + 1];
            if (checkString(rightOfLastGear)) {
                counter++;
                adjNumbers.push(findNumRightOfGear());
            }

            //Check y coordinate row below
            for (let k = -1; k <= 1; k++) {
                //k <= 1 since only 3 characters needs to be checked under the one character * gear
                let xCoordinate = [gearX + k];
                let yCoordinateBelow = [gearY + 1];
                let cellToCheckBelow = arr[yCoordinateBelow][xCoordinate];

                if (checkString(cellToCheckBelow) && k === -1) {
                    counter++;
                    adjNumbers.push(findNumBelowGearLeft());
                }

                if (checkString(cellToCheckBelow) && k === 0) {
                    counter++;
                    adjNumbers.push(findNumBelowGear());
                }

                if (checkString(cellToCheckBelow) && k === 1) {
                    counter++;
                    adjNumbers.push(findNumBelowGearRight());
                }
            }

            //If there is EXACTLY two numbers adjacent to the gear, then take the sum product of those two numbers
            if (counter === 2) {
                console.log(
                    `The first adjacent number is ${adjNumbers[0]}. The second adjacent number is ${adjNumbers[1]}`
                );
                console.log(adjNumbers);
                product = adjNumbers[0] * adjNumbers[1];
                numbersToTotal.push(product);
            }
        }

        //If y coordinate is the last row, no need to check the row below
        if (gearY === arr.length - 1) {
            //Counter will tally the number of numbers adjacent to the "*" gear
            let counter = 0;
            let product = 0;
            let adjNumbers = [];

            //Check current y coordinate row. Left cell of first digit.
            let leftOfFirstGear = arr[gearY][gearX - 1];
            if (checkString(leftOfFirstGear)) {
                counter++;
                adjNumbers.push(findNumLeftOfGear());
            }

            //Check current y coordinate row. Right cell of last digit.
            let rightOfLastGear = arr[gearY][gearX + 1];
            if (checkString(rightOfLastGear)) {
                counter++;
                adjNumbers.push(findNumRightOfGear());
            }

            //Check y coordinate row above
            for (let k = -1; k <= 1; k++) {
                //k <= 1 since only 3 characters needs to be checked under the one character * gear
                let xCoordinate = [gearX + k];
                let yCoordinateAbove = [gearY - 1];
                let cellToCheckAbove = arr[yCoordinateAbove][xCoordinate];

                if (checkString(cellToCheckAbove) && k === -1) {
                    counter++;
                    adjNumbers.push(findNumAboveGearLeft());
                }

                if (checkString(cellToCheckAbove) && k === 0) {
                    counter++;
                    adjNumbers.push(findNumAboveGear());
                }

                if (checkString(cellToCheckAbove) && k === 1) {
                    counter++;
                    adjNumbers.push(findNumAboveGearRight());
                }
            }

            //If there is EXACTLY two numbers adjacent to the gear, then take the sum product of those two numbers
            if (counter === 2) {
                console.log(
                    `The first adjacent number is ${adjNumbers[0]}. The second adjacent number is ${adjNumbers[1]}`
                );
                console.log(adjNumbers);
                product = adjNumbers[0] * adjNumbers[1];
                numbersToTotal.push(product);
            }
        }

        //If y coordinate is NOT the last or first row, check everything
        if (!(gearY == arr.length - 1) && !(gearY == 0)) {
            //Counter will tally the number of numbers adjacent to the "*" gear
            let counter = 0;
            let product = 0;
            let adjNumbers = [];

            //Check current y coordinate row. Left cell of first digit.
            let leftOfFirstGear = arr[gearY][gearX - 1];
            if (checkString(leftOfFirstGear)) {
                counter++;
                adjNumbers.push(findNumLeftOfGear());
            }

            //Check current y coordinate row. Right cell of last digit.
            let rightOfLastGear = arr[gearY][gearX + 1];
            if (checkString(rightOfLastGear)) {
                counter++;
                adjNumbers.push(findNumRightOfGear());
            }

            //Check y coordinate row above
            for (let k = -1; k <= 1; k++) {
                //k <= 1 since only 3 characters needs to be checked under the one character * gear
                let xCoordinate = [gearX + k];
                let yCoordinateAbove = [gearY - 1];
                let cellToCheckAbove = arr[yCoordinateAbove][xCoordinate];

                if (checkString(cellToCheckAbove) && k === -1) {
                    counter++;
                    adjNumbers.push(findNumAboveGearLeft());
                    if (
                        arr[yCoordinateAbove][gearX + k + 1] === "." &&
                        checkString(arr[yCoordinateAbove][gearX + k + 2])
                    ) {
                        counter++;
                        adjNumbers.push(findNumAboveGearRight());
                    }
                    break;
                }

                if (checkString(cellToCheckAbove) && k === 0) {
                    counter++;
                    adjNumbers.push(findNumAboveGear());
                    break;
                }

                if (checkString(cellToCheckAbove) && k === 1) {
                    counter++;
                    adjNumbers.push(findNumAboveGearRight());
                    break;
                }
            }

            //Check y coordinate row below
            for (let k = -1; k <= 1; k++) {
                //k <= 1 since only 3 characters needs to be checked under the one character * gear
                let xCoordinate = [gearX + k];
                let yCoordinateBelow = [gearY + 1];
                let cellToCheckBelow = arr[yCoordinateBelow][xCoordinate];

                if (checkString(cellToCheckBelow) && k === -1) {
                    counter++;
                    adjNumbers.push(findNumBelowGearLeft());
                    if (
                        arr[yCoordinateBelow][gearX + k + 1] === "." &&
                        checkString(arr[yCoordinateBelow][gearX + k + 2])
                    ) {
                        counter++;
                        adjNumbers.push(findNumBelowGearRight());
                    }
                    break;
                }

                if (checkString(cellToCheckBelow) && k === 0) {
                    counter++;
                    adjNumbers.push(findNumBelowGear());
                    break;
                }

                if (checkString(cellToCheckBelow) && k === 1) {
                    counter++;
                    adjNumbers.push(findNumBelowGearRight());
                    break;
                }
            }

            //If there is EXACTLY two numbers adjacent to the gear, then take the sum product of those two numbers
            if (counter === 2) {
                console.log(adjNumbers);
                product = adjNumbers[0] * adjNumbers[1];
                numbersToTotal.push(product);
            }
        }
    }
    sumProduct = sumTotal(numbersToTotal);
    return sumProduct;
};

console.log(checkNums(input));
