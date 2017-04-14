var Data = require('./Data');
(function(){	
	setInterval(function(){
		var rData = Data.readRawData();
		var accelScaled = Data.readAccelScaled();
		var rotations = Data.readRotation();
		var tempC = Data.readTempCelsius(); 
		console.log("| "+ rData.gyroX +" | "+ rData.gyroY +" | "+ rData.gyroZ+" | "+ rData.temp+" | ");
		//console.log("| "+ accelScaled.accelX_scaled +" | "+ accelScaled.accelY_scaled +" | "+ accelScaled.accelZ_scaled+" | ");
		//console.log(rotations);	
		//console.log(tempC);
	}, 500)
})();
