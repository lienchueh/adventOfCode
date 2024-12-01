//Purpose: Find the lowest location number

/*Example: 
Destination Source Range
50 98 2
*/

//Import the file
const fs = require("fs");
let input = fs.readFileSync("input.txt").toString().split("\r\n\r\n");

//Function that delimits by space
let delimitBySpace = (arr) => {
    let newArr = arr;
    for (let i = 0; i < newArr.length; i++) {
        newArr[i] = newArr[i].split(" ");
    }
    return newArr;
};

//Create seeds array
let seedsArr = (arr) => {
    let mapsArrays = arr[0];
    let newArr = [];

    newArr = mapsArrays.split(": ");
    newArr = newArr[1];
    newArr = newArr.split(" ");

    //Convert to number
    for (let i = 0; i < newArr.length; i++) {
        newArr[i] = Number(newArr[i]);
    }
    return newArr;
};

//Separate out the maps
let mapsArr = (arr) => {
    let mapsArrays = arr.slice(1, arr.length);
    let newArr = [];
    //Separate out the "\r\n"
    for (let i = 0; i < mapsArrays.length; i++) {
        newArr.push(mapsArrays[i].split("\r\n"));
    }

    //Remove the letters from the array
    for (let i = 0; i < newArr.length; i++) {
        for (let j = 0; j < newArr[i].length; j++) {
            let length = newArr[i].length;
            if (j === length - 1) {
                newArr[i] = newArr[i].slice(0, length - 1);
                break;
            }
            newArr[i][j] = newArr[i][j + 1];
        }
    }
    return newArr;
};

//Put each map array into an object
let convertArrToObj = (arr) => {
    let formattedArr = mapsArr(input);

    for (let i = 0; i < formattedArr.length; i++) {
        //Delimit by space
        let tempArr = delimitBySpace(formattedArr[i]);

        for (let j = 0; j < formattedArr[i].length; j++) {
            let obj = { destination: 0, source: 0, range: 0, match: false };
            obj.destination = Number(tempArr[j][0]);
            obj.source = Number(tempArr[j][1]);
            obj.range = Number(tempArr[j][2]);
            formattedArr[i][j] = obj;
        }
    }
    return formattedArr;
};

//Checks for the location of the corresponding seedsArr
let locationFinder = (arr) => {
    let seedsArray = seedsArr(arr);
    let mapsArr = convertArrToObj(arr);

    //Iterate over the maps array to mutate the location of the seeds
    for (let i = 0; i < mapsArr.length; i++) {
        //Loop through each map

        for (let j = 0; j < seedsArray.length; j++) {
            //Loop through each seed
            for (let k = 0; k < mapsArr[i].length; k++) {
                //Loop through each coordinate within the map
                //Lower limit is SOURCE
                let lowerLimit = mapsArr[i][k].source;
                //Upper limit is SOURCE + RANGE
                let upperLimit = lowerLimit + mapsArr[i][k].range;

                //Current seed
                let currentSeed = seedsArray[j];

                //Difference between Source and current seed Location
                let locationDifference = currentSeed - lowerLimit;

                if (currentSeed >= lowerLimit && currentSeed <= upperLimit) {
                    seedsArray[j] = mapsArr[i][k].destination + locationDifference;
                    break;
                }
            }
        }
    }
    return seedsArray;
};

//Find the smallest number within the array
let lowestLocation = (arr) => {
    let seedsArray = locationFinder(arr);
    let counter = 0;
    for (let i = 0; i < seedsArray.length; i++) {
        if (i === 0) {
            counter += seedsArray[i];
        }
        if (seedsArray[i] < counter) {
            counter = seedsArray[i];
        }
    }
    return counter;
};

//Part II Seeds array is actually a range (first number is start location, second number is the range)

//Create the array of seeds that will need to be checked for locations
let seedsArrRange = (arr) => {
    let seedPairs = seedsArr(arr);
    let seedsArray = [];

    for (let i = 0; i < seedPairs.length; i += 2) {
        //Convert each pair to the range of beginning seed locations
        let seedRange = [];

        for (let j = 0; j < seedPairs[i + 1]; j++) {
            let nextSeed = seedPairs[i] + j;
            seedRange.push(nextSeed);
        }

        seedsArray.push(seedRange);
    }
    return seedsArray;
};

