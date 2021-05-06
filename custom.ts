
enum Type {
    //% block="whole number"
    Integer = 1,
    //% block="decimal number"
    Decimal = 2,
    //% block="text"
    String = 3,
    //% block="boolean"
    Boolean = 4
}


//% color="#AA278D" weight=100 icon="\uf2db"
namespace CircuitCheck {

    let timer = 0;
    let data_raw = "";
    //let in_or_out = [[0, 0], [0, 0], [0, 0]];//deprecated with removal of case 0 (live view)
    let digital_pins = [DigitalPin.P0, DigitalPin.P1, DigitalPin.P2, DigitalPin.P3, DigitalPin.P4, DigitalPin.P5, DigitalPin.P6, DigitalPin.P7, DigitalPin.P8, DigitalPin.P9, DigitalPin.P10, DigitalPin.P11, DigitalPin.P12, DigitalPin.P13, DigitalPin.P14, DigitalPin.P15, DigitalPin.P16, DigitalPin.P0, DigitalPin.P0, DigitalPin.P19, DigitalPin.P20];
    let analog_pins = [AnalogPin.P0, AnalogPin.P1, AnalogPin.P2];
    let delim = "&";
    let gestures = [Gesture.EightG, Gesture.FreeFall, Gesture.LogoDown, Gesture.LogoUp, Gesture.ScreenDown, Gesture.ScreenUp, Gesture.Shake, Gesture.SixG, Gesture.ThreeG, Gesture.TiltLeft, Gesture.TiltRight];
    let gesture_text = ["Eight G", "Free Fall", "Logo Down", "Logo Up", "Screen Down", "Screen Up", "Shake", "Six G", "Three G", "Tilt Left", "Tilt Right"];
    let data_split = ["0"];
    let delay = 50;
    let continue_breakpoint = true;
    let variable_update = {name: "", value:"0", var_type: Type.Integer};
    let variable_transmitter = () => {};
    let sensor_update = "start";
    let sensor_transmitter = () => {};


    /**
     * Pause the running program and connect with Circuit Check
     */
    //% block
    //% weight=100
    export function run_circuit_check() {
        while (true) {
            if (timer + delay < input.runningTime()) {
                checkMessages();
                // Update timer
                timer = input.runningTime();
            }
        }
    }

    /**
     * Pause the running program and connect with Circuit Check
     */
    //% block
    //% weight=100
    //% group="Breakpoint"
    //% id.defl="description here!"
    //% advanced=true
    export function breakpoint(id: string) {
        serial.writeLine("{\"Breakpoint\": {  \"id\":\"" + id +  "\"}}" + delim);
        sendScreenshot();//Send current state of LED matrix, so that CC can mirror it
        variable_transmitter();//Send current state of variables
        while(continue_breakpoint)
        {
            if (timer + delay < input.runningTime()) {
                checkMessages();
                // Update timer
                timer = input.runningTime();
            }
        }
        continue_breakpoint = true;//reset to allow for next breakpoint
    }   

    /**
     * Prepare the microcontroller to relay variable and sensor data to Circuit Check
     */
    //% block="prepare variable data"
    //% group="Variables"
    //% weight=100
    //% handlerStatement
    //% advanced=true
    export function prepareVariables(handler: () => void) {
        variable_transmitter = handler;
    }

    /**
     * Send a variable's value to Circuit Check 
     */
    //% block="update variable (name: $name , value: $variable=variables_get(var) , type: $var_type )"
    //% group="Variables"
    //% weight=90
    //% var_type.defl = Type.Integer
    //% advanced=true
    export function transmitVariableData( name: string, variable: any, var_type : Type) {
        
        if(variable_update.name === name)
        {//An updated value has been transmitted
            variable_update.name = "";//Reset
            if(variable_update.var_type === Type.Integer)
            {
                return parseInt(variable_update.value);
            }
            else if(variable_update.var_type === Type.Decimal)
            {
                return parseFloat(variable_update.value);
            }
            else if(variable_update.var_type === Type.String)
            {
                return variable_update.value;
            }
            else if(variable_update.var_type === Type.Boolean)
            {
                return variable_update.value === "true";
            }
        }
        //transmit current variable data
        serial.writeLine("{\"Variable\": {  \"name\":" + name + ",\"value\":"+ variable +",\"type\":" + var_type +  "}}" + delim);
        return variable;//No update has occured send the old value - Todo: This seems inefficient by adding additional writes to memory...
    }

