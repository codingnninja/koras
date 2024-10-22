import { $trigger } from "../../src/render";

describe('$trigger an event handler', function() { 
   it('should throw an error on the server', () => {
        function myFunction() {
            return new Set([1, 3]);   
        }
        expect(
            () => $trigger({myFunction}, '.post', "{name: 'Ayobami'}")
        ).toThrow("You cannot use $trigger on the server");
    });
});