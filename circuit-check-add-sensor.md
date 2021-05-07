# Adding a sensor to Circuit Check
In this tutorial you will learn to add an external sensor to Circuit Check

## Prepare Sensor Block

```blocks
CircuitCheck.prepareSensors(function () {
	
})
```

## Display Sensor Block
```blocks
CircuitCheck.prepareSensors(function () {
    CircuitCheck.transmitSensorData_Basic("", 0)
})
``` 

## Place Sensor Block

```blocks
CircuitCheck.prepareSensors(function () {
    CircuitCheck.transmitSensorData_Basic("Ultrasonic", sonar.ping(
    DigitalPin.P0,
    DigitalPin.P1,
    PingUnit.MicroSeconds
    ))
})
```