    /**
     * Prepare the microcontroller to relay variable and sensor data to Circuit Check
     */
    //% block="prepare sensor data"
    //% group="Sensors"
    //% weight=100
    //% handlerStatement
    //% advanced=true
    export function prepareSensors(handler: () => void) {
        sensor_transmitter = handler;
    }

    /**
     * Prepare sensor data for transmission
     */
    //% group="Sensors"
    //% weight=90
    //% block="display sensor data (name: $name , value: $value, type: $var_type )"
    //% advanced=true
    export function transmitSensorData_Advanced( name: string, value: any, var_type: Type) {
        if(sensor_update === "send names")
        {
            serial.writeLine("{\"Sensor_Name\":\"" + name  +"\"}" + delim);//Transmits just the name so Circuit Check can catalogue all of the connected sensors
        }
        else if(sensor_update === name)
        {//Only transmit the data of the selected sensor
            serial.writeLine("{\"Sensor\": {  \"name\":\"" + name + "\",\"value\":"+ value +",\"type\":" + var_type +  "}}" + delim);
        }
    }

    /**
     * Prepare sensor data for transmission
     */
    //% group="Sensors"
    //% weight=90
    //% block="display sensor data (name: $name , value: $value)"
    //% advanced=true
    export function transmitSensorData_Basic( name: string, value: any) {
        transmitSensorData_Advanced(name, value, Type.Integer);
    }

