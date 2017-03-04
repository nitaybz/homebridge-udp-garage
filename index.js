var udp = require('./udp');
var Service, Characteristic;

module.exports = function(homebridge) {
	Service = homebridge.hap.Service;
	Characteristic = homebridge.hap.Characteristic;

	homebridge.registerAccessory("homebridge-udp-garage", "udpGarage", udpGarage);
}

function udpGarage(log, config) {
	this.log = log;
	this.name = config["name"];
	this.host = config["host"];
   	this.port = config["port"];
	this.garage_open_payload = config["open_payload"];
	this.garage_close_payload = config["close_payload"];
	this.currentState = ((config["defaultState"] == "closed") ? Characteristic.CurrentDoorState.CLOSED; : Characteristic.CurrentDoorState.OPEN) || Characteristic.CurrentDoorState.CLOSED;;

	this.garageservice = new Service.GarageDoorOpener(this.name);

	this.garageservice
		.getCharacteristic(Characteristic.CurrentDoorState)
		.on('get', this.getState.bind(this));

	this.garageservice
		.getCharacteristic(Characteristic.TargetDoorState)
		.on('get', this.getState.bind(this))
		.on('set', this.setState.bind(this));

	this.garageservice
		.getCharacteristic(Characteristic.ObstructionDetected)
		.on('get', this.getStateObstruction.bind(this));

}


udpGarage.prototype.getStateObstruction = function(callback) {
	callback(null, false); // no obstruction
}


udpGarage.prototype.getState = function(callback) {
	this.log("current state");
	callback(null, this.currentState);	

}

udpGarage.prototype.setState = function(state, callback) {
	var doorState = (state == Characteristic.TargetDoorState.CLOSED) ? "closed" : "open";
	this.log("Set state to ", doorState);

   	this.udpRequest(this.host, this.port, (doorState == "closed" ? this.garage_close_payload : this.garage_open_payload), function() {
		this.log("Success ", (doorState == "closed" ? "closing" : "opening"))
			this.currentState = (state == Characteristic.TargetDoorState.CLOSED) ? Characteristic.CurrentDoorState.CLOSED : Characteristic.CurrentDoorState.OPEN;
		this.garageservice
			.setCharacteristic(Characteristic.CurrentDoorState, this.currentState);
			callback(null); // success
    	}.bind(this));
},

udpGarage.prototype.udpRequest = function(host, port, payload, callback) {
        udp(host, port, payload, function (err) {
            callback(err);
        });
    },	

udpGarage.prototype.getServices = function() {
	return [this.garageservice];
}
