import { $register } from "../../src/render";
describe('Register only functions to the global scope', function() {

    it('should register a single function to the global scope', () => {
        function testFunction() {
          return 'test';
        }
        $register(testFunction);
        expect(globalThis.testFunction).toBeDefined();
        expect(globalThis.testFunction()).toBe('test');
    });

    it('should throw error when non-function argument is passed', () => {
        expect(() => {
          $register(123);
        }).toThrow('Only function is expected');
    });

    it('should register multiple functions to the global scope', () => {
        function testFunction1() {
          return 'test1';
        }
        function testFunction2() {
          return 'test2';
        }
        $register(testFunction1, testFunction2);
        expect(globalThis.testFunction1).toBeDefined();
        expect(globalThis.testFunction2).toBeDefined();
        expect(globalThis.testFunction1()).toBe('test1');
        expect(globalThis.testFunction2()).toBe('test2');
    });

    it('should return globalThis after successful registration', () => {
        function testFunction() {
          return 'test';
        }
        const result = $register(testFunction);
        expect(result).toBe(globalThis);
    });
});