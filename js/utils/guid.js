/**
 * Generates a random UUID.
 * 
 * @returns Randwom UUID string.
 */
ko.materialcomponents.utils.guid = function() {
    return global.crypto.randomUUID();
};