import React, { useState, useEffect } from 'react';
import { SafeAreaView, StatusBar, Pressable, View, Text, Dimensions, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemeContext } from '../src/context/ThemeContext';
import { Styles } from "../src/styles/MainStyles";
import { Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold } from "@expo-google-fonts/poppins";
import { useFonts } from "expo-font";
import {ParamListBase, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

// icons components
import HistoryDark from '../assets/icons/components/HistoryDark';
import HistoryLight from '../assets/icons/components/HistoryLight';
import SunLight from '../assets/icons/components/SunLight';
import SunDark from '../assets/icons/components/SunDark';
import MoonLight from '../assets/icons/components/MoonLight';
import MoonDark from '../assets/icons/components/MoonDark';
import DeleteLight from '../assets/icons/components/DeleteLight';
import DeleteDark from '../assets/icons/components/DeleteDark';

// screen properties
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

function getCurrentDate(): string {
  const date = new Date();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const year = date.getFullYear().toString();
  return `${day}/${month}/${year}`;
}

// saving data
const saveData = async (key: string, data: any) => {
  try {
    const jsonData = JSON.stringify(data);
    await AsyncStorage.setItem(key, jsonData);
  } catch (e) {
    console.error('Error saving data', e);
  }
};

const storeData = async (value: any) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem('my-key', jsonValue);
  } catch (e) {
    // saving error
  }
};

const getData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('my-key');
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    // error reading value
  }
};

const saveDataByKey = async (key: string, newValue: any) => {
  try {
    const allData = (await getData()) || {};
    const valuesForKey = allData[key] || [];
    const updatedValues = [...valuesForKey, newValue];
    const newData = { ...allData, [key]: updatedValues };

    await storeData(newData);
  } catch (error) {
    console.error("Error:", error);
  }
};


