export declare const BEARING_DIFF_THRESHOLD = 45;
export declare const DISTANCE_WEIGHT = 0.8;
export declare const BEARING_WEIGHT = 0.2;
export interface Coordinates {
    lat: number;
    lng: number;
}
/**
 * Normalizes a value between a minimum and maximum range.
 * @param {number} value - The value to normalize.
 * @param {number} min - The minimum value of the range.
 * @param {number} max - The maximum value of the range.
 * @returns {number} - The normalized value.
 */
export declare const normalize: (min: number, max: number) => (value: number) => number;
/**
 * Converts degrees to radians.
 * @param {number} deg - The value in degrees.
 * @returns {number} - The value in radians.
 */
export declare const deg2rad: (deg: number) => number;
/**
 * Converts radians to degrees.
 * @param {number} rad - The value in radians.
 * @returns {number} - The value in degrees.
 */
export declare const rad2deg: (rad: number) => number;
/**
 * Calculates the distance between two coordinates on Earth.
 * @param {Coordinates} A - first coordinate.
 * @param {Coordinates} B - second coordinate.
 * @returns {number} - The distance between the coordinates in kilometers.
 */
export declare const calculateDistance: (A: Coordinates, B: Coordinates) => number;
/**
 * Calculates the bearing between two coordinates on Earth.
 * @param {Coordinates} A - first coordinate.
 * @param {Coordinates} B - second coordinate.
 * @returns {number} - The bearing between the coordinates in degrees.
 */
export declare const calculateBearing: (A: Coordinates, B: Coordinates) => number;
/**
 * Calculates the difference between two bearings.
 * @param {number} bearing1 - The first bearing in degrees.
 * @param {number} bearing2 - The second bearing in degrees.
 * @returns {number} - The difference between the bearings in degrees.
 */
export declare const calculateBearingDiff: (bearingA: number, bearingB: number) => number;
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
export declare const filterPoints: (start: Coordinates, end: Coordinates, points: Coordinates[], threshold?: number) => Coordinates[];
/**
 * Calculates the minimum and maximum values for distance and bearing difference in an array of points.
 * @param {Coordinates} start - The start coordinate.
 * @param {Coordinates} end - The end coordinate.
 * @param {Coordinates[]} points - The array of coordinates.
 * @returns {object} - An object containing the minimum and maximum values for distance and bearing difference.
 */
export declare const calculateMinMaxValues: (start: Coordinates, end: Coordinates, points: Coordinates[]) => {
    minDistance: number;
    maxDistance: number;
    minBearingDiff: number;
    maxBearingDiff: number;
};
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
export declare const sortPoints: (start: Coordinates, end: Coordinates, points: Coordinates[], distanceWeight?: number, bearingWeight?: number) => Coordinates[];
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
export declare const rankPointsAlongBearing: (start: Coordinates, end: Coordinates, points: Coordinates[], distanceWeight?: number, bearingWeight?: number, threshold?: number) => Coordinates[];
