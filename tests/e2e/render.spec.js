import { $render, $register } from "../../src/render";
describe('Render a component', function() {
  it('should render a component when the component name starts with an uppercase letter', async () => {
      const MyComponent = function (props) {
        return `<div>Hello, ${props.name}!</div>`;
      };

      $register(MyComponent);
      const props = { name: 'John' };
      const result = await $render(MyComponent, props);

      expect(result).toEqual('<div>Hello, John!</div>');
  });

  it('should render child components', async () => {

    const props = { firstName: 'John', secondName: 'Ope' };

    const InnerJSX = function ({ secondName, fullname}) {
      return `
        <div>${secondName}</div>
        <div>${fullname}</div>
      `;
    }

    const Welcome = function (props) {
      return `
        <div>Hello, ${props.firstName}!
          <InnerJSX secondName=${props.secondName} fullname={props} />
          <InnerJSX secondName=${props.secondName} fullname={props} />
        </div>
      `;
    };

    $register(Welcome, InnerJSX);
    const result = await $render(Welcome, props);
    expect(result).toBe('<div>Hello, John!<div>Ope</div><div>${stringify(props)}</div><div>Ope</div><div>${stringify(props)}</div></div>');
  });

  it('should throw an error when the component name does not start with an uppercase letter', async () => {
    const anotherOne = function (props) {
      return `<div>Hello, ${props.name}!</div>`;
    };

    const props = { name: 'John' };
    await expect($render(anotherOne, props)).rejects.toThrow("A component must start with a capital letter");
  });

});