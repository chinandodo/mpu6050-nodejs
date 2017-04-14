var Data = {};
Data = (function(){
	var wpi = require('wiring-pi');
	wpi.setup('wpi');
			
	var REG = {
		'ADDRESS'	   : (0x68),	 // Address value i2cdetect command
		'POWER_MGMT'   : (0x6B),	 // Power Management register
		'ACCEL_XOUT_H' : (0x3B),	 // Accelerometer registers
   //	'ACCEL_XOUT_L' : (0x3C),	 // ,,|
		'ACCEL_YOUT_H' : (0x3D),	 //	,,|
   //	'ACCEL_YOUT_L' : (0x3E),	 // ,,|
		'ACCEL_ZOUT_H' : (0x3F),	 // ,,|
   //	'ACCEL_ZOUT_L' : (0x40),	 // ,,|
		'TEMP_OUT_H'   : (0x41),	 //	Temperature registers
   //	'TEMP_OUT_L'   : (0x42),	 //	,,|
		'GYRO_XOUT_H'  : (0x43),	 // Gyroscope registers
   //	'GYRO_XOUT_L'  : (0x44),	 //	,,|
		'GYRO_YOUT_H'  : (0x45),	 // ,,|
   //	'GYRO_YOUT_L'  : (0x46),	 // ,,|
		'GYRO_ZOUT_H'  : (0x47), 	 //	,,|
   //	'GYRO_ZOUT_L'  : (0x48)	 	 //	,,|
	};
	// Private Variables / Properties
	var fd = wpi.wiringPiI2CSetup(REG.ADDRESS);
	wpi.wiringPiI2CWriteReg8(fd, REG.POWER_MGMT, 0);
	
	// Privare Methods
	function readWord(add){
		var high = wpi.wiringPiI2CReadReg8(fd, add);
		var low =  wpi.wiringPiI2CReadReg8(fd, add+1);
		var value = (high << 8) + low;
		return value;
	}
	
	function readWord2C(add){
		value = readWord(add);
		if(value >= 0x8000){
			return -((65535 - value) + 1);			
		}else{
			return value;
		}
	}
	
	function dist(a, b){
		return Math.sqrt((a*a)+(b*b));
	}
	
	function get_y_rotation(x, y, z){
		var radians = Math.atan2(x, dist(y,z));		
		return radians * 180 / Math.PI;
	}
	
	function get_x_rotation(x, y, z){
		var radians = Math.atan2(y, dist(x,z));
		return radians * 180 / Math.PI;
	}
	
	// Public methods (API)
	return {
		readAccelScaled : function(){
			return {
				'accelX_scaled'  :  (readWord2C(REG.ACCEL_XOUT_H) / 16384.0).toFixed(3),
				'accelY_scaled'  :  (readWord2C(REG.ACCEL_YOUT_H) / 16384.0).toFixed(3),
				'accelZ_scaled'  :  (readWord2C(REG.ACCEL_ZOUT_H) / 16384.0).toFixed(3),
			}
		},
		
		readRotation : function(){
			var accelScaled = this.readAccelScaled();
			return{								
				'xRotation' : get_x_rotation(accelScaled.accelX_scaled, accelScaled.accelY_scaled, accelScaled.accelZ_scaled).toFixed(3),
				'yRotation' : get_y_rotation(accelScaled.accelX_scaled, accelScaled.accelY_scaled, accelScaled.accelZ_scaled).toFixed(3),	
			}
		},
		
		readRawData : function(){ 
			return {
				'accelX' : readWord2C(REG.ACCEL_XOUT_H),
				'accelY' : readWord2C(REG.ACCEL_YOUT_H),
				'accelZ' : readWord2C(REG.ACCEL_ZOUT_H),
				'gyroX'  : readWord2C(REG.GYRO_XOUT_H),
				'gyroY'  : readWord2C(REG.GYRO_YOUT_H),
				'gyroZ'  : readWord2C(REG.GYRO_ZOUT_H),
				'temp'   : readWord2C(REG.TEMP_OUT_H)
			} 
		}, 
		
		readTempCelsius : function(){
			return { 'tempCelsius' : (readWord2C(REG.TEMP_OUT_H)/340 + 36.53).toFixed(3) }
		}
	};
	
})();

module.exports = Data;
