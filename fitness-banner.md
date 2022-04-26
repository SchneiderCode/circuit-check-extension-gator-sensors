# Programming Your Fitness Banners LEDs 
 
```package
CircuitCheck=github:schneidercode/circuit-check-extension 
```
 
## Setup 
To start you should only have one block in your program, the ``||CircuitCheck:[cc] forever||`` block. This block replaces
makecode's standard ``||Basic:forever||`` block and will allow us to use CircuitCheck for debugging our code!
```block
CircuitCheck.runCircuitCheck(function () {
  
})
```
 
```template
CircuitCheck.runCircuitCheck(function () {
  
})
```
 
## Turn an LED On
To turn an LED **ON**, we need to add the ``||pins:digital write pin||`` block to the ``||CircuitCheck:[cc] forever||`` block.
You will need to set two values for the ``||pins:digital write pin||`` block, which are the pin you want to control (*P#*) and the value you want to set it to.
 * 0 : Off
 * 1 : On
 
Modify the ``||pins:digital write pin||`` block so that it turns the first pin in your circuit to **1** or **ON**.
 
```block
CircuitCheck.runCircuitCheck(function () {
   // @highlight
   pins.digitalWritePin(DigitalPin.P0, 1)
})
 
```
 
## Test Your Code
Just as we built our circuit piece-by-piece, we are going to build up our code in small steps, testing as we go.
To test your code, you will need to download it to your micro:bit.
1. Make sure your micro:bit is paired to MakeCode
2. Click the ``||download||`` button to load the code onto your micro:bit
 
Once downloaded, your first LED you should turn **ON**. If it doesn't turn on, review the [debugging slides](https://docs.google.com/presentation/d/17digYKp8IWCYh-SwrrQSS7MDnxdb05ifdeU3RRqkCdg/edit?usp=sharing).
 
## Turn an LED Off
To turn an LED off, we need to modify the ``||pins:digital write pin||`` block and set it's value to **0** or **OFF**.
 
After updating your code, make sure to ``||download||`` it to your micro:bit and test that it works!
 
```block
CircuitCheck.runCircuitCheck(function () {
   // @highlight
   pins.digitalWritePin(DigitalPin.P0, 0)
})
 
```
 
## Set Your LED to Blink (1/2)
We can now control our LEDs with the ``||pins:digital write pin||`` block, so that our LED turns **ON** or **OFF**.
To have our LED blink, we'll need to add an additional block to control how long our LED stays **ON** or **OFF**.  
 
The ``||CircuitCheck: [cc] pause ||`` block will stop your code from running for a set interval of time.
The block accepts the number of milliseconds you want to have your code paused for. For example, 500 milliseconds would be half a second and 1000 milliseconds would be a full second.
 
So to have our LED blink, add a ``||CircuitCheck: [cc] pause ||`` block and set it to **500** milliseconds. This first ``||CircuitCheck: [cc] pause ||`` block controls how long our LED stays **ON** when blinking.
```diffblocks
CircuitCheck.runCircuitCheck(function () {
   pins.digitalWritePin(DigitalPin.P0, 1)
})
----------
CircuitCheck.runCircuitCheck(function () {
   pins.digitalWritePin(DigitalPin.P0, 1)
   CircuitCheck.pause(500)
})
 
```
 
## Set Your LED to Blink (2/2)
 
To control how long the LED stays **OFF**, add an additional ``||CircuitCheck: [cc] pause ||`` block and set it to **1000** milliseconds.
Lastly, add an additional ``||pins:digital write pin||`` block and set it **0** or **OFF**.
 
Now ``||download||`` your updated code and see if your LED blinks **ON** and **OFF**.
```diffblocks
CircuitCheck.runCircuitCheck(function () {
   pins.digitalWritePin(DigitalPin.P0, 1)
   CircuitCheck.pause(500)
})
----------
CircuitCheck.runCircuitCheck(function () {
   pins.digitalWritePin(DigitalPin.P0, 1)
   CircuitCheck.pause(500)
   pins.digitalWritePin(DigitalPin.P0, 0)
   CircuitCheck.pause(1000)
})
 
```
 
## Have Three LEDs Blink Together
### @explicitHints false
Now that your have 1 LED blinking ON and OFF, how might you modify your code so that all 3 of your LEDs are blinking ON and OFF?
Click the Hint button to see one potential way for having your LEDs blink ON and OFF at the same time.
 
```block
CircuitCheck.runCircuitCheck(function () {
   pins.digitalWritePin(DigitalPin.P0, 1)
   pins.digitalWritePin(DigitalPin.P1, 1)
   pins.digitalWritePin(DigitalPin.P2, 1)
   CircuitCheck.pause(500)
   pins.digitalWritePin(DigitalPin.P0, 0)
   pins.digitalWritePin(DigitalPin.P1, 0)
   pins.digitalWritePin(DigitalPin.P2, 0)
   CircuitCheck.pause(1000)
})
 
```
 
## Have Your LEDS Alternate ON and OFF
How might you modify your code so that your LEDs take turns blinking On (i.e. only 1 LED is on at a time, and the other two are off)?
Click the Hint button to see one potential way for having your LEDs take turns being ON.
 
```block
CircuitCheck.runCircuitCheck(function () {
   pins.digitalWritePin(DigitalPin.P0, 1)
   pins.digitalWritePin(DigitalPin.P1, 0)
   pins.digitalWritePin(DigitalPin.P2, 0)
   CircuitCheck.pause(500)
   pins.digitalWritePin(DigitalPin.P0, 0)
   pins.digitalWritePin(DigitalPin.P1, 1)
   pins.digitalWritePin(DigitalPin.P2, 0)
   CircuitCheck.pause(500)
   pins.digitalWritePin(DigitalPin.P0, 0)
   pins.digitalWritePin(DigitalPin.P1, 0)
   pins.digitalWritePin(DigitalPin.P2, 1)
   CircuitCheck.pause(500)
})
```
 

