def transTime(time):
    hour = int(time/3600)
    minus = int((time - hour*3600)/60)
    second = int(time - hour*3600 - minus*60)
    return hour, minus, second

pins.analog_write_pin(AnalogPin.P14, 0)
pins.analog_write_pin(AnalogPin.P13, 0)
speed = 0
timeOn = 3
#timeOn = EEPROM.readw(0) #read old value of Hold time AE
timeOff = 3
#timeOff = EEPROM.readw(2)
counterClearLCD = 0

makerbit.connect_lcd(39)
makerbit.set_lcd_backlight(LcdBacklight.ON)

timeRemainSetup = 5
motor = 0
onSetup = 0
timeTriger = timeOff

def on_forever():
    #===========================================================================
    global timeOn, timeOff, motor, timeRemainSetup, onSetup, timeTriger, counterClearLCD
    if timeRemainSetup > 0: #setup on process
        if onSetup == 0: #Setup delay time
            string = "Setup: TimeOn   "
            makerbit.show_string_on_lcd1602(string, makerbit.position1602(LcdPosition1602.POS1), 16)
            basic.pause(100)
            hourSet, minSet, secSet = transTime(timeOn)
            string = "Time: %2dh%2dm%2ds " % (hourSet, minSet, secSet)
            makerbit.show_string_on_lcd1602(string, makerbit.position1602(LcdPosition1602.POS17), 16)
            basic.pause(100)
                
        elif onSetup == 1: #Setup hold time
            string = "Setup: TimeOff  "
            makerbit.show_string_on_lcd1602(string, makerbit.position1602(LcdPosition1602.POS1), 16)
            basic.pause(100)
            hourSet, minSet, secSet = transTime(timeOff)
            string = "Time: %2dh%2dm%2ds " % (hourSet, minSet, secSet)
            makerbit.show_string_on_lcd1602(string, makerbit.position1602(LcdPosition1602.POS17), 16)
            basic.pause(100)
    else:
        hourSet, minSet, secSet = transTime(timeTriger)
        string = "Time: %2dh%2dm%2ds " % (hourSet, minSet, secSet)
        makerbit.show_string_on_lcd1602(string, makerbit.position1602(LcdPosition1602.POS1), 16)
        basic.pause(100)
        if(motor):
            string = "-----Active-----"
        else:
            string = "----Inactive----"
        makerbit.show_string_on_lcd1602(string, makerbit.position1602(LcdPosition1602.POS17), 16)
        basic.pause(100)
basic.forever(on_forever)

def on_forever2():
    global timeOn, timeOff, timeRemainSetup, onSetup
    if onSetup == 0:
        if input.button_is_pressed(Button.A):
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
            while input.pin_is_pressed(TouchPin.P0):
                pass
            onSetup = 1
            #EEPROM.writew(0, timeOn)
            timeRemainSetup = 5
            basic.show_icon(IconNames.Yes)
            basic.clear_screen()
    elif onSetup == 1: #On ESA
        if input.button_is_pressed(Button.A):
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
            while input.pin_is_pressed(TouchPin.P0):
                pass
            onSetup = 0
            timeRemainSetup = 5
            #EEPROM.writew(2, timeOff)
            basic.show_icon(IconNames.Yes)
            basic.clear_screen()
    basic.pause(100)
basic.forever(on_forever2)

def on_forever5():
    global motor, timeOn, timeOff, timeTriger, speed
    if motor == 1:
        pins.analog_write_pin(AnalogPin.P14, 0)
        if speed < 800:
            speed += 20
        pins.analog_write_pin(AnalogPin.P13, speed)
        serial.write_value("speed: ", speed)
        basic.pause(10)
        if timeTriger == 0:
            timeTriger = timeOff
            motor = 0
            speed = 0
    else:
        pins.analog_write_pin(AnalogPin.P14, 0)
        pins.analog_write_pin(AnalogPin.P13, 0)
        if timeTriger == 0:
            timeTriger = timeOn
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
        change = 1
    else:
        timeRemainSetup = 0
basic.forever(on_forever6)
# For Display