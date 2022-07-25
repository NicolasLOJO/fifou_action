# fifou_action

This project is a web server based on express.

**It is not intended to use in production or in a any project.**

## Getting started

Before you start you need to follow this step

```bash
git clone git@github.com:NicolasLOJO/fifou_action.git #ssh
cd ./fifou_action

npm install
npm start # Or npm run start
# You have npm test or npm run test to test this app
```

## How to try

The project start at **_localhost:3000_**

When you're server is started you can call 3 different route.

[**GET**] --> /action = Get all action available

[**POST**] --> /action = Post an action (object would be like this) :

```js
{
  action: "foo";
}
```
[**GET**] --> /queue = Get actual queue list

## Create action

For create an action you need to create a ***class*** that extend **CreditAction** and add it to the actions list *(that is an object)*.

An action could be anything (function, string, number, ...);

To instanciate an action you just need 2 params (credit, action)


```ts
class MyAction extends CreditAction {}
const actionFunc = () => {
    // Very impressive function
}
const myAction = new MyAction(10, actionFunc);
const actions = {
    'my-action': myAction
}

// you can get action by call it's property
const a = myAction.action;
// But it automaticly decrease credit
 
// You can get credit 
const c = myAction.credit
// But you cannot set it
```

## Queue

In this app you have a Queue Class that would keep you're action in a FIFO queue.
To use it you just need to do :
```ts
const queue = new Queue<string>();
// You can type it or keep it unknow
// To enqueue, dequeue you have method
queue.enqueue('in');
const q = queueu.dequeue();
// q = 'in'
// You can execute an interval to (it's an helper)
queue.execute(2000, () => {
    const d = queue.dequeue();

    // you can count it to
    const count = queue.count();
    // and stop interval
    queue.stop();
});
```