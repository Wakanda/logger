#A Logging Service For Wakanda Server

#Setup

- Put the files inside a `logger` folder in your `backend/modules` folder
- Inside the studio, right click on the index.js file and click on `Set As Service`
- Reload your solution

#Usage

```javascript

var logger = require("logger");

/*
 * namespace, message and data are all optional.
 * Give values only to those you need
 */
logger.warn({
	"namespace" : "my-logger",
	"message"	: "blabla",
	"data"		: {
		"this" : "is a test"
	}
});

```

You can use one of these methods :

- debug
- info
- warn
- error

#Configuration

In the file `config.js` you can change the following elements :

- level : The minimum level of logs to persist on disk, if you don't want to log entries of type `debug` you can give this property a value of `INFO` (since the order is : `DEBUG`, `INFO`, `WARN`, `ERROR`)
- format : The format of a log entry
- file : Log file path
- flushTime : Time delay before writing received log entries from memory to disk in miliseconds
