#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const process_1 = require("process");
const lib_1 = require("./lib");
commander_1.program
    .name("travelord")
    .version("0.1.0")
    .description("CLI tool to rank points along a bearing line")
    .requiredOption("-i, --input <file>", "Input JSON file containing points data")
    .requiredOption("-s, --start <coordinates>", "Start coordinate in the format lat,lng")
    .requiredOption("-e, --end <coordinates>", "End coordinate in the format lat,lng")
    .option("-dw, --distance-weight <value>", `Weight for distance calculation (default: ${lib_1.DISTANCE_WEIGHT})`, parseFloat)
    .option("-bw, --bearing-weight <value>", `Weight for bearing difference calculation (default: ${lib_1.BEARING_WEIGHT})`, parseFloat)
    .option("-t, --threshold <value>", `Bearing difference threshold (default: ${lib_1.BEARING_DIFF_THRESHOLD})`, parseFloat)
    .option("-o, --output <file>", "Output file to store the sorted data")
    .parse();
const options = commander_1.program.opts();
// Load input data from the JSON file
const inputFile = path_1.default.resolve(options["input"]);
const points = JSON.parse(fs_1.default.readFileSync(inputFile, "utf8"));
const distanceWeight = options["distanceWeight"] || lib_1.DISTANCE_WEIGHT;
const bearingWeight = options["bearingWeight"] || lib_1.BEARING_WEIGHT;
const threshold = options["threshold"] || lib_1.BEARING_DIFF_THRESHOLD;
// Extract start and end coordinates from the provided flags
const [startLat, startLng] = options["start"].split(",").map(parseFloat);
const [endLat, endLng] = options["end"].split(",").map(parseFloat);
const start = { lat: startLat, lng: startLng };
const end = { lat: endLat, lng: endLng };
// Call the rankPointsAlongBearing function with the provided data
const rankedPoints = (0, lib_1.rankPointsAlongBearing)(start, end, points, distanceWeight, bearingWeight, threshold);
// Write the sorted points to the output file if specified
if (options["output"]) {
    const outputFile = path_1.default.resolve(options["output"]);
    fs_1.default.writeFileSync(outputFile, JSON.stringify(rankedPoints, null, 2));
    console.log(`data written to ${outputFile}`);
    console.log(`length was ${points.length}, now is ${rankedPoints.length}`);
}
else {
    // Output the sorted points to the console
    console.log(JSON.stringify(rankedPoints));
}
(0, process_1.exit)(0);
//# sourceMappingURL=cli.js.map