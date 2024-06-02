import React, { useState, useEffect, useRef } from 'react';
import { TouchableOpacity, View, ScrollView, StatusBar, Text, Dimensions, Animated  } from 'react-native';
import { Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold } from "@expo-google-fonts/poppins";
import {ParamListBase, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import { ThemeContext } from '../src/context/ThemeContext';
import { Styles } from '../src/styles/HistoryStyles';
import { useFonts } from "expo-font";
import { LinearGradient } from 'expo-linear-gradient';
import { useRoute } from '@react-navigation/native';
import * as Clipboard from 'expo-clipboard';
import AsyncStorage from '@react-native-async-storage/async-storage';

// icon components
import LeftArrowLight from '../assets/icons/components/LeftArrowLight';
import LeftArrowDark from '../assets/icons/components/LeftArrowDark';
import TrashLight from '../assets/icons/components/TrashLight';
import TrashDark from '../assets/icons/components/TrashDark';
import FolderLight from '../assets/icons/components/FolderLight';
import FolderDark from '../assets/icons/components/FolderDark';
import ListLight from '../assets/icons/components/ListLight';
import ListDark from '../assets/icons/components/ListDark';
import CloseLight from '../assets/icons/components/closeLight';
import CloseDark from '../assets/icons/components/closeDark';
import CopyLight from '../assets/icons/components/CopyLight';
import CopyDark from '../assets/icons/components/CopyDark';
import CheckLight from '../assets/icons/components/checkLight';
import CheckDark from '../assets/icons/components/checkDark';

import Checkbox from '../src/components/Checkbox'
import DeleteLight from '../assets/icons/components/DeleteLight';

// screen properties
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

interface RouteParams {
    theme?: string;
}

const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('my-key');
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      // error reading value
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

export default function HistoryScreen() {
    const [calcsData, setCalcsData] = useState<any>({});
    const allValues = calcsData ? Object.keys(calcsData).reverse().map(key => calcsData && calcsData[key]).flat() : [];
    const copyToClipboard = () => {
        // getting list from all values of dict
        Clipboard.setStringAsync(customSort(allValues, chosenCalcs).join('\n'));
    };
    
    useEffect(() => {
        (async () => {
          try {
            const reversedData: { [key: string]: any } = {};

            Object.entries(await getData()).forEach(([key, value]) => {
                reversedData[key] = (value as any[]).reverse();
            });
            setCalcsData(reversedData);
          } catch (error) {
            // error 
          }
        })();
      }, []);

    const route = useRoute();
    // it excepts
    var { theme }: RouteParams = route.params ?? {};

    const [deleteClicked, setDeleteClicked] = React.useState(false);
    const [selected, setSelected] = React.useState(0);
    const [chosenCalcs, setChosenCalcs] = useState<string[]>([]);
    const [copyAll, setCopyAll] = React.useState(false);

    const [copyBottomClicked, setCopyBottomClicked] = React.useState(true);
    const [deleteBottomClicked, setDeleteBottomClicked] = React.useState(true);

    const [isVisible, setIsVisible] = useState(false);
    const fadeAnim = useRef(new Animated.Value(0)).current; // Initialize with 0 for hidden state
    const isInitialMount = useRef(true);


    useEffect(() => {
        if (!copyBottomClicked && !deleteBottomClicked) {
            return 
        }

        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        setIsVisible(true);
        fadeIn();

        const timer = setTimeout(() => {
            fadeOut();
        }, 3000);

        return () => clearTimeout(timer);
    }, [copyBottomClicked, deleteBottomClicked]);

    const fadeIn = () => {
        Animated.timing(
            fadeAnim,
            {
                toValue: 1,
                duration: 500,
                useNativeDriver: true
            }
        ).start(() => {
            
        });
    };

    const fadeOut = () => {
        Animated.timing(
            fadeAnim,
            {
                toValue: 0,
                duration: 500,
                useNativeDriver: true
            }
        ).start(() => {
            
        });
    };
    
    
    // delete clicked extention
    useEffect(() => {
        setSelected(0)

        if (deleteClicked) {
            setCopyBottomClicked(false);
            setDeleteBottomClicked(false);
        }
    }, [deleteClicked])

    const bottomFunc = () => {
        setSelected(0)

        setDeleteClicked(false);


        (async () => {
            try {
                var allData = await getData() || {};
            
                Object.keys(allData).forEach(key => {
                    allData[key] = allData[key].filter((item: string) => !chosenCalcs.includes(item));
                });

                // checking on existence of values
                allData = Object.fromEntries(Object.entries(allData).filter(([key, value]) => (value as string[]).length > 0));
                
                await storeData(allData);

                const reversedData: { [key: string]: any } = {};
                Object.entries(await getData()).forEach(([key, value]) => {
                    reversedData[key] = (value as any[]).reverse();
                });
                setCalcsData(reversedData);
            
            } catch (error) {
                //
            }
        })();
    }

    const handleCheckboxClick = (isChecked: boolean, value: string) => {
        setCopyAll(false)

        if (isChecked) {
            setSelected(prev => prev + 1); 
            setChosenCalcs(prev => [...prev, value]);
            //setSelectedIndexes(prevIndexes => [...prevIndexes, value]);
        } else if (selected > 0) {
            setSelected(prev => prev - 1);
            setChosenCalcs(prev => prev.filter(item => item !== value));
            //setSelectedIndexes(prevIndexes => prevIndexes.filter(item => item !== value));
        }
    };

    function customSort(a: any[], b: any[]): any[] {
        const commonElements = a.filter(item => b.includes(item));
        const sortedCommonElements = a.filter(item => commonElements.includes(item));
        return sortedCommonElements;
    }

    // navigation
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

    // fonts
    const [fontsLoaded] = useFonts({
        Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold
    });
    if (!fontsLoaded) {
        return <Text>Loading...</Text>;
    }

    // Reverse the entries of timeOperationDict only once
    const reversedEntries = calcsData ? Object.entries(calcsData).reverse() : [];

    return (
        <ThemeContext.Provider value={theme || 'default'}>
                <LinearGradient
                    style={Styles.container}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    colors={theme === 'light' ? ['#FEFEFE', '#FEFEFE'] : ['#373737', '#252628', '#000309']}
                    locations={theme === 'light' ? [0, 1] : [0, 0.23, 1]}>
                    <StatusBar
                        backgroundColor={theme === 'light' ? '#252628' : '#FEFEFE'}
                        barStyle={theme === 'light' ? 'light-content' : 'dark-content'} />
                    <View style={[Styles.upperArrowTitle, {width: screenWidth - 64}]}>
                        <TouchableOpacity
                            onPress={() => {
                                if (!deleteClicked) {
                                    navigation.navigate("Calculator");
                                } else {
                                    setDeleteClicked(false);
                                    setCopyAll(false);
                                }}} style={[Styles.standartIcon, {position: 'absolute'}]}>

                                {deleteClicked && (
                                    theme === 'light' ? <CloseLight /> : <CloseDark />
                                )}
                                {!deleteClicked && (
                                    theme === 'light' ? <LeftArrowLight /> : <LeftArrowDark />
                                )}
                        </TouchableOpacity>

                        <Text style={[Styles.upperText, {
                            color: theme === 'light' ? '#202224' : '#FBFBFB',
                        }]}>{deleteClicked ? `Selected ${selected} items` : 'History'}</Text>

                        {/* right icon */}
                        {deleteClicked && calcsData && Object.keys(calcsData).length > 0 && (
                            <TouchableOpacity style={{position: 'absolute', right: 0}} onPress={() => {
                                setCopyAll(true);
                                setSelected(allValues.length);
                                setChosenCalcs(prev => [...prev, ...allValues]);
                            }}>
                                {theme === 'light' ? <ListLight /> : <ListDark />}
                            </TouchableOpacity>
                        )}
                        {!deleteClicked && calcsData && Object.keys(calcsData).length > 0 && (
                            <TouchableOpacity style={{position: 'absolute', right: 0}} onPress={() => {
                                setDeleteClicked(!deleteClicked)
                                if (deleteClicked) {
                                    setDeleteBottomClicked(false);
                                }}}>
                                {theme === 'light' ? <TrashLight /> : <TrashDark />}
                            </TouchableOpacity>
                        )}
                    </View>

                    <ScrollView style={{ width: '100%', marginBottom: deleteClicked ? 108 : 0 }} showsVerticalScrollIndicator={false}>
                        {/* main block */}
                        { calcsData && !Object.keys(calcsData).length ? (
                            <View style={[Styles.items, { marginTop: screenHeight * 0.297 }]}>
                                <View>{theme === 'light' ? <FolderLight /> : <FolderDark />}</View>
                                <Text style={[Styles.noItemsText, {
                                    color: theme === 'light' ? 'rgba(55, 55, 55, 0.5)' : 'rgba(254, 254, 254, 1)'
                                }]}>No items here yet</Text>
                            </View>
                        ) : (
                            <View style={Styles.calcCont}>
                                {calcsData && reversedEntries.map(([key, values], index) => (
                                    <View style={Styles.itemContainer} key={index}>

                                        {/* checking on presence of content */}
                                        {(values as string[]).length !== 0 && 
                                            <>
                                                {index !== 0 && (
                                                    <View style={[Styles.line, {backgroundColor: 
                                                        theme === 'light' ? 'rgba(55, 55, 55, 0.25)' : 'rgba(86, 87, 89, 1)'
                                                    }]} />
                                                )}
                                                <Text style={[Styles.dateText, {color: theme === 'light' ? 'rgba(55, 55, 55, 0.5)' : 'rgba(109, 110, 112, 1)'}]}>{key}</Text>
                                                <View style={[Styles.calcItems, {gap: deleteClicked ? 12 : 4}]}>
                                                    {(values as string[]).map((value, index) => (
                                                        (!deleteBottomClicked || (deleteBottomClicked && !chosenCalcs.includes(value))) && (
                                                            <View style={Styles.calcBlock} key={index}>
                                                                <Text style={[Styles.calcText, {color: theme === 'light' ? 'rgba(55, 55, 55, 1)' : 'rgba(254, 254, 254, 1)'}]}>{value}</Text>
                                                                {deleteClicked && <Checkbox theme={theme} onCheckboxClick={handleCheckboxClick} value={value} pushed={copyAll} />}
                                                            </View>
                                                        )
                                                    ))}
                                                </View>
                                            </>
                                        }
                                    </View>
                                ))}
                            </View>
                        )}
                    </ScrollView>

                    {/* below messages */}
                    {isVisible && (deleteBottomClicked || copyBottomClicked) && (
                        <Animated.View style={[Styles.belowTextBlock, {
                            opacity: fadeAnim,
                            backgroundColor: theme === 'light' ? '#E8E8E8' : '#424447', 
                            borderWidth: 2,
                            borderColor: theme === 'light' ? '#B6B6B6' : '#2C2E31'
                            }]}>
                            <Text style={[Styles.belowText, {color: theme === 'light' ? '#080B0F' : '#FEFEFE'}]}>{!deleteBottomClicked ? 'Text copied to clipboard!' : 'Calculations deleted!'}</Text>
                        </Animated.View>
                    )}
                    
                    {deleteClicked && 
                    <View style={[Styles.belowCont, {gap: screenWidth * 0.331, backgroundColor: theme === 'light' ? '#252628' : '#FEFEFE'}]}>
                        <TouchableOpacity style={Styles.belowBlock} onPress={() => {copyToClipboard(), setCopyBottomClicked(!copyBottomClicked)}}>
                            {theme === 'dark' ? <CopyLight style={Styles.belowIcons} /> : <CopyDark style={Styles.belowIcons} />}
                            <Text style={[Styles.belowTexts, {color: theme === 'dark' ? '#373737' : '#FEFEFE'}]}>Copy</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={Styles.belowBlock} onPress={() => {bottomFunc(); setDeleteBottomClicked(true)}}>
                            {theme === 'dark' ? <TrashLight style={Styles.belowIcons} /> : <TrashDark style={Styles.belowIcons} />}
                            <Text style={[Styles.belowTexts, {color: theme === 'dark' ? '#373737' : '#FEFEFE'}]}>Delete</Text>
                        </TouchableOpacity>
                    </View>}
                </LinearGradient>
        </ThemeContext.Provider>
    );
}
