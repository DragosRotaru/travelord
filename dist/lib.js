"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rankPointsAlongBearing = exports.sortPoints = exports.calculateMinMaxValues = exports.filterPoints = exports.calculateBearingDiff = exports.calculateBearing = exports.calculateDistance = exports.rad2deg = exports.deg2rad = exports.normalize = exports.BEARING_WEIGHT = exports.DISTANCE_WEIGHT = exports.BEARING_DIFF_THRESHOLD = void 0;
exports.BEARING_DIFF_THRESHOLD = 45; // Adjust the bearing difference threshold as per your preference
exports.DISTANCE_WEIGHT = 0.8; // Weight for distance from Start
exports.BEARING_WEIGHT = 0.2; // Weight for bearing difference
/**
 * Normalizes a value between a minimum and maximum range.
 * @param {number} value - The value to normalize.
 * @param {number} min - The minimum value of the range.
 * @param {number} max - The maximum value of the range.
 * @returns {number} - The normalized value.
 */
const normalize = (min, max) => (value) => (value - min) / (max - min);
exports.normalize = normalize;
/**
 * Converts degrees to radians.
 * @param {number} deg - The value in degrees.
 * @returns {number} - The value in radians.
 */
const deg2rad = (deg) => deg * (Math.PI / 180);
exports.deg2rad = deg2rad;
/**
 * Converts radians to degrees.
 * @param {number} rad - The value in radians.
 * @returns {number} - The value in degrees.
 */
const rad2deg = (rad) => (rad * 180) / Math.PI;
exports.rad2deg = rad2deg;
/**
 * Calculates the distance between two coordinates on Earth.
 * @param {Coordinates} A - first coordinate.
 * @param {Coordinates} B - second coordinate.
 * @returns {number} - The distance between the coordinates in kilometers.
 */
const calculateDistance = (A, B) => {
    const R = 6371; // Earth's radius in km
    const dLat = (0, exports.deg2rad)(B.lat - A.lat);
    const dLng = (0, exports.deg2rad)(B.lng - A.lng);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((0, exports.deg2rad)(A.lat)) *
            Math.cos((0, exports.deg2rad)(B.lat)) *
            Math.sin(dLng / 2) *
            Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
};
exports.calculateDistance = calculateDistance;
/**
 * Calculates the bearing between two coordinates on Earth.
 * @param {Coordinates} A - first coordinate.
 * @param {Coordinates} B - second coordinate.
 * @returns {number} - The bearing between the coordinates in degrees.
 */
const calculateBearing = (A, B) => {
    const Δλ = (0, exports.deg2rad)(B.lng - A.lng);
    const φA = (0, exports.deg2rad)(A.lat);
    const φB = (0, exports.deg2rad)(B.lat);
    const y = Math.sin(Δλ) * Math.cos(φB);
    const x = Math.cos(φA) * Math.sin(φB) -
        Math.sin(φA) * Math.cos(φB) * Math.cos(Δλ);
    const bearingRad = Math.atan2(y, x);
    const bearingDeg = (0, exports.rad2deg)(bearingRad);
    // normalize to 0°..360°
    return (bearingDeg + 360) % 360;
};
exports.calculateBearing = calculateBearing;
/**
 * Calculates the difference between two bearings.
 * @param {number} bearing1 - The first bearing in degrees.
 * @param {number} bearing2 - The second bearing in degrees.
 * @returns {number} - The difference between the bearings in degrees.
 */
const calculateBearingDiff = (bearingA, bearingB) => {
    const diff = Math.abs(bearingA - bearingB);
    // If the difference is greater than 180°, the smaller angle is 360° - diff
    return diff > 180 ? 360 - diff : diff;
};
exports.calculateBearingDiff = calculateBearingDiff;
/**
 * Filters an array of coordinates if the bearing difference and distance from start are within a threshold.
 * The bearing difference is calculated between the bearing of the travel path and the bearing of the point.
 * If the distance between start and point is greater than the distance between start and end, the point is filtered out.
 * @param {Coordinates} start - The start coordinate.
 * @param {Coordinates} end - The end coordinate.
 * @param {Coordinates[]} points - The array of coordinates to filter.
 * @param {number[]} threshold - The bearing difference threshold. (default: 45)
 * @returns {Coordinates[]} - The filtered array of coordinates.
 */
