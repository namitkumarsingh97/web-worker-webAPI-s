# Web Worker

- Web Workers in JavaScript are a powerful feature that allows you to run scripts in background threads, separate from the main execution thread of your web page. This can be very useful for handling computationally intensive tasks without blocking the user interface.
- In addition, they can make network requests using the `fetch()` or `XMLHttpRequest` APIs. Once created, a worker can send messages to the JavaScript code that created it by posting messages to an event handler specified by that code (and vice versa).
- A Web Worker is a JavaScript file that runs in the background, independently of other scripts on the page.
- It runs in a separate thread from the main JavaScript execution thread, allowing it to perform tasks without interfering with the responsiveness of the user interface.

## Web Workers API

- A worker is an object created using a constructor (e.g. `Worker()`) that runs a named JavaScript file — this file contains the code that will run in the worker thread; workers run in another global execution context that is different from the current `window`. Thus, using the `window` shortcut to get the current global scope (instead of `self`) within a `Worker` will return an error.

## Use of Web Worker

- Web Workers are used in web development to perform tasks that are computationally intensive or time-consuming without blocking the main execution thread of the web page.

### Note

- You can run whatever code you like inside the worker thread, with some exceptions.
- For example, you can't directly manipulate the DOM from inside a worker, or use some default methods and properties of the `window` object. But you can use a large number of items available under `window`, including WebSockets, and data storage mechanisms like IndexedDB.

## Types of Web Workers

1. Dedicated Workers: These workers are dedicated to a single script. They are created using the `Worker` constructor.
2. Shared Workers: These workers can be shared among multiple scripts running in different windows, tabs, or frames of the same origin. They are created using the `SharedWorker` constructor.

## Real Life Use Cases of Web Worker

1. Data Processing and Analysis: Web Workers are often used for heavy data processing tasks such as parsing large datasets, performing complex calculations, or running algorithms. For example, in data visualization applications, Web Workers can process large datasets in the background while keeping the UI responsive.
2. Image Manipulation: Image editing applications or websites often use Web Workers to perform image processing tasks such as resizing, cropping, or applying filters. This allows users to interact with the interface smoothly while image processing tasks are carried out in the background.
3. Game Development: In browser-based games, Web Workers can be utilized for tasks such as game logic, physics simulations, pathfinding algorithms, or AI computations. This helps maintain a consistent frame rate and overall performance of the game.
4. Parallelizing Tasks: Web Workers enable parallel execution of tasks, which can be useful for scenarios like parallelizing HTTP requests to fetch data from multiple sources simultaneously. This can improve the efficiency and speed of fetching and processing data in web applications.
5. Encryption and Cryptography: Cryptographic operations such as encryption, decryption, or hashing can be computationally intensive. Web Workers can be used to perform these operations in the background, especially in applications that require secure communication or data storage.
6. Real-Time Collaboration Tools: Web-based collaborative tools like document editors or whiteboards often use Web Workers to synchronize changes made by multiple users in real-time. Each user's changes can be processed in a separate worker thread to prevent UI freezes or delays.
7. Audio/Video Processing: Applications that involve audio or video processing, such as media players or editors, can benefit from Web Workers for tasks like decoding, encoding, or applying effects to audio/video streams.
8. Scientific and Engineering Simulations: Web-based simulations for scientific or engineering purposes, such as simulations of physical phenomena, circuit designs, or fluid dynamics, can leverage Web Workers to distribute computations and improve performance.

## Dedicated Workers

- A dedicated worker is only accessible by the script that called it.

### Worker feature detection

- For slightly more controlled error handling and backwards compatibility, it is a good idea to wrap your worker accessing code in the following (main.js):

```
if (window.Worker) {
  // …
}
```

### Spawning a dedicated worker

- Creating a new worker is simple. All you need to do is call the `Worker()` constructor, specifying the URI of a script to execute in the worker thread (main.js):

```
const myWorker = new Worker("worker.js");
```

### Sending messages to and from a dedicated worker

- The magic of workers happens via the `postMessage()` method and the `onmessage` event handler. When you want to send a message to the worker, you post messages to it like this (main.js):

