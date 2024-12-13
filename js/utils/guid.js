/**
 * Generates a random UUID.
 * 
 * @returns Randwom UUID string.
 */
utils.guid = function() {
    return global.crypto.randomUUID();
};