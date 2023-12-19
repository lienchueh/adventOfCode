//Purpose:

//Import the file
const exp = require("constants");
const fs = require("fs");
const input = fs.readFileSync("input.txt").toString().split("\r\n");

//Factorial formula
let factorial = (num) => {
    //If number is less than 0, rehect it
    if (num < 0) {
        return -1;
    }

    //Base case: When the count reaches 0
    else if (num === 0) {
        return 1;
    }

    //Recursive case: if the number is still greater than 0
    else if (num > 0) {
        return num * factorial(num - 1);
    }
};

//Combinatorics formula (how many different possible subsets can be made from the larger set)
//Assumption: For n >= r >= 0 (Binomial coefficient)
const totalPairs = (n, r) => {
    //n is objects
    //r is sample
    //Example: 9 choose 2 (n choose r) would be how many pairs exist if the total number of galaxies is 9
    let numerator = factorial(9);
    let denominator = factorial(r) * factorial(n - r);
    let totalPairings = numerator / denominator;

    return totalPairings;
};

//console.log(totalPairs(9, 2))
//Above would result in 36 pairs

//Checks if a row has at least one galaxy
let checkForGalaxies = (str) => {
    for (let i = 0; i < str.length; i++) {
        let character = str[i];
        if (character === "#") {
            return true;
        }
    }
    return false;
};

//Creates an array of only the columns
const createColumnArray = (arr) => {
    let arrOfColumns = [];
    //Pushes the columns to their own array
    for (let i = 0; i < arr[0].length; i++) {
        let column = [];
        for (let j = 0; j < arr.length; j++) {
            let character = arr[j][i];
            column.push(character);
        }
        arrOfColumns.push(column);
    }
    return arrOfColumns;
};

//Returns the X coordinates of all rows that do not have at least one galaxy in it
let missingRowGalaxy = (arr) => {
    let rowsMissingGalaxies = [];

    for (let i = 0; i < arr.length; i++) {
        let row = arr[i];
        if (!checkForGalaxies(row)) {
            rowsMissingGalaxies.push(i);
        }
    }
    console.log(`The rows missing galaxies are rows ${rowsMissingGalaxies}`);
    return rowsMissingGalaxies;
};

let missingColumnGalaxy = (arr) => {
    //Converts the array into an array of columns
    let columnArr = createColumnArray(arr);
    let columnsMissingGalaxies = [];

    for (let i = 0; i < columnArr.length; i++) {
        let column = columnArr[i];
        if (!checkForGalaxies(column)) {
            columnsMissingGalaxies.push(i);
        }
    }
    console.log(`The columns missing galaxies are columns ${columnsMissingGalaxies}`);
    return columnsMissingGalaxies;
};

//Expand the universe for all rows and columns that do not have any galaxies within them
let expandUniverse = (arr) => {
    let newUniverse = arr;
    let missingRows = missingRowGalaxy(arr);
    let missingColumns = missingColumnGalaxy(arr);
    let rowLength = newUniverse[0].length;

    //Expand rows
    for (let i = missingRows.length; i > 0; i--) {
        newUniverse.splice(missingRows[i - 1], 0, ".".repeat(rowLength));
    }

    //Expand columns
    for (let j = missingColumns.length; j > 0; j--) {
        let columnToInsert = missingColumns[j - 1];

        for (let k = 0; k < newUniverse.length; k++) {
            let replacementRow = newUniverse[k];

            //If insertion of the column is at the beginning
            if (columnToInsert === 0) {
                newUniverse[k] = ".".concat(replacementRow);
            }
            //If insertion of the column is in the middle
            else if (columnToInsert > 0 && columnToInsert !== newUniverse.length - 1) {
                replacementRow =
                    replacementRow.slice(0, columnToInsert) +
                    "." +
                    replacementRow.slice(columnToInsert, replacementRow.length);
                newUniverse[k] = replacementRow;
            }
            //If insertion of the column is at the end
            else {
                newUniverse[k] = replacementRow.concat(".");
            }
        }
    }
    return newUniverse;
};

//Find the coordinates of all the galaxies
const galaxyCoordinates = (arr) => {
    let obj = {};
    let counter = 0;
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i].length; j++) {
            let character = arr[i][j];
            if (character === "#") {
                counter++;
                obj[counter] = {
                    X: j,
                    Y: i,
                };
            }
        }
    }
    return obj;
};

