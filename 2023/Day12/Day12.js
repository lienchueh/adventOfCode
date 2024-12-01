//Purpose: Find the total number of possible combinations

//Import the file
const fs = require("fs");
const input = fs.readFileSync("input.txt").toString().split("\r\n");

//Delimit by space
const delimitBySpace = (arr) => {
    let newArr = [];

    for (let i = 0; i < arr.length; i++) {
        let obj = {};
        let splitStr = arr[i].split(" ");

        //Split off the springs input
        obj["springs"] = splitStr[0];

        //Split off the number of groupSize array
        let groupSize = splitStr[1].split(",");

        //Convert groupSize's elements to number
        for (let j = 0; j < groupSize.length; j++) {
            groupSize[j] = Number(groupSize[j]);
        }

        //Add the groupSize array to the object
        obj["groupSize"] = groupSize;

        newArr.push(obj);
    }
    return newArr;
};

//Swaps first spring with "."
const swapWorkingSpring = (str) => {
    let newStr = "." + str.substring(1);
    return newStr;
};

//Swaps first spring with "?"
const swapBrokenSpring = (str) => {
    let newStr = "#" + str.substring(1);
    return newStr;
};

//Function that handles if the first spring is a "#"
const pound = (springs, groupSize) => {
    let nextGroup = groupSize[0];

    //If the first spring is "#", then the first n characters must be able to be treated as a pound, where n is the first group number
    let thisGroup = springs.substring(0, nextGroup);

    //If there are "?" within thisGroup, replace them with "#"
    thisGroup = thisGroup.replaceAll("?", "#");

    //If the nextGroup can't fit all the damaged springs, then exit
    if (thisGroup !== "#".repeat(nextGroup)) {
        return 0;
    }

    //If the rest of the springs is just the last group, the nwe're done and there's only one possibility
    if (springs.length === nextGroup) {
        //Confirm that this is the last group
        if (groupSize.length === 1) {
            //This is valid
            return 1;
        } else {
            //There are more groups, this doesn't work
            return 0;
        }
    }

    //Make sure the character that follows this group can be a separator "."
    if (springs[nextGroup + 1] === "?" || springs[nextGroup + 1] === ".") {
    }
};

//Recursively analyze the string from left to right. Use recursion to generate your recursions
const springCheck = (springs, groupSize, cache = {}) => {
    //Base case #1: When no more groups are left
    if (groupSize.length === 0) {
        //If there are no more ungrouped damanged springs, this combo is valid
        if (!springs.includes("#")) {
            return 1;
        }
        //There are more damaged springs that haven't been grouped.
        else return 0;
    }
    //Base case #2: There are more groups, but no more springs left
    else if (springs.length === 0) {
        //No more springs left to allocate to groups, therefore, exit
        return 0;
    }

    // Look at the next element in within the springs and groups array
    let nextspring = springs[0];
    let nextGroup = groupSize[0];

    //Recursive case 1: If the springs begin with a "#"
    if (nextspring === "#") {
        //DO SOMETHING
    }
    //Recursive case 2: if the springs begins with a ".", advance to the next available "#" or "?" and recursively check again
    else if (nextspring === ".") {
        return springCheck(springs.substring(1), groupSize, cache);
    }
    //Recursive case 3: If the springs begin with a "?"
    else if (nextspring === "?") {
        //If the next spring begins with a "?"...
        //Sub-variation 1: replace with "." and recursively check again
        let swappedWithWorkingspring = swapWorkingspring(springs);
        springCheck(swappedWithWorkingspring);

        //Sub-variation 2: replace with "#" and recursively check again
    }
};
let str = "???.###";
let groupSize = [1, 1, 3];

//console.log(springCheck(str, groupSize))

console.log("#".repeat(4));
