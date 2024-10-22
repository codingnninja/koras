import { $purify, stringify } from "../../src/render";

describe('Convert render prop string to equivalent data type', function() {
    it('should convert to undefined', () => {
        const input = undefined;
        const result = $purify(input);
        expect(result).toBe(input);
    });

    it('should correctly convert to an object', () => {
        const input = {"key": "I am ayo"};
        const result = $purify(input);
        expect(result).toEqual({key: "I am ayo"});
    });

    it('should correctly convert to a nested object', () => {
        const input = { "key": {1:"a"} };
        const result = $purify(input);
        expect(result).toEqual({ key: {1:"a"} });
    });

    it('should correctly convert to a number', () => {
        const input = 7;
        const result = $purify(input);
        expect(result).toEqual(input);
    });

    it('should correctly convert to a function', () => {
        //We don't stringify function because $purify doesn't deal with it.
        function myFunction() {
            return new Set([1, 3]);   
        }

        const result = $purify(myFunction);
        expect(result).toBe(myFunction);
    });

    it('should handle null input correctly', () => {
        const input = null;
        const result = $purify(input);
        expect(result).toBe(input);
    });

    it('should return null in place of NaN', () => {
        const input = NaN;
        const result = $purify(input);
        expect(result).toBe(input);
    });

    it('should correctly convert to an array of objects', () => {
        const input = [{"a":2}, {"b":3}];
        const result = $purify(input);

        expect(result).toEqual([{a:2}, {b:3}]);
    });

    it('should correctly convert to an array of number', () => {
        const input = [1, 2];
        const result = $purify(input);
        expect(result).toEqual([1, 2]);
    });

    it('should return not allowed error when data contain render special characters', () => {
        const input = 'special_string_9s35Ufa7M67wghwT_special';
        const result = $purify(input);
        expect(result).toBe("You're not allowed to use reserved ID (_9s35Ufa7M67wghwT_) in data");
    });

    it('should remove renderIdentity from props', () => {
        const input = '_9s35Ufa7M67wghwT_[{"a":2}, {"b":3}]_9s35Ufa7M67wghwT_';
        const result = $purify(input);
        expect(result).toEqual([{a:2}, {b:3}]);
    });

    it('should convert a stringified boolean to a real boolean', () => {
        const input = 'true';
        const result = $purify(input);
        expect(result).toEqual(true);
    });

    it('should convert a stringified number to a real number', () => {
        const input = '777';
        const result = $purify(input);
        expect(result).toEqual(777);
    });
});