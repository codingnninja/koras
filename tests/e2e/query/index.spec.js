import { $select } from "../../../src/query/index.js";

describe('$select DOM elements and apply action constraints', function() { 
   it('should throw an error on the server', () => {
        expect(
            () => $select(`.post[add|class=hidden]`)
        ).toThrow("You cannot use $select on the server");
    });
});