//Checks for the location of the corresponding seedsArr
let locationFinderRange = (arr) => {
    let seedsArray = seedsArrRange(arr);
    let mapsArr = convertArrToObj(arr);

    //Iterate over the maps array to mutate the location of the seeds
    for (let i = 0; i < mapsArr.length; i++) {
        //Loop through each map

        for (let j = 0; j < seedsArray.length; j++) {
            //Loop through each seed array
            for (let l = 0; l < seedsArray[j].length; l++) {
                //Loop through the seed's range
                for (let k = 0; k < mapsArr[i].length; k++) {
                    //Loop through each coordinate within the map
                    //Lower limit is SOURCE
                    let lowerLimit = mapsArr[i][k].source;
                    //Upper limit is SOURCE + RANGE
                    let upperLimit = lowerLimit + mapsArr[i][k].range;

                    //Current seed
                    let currentSeed = seedsArray[j][l];

                    //Difference between Source and current seed Location
                    let locationDifference = currentSeed - lowerLimit;

                    if (currentSeed >= lowerLimit && currentSeed <= upperLimit) {
                        seedsArray[j][l] = mapsArr[i][k].destination + locationDifference;
                        break;
                    }
                }
            }
        }
    }
    return seedsArray;
};

//Find the smallest number within the array
let lowestLocationRange = (arr) => {
    let seedsArray = locationFinderRange(arr);
    let counter = Infinity;
    for (let i = 0; i < seedsArray.length; i++) {
        for (let j = 0; j < seedsArray[i].length; j++) {
            if (seedsArray[i][j] < counter) {
                counter = seedsArray[i][j];
            }
        }
    }
    return counter;
};

//Part II Attempt #2 (The above attempt uses too much memory)

//Modify the seeds array into an object
let seedsArrObj = (arr) => {
    let seedsArray = seedsArrRange(arr);
    let newSeedsArr = [];
    for (let i = 0; i < seedsArray.length; i++) {
        let seedObj = {};
        seedObj.location = seedsArray[i][0];
        seedObj.range = seedsArray[i][seedsArray[i].length - 1] - seedsArray[i][0] + 1;
        seedObj.matchType = "";
        newSeedsArr.push(seedObj);
    }

    return newSeedsArr;
};

//Modify the seeds array into pairs
let seedsArrPairs = (arr) => {
    let seedsArray = seedsArr(arr);
    let newSeedsArr = [];

    for (let i = 0; i < seedsArray.length; i += 2) {
        let tempArr = [];
        tempArr.push(seedsArray[i], seedsArray[i + 1]);
        newSeedsArr.push(tempArr);
    }
    return newSeedsArr;
};

//Filters through an array and returns only objects that has the "Match" property set to "True"
function filterByMatch(arr) {
    return arr.filter((item) => item.match === true);
}

//Create a compare function for use in the source function
function compareBySource(a, b) {
    return a.source - b.source;
}

function sortBySource(arr) {
    return arr.sort(compareBySource);
}

