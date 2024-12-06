def transTime(time):
    hour = int(time/3600)
    minus = int((time - hour*3600)/60)
    second = int(time - hour*3600 - minus*60)
    return hour, minus, second

pins.analog_write_pin(AnalogPin.P15, 0)
pins.analog_write_pin(AnalogPin.P10, 0)

timeOn = 3
timeOn = EEPROM.readw(0) #read old value of Hold time AE
timeOff = 3
timeOff = EEPROM.readw(2)

I2C_LCD1602.lcd_init(39)
I2C_LCD1602.on()
I2C_LCD1602.backlight_on()

timeRemainSetup = 5
motor = 0
onSetup = 0
change = 1
timeTriger = timeOff

def on_forever():
    #===========================================================================
    global timeOn, timeOff, motor, timeRemainSetup, onSetup, timeTriger
    if timeRemainSetup > 0: #setup on process
        if onSetup == 0: #Setup delay time
            if change: 
                string = "Setup: TimeOn   "
                I2C_LCD1602.show_string(string, 0, 0)
                hourSet, minSet, secSet = transTime(timeOn)
                string = "Time: %2dh%2dm%2ds " % (hourSet, minSet, secSet)
                I2C_LCD1602.show_string(string, 0, 1)
                change = 0;
            else:
                hourSet, minSet, secSet = transTime(timeOn)
                if hourSet >= 10:
                    I2C_LCD1602.show_number(hourSet, 6, 1)
                else:
                    I2C_LCD1602.show_number(0, 6, 1)
                    I2C_LCD1602.show_number(hourSet, 7, 1)
                if minSet >= 10:
                    I2C_LCD1602.show_number(minSet, 9, 1)
                else:
                    I2C_LCD1602.show_number(0, 9, 1)
                    I2C_LCD1602.show_number(hourSet, 10, 1)
                if secSet >= 10:
                    I2C_LCD1602.show_number(secSet, 12, 1)
                else:
                    I2C_LCD1602.show_number(0, 12, 1)
                    I2C_LCD1602.show_number(secSet, 13, 1)                
        elif onSetup == 1: #Setup hold time
            if change:
                string = "Setup: TimeOff  "
                I2C_LCD1602.show_string(string, 0, 0)
                hourSet, minSet, secSet = transTime(timeOff)
                string = "Time: %2dh%2dm%2ds " % (hourSet, minSet, secSet)
                I2C_LCD1602.show_string(string, 0, 1)
                change = 0;
            else:
                hourSet, minSet, secSet = transTime(timeOff)
                if hourSet >= 10:
                    I2C_LCD1602.show_number(hourSet, 6, 1)
                else:
                    I2C_LCD1602.show_number(0, 6, 1)
                    I2C_LCD1602.show_number(hourSet, 7, 1)
                if minSet >= 10:
                    I2C_LCD1602.show_number(minSet, 9, 1)
                else:
                    I2C_LCD1602.show_number(0, 9, 1)
                    I2C_LCD1602.show_number(hourSet, 10, 1)
                if secSet >= 10:
                    I2C_LCD1602.show_number(secSet, 12, 1)
                else:
                    I2C_LCD1602.show_number(0, 12, 1)
                    I2C_LCD1602.show_number(secSet, 13, 1)
    else:
        if change:
            hourSet, minSet, secSet = transTime(timeTriger)
            string = "Time: %2dh%2dm%2ds " % (hourSet, minSet, secSet)
            I2C_LCD1602.show_string(string, 0, 0)
            if(motor):
                string = "-----Active-----"
            else:
                string = "----Inactive----"
            I2C_LCD1602.show_string(string, 0, 1)
            change = 0;
        else:
            hourSet, minSet, secSet = transTime(timeTriger)
            if hourSet >= 10:
                I2C_LCD1602.show_number(hourSet, 6, 1)
            else:
                I2C_LCD1602.show_number(0, 6, 1)
                I2C_LCD1602.show_number(hourSet, 7, 1)
            if minSet >= 10:
                I2C_LCD1602.show_number(minSet, 9, 1)
            else:
                I2C_LCD1602.show_number(0, 9, 1)
                I2C_LCD1602.show_number(hourSet, 10, 1)
            if secSet >= 10:
                I2C_LCD1602.show_number(secSet, 12, 1)
            else:
                I2C_LCD1602.show_number(0, 12, 1)
                I2C_LCD1602.show_number(secSet, 13, 1) 
    basic.pause(100)           
