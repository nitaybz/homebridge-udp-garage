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
	this.currentState = (config["defaultState"] == "locked") ? true : false;
	this.log("locked = " + this.currentState);
	
	this.garageservice = new Service.LockMechanism(this.name);

	this.garageservice
		.getCharacteristic(Characteristic.LockCurrentState)
		.on('get', this.getState.bind(this));

	this.garageservice
		.getCharacteristic(Characteristic.LockTargetState)
		.on('get', this.getState.bind(this))
		.on('set', this.setState.bind(this));
}

udpGarage.prototype.getState = function(callback) {
	this.log("current locked state is " + this.currentState);
	callback(null, this.currentState);	

}

udpGarage.prototype.setState = function(state, callback) {
	var doorState = (state == Characteristic.TargetDoorState.CLOSED) ? "closed" : "open";
	this.log("Set state to ", doorState);

   	this.udpRequest(this.host, this.port, (doorState == "closed" ? this.garage_close_payload : this.garage_open_payload), function() {
		this.log("Success ", (doorState == "closed" ? "closing" : "opening"))
			this.currentState = (state == Characteristic.LockTargetState.SECURED) ? Characteristic.LockCurrentState.SECURED : Characteristic.LockCurrentState.UNSECURED;
		this.garageservice
			.setCharacteristic(Characteristic.LockCurrentState, this.currentState);
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