    function checkMessages() {
        data_raw = serial.readString()
        if (data_raw.trim() != "") {
            data_split = data_raw.split(",");
            serial.writeString("{\"Message\":\" Raw data was " + data_raw + " selection was " + data_split[0] + " and Data was : ")
            for (let i = 0; i <= data_split.length - 1; i++) {
                serial.writeString("[" + i + "] " + data_split[i] + " | ")
            }
            serial.writeLine("\"}" + delim);
        }
        switch(data_split[0])
        {
            case "-2": //Handle Variable Update
                variable_update = {name: data_split[1], value: data_split[2], var_type: parseInt(data_split[3])};
                variable_transmitter();
                data_split= ["D"];//Only set once
            break;

            case "-1": //Step to the next breakpoint
                continue_breakpoint = false;
                data_split= ["D"];//Only set once
            break;

            /*case "0": //Read out Digital/Analog pin values 
            {//Deprecate?
                serial.writeLine("{\"Pins\":{");
                let j = 0;
                for(j; j < in_or_out.length; j++)
                {
                    if(in_or_out[j][0] == 0)
                    {//Only read from pins set to be inputs
                        serial.writeLine("\"D" + j + "\":[" + pins.digitalReadPin(digital_pins[j]) + ",0],");
                        serial.writeLine("\"A" + j + "\":" + pins.analogReadPin(analog_pins[j]) + ",");
                    }
                    else
                    {
                        serial.writeLine("\"D" + j + "\":[" + in_or_out[j][1] +",1],");//List as an output
                    }
                }
                //Check for button presses
                serial.writeLine("\"D5\":[" + (input.buttonIsPressed(Button.A) ? 1 : 0) + ",0],");
                serial.writeLine("\"D11\":[" + (input.buttonIsPressed(Button.B) ? 1 : 0) + ",0]}}" + delim);
                delay = 50;      
            }
            break;*/
            
            case "1": //Read value on a specific pin
                if(parseInt(data_split[1]) === 0)
                {//Digital
                    let digital_val = 0;
                    if(data_split[2] == "5")
                    {//Handle Button A
                        if(input.buttonIsPressed(Button.A))
                        {
                            digital_val = 1;
                        }
                    }
                    else if(data_split[2] == "11")
                    {//Handle Button B
                        if(input.buttonIsPressed(Button.B))
                        {
                            digital_val = 1;
                        }
                    }
                    else
                    {
                        digital_val = pins.digitalReadPin(digital_pins[parseInt(data_split[2])]);
                    }
                    serial.writeLine("{\"Pins\":{\"DP" + data_split[2] + "\":" + digital_val+ "}}" + delim);
                }
                else
                {//Analog
                    serial.writeLine("{\"Pins\":{\"AP" + data_split[2] + "\":" + pins.analogReadPin(analog_pins[parseInt(data_split[2])]) + "}}" + delim);
                }
            break;
            
            case "2": //Set PWM on a specific pin
                pins.analogWritePin(analog_pins[parseInt(data_split[1])], parseInt(data_split[2]));
                serial.writeString("{\"Message\":\" PWM was set on pin " + data_split[1] + "to " + data_split[2] + "\"}" + delim);
                data_split= ["D"];//Only set once
            break;
            
            case "3": //Set digitalWrite on a pin
                pins.digitalWritePin(digital_pins[parseInt(data_split[1])], parseInt(data_split[2]));
                data_split= ["D"];//Only set once
            break;
            
            case "4": //Set specific led on
                led.plot(parseInt(data_split[1]), parseInt(data_split[2])); 
                serial.writeString("{\"Message\":\" LED Plot was " + data_split[1] + data_split[2] + "\"}" + delim);
                data_split= ["D"];//Only set once
            break;
            
            case "5": //Set specific led off
                led.unplot(parseInt(data_split[1]), parseInt(data_split[2]));
                serial.writeString("{\"Message\":\" LED UnPlot was " + data_split[1] + data_split[2] + "\"}" + delim);
                data_split= ["D"];//Only set once
            break;

            case "6": //calibrate compass
                input.calibrateCompass();
                data_split = ["7"];
            break;

            case "7": //get compass heading
                serial.writeLine("{\"Compass\":" + input.compassHeading() +"}" + delim);
                delay = 125;
            break;

            case "8": //get  magnetic field ratings along x,y,z & strength
                serial.writeLine("{\"Magnet\":{\"X\":" + input.magneticForce(Dimension.X) + ",\"Y\":" + input.magneticForce(Dimension.Y) +",\"Z\":" + input.magneticForce(Dimension.Z) +",\"Strength\":" + input.magneticForce(Dimension.Strength) +"}}" + delim);
                delay = 125;
            break;

            case "9": //set accel. range
                //Accell enums:
                // AcceleratorRange.OneG - 1
                // AcceleratorRange.TwoG - 2
                // AcceleratorRange.FourG - 4
                // AcceleratorRange.EightG - 8
                input.setAccelerometerRange(parseInt(data_split[1]));
                data_split = ["9"];
            break;

            case "10": //accelerometer data
                serial.writeLine("{\"Motion\":{\"X\":" + input.acceleration(Dimension.X) + ",\"Y\":" + input.acceleration(Dimension.Y) +",\"Z\":" + input.acceleration(Dimension.Z) +",\"Strength\":" + input.acceleration(Dimension.Strength)+ "}}" + delim);
                delay = 125;
            break;

            case "11": //rotation data
                serial.writeLine("{\"Rotation\":{\"Pitch\":" + input.rotation(Rotation.Pitch) + ",\"Roll\":" + input.rotation(Rotation.Roll) + "}}" + delim);
                delay = 125;
            break;

            case "12": //acceleremoter gesture -> TODO: update to directly access current gesture
            {   
                let gesture = "None";
                for(let k = 0; k < gestures.length; k++)//TODO: see if brute force option can be removed
                {
                    if(input.isGesture(gestures[k]))
                    {
                        gesture = gesture_text[k];
                        break;
                    }
                }
                serial.writeLine("{\"Gesture\":\"" + gesture +"\"}" + delim);
                delay = 125;
            }
            break; 

            case "13": //Temperature
                serial.writeLine("{\"Temp\":" + input.temperature() + "}" + delim);
                delay = 125;
            break;
            
            case "14": //Light Level
                serial.writeLine("{\"Light\":" + input.lightLevel() + "}" + delim);
                delay = 125;
            break;

            case "15": //Transmit external sensor names
                sensor_update = "send names";
                sensor_transmitter();
                data_split= ["D"];//Only set once
            break;

            case "16": //Transmit external sensor data
                sensor_update = data_split[1];
                sensor_transmitter();
            break;
        }
        
    }

    function sendScreenshot(){
        let image = led.screenshot();
        let led_array = "[";
        for(let y = 0; y < 5; y++)
        {
            led_array += "[";
            for(let x = 0; x < 5; x++)
            {
                led_array += image.pixel(x, y).toString() + ",";
            }
            led_array += "],";
        }
        led_array += "]";
        
        serial.writeLine("{\"Reset_LEDs\":" + led_array + "}" + delim);
    }
}
