# PART 2

## 1. What is the difference between Component and PureComponent? give an example where it might break my app.

A: `Component` and `PureComponent` are basically the same, but `PureComponent` automatically implements the shouldComponentUpdate and do a shallow comparison of props and state before allowing the re-render. This behaviour can lead to undesired situations due to the fact that shallow comparisons can evaluate the wrong response on complex objects in state and props, since the shallow comparision will evaluate the reference of the object and not the value of it.

## 2. Context + ShouldComponentUpdate might be dangerous. Can think of why is that?

A: `shouldComponentUpdate` can stop a part of the component tree to re-render, which can block context data propagation.

## 3. Describe 3 ways to pass information from a component to its PARENT.

A: I only use callback functions on the child, so the child invokes the callback which triggers a function on the parent notifying some change. If using class components, I think you can use refs, but I dont think that would be a good idea. Maybe the usage of EventEmitter, which could allow child to send message up the component tree to any level, but I think the callback is more reliable and easier to understand. 

## 4. Give 2 ways to prevent components from re-rendering.

A: Memoization with dependency arrays, proper implementation of the `shouldComponentUpdate`. 

## 5. What is a fragment and why do we need it? Give an example where it might break my app.

A: `Fragment` is a virtual DOM container, so it allows grouping multiple components without the need to introduce a new DOM element as parent. Since `Fragment` is just a virtual DOM container, it cannot be styled, therefore if the UI is not carefully planned and/or the UI framework attempts to injects classes or styles to it, can break your render sometimes making the application useless.

## 6. Give 3 examples of the HOC pattern.

A: 3 examples of real world HOCs are the `withRouter` from `react-router`, `connect` from `react-redux` and `withStyles` from `material-ui`. 
3 examples of HOCs are bellow.

1.
```
export default function withProvider(Provider, WrappedComponent) {
   return (props) => (
      <Provider><WrappedComponent {...props}/></Provider>
   )
}
```
2.
```
export default function withData(WrappedComponent, data) {
   return (props) => {
      const [state, setState] = React.useState(data);
      return (
         <WrappedComponent data={state} {...props} />
      );
   }
}
```
3.
```
export default function withLoading(Component) { 
    return ({isLoading, ...props}) => 
            isLoading ? 
                (<p> fetching data... </p>): 
                (<Component {...props} />);
}
```

## 7. what's the difference in handling exceptions in promises, callbacks and async...await.

A: Using async... await you need to wrap them with a try/catch, if the promise is rejected it will throw an exception and fall into the catch. 

Example:
```
async function performRequest() {
    try {
        const response = await fetch(url);
        const json = await response.json();
        return json;
    } catch (e) {
        alert("Ops... something went wrong...");
    }
}
```
Using callbacks, you can either pass into the then function a resolved callback function and a rejected callback function, dealing with the error on the rejected callback, or add after the .then(...) a catch function call, like promise.then(...).catch(... deal with error ...)

Example:
```
function performRequest() {
    fetch(url).then(
        (result) => result.json()
    ).catch((error) => {
        alert("Ops... something went wrong...");
    });
}
```

## 8. How many arguments does setState take and why is it async.

A: Two, first is either a value or a dispatcher function with the current state and props as arguments with signature `(state, props) => stateChange`, and the second is an optional callback function to be executed once the setState is completed and the component is re-rendered. SetState is more a request than an imperative call, so it requests React to perform the state change and react will do that along side other changes, this is done because the render trigger by each state modification can be expensive, leading to a potentially unresponsive state of the application.

## 9. List the steps needed to migrate a Class to Function Component.

A: 
1. Create a function that receives the same props as the class component; 
2. Split the state of the class into individual fields within the scope of the function;
3. Change all inner methods of the class in stand-alone functions inside the scope of the function;
4. Implement the return of the function as the rendered result of the class component render function;
5. Implement `useEffect` not dependent on the state variables to replace the `onComponentDidMount` and return a destruct callback to replace the `onComponentWillUnmount`;
6. Add another `useEffect` to replace the `onComponentDidUpdate` with a dependency array containing the state variables that should trigger it;
7. Remove the class and export this function instead.

## 10. List a few ways styles can be used with components.

A: 
1. Add the desired styles to the page css (note, when using ids and classNames to virtual dom elements we need to be carefull to properly set them to the required real DOM elements rendered at the end);
2. Add the desired styles to the application default css (same note applies here);
3. Import the `.css` inside of the `(T|J)SX` and use ids and classNames on the components (same note applies here);
4. Set the style attribute to the DOM element returned by the render function directly;
5. Use external libraries like MUI and use `JSS` or the `SX` to set the styles.

## 11. How to render an HTML string coming from the server.

A: Use the prop `dangerouslySetInnerHTML` on a DOM element and use an object like
```
{ __html: "value as string" }
```
