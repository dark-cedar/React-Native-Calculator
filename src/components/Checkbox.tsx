import React, { useEffect } from 'react';
import { View, TouchableOpacity } from 'react-native';

import CheckLight from '../../assets/icons/components/checkLight';
import CheckDark from '../../assets/icons/components/checkDark';
import { Styles } from '../../src/styles/HistoryStyles';


const Checkbox = ({ theme, onCheckboxClick, value, pushed }: { theme?: string, onCheckboxClick: (isChecked: boolean, value: string) => void, value: string, pushed?: boolean }) => {
    const [clicked, setClicked] = React.useState(false);

    const handlePress = () => {
        setClicked(!clicked);
        onCheckboxClick(!clicked, value);
    };

    useEffect(() => {
        if (pushed) {
            setClicked(true)
        }
    })

    return (
        <TouchableOpacity onPress={handlePress}>
            {(clicked) ? (
                theme === 'light' ? <CheckLight /> : <CheckDark />
            ) : (
                <View style={[Styles.circle, theme === 'light' ? Styles.circleLight : Styles.circleDark]} />
            )}
        </TouchableOpacity>
    );
};

export default Checkbox;