//Calculate the distance between each pair of galaxies
const galaxyDistance = (arr) => {
    let total = 0;

    for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
            //Get current galaxy's coordinates
            let currentGalaxyX = arr[i]["X"];
            let currentGalaxyY = arr[i]["Y"];

            //Get comparison galaxy's coordinates
            let nextGalaxyX = arr[j]["X"];
            let nextGalaxyY = arr[j]["Y"];

            //Calculate the difference between the two galaxies
            let difference =
                Math.abs(currentGalaxyX - nextGalaxyX) + Math.abs(currentGalaxyY - nextGalaxyY);

            //Increment Total with the difference
            total += difference;
        }
    }
    return total;
};

/*Answer:
let expandedUniverse = expandUniverse(input);
let expandedGalaxyCoordinates = Object.values(galaxyCoordinates(expandedUniverse));
console.log(galaxyDistance(expandedGalaxyCoordinates));
*/

//Part 2: Each empty row or column is now one million times larger (i.e. each empty row/column should be replaced with 1,000,000 empty rows/columns)

//Determine how many empty rows and empty columns fall within the bounds of each pair
const galaxyDistanceExpansion = (arr) => {
    let total = 0;

    let missingRows = missingRowGalaxy(arr);
    let missingColumns = missingColumnGalaxy(arr);

    let unmodifiedGalaxyCoordinates = Object.values(galaxyCoordinates(input));

    for (let i = 0; i < unmodifiedGalaxyCoordinates.length; i++) {
        for (let j = i + 1; j < unmodifiedGalaxyCoordinates.length; j++) {
            //Get current galaxy's coordinates
            let currentGalaxyX = unmodifiedGalaxyCoordinates[i]["X"];
            let currentGalaxyY = unmodifiedGalaxyCoordinates[i]["Y"];

            //Get comparison galaxy's coordinates
            let nextGalaxyX = unmodifiedGalaxyCoordinates[j]["X"];
            let nextGalaxyY = unmodifiedGalaxyCoordinates[j]["Y"];

            //Count how many missing columns (X coordinate) fall within the two galaxy's range
            let xExpansionCount = 0;

            for (let k = 0; k < missingColumns.length; k++) {
                let currentMissingColumn = missingColumns[k];

                if (currentGalaxyX < currentMissingColumn && nextGalaxyX > currentMissingColumn) {
                    xExpansionCount++;
                } else if (
                    currentGalaxyX > currentMissingColumn &&
                    nextGalaxyX < currentMissingColumn
                ) {
                    xExpansionCount++;
                }
            }

            //Count how many missing rows (Y coordinate) fall within the two galaxy's range
            let yExpansionCount = 0;

            for (let l = 0; l < missingRows.length; l++) {
                let currentMissingRow = missingRows[l];

                if (currentGalaxyY < currentMissingRow && nextGalaxyY > currentMissingRow) {
                    yExpansionCount++;
                } else if (currentGalaxyY > currentMissingRow && nextGalaxyY < currentMissingRow) {
                    yExpansionCount++;
                }
            }

            //Calculate the difference between the two galaxies
            let difference =
                Math.abs(currentGalaxyX - nextGalaxyX) + Math.abs(currentGalaxyY - nextGalaxyY);

            let expansionDifference = difference;

            if (xExpansionCount > 0 && yExpansionCount > 0) {
                //If both row and columns have space expansions
                expansionDifference =
                    difference -
                    xExpansionCount -
                    yExpansionCount +
                    xExpansionCount * expansionCoefficient +
                    yExpansionCount * expansionCoefficient;
            } else if (xExpansionCount > 0 && yExpansionCount === 0) {
                //If only the columns have space expansion
                {
                    expansionDifference =
                        difference - xExpansionCount + xExpansionCount * expansionCoefficient;
                }
            } else if (xExpansionCount === 0 && yExpansionCount > 0) {
                //If only the rows have space expansion
                {
                    expansionDifference =
                        difference - yExpansionCount + yExpansionCount * expansionCoefficient;
                }
            }

            //Increment Total with the difference
            total += expansionDifference;
        }
    }
    return total;
};

let expansionCoefficient = 1000000; //How many extra rows/columns to substitute for one empty row/column
console.log(galaxyDistanceExpansion(input));