const filterPoints = (start, end, points, threshold = exports.BEARING_DIFF_THRESHOLD) => {
    const travelBearing = (0, exports.calculateBearing)(start, end);
    const travelDistance = (0, exports.calculateDistance)(start, end);
    return points.filter((point) => {
        const bearing = (0, exports.calculateBearing)(start, point);
        const bearingDiff = (0, exports.calculateBearingDiff)(bearing, travelBearing);
        const distance = (0, exports.calculateDistance)(start, point);
        return bearingDiff <= threshold && distance <= travelDistance;
    });
};
exports.filterPoints = filterPoints;
/**
 * Calculates the minimum and maximum values for distance and bearing difference in an array of points.
 * @param {Coordinates} start - The start coordinate.
 * @param {Coordinates} end - The end coordinate.
 * @param {Coordinates[]} points - The array of coordinates.
 * @returns {object} - An object containing the minimum and maximum values for distance and bearing difference.
 */
const calculateMinMaxValues = (start, end, points) => {
    let minDistance = Infinity;
    let maxDistance = -Infinity;
    let minBearingDiff = Infinity;
    let maxBearingDiff = -Infinity;
    const travelBearing = (0, exports.calculateBearing)(start, end);
    points.forEach((point) => {
        const bearingDiff = (0, exports.calculateBearingDiff)((0, exports.calculateBearing)(start, point), travelBearing);
        const distanceFromStart = (0, exports.calculateDistance)(start, point);
        if (distanceFromStart < minDistance)
            minDistance = distanceFromStart;
        if (distanceFromStart > maxDistance)
            maxDistance = distanceFromStart;
        if (bearingDiff < minBearingDiff)
            minBearingDiff = bearingDiff;
        if (bearingDiff > maxBearingDiff)
            maxBearingDiff = bearingDiff;
    });
    return {
        minDistance,
        maxDistance,
        minBearingDiff,
        maxBearingDiff,
    };
};
exports.calculateMinMaxValues = calculateMinMaxValues;
/**
 * Sorts an array of coordinates based on their distance from the start coordinates,
 * as well as the bearing difference with the line formed by the start and end coordinates.
 * @param {Coordinates} start - The start coordinate.
 * @param {Coordinates} end - The end coordinate.
 * @param {Coordinates[]} points - The array of coordinates to sort.
 * @param {number} distanceWeight - The weight for distance calculation (default: 0.8).
 * @param {number} bearingWeight - The weight for bearing difference calculation (default: 0.2).
 * @returns {Coordinates[]} - The sorted array of coordinates.
 */
const sortPoints = (start, end, points, distanceWeight = exports.DISTANCE_WEIGHT, bearingWeight = exports.BEARING_WEIGHT) => {
    const { minDistance, maxDistance, minBearingDiff, maxBearingDiff } = (0, exports.calculateMinMaxValues)(start, end, points);
    const travelBearing = (0, exports.calculateBearing)(start, end);
    const normBearing = (0, exports.normalize)(minBearingDiff, maxBearingDiff);
    const normDistance = (0, exports.normalize)(minDistance, maxDistance);
    const score = (point) => {
        const bearingDiff = (0, exports.calculateBearingDiff)((0, exports.calculateBearing)(start, point), travelBearing);
        const distanceFromStart = (0, exports.calculateDistance)(start, point);
        return (distanceWeight * normDistance(distanceFromStart) +
            bearingWeight * normBearing(bearingDiff));
    };
    return points.sort((a, b) => score(a) - score(b));
};
exports.sortPoints = sortPoints;
/**
 * Ranks points along a bearing line based on their distance from the start and end coordinates,
 * as well as the bearing difference with the line formed by the start and end coordinates.
 *
 * @param {Coordinates} start - The start coordinate.
 * @param {Coordinates} end - The end coordinate.
 * @param {Coordinates[]} points - The array of coordinates to sort.
 * @param {number} distanceWeight - The weight for distance calculation (default: 0.8).
 * @param {number} bearingWeight - The weight for bearing difference calculation (default: 0.2).
 * @param {number} threshold - The bearing difference threshold.(default: 45)
 * @returns {Coordinates[]} - The sorted array of coordinates.
 */
const rankPointsAlongBearing = (start, end, points, distanceWeight = exports.DISTANCE_WEIGHT, bearingWeight = exports.BEARING_WEIGHT, threshold = exports.BEARING_DIFF_THRESHOLD) => (0, exports.sortPoints)(start, end, (0, exports.filterPoints)(start, end, points, threshold), distanceWeight, bearingWeight);
exports.rankPointsAlongBearing = rankPointsAlongBearing;
//# sourceMappingURL=lib.js.map