export default function MainScreen() {
  // hooks
  const [theme, setTheme] = useState('light');

  // navigation
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  const [mainText, setMainText] = useState('0');
  const [secondaryText, setSecondaryText] = useState('0');
  const [operation, setOperation] = React.useState("");
  const [clean, cleanClicked] = React.useState(false);
  const [rpnList, setRpnList] = React.useState<string[]>([]);
  const [minusIsActive, setMinusIsActive] = React.useState(false);

  // fonts
  const [fontsLoaded] = useFonts({
    Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold
  });
  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }
  
  // action functions
  const clear = () => {
    if (mainText === '0' && clean) { // double click
      cleanClicked(false)
      setSecondaryText('0')
    } else if (mainText !== '0') { // single click
      setMainText('0')
      cleanClicked(true)
      setOperation('')
      setRpnList([])
      setMinusIsActive(false)
    }
  };

  const handleOperationPress = (buttonValue: string) => {
    if (buttonValue === '=') {
      if (mainText[0] === '-') {
        var checkingString = mainText.slice(1)
      } else {
        var checkingString = mainText.slice(0)
      }

      var firCheck = checkingString.split(/[\+\-\×\÷]/).filter(part => part.trim() !== '').length > 1
      var secCheck = ['+', '-', '×', '÷'].some(operator => checkingString.includes(operator))

      if (mainText !== '0' && firCheck && secCheck) {
        // add data in storage
        (async () => {
          try {
            
            await saveDataByKey(getCurrentDate(), `${mainText}= ${secondaryText}`);
          } catch (error) {
            console.error("Error:", error);
          }
        })();

        setMainText(secondaryText)
        setSecondaryText(mainText)
      }
    } else if (buttonValue === 'back') {
      if (mainText.length === 1) {
        setMainText('0');
      } else {
        setMainText(mainText.slice(0, -1));
        rpnList.pop()
        checkForReadyAnswer({ optParam: undefined });
      }
    } else if (buttonValue === '+/-') {
      if (!minusIsActive) { // setting minus
        setMinusIsActive(true)
        setMainText(`-(${mainText})`)
        checkForReadyAnswer({ activationOfMinus: true });
      } else { // deleting minus
        setMinusIsActive(false)
        setMainText(mainText.slice(2, -1))
        checkForReadyAnswer({ activationOfMinus: false });
      }
    } else {
      setRpnList(prevList => [...prevList, buttonValue]);
      const updatedMainText = isNaN(Number(mainText.charAt(mainText.length - 1))) ?
      `${mainText.slice(0, -1)}${buttonValue}` :
      `${mainText}${buttonValue}`;

      setOperation(buttonValue);
      setMainText(updatedMainText);
    }

    if (buttonValue === '-') {
      if (mainText === '0') {
        setMainText('-')
        setRpnList(prevList => [...prevList, buttonValue]);
      } else if (mainText === '-(0)') {
        setMainText('-(-)')
        setRpnList(['-']);
      }
    } 
  }
  
  const handleNumberPress = (buttonValue: string) => {
    if (mainText === '0') {
      setMainText(buttonValue);
      setRpnList(prevList => [buttonValue]); // setting rpn
    } else {
      if (mainText === '-(0)') {
        setMainText(`-(${buttonValue})`);
        setRpnList([buttonValue]);
      } else if (mainText !== '-') {
        if (mainText.includes(')')) {
          setMainText(`${mainText.slice(0, -1)}${buttonValue})`);
        } else if (minusIsActive && mainText.slice(0, 2) === '-(') {
          setMainText(`${mainText}${buttonValue})`);
        } else {
          setMainText(`${mainText}${buttonValue}`);
        }
        setRpnList(prevList => [...prevList, buttonValue]); // setting rpn
      } else if (mainText === '-') {
        setMainText(`-${buttonValue}`);
        setRpnList([`-${buttonValue}`]); // setting rpn
      }
    }
    checkForReadyAnswer({ optParam: buttonValue, activationOfMinus: minusIsActive });
  };

  const evaluateRPN = (expression: string[]): number | undefined => {
    const stack: number[] = [];
    const operators: Record<string, (a: number, b: number) => number> = {
      '+': (a, b) => a + b,
      '-': (a, b) => a - b,
      '×': (a, b) => a * b,
      '÷': (a, b) => a / b,
    };
  
    for (let token of expression) {
      if (!isNaN(parseFloat(token))) {
        stack.push(parseFloat(token));
      } else {
        const operand2 = stack.pop();
        const operand1 = stack.pop();
        const operator = operators[token];
        if (operand1 !== undefined && operand2 !== undefined && operator) {
          stack.push(operator(operand1, operand2));
        } else {
          return undefined;
        }
      }
    }

    return stack.length === 1 ? stack.pop() : undefined;
  };

  const getPrecedence = (operator: string): number => {
    switch (operator) {
      case '+':
      case '-':
        return 1;
      case '×':
      case '÷':
        return 2;
      default:
        return 0;
    }
  };

  const toRPN = (expression: string[]): string[] => {
    const output: string[] = [];
    const stack: string[] = [];
  
    for (let token of expression) {
      if (!['+', '-', '×', '÷'].includes(token)) {
        output.push(token);
      } else {
        while (stack.length > 0 && getPrecedence(stack[stack.length - 1]) >= getPrecedence(token)) {
          output.push(stack.pop()!);
        }
        stack.push(token);
      }
    }
  
    while (stack.length > 0) {
      output.push(stack.pop()!);
    }

    return output.filter(Boolean);
  };  

  const checkForReadyAnswer = ({ optParam, activationOfMinus } : { optParam?: string, activationOfMinus?: boolean }) => {
    cleanClicked(false)
    var newList: string[] = [...rpnList, optParam || ''];

    for (var i = 0; i < newList.length - 1; i++) {
      if (!['+', '-', '×', '÷'].includes(newList[i]) && !['+', '-', '×', '÷'].includes(newList[i + 1])) {
          newList.splice(i, 2, newList[i] + newList[i + 1]);
          i--;
      }
    }

    if (newList[0] === '-' && newList.length > 2) {
      newList[1] = newList[0] + newList[1]
      newList.shift();
    }
    const newVal = evaluateRPN(toRPN(newList))
    if (newVal !== undefined) {
      if (!activationOfMinus) {
        setSecondaryText(newVal.toString().replace(/--/g, '-'));
      } else {
        setSecondaryText(`${-1 * newVal}`);
      }
    } else {
      setSecondaryText(newList.join('').replace(/--/g, '-'));
    }
  }

  // interface
  return (
    <ThemeContext.Provider value={theme}>
      <LinearGradient
          style={Styles.container}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          colors={theme === 'light' ? ['#FEFEFE', '#F9F9F9', '#F3F3F3', '#E5E5E5'] : ['#373737', '#252628', '#000309']}
          locations={theme === 'light' ? [0, 0.13, 0.33, 1] : [0, 0.23, 1]}
        >
        <SafeAreaView style={[Styles.container, { paddingTop: StatusBar.currentHeight }]}>
          <StatusBar
            backgroundColor={theme === 'light' ? '#252628' : '#FEFEFE'}
            barStyle={theme === 'light' ? 'light-content' : 'dark-content'} />
          <View style={Styles.switchHistoryBlock}>
            <Pressable onPress={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
              <View style={[Styles.switchContainer, theme === 'light' ? Styles.lightMode : Styles.darkMode]}>
                <View style={[Styles.chosenIcon,
                  { 
                    backgroundColor: theme === 'light' ? '#D8EEFF' : '#003661',
                    right: theme === 'light' ? null : 0,
                    position: theme === 'light' ? 'relative' : 'absolute',
                  }]}>
                    <View style={Styles.standartIcon}>
                      {theme === 'light' ? <SunLight /> : <MoonDark />}
                    </View>
                </View>
                <View style={[Styles.standartIcon, { marginLeft: theme === 'light' ? 7 : 17 }]}>
                  {theme === 'light' ? <MoonLight /> : <SunDark />}
                </View>
              </View>
            </Pressable>
            <TouchableOpacity onPress={() => {navigation.navigate("History", { theme: theme })}} style={[Styles.standartIcon, { position: 'absolute', right: 34 }]}>
              {theme === 'light' ? <HistoryLight /> : <HistoryDark />}
            </TouchableOpacity>
          </View>
          <View style={Styles.belowBlock}>
          <View style={Styles.resultBlock}>
            <Pressable style={Styles.equalResults}>
              <Text style={[Styles.text, {
                color: theme === 'light' ? '#202224' : '#FBFBFB',
              }]}>=</Text></Pressable>
            <View style={Styles.twoTexts}>
              <Text style={[Styles.screenFirstNumber, {
                color: theme === 'light' ? 'rgba(55, 55, 55, 0.5)' : 'rgba(251, 251, 251, 0.5)'
              }]}>{secondaryText}</Text>
              <Text style={[Styles.screenSecondNumber, {
                color: theme === 'light' ? '#373737' : '#FBFBFB'
              }]}>{mainText}</Text>
            </View>
          </View>
          <LinearGradient
            style={[Styles.calculatorBlock, { paddingRight: 104 + (screenWidth - 34 * 2 - 70 * 4) / 3 }]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            colors={theme === 'light' ? ['#ACDFFF', '#7AADCE'] : ['#4A4A47', '#44255C', '#003971']}
            locations={theme === 'light' ? [0, 1] : [0, 0.5, 1]}>
            <View style={[Styles.leftCont, { marginRight: (screenWidth - 34 * 2 - 70 * 4) / 3 }]}>
              <View style={[Styles.upperBtn, {
                backgroundColor: theme === 'light' ? '#BFE2F9' : 'rgba(5, 5, 5, 0.3)',
              }]}>
                <Pressable
                  style={[Styles.btn, {
                    backgroundColor: theme === 'light' ? '#BFE2F9' : 'transparent'
                  }]} onPress={clear}>
                  <Text style={[Styles.text, {
                    color: theme === 'light' ? '#202224' : '#FBFBFB'
                  }]}>AC</Text>
                </Pressable>
                <Pressable
                  style={[Styles.btn, {
                    backgroundColor: theme === 'light' ? '#BFE2F9' : 'transparent'
                  }]} onPress={() => handleOperationPress('+/-')}>
                  <Text style={[Styles.text, {
                    color: theme === 'light' ? '#202224' : '#FBFBFB'
                  }]}>+/-</Text>
                </Pressable>
                <Pressable
                  style={[Styles.btn, {
                    backgroundColor: theme === 'light' ? '#BFE2F9' : 'transparent'
                  }]} onPress={() => handleOperationPress('back')}>
                  <View>
                    {theme === 'light' ? <DeleteLight /> : <DeleteDark />}
                  </View>
                </Pressable>
              </View>
              <View style={[Styles.leftBtns]}>
                <View style={[Styles.column]}>
                  <Pressable
                    style={[Styles.btn, {
                      backgroundColor: theme === 'light' ? '#BFE2F9' : 'rgba(5, 5, 5, 0.3)'
                    }]} onPress={() => handleNumberPress('1')}>
                    <Text style={[Styles.text, {
                      color: theme === 'light' ? '#202224' : '#FBFBFB'
                    }]}>1</Text>
                  </Pressable>
                  <Pressable
                    style={[Styles.btn, {
                      backgroundColor: theme === 'light' ? '#BFE2F9' : 'rgba(5, 5, 5, 0.3)'
                    }]} onPress={() => handleNumberPress('4')}>
                    <Text style={[Styles.text, {
                      color: theme === 'light' ? '#202224' : '#FBFBFB'
                    }]}>4</Text>
                  </Pressable>
                  <Pressable
                    style={[Styles.btn, {
                      backgroundColor: theme === 'light' ? '#BFE2F9' : 'rgba(5, 5, 5, 0.3)'
                    }]} onPress={() => handleNumberPress('7')}>
                    <Text style={[Styles.text, {
                      color: theme === 'light' ? '#202224' : '#FBFBFB'
                    }]}>7</Text>
                  </Pressable>
                  <Pressable
                    style={[Styles.btn, {
                      backgroundColor: theme === 'light' ? '#BFE2F9' : 'rgba(5, 5, 5, 0.3)'
                    }]} onPress={() => handleNumberPress('.')}>
                    <Text style={[Styles.text, {
                      color: theme === 'light' ? '#202224' : '#FBFBFB'
                    }]}>.</Text>
                  </Pressable>
                </View>
                <View style={[Styles.column]}>
                  <Pressable
                    style={[Styles.btn, {
                      backgroundColor: theme === 'light' ? '#BFE2F9' : 'rgba(5, 5, 5, 0.3)'
                    }]} onPress={() => handleNumberPress('2')}>
                    <Text style={[Styles.text, {
                      color: theme === 'light' ? '#202224' : '#FBFBFB'
                    }]}>2</Text>
                  </Pressable>
                  <Pressable
                    style={[Styles.btn, {
                      backgroundColor: theme === 'light' ? '#BFE2F9' : 'rgba(5, 5, 5, 0.3)'
                    }]} onPress={() => handleNumberPress('5')}>
                    <Text style={[Styles.text, {
                      color: theme === 'light' ? '#202224' : '#FBFBFB'
                    }]}>5</Text>
                  </Pressable>
                  <Pressable
                    style={[Styles.btn, {
                      backgroundColor: theme === 'light' ? '#BFE2F9' : 'rgba(5, 5, 5, 0.3)'
                    }]} onPress={() => handleNumberPress('8')}>
                    <Text style={[Styles.text, {
                      color: theme === 'light' ? '#202224' : '#FBFBFB'
                    }]}>8</Text>
                  </Pressable>
                  <Pressable
                    style={[Styles.btn, {
                      backgroundColor: theme === 'light' ? '#BFE2F9' : 'rgba(5, 5, 5, 0.3)'
                    }]} onPress={() => handleNumberPress('0')}>
                    <Text style={[Styles.text, {
                      color: theme === 'light' ? '#202224' : '#FBFBFB'
                    }]}>0</Text>
                  </Pressable>
                </View>
                <View style={[Styles.column]}>
                  <Pressable
                    style={[Styles.btn, {
                      backgroundColor: theme === 'light' ? '#BFE2F9' : 'rgba(5, 5, 5, 0.3)'
                    }]} onPress={() => handleNumberPress('3')}>
                    <Text style={[Styles.text, {
                      color: theme === 'light' ? '#202224' : '#FBFBFB'
                    }]}>3</Text>
                  </Pressable>
                  <Pressable
                    style={[Styles.btn, {
                      backgroundColor: theme === 'light' ? '#BFE2F9' : 'rgba(5, 5, 5, 0.3)'
                    }]} onPress={() => handleNumberPress('6')}>
                    <Text style={[Styles.text, {
                      color: theme === 'light' ? '#202224' : '#FBFBFB'
                    }]}>6</Text>
                  </Pressable>
                  <Pressable
                    style={[Styles.btn, {
                      backgroundColor: theme === 'light' ? '#BFE2F9' : 'rgba(5, 5, 5, 0.3)'
                    }]} onPress={() => handleNumberPress('9')}>
                    <Text style={[Styles.text, {
                      color: theme === 'light' ? '#202224' : '#FBFBFB'
                    }]}>9</Text>
                  </Pressable>
                  <Pressable
                    style={[Styles.btn, {
                      backgroundColor: theme === 'light' ? '#BFE2F9' : 'rgba(5, 5, 5, 0.3)'
                    }]} onPress={() => handleNumberPress('00')}>
                    <Text style={[Styles.text, {
                      color: theme === 'light' ? '#202224' : '#FBFBFB'
                    }]}>00</Text>
                  </Pressable>
                </View>
              </View>
            </View>
            <View style={[Styles.rightBtn, {backgroundColor: theme === 'light' ? '#BFE2F9' : 'rgba(5, 5, 5, 0.3)',}]}>
              <Pressable
                style={[Styles.btn, {
                  backgroundColor: theme === 'light' ? '#BFE2F9' : 'transparent'
                }]} onPress={() => handleOperationPress('÷')}>
                <Text style={[Styles.text, {
                  color: theme === 'light' ? '#202224' : '#FBFBFB'
                }]}>÷</Text>
              </Pressable>
              <Pressable
                style={[Styles.btn, {
                  backgroundColor: theme === 'light' ? '#BFE2F9' : 'transparent'
                }]} onPress={() => handleOperationPress('×')}>
                <Text style={[Styles.text, {
                  color: theme === 'light' ? '#202224' : '#FBFBFB'
                }]}>×</Text>
              </Pressable>
              <Pressable
                style={[Styles.btn, {
                  backgroundColor: theme === 'light' ? '#BFE2F9' : 'transparent'
                }]} onPress={() => handleOperationPress('-')}>
                <Text style={[Styles.text, {
                  color: theme === 'light' ? '#202224' : '#FBFBFB'
                }]}>-</Text>
              </Pressable>
              <Pressable
                style={[Styles.btn, {
                  backgroundColor: theme === 'light' ? '#BFE2F9' : 'transparent'
                }]} onPress={() => handleOperationPress('+')}>
                <Text style={[Styles.text, {
                  color: theme === 'light' ? '#202224' : '#FBFBFB'
                }]}>+</Text>
              </Pressable>
              <Pressable
                style={[Styles.btn, {
                  backgroundColor: theme === 'light' ? '#BFE2F9' : 'transparent'
                }]} onPress={() => handleOperationPress('=')}>
                <Text style={[Styles.text, {
                  color: theme === 'light' ? '#202224' : '#FBFBFB'
                }]}>=</Text>
              </Pressable>
            </View>
          </LinearGradient>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </ThemeContext.Provider>
  );
}
