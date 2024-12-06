function transTime(time: number): number[] {
    let hour = Math.trunc(time / 3600)
    let minus = Math.trunc((time - hour * 3600) / 60)
    let second = Math.trunc(time - hour * 3600 - minus * 60)
    return [hour, minus, second]
}

pins.analogWritePin(AnalogPin.P15, 0)
pins.analogWritePin(AnalogPin.P10, 0)
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
let change = 1
let timeTriger = timeOff
basic.forever(function on_forever() {
    let string: string;
    let change: number;
    // ===========================================================================
    
    if (timeRemainSetup > 0) {
        // setup on process
        if (onSetup == 0) {
            // Setup delay time
            if (change) {
                string = "Setup: TimeOn   "
                I2C_LCD1602.ShowString(string, 0, 0)
                let [hourSet, minSet, secSet] = transTime(timeOn)
                string = `Time: ${hourSet}h${minSet}m${secSet}s `
                I2C_LCD1602.ShowString(string, 0, 1)
                change = 0
            } else {
                let [hourSet, minSet, secSet] = transTime(timeOn)
                if (hourSet >= 10) {
                    I2C_LCD1602.ShowNumber(hourSet, 6, 1)
                } else {
                    I2C_LCD1602.ShowNumber(0, 6, 1)
                    I2C_LCD1602.ShowNumber(hourSet, 7, 1)
                }
                
                if (minSet >= 10) {
                    I2C_LCD1602.ShowNumber(minSet, 9, 1)
                } else {
                    I2C_LCD1602.ShowNumber(0, 9, 1)
                    I2C_LCD1602.ShowNumber(hourSet, 10, 1)
                }
                
                if (secSet >= 10) {
                    I2C_LCD1602.ShowNumber(secSet, 12, 1)
                } else {
                    I2C_LCD1602.ShowNumber(0, 12, 1)
                    I2C_LCD1602.ShowNumber(secSet, 13, 1)
                }
                
            }
            
        } else if (onSetup == 1) {
            // Setup hold time
            if (change) {
                string = "Setup: TimeOff  "
                I2C_LCD1602.ShowString(string, 0, 0)
                let [hourSet, minSet, secSet] = transTime(timeOff)
                string = `Time: ${hourSet}h${minSet}m${secSet}s `
                I2C_LCD1602.ShowString(string, 0, 1)
                change = 0
            } else {
                let [hourSet, minSet, secSet] = transTime(timeOff)
                if (hourSet >= 10) {
                    I2C_LCD1602.ShowNumber(hourSet, 6, 1)
                } else {
                    I2C_LCD1602.ShowNumber(0, 6, 1)
                    I2C_LCD1602.ShowNumber(hourSet, 7, 1)
                }
                
                if (minSet >= 10) {
                    I2C_LCD1602.ShowNumber(minSet, 9, 1)
                } else {
                    I2C_LCD1602.ShowNumber(0, 9, 1)
                    I2C_LCD1602.ShowNumber(hourSet, 10, 1)
                }
                
                if (secSet >= 10) {
                    I2C_LCD1602.ShowNumber(secSet, 12, 1)
                } else {
                    I2C_LCD1602.ShowNumber(0, 12, 1)
                    I2C_LCD1602.ShowNumber(secSet, 13, 1)
                }
                
            }
            
        }
        
    } else if (change) {
        let [hourSet, minSet, secSet] = transTime(timeTriger)
        string = `Time: ${hourSet}h${minSet}m${secSet}s `
        I2C_LCD1602.ShowString(string, 0, 0)
        if (motor) {
            string = "-----Active-----"
        } else {
            string = "----Inactive----"
        }
        
        I2C_LCD1602.ShowString(string, 0, 1)
        change = 0
    } else {
        let [hourSet, minSet, secSet] = transTime(timeTriger)
        if (hourSet >= 10) {
            I2C_LCD1602.ShowNumber(hourSet, 6, 1)
        } else {
            I2C_LCD1602.ShowNumber(0, 6, 1)
            I2C_LCD1602.ShowNumber(hourSet, 7, 1)
        }
        
        if (minSet >= 10) {
            I2C_LCD1602.ShowNumber(minSet, 9, 1)
        } else {
            I2C_LCD1602.ShowNumber(0, 9, 1)
            I2C_LCD1602.ShowNumber(hourSet, 10, 1)
        }
        
        if (secSet >= 10) {
            I2C_LCD1602.ShowNumber(secSet, 12, 1)
        } else {
            I2C_LCD1602.ShowNumber(0, 12, 1)
            I2C_LCD1602.ShowNumber(secSet, 13, 1)
        }
        
    }
    
    basic.pause(100)
})
basic.forever(function on_forever2() {
    let change: number;
    let counter: number;
    
    if (onSetup == 0) {
        if (input.buttonIsPressed(Button.A)) {
            if (timeRemainSetup == 0) {
                change = 1
            }
            
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
            if (timeRemainSetup == 0) {
                change = 1
            }
            
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
            if (timeRemainSetup == 0) {
                change = 1
            }
            
            while (input.pinIsPressed(TouchPin.P0)) {
                
            }
            onSetup = 1
            EEPROM.writew(0, timeOn)
            timeRemainSetup = 5
            basic.showIcon(IconNames.Yes)
            basic.clearScreen()
        }
        
    } else if (onSetup == 1) {
        // On ESA
        if (input.buttonIsPressed(Button.A)) {
            if (timeRemainSetup == 0) {
                change = 1
            }
            
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
            if (timeRemainSetup == 0) {
                change = 1
            }
            
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
            if (timeRemainSetup == 0) {
                change = 1
            }
            
            while (input.pinIsPressed(TouchPin.P0)) {
                
            }
            onSetup = 0
            timeRemainSetup = 5
            EEPROM.writew(2, timeOff)
            basic.showIcon(IconNames.Yes)
            basic.clearScreen()
        }
        
    }
    
    basic.pause(100)
})
basic.forever(function on_forever5() {
    let change: number;
    
    if (motor == 1) {
        pins.analogWritePin(AnalogPin.P15, 0)
        pins.analogWritePin(AnalogPin.P10, 550)
        if (timeTriger == 0) {
            timeTriger = timeOff
            change = 1
            motor = 0
        }
        
    } else {
        pins.analogWritePin(AnalogPin.P15, 0)
        pins.analogWritePin(AnalogPin.P10, 0)
        if (timeTriger == 0) {
            timeTriger = timeOn
            change = 1
            motor = 1
        }
        
    }
    
    basic.pause(100)
})
basic.forever(function on_forever6() {
    let change: number;
    
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
    
    if (timeRemainSetup == 1) {
        change = 1
    }
    
})
basic.forever(function on_forever7() {
    // Cycle reset I2CLCD
    basic.pause(5000)
    I2C_LCD1602.clear()
    I2C_LCD1602.off()
    I2C_LCD1602.LcdInit(39)
    I2C_LCD1602.on()
    let change = 1
})