let mapMatchesNew = (arr) => {
    let mapsArr = convertArrToObj(arr);
    let seedsArrayPairs = seedsArrPairs(input);

    //Step 1: Iterate over the maps array and FILTER for the maps whose range overlaps with the seed locations
    for (let i = 0; i < mapsArr.length; i++) {
        //console.log(`Step ${i} has array pairs of `);
        //console.log(seedsArrayPairs);

        for (let j = 0; j < mapsArr[i].length; j++) {
            //Map Entry lower limit is SOURCE
            let mapEntryLowerLimit = mapsArr[i][j]["source"];

            //Map Entry upper limit is SOURCE + RANGE
            let mapEntryUpperLimit = mapEntryLowerLimit + mapsArr[i][j]["range"];

            for (let k = 0; k < seedsArrayPairs.length; k++) {
                //Seed lower range
                let seedLowerLimit = seedsArrayPairs[k][0];
                //Seed location upper range
                let seedUpperLimit = seedLowerLimit + seedsArrayPairs[k][1];

                //Case 1: Partial overlap. Map overlaps at tail end of seed range
                if (
                    mapEntryLowerLimit > seedLowerLimit && //Lower bound check
                    seedUpperLimit <= mapEntryUpperLimit && //Upper bound check
                    seedUpperLimit - mapEntryLowerLimit > 0
                ) {
                    mapsArr[i][j].match = true;
                }

                //Case 2: Partial overlap. Map overlaps at front end of seed range
                if (
                    mapEntryLowerLimit < seedLowerLimit &&
                    seedUpperLimit >= mapEntryUpperLimit &&
                    mapEntryUpperLimit - seedLowerLimit > 0
                ) {
                    mapsArr[i][j].match = true;
                }

                //Case 3: Complete overlap. Map range is larger than seed range.
                if (
                    mapEntryLowerLimit < seedLowerLimit &&
                    mapEntryUpperLimit > seedUpperLimit &&
                    (seedLowerLimit - mapEntryLowerLimit > 0 ||
                        mapEntryUpperLimit - seedUpperLimit > 0)
                ) {
                    mapsArr[i][j].match = true;
                }

                //Case 4: Complete overlap. Map range is smaller than seed range.
                if (
                    mapEntryLowerLimit > seedLowerLimit &&
                    mapEntryUpperLimit < seedUpperLimit &&
                    (mapEntryLowerLimit - seedLowerLimit > 0 ||
                        seedUpperLimit - mapEntryUpperLimit > 0)
                ) {
                    mapsArr[i][j].match = true;
                }
            }
        }
        //Filter within the map for only entries that has the value of "True" for the "Match" property key
        mapsArr[i] = filterByMatch(mapsArr[i]);

        //Step 2: Sort the maps by SOURCE (sort so that you can always go left to right to determine where your ranges begin and end)
        mapsArr[i] = sortBySource(mapsArr[i]);

        /*Step 3: Push the newly separated seed ranges into a new array (The separated ranges are based upon the filtering from step #3)
        - Make sure you're aware of where your seed range STARTS and ENDS --> And make sure you note where your map ranges begins and ends
        */
        for (let j = 0; j < mapsArr[i].length; j++) {
            //Map Entry lower limit is SOURCE
            let mapEntryLowerLimit = mapsArr[i][j]["source"];

            //Map Entry upper limit is SOURCE + RANGE
            let mapEntryUpperLimit = mapEntryLowerLimit + mapsArr[i][j]["range"];

            let newSeedsArrayPairs = [];

            for (let k = 0; k < seedsArrayPairs.length; k++) {
                let nonOverlapArr = [];
                let overlapArr = [];

                //Check if the seed location has a third value, then it's already been updated and should be ignored
                let seedUpdatedFlag = seedsArrayPairs[k][2];

                if (seedUpdatedFlag === undefined || seedUpdatedFlag === false) {
                    //Seed lower range
                    let seedLowerLimit = seedsArrayPairs[k][0];
                    //Seed location upper range
                    let seedUpperLimit = seedLowerLimit + seedsArrayPairs[k][1];

                    //Calculate the difference between SOURCE and LOCATION
                    let locationSourceDiff = mapsArr[i][j]["destination"] - mapsArr[i][j]["source"];

                    //Case 1: Partial overlap. Map overlaps at tail end of seed range
                    if (
                        mapEntryLowerLimit > seedLowerLimit && //Lower bound check
                        seedUpperLimit < mapEntryUpperLimit && //Upper bound check
                        seedUpperLimit - mapEntryLowerLimit > 0
                    ) {
                        //Calculate the distance between the Seed's lower range and the beginning index of the map's overlap
                        let nonOverlapRange = mapEntryLowerLimit - seedLowerLimit;

                        //Calculate the distance between the beginning index of the map's overlap range and the end of the seed's upper range
                        let overlapRange = seedUpperLimit - mapEntryLowerLimit;

                        //Push the non-overlap range (First seed location up to beginning of overlapping map location)
                        nonOverlapArr.push(seedLowerLimit, nonOverlapRange);
                        newSeedsArrayPairs.push(nonOverlapArr);

                        //Push the overlap range (Beginning of overlapping map location to last Seed location)
                        overlapArr.push(
                            mapEntryLowerLimit + locationSourceDiff,
                            overlapRange,
                            true
                        );
                        //Set seedUpdatedFlag to be true
                        seedsArrayPairs[k][2] = true;

                        newSeedsArrayPairs.push(overlapArr);
                    }

                    //Case 2: Partial overlap. Map overlaps at front end of seed range
                    if (
                        mapEntryLowerLimit < seedLowerLimit &&
                        seedUpperLimit > mapEntryUpperLimit &&
                        mapEntryUpperLimit - seedLowerLimit > 0
                    ) {
                        //Calculate the distance between the seed's upper end and the map's upper end
                        let nonOverlapRange = seedUpperLimit - mapEntryUpperLimit;

                        //Calculate the distance between map's upper end and the seed's lower range
                        let overlapRange = mapEntryUpperLimit - seedLowerLimit;

                        //Push the non-overlap range (Map's upper limit to seed's upper limit)
                        nonOverlapArr.push(mapEntryUpperLimit, nonOverlapRange);
                        newSeedsArrayPairs.push(nonOverlapArr);

                        //Push the overlap range (Seed's lower limit to map's upper limit)
                        overlapArr.push(seedLowerLimit + locationSourceDiff, overlapRange, true);
                        newSeedsArrayPairs.push(overlapArr);

                        //Set seedUpdatedFlag to be true
                        seedsArrayPairs[k][2] = true;
                    }

                    //Case 3: Complete overlap. Map range is larger than seed range.
                    if (
                        mapEntryLowerLimit <= seedLowerLimit &&
                        mapEntryUpperLimit >= seedUpperLimit &&
                        (seedLowerLimit - mapEntryLowerLimit > 0 ||
                            mapEntryUpperLimit - seedUpperLimit > 0)
                    ) {
                        //Calculate the distance between seed's lower end to the seed's upper range
                        let overlapRange = seedUpperLimit - seedLowerLimit;

                        //Push the overlap range (Seed's lower limit to seed's upper limit)
                        overlapArr.push(seedLowerLimit + locationSourceDiff, overlapRange, true);

                        //Set seedUpdatedFlag to be true
                        seedsArrayPairs[k][2] = true;

                        newSeedsArrayPairs.push(overlapArr);
                    }
                    //Case 4: Complete overlap. Map range is smaller than seed range.
                    if (
                        mapEntryLowerLimit >= seedLowerLimit &&
                        mapEntryUpperLimit <= seedUpperLimit &&
                        (mapEntryLowerLimit - seedLowerLimit > 0 ||
                            seedUpperLimit - mapEntryUpperLimit > 0)
                    ) {
                        //Calculate the distance between the seed's upper end and the map's upper end
                        let nonOverlapRangeFront = mapEntryLowerLimit - seedLowerLimit;
                        let nonOverlapRangeBack = seedUpperLimit - mapEntryUpperLimit;

                        //Calculate the distance between map's upper end and the seed's lower range
                        let overlapRange = mapEntryUpperLimit - mapEntryLowerLimit;

                        //Step 4: Convert the results from Step #3 from the SOURCE to the LOCATION
                        //Push the non-overlap range FRONT (Seed's lower limit to map's lower limit)
                        if (nonOverlapRangeFront > 0) {
                            nonOverlapArr.push(seedLowerLimit, nonOverlapRangeFront);
                            newSeedsArrayPairs.push(nonOverlapArr);
                            nonOverlapArr = [];
                        }
                        //Push the non-overlap range BACK (Map's upper limit to seed's upper limit)
                        if (nonOverlapRangeBack > 0) {
                            nonOverlapArr.push(mapEntryUpperLimit, nonOverlapRangeBack);
                            newSeedsArrayPairs.push(nonOverlapArr);
                        }

                        //Push the overlap range (Map's lower limit to map's upper limit)
                        overlapArr.push(
                            mapEntryLowerLimit + locationSourceDiff,
                            overlapRange,
                            true
                        );
                        //Set seedUpdatedFlag to be true
                        seedsArrayPairs[k][2] = true;

                        newSeedsArrayPairs.push(overlapArr);
                    } // Case 5: No overlap anywhere
                    if (
                        (seedLowerLimit > mapEntryLowerLimit &&
                            seedLowerLimit > mapEntryUpperLimit) ||
                        (seedUpperLimit < mapEntryLowerLimit && seedUpperLimit < mapEntryUpperLimit)
                    ) {
                        //If no matches to the above, then return the same array pair
                        nonOverlapArr.push(seedLowerLimit, seedsArrayPairs[k][1]);
                        newSeedsArrayPairs.push(nonOverlapArr);
                    }
                } else {
                    newSeedsArrayPairs.push(seedsArrayPairs[k]);
                }
            }
            //Mutate the seedsArrayPairs with the new locations
            seedsArrayPairs = newSeedsArrayPairs;
        }
        //Reset seedArrayPairs to be "False" for seedUpdatedFlag checker
        seedsArrayPairs = resetToFalse(seedsArrayPairs);
    }
    //console.log(`Step 7 has array pairs of `);
    return seedsArrayPairs;
};

let resetToFalse = (arr) => {
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i].length; j++) {
            if (arr[i][j] === true) {
                arr[i][j] = false;
            }
        }
    }
    return arr;
};

//Remove third element from array
let removeFalse = (arr) => {
    let array = mapMatchesNew(arr);
    for (let i = 0; i < array.length; i++) {
        array[i] = array[i].slice(0, 2);
    }
    return array;
};

//Find the smallest location
let smallestLocation = (arr) => {
    let array = removeFalse(arr);
    let counter = Infinity;
    for (let i = 0; i < array.length; i++) {
        if (array[i][0] < counter) {
            counter = array[i][0];
        }
    }
    return counter;
};

console.log(smallestLocation(input));
