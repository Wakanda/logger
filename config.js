module.exports = {
	"level"		: "DEBUG", // DEBUG, INFO, WARN, ERROR
	"format"	: '%date %level %namespace %message %data',
	"file"		: "/PROJECT/data/logger.log",
	"flushTime"	: 15000 //Write logs to disk every 15 seconds
};