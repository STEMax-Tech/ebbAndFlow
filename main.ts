function transTime(time: number): number[] {
    let hour = Math.trunc(time / 3600)
    let minus = Math.trunc((time - hour * 3600) / 60)
    let second = Math.trunc(time - hour * 3600 - minus * 60)
    return [hour, minus, second]
}

pins.analogWritePin(AnalogPin.P13, 0)
pins.analogWritePin(AnalogPin.P14, 0)
let timeOn = 3
timeOn = EEPROM.readw(0)
// read old value of Hold time AE
let timeOff = 3
timeOff = EEPROM.readw(2)
I2C_LCD1602.LcdInit(39)
I2C_LCD1602.on()
I2C_LCD1602.BacklightOn()
let timeRemainSetup = 5
let motor = 0
let onSetup = 0
let timeTriger = timeOff
basic.forever(function on_forever() {
    let string: string;
    // ===========================================================================
    
    if (timeRemainSetup > 0) {
        // setup on process
        if (onSetup == 0) {
            // Setup delay time
            string = "Setup: TimeOn   "
            I2C_LCD1602.ShowString(string, 0, 0)
            let [hourSet, minSet, secSet] = transTime(timeOn)
            string = `Time: ${hourSet}h${minSet}m${secSet}s     `
            I2C_LCD1602.ShowString(string, 0, 1)
        } else if (onSetup == 1) {
            // Setup hold time
            string = "Setup: TimeOff  "
            I2C_LCD1602.ShowString(string, 0, 0)
            let [hourSet, minSet, secSet] = transTime(timeOff)
            string = `Time: ${hourSet}h${minSet}m${secSet}s     `
            I2C_LCD1602.ShowString(string, 0, 1)
        }
        
    } else {
        let [hourSet, minSet, secSet] = transTime(timeTriger)
        string = `Time: ${hourSet}h${minSet}m${secSet}s   `
        I2C_LCD1602.ShowString(string, 0, 0)
        if (motor) {
            string = "-----Active-----"
        } else {
            string = "----Inactive----"
        }
        
        I2C_LCD1602.ShowString(string, 0, 1)
    }
    
})
basic.forever(function on_forever2() {
    let counter: number;
    
    if (onSetup == 0) {
        if (input.buttonIsPressed(Button.A)) {
            timeRemainSetup = 5
            counter = 0
            while (input.buttonIsPressed(Button.A)) {
                timeRemainSetup = 5
                counter = counter + 1
                basic.pause(10)
                if (counter > 50) {
                    timeOn += 60
                    basic.pause(200)
                }
                
            }
            timeOn += 2
            if (timeOn < 0) {
                timeOn = 0
            }
            
        } else if (input.buttonIsPressed(Button.B)) {
            timeRemainSetup = 5
            counter = 0
            while (input.buttonIsPressed(Button.B)) {
                timeRemainSetup = 5
                counter += 1
                basic.pause(10)
                if (counter > 50) {
                    timeOn -= 60
                    basic.pause(200)
                }
                
            }
            timeOn -= 2
            if (timeOn < 0) {
                timeOn = 0
            }
            
        } else if (input.pinIsPressed(TouchPin.P0)) {
            onSetup = 1
            EEPROM.writew(0, timeOn)
            basic.pause(100)
            basic.showIcon(IconNames.Yes)
            basic.clearScreen()
        }
        
    } else if (onSetup == 1) {
        // On ESA
        if (input.buttonIsPressed(Button.A)) {
            timeRemainSetup = 5
            counter = 0
            while (input.buttonIsPressed(Button.A)) {
                counter += 1
                timeRemainSetup = 5
                basic.pause(10)
                if (counter > 50) {
                    timeOff += 60
                    basic.pause(200)
                }
                
            }
            timeOff += 2
        } else if (input.buttonIsPressed(Button.B)) {
            timeRemainSetup = 5
            counter = 0
            while (input.buttonIsPressed(Button.B)) {
                counter += 1
                timeRemainSetup = 5
                basic.pause(10)
                if (counter > 50) {
                    timeOff -= 60
                    basic.pause(200)
                }
                
            }
            timeOff -= 2
            if (timeOff < 0) {
                timeOff = 0
            }
            
        } else if (input.pinIsPressed(TouchPin.P0)) {
            onSetup = 0
            EEPROM.writew(2, timeOff)
            basic.showIcon(IconNames.Yes)
            basic.clearScreen()
        }
        
    }
    
    basic.pause(100)
})
basic.forever(function on_forever5() {
    
    if (motor == 1) {
        pins.analogWritePin(AnalogPin.P13, 0)
        pins.analogWritePin(AnalogPin.P14, 550)
        if (timeTriger == 0) {
            timeTriger = timeOff
            motor = 0
        }
        
    } else {
        pins.analogWritePin(AnalogPin.P13, 0)
        pins.analogWritePin(AnalogPin.P14, 0)
        if (timeTriger == 0) {
            timeTriger = timeOn
            motor = 1
        }
        
    }
    
    basic.pause(100)
})
basic.forever(function on_forever6() {
    
    basic.pause(1000)
    if (timeTriger > 0) {
        timeTriger -= 1
    } else {
        timeTriger = 0
    }
    
    if (timeRemainSetup > 0) {
        timeRemainSetup -= 1
    } else {
        timeRemainSetup = 0
    }
    
})
