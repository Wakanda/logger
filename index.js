var logger = {};

logger.postMessage = function(message){  
    switch(message.name){
        case "applicationWillStart":
            /*
             * Create The Worker
             */ 
            getWorkerPort();
            break;
        case "applicationWillStop":
            /*
             * Stop The Worker
             */ 
            stopWorker();
            break;
    }
};

logger.debug = function(options){
	options.level = "DEBUG";
	
	log(options);
};

logger.info = function(options){
	options.level = "INFO";
	
	log(options);
};

logger.warn = function(options){
	options.level = "WARN";
	
	log(options);
};

logger.error = function(options){
	options.level = "ERROR";
	
	log(options);
};

logger.flush = function(){
	handle({
		action: 'flush'
	});
};

function handle(json){	
	var port		= getWorkerPort();
	var connected	= false;
	
    port.onmessage = function(evt){
		var message = evt.data;
		
		switch (message.type){
			case 'connected':
            	connected	= true;
            	
            	port.postMessage(json);
            
            	exitWait();
            	
        		break;
		};
	};
	
	wait(100);
	
	if (!connected){
		throw {
			code	: "TIMEOUT",
			message	: "logger worker start timed-out"
		};
	};
};

function getWorkerPort(){
	var moduleFile	= new File(module.filename);
	var workerFile	= new File(moduleFile.parent, "./worker.js");
	var worker		= new SharedWorker(workerFile.path, 'logger');
	
	return worker.port;
}

function log(options){
	options.date = new Date().toISOString();
	options.data = (typeof options.data === 'object') ? JSON.stringify(options.data) : options.data;
	
	handle({
		action: 'log',
		log: options
	});
};

function stopWorker(){
    handle({
		action: 'stop'
	});
}

module.exports = logger;