```
first.onchange = () => {
  myWorker.postMessage([first.value, second.value]);
  console.log("Message posted to worker");
};

second.onchange = () => {
  myWorker.postMessage([first.value, second.value]);
  console.log("Message posted to worker");
};
```

- So here we have two `<input>` elements represented by the variables first and second; when the value of either is changed, `myWorker.postMessage([first.value,second.value])` is used to send the value inside both to the worker, as an array. You can send pretty much anything you like in the message.

- In the worker, we can respond when the message is received by writing an event handler block like this (worker.js):

```
onmessage = (e) => {
  console.log("Message received from main script");
  const workerResult = `Result: ${e.data[0] * e.data[1]}`;
  console.log("Posting message back to main script");
  postMessage(workerResult);
};
```

- The `onmessage` handler allows us to run some code whenever a message is received, with the message itself being available in the `message` event's `data` attribute. Here we multiply together the two numbers then use `postMessage()` again, to post the result back to the main thread.

- Back in the main thread, we use onmessage again, to respond to the message sent back from the worker:

```
myWorker.onmessage = (e) => {
  result.textContent = e.data;
  console.log("Message received from worker");
};
```

- Here we grab the message event data and set it as the textContent of the result paragraph, so the user can see the result of the calculation.

`Note: Notice that onmessage and postMessage() need to be hung off the Worker object when used in the main script thread, but not when used in the worker. This is because, inside the worker, the worker is effectively the global scope.`

`Note: When a message is passed between the main thread and worker, it is copied or "transferred" (moved), not shared.`

### Terminating a worker

- If you need to immediately terminate a running worker from the main thread, you can do so by calling the worker's `terminate` method:

```
myWorker.terminate();
```

The worker thread is killed immediately.

### Handling errors

- When a runtime error occurs in the worker, its `onerror` event handler is called. It receives an event named `error` which implements the `ErrorEvent` interface.
- The event doesn't bubble and is cancelable; to prevent the default action from taking place, the worker can call the error event's `preventDefault()` method.
- The error event has the following three fields that are of interest:

1. `message`

- A human-readable error message.

2. `filename`

- The name of the script file in which the error occurred.

3. `lineno`

- The line number of the script file on which the error occurred.

### Spawning subworkers

- Workers may spawn more workers if they wish. So-called sub-workers must be hosted within the same origin as the parent page. Also, the URIs for subworkers are resolved relative to the parent worker's location rather than that of the owning page. This makes it easier for workers to keep track of where their dependencies are.

### Importing scripts and libraries

- Worker threads have access to a global function, `importScripts()`, which lets them import scripts. It accepts zero or more URIs as parameters to resources to import; all the following examples are valid:

```
importScripts(); /* imports nothing */
importScripts("foo.js"); /* imports just "foo.js" */
importScripts("foo.js", "bar.js"); /* imports two scripts */
importScripts(
  "//example.com/hello.js",
); /* You can import scripts from other origins */
```

## Shared workers

- A shared worker is accessible by multiple scripts — even if they are being accessed by different windows, iframes or even workers.

- Note
  ⋅⋅1. If SharedWorker can be accessed from several browsing contexts, all those browsing contexts must share the exact same origin (same protocol, host, and port).
  ⋅⋅2. In Firefox, shared workers cannot be shared between documents loaded in private and non-private windows.

### Spawning a shared worker

- Spawning a new shared worker is pretty much the same as with a dedicated worker, but with a different constructor name.

```
const myWorker = new SharedWorker("worker.js");
```

- One big difference is that with a shared worker you have to communicate via a `port` object — an explicit port is opened that the scripts can use to communicate with the worker (this is done implicitly in the case of dedicated workers).
- The port connection needs to be started either implicitly by use of the `onmessage` event handler or explicitly with the `start()` method before any messages can be posted. Calling `start()` is only needed if the `message` event is wired up via the `addEventListener()` method.
- Note: When using the `start()` method to open the port connection, it needs to be called from both the parent thread and the worker thread if two-way communication is needed.

### Sending messages to and from a shared worker

- Now messages can be sent to the worker as before, but the `postMessage()` method has to be invoked through the port object.

```
squareNumber.onchange = () => {
  myWorker.port.postMessage([squareNumber.value, squareNumber.value]);
  console.log("Message posted to worker");
};
```

## Start Project

> npm install -g http-server

> http-server