basic.forever(on_forever)

def on_forever2():
    global timeOn, timeOff, timeRemainSetup, onSetup
    if onSetup == 0:
        if input.button_is_pressed(Button.A):
            if timeRemainSetup == 0:
                change = 1
            timeRemainSetup = 5
            counter = 0
            while input.button_is_pressed(Button.A):
                timeRemainSetup = 5
                counter = counter + 1
                basic.pause(10)
                if counter > 50:
                    timeOn += 60
                    basic.pause(200)
            timeOn += 2
            if timeOn < 0:
                timeOn = 0
        elif input.button_is_pressed(Button.B):
            if timeRemainSetup == 0:
                change = 1
            timeRemainSetup = 5
            counter = 0
            while input.button_is_pressed(Button.B):
                timeRemainSetup = 5
                counter += 1
                basic.pause(10)
                if counter > 50:
                    timeOn -= 60
                    basic.pause(200)
            timeOn -= 2
            if timeOn < 0:
                timeOn = 0
        elif input.pin_is_pressed(TouchPin.P0):
            if timeRemainSetup == 0:
                change = 1
            while input.pin_is_pressed(TouchPin.P0):
                pass
            onSetup = 1
            EEPROM.writew(0, timeOn)
            timeRemainSetup = 5
            basic.show_icon(IconNames.Yes)
            basic.clear_screen()
    elif onSetup == 1: #On ESA
        if input.button_is_pressed(Button.A):
            if timeRemainSetup == 0:
                change = 1
            timeRemainSetup = 5
            counter = 0
            while input.button_is_pressed(Button.A):
                counter += 1
                timeRemainSetup = 5
                basic.pause(10)
                if counter > 50:
                    timeOff += 60
                    basic.pause(200)
            timeOff += 2
        elif input.button_is_pressed(Button.B):
            if timeRemainSetup == 0:
                change = 1
            timeRemainSetup = 5
            counter = 0
            while input.button_is_pressed(Button.B):
                counter += 1
                timeRemainSetup = 5
                basic.pause(10)
                if counter > 50:
                    timeOff -= 60
                    basic.pause(200)
            timeOff -= 2
            if timeOff < 0:
                timeOff = 0
        elif input.pin_is_pressed(TouchPin.P0):
            if timeRemainSetup == 0:
                change = 1
            while input.pin_is_pressed(TouchPin.P0):
                pass
            onSetup = 0
            timeRemainSetup = 5
            EEPROM.writew(2, timeOff)
            basic.show_icon(IconNames.Yes)
            basic.clear_screen()
    basic.pause(100)
basic.forever(on_forever2)

def on_forever5():
    global motor, timeOn, timeOff, timeTriger
    if motor == 1:
        pins.analog_write_pin(AnalogPin.P15, 0)
        pins.analog_write_pin(AnalogPin.P10, 550)
        if timeTriger == 0:
            timeTriger = timeOff
            change = 1
            motor = 0
    else:
        pins.analog_write_pin(AnalogPin.P15, 0)
        pins.analog_write_pin(AnalogPin.P10,
         0)
        if timeTriger == 0:
            timeTriger = timeOn
            change = 1
            motor = 1
    basic.pause(100)
basic.forever(on_forever5)

def on_forever6():
    global timeOn, timeOff, timeRemainSetup, timeTriger
    basic.pause(1000)
    if timeTriger > 0:
        timeTriger -= 1
    else:
        timeTriger = 0
    if timeRemainSetup > 0:
        timeRemainSetup -= 1
    else:
        timeRemainSetup = 0
    if timeRemainSetup == 1:
        change = 1
basic.forever(on_forever6)

def on_forever7(): #Cycle reset I2CLCD
    basic.pause(5000)
    I2C_LCD1602.clear()
    I2C_LCD1602.off()
    I2C_LCD1602.lcd_init(39)
    I2C_LCD1602.on()
    change = 1
basic.forever(on_forever7)
# For Display