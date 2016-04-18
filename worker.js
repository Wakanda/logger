var config	= require("./config");
var levels	= {"DEBUG": 0, "INFO": 1, "WARN": 2, "ERROR": 3};
var logs	= [];
var interval;

onconnect = function(event){
    var port	= event.ports[0];
    var e		= null;
    
    port.onmessage = function(message){
        var data = message.data;
        
        switch (data.action){
            case 'log':
				try{
					if (levels[data.log.level] >= levels[config.level]){
						var log	= construct(data.log);
						logs.push(log);
					}
				}catch(e){
					console.log("Error occured while handling log entry : " + e);
				}         	
	            
            	break;
				
			case 'flush':
				flush();            	
            	break;
				
			case 'stop':
				logs.push(new Date().toISOString() + ' INFO %%%% logger STOPPING');
				flush();
				close();        	
            	break;
        }
    };
    
    port.postMessage({
		type: 'connected'
	});
};

function construct(json) {
	var log	= config.format;
	
	for (var i in json) {
		if (typeof json[i] === 'undefined' || json[i] === '') {
			json[i] = '';
		};
		
		log = log.replace('%' + i, json[i]);
		
		// some formatting for stringifyed json objects
		log = log.replace('"{', '\'{');
		log = log.replace('}"', '}\'');
		log = log.replace(/\\"/g, '"');
	};

	return log;
};

function flush() {
	if (logs.length == 0){
		return;
	};
	
	var toFlush	= logs;
	logs = [];
	
	try {
		var ts = TextStream(File(config.file), 'write');
		
		for (var i in toFlush){
			ts.write(toFlush[i] + '\n');
		};
		
		ts.close();
	
	} catch(e){
		console.log('LOGGER flush error: ' + e);
	};
	
	toFlush	= null;
};

(function init(){
	logs.push(new Date().toISOString() + ' INFO %%%% logger STARTED');
	interval = setInterval(flush, config.flushTime);
	File(config.file).parent.create();
})();
