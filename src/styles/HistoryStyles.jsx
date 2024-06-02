import { StyleSheet } from "react-native";

export const Styles = StyleSheet.create({
    container: {
        display: 'flex',
        alignItems: 'center',
        flex: 1,
        paddingLeft: 34,
        paddingRight: 34,
        width: '100%',
        position: 'relative'
    },
    upperArrowTitle: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginTop: 35,
    },
    standartIcon: {
        width: 30,
        height: 30,
    },
    upperText: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 26,
        color: 'rgba(55, 55, 55, 1)',
        margin: 'auto',
    },
    items: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        gap: 24,
    },
    noItemsText: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 18,
        color: 'rgba(55, 55, 55, 0.5)',
        margin: 'auto'
    },
    calcCont: {
        display: 'flex',
        alignItems: 'flex-end',
        width: '100%',
        height: '100%',
        marginTop: 28
    },
    itemContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        width: '100%',
    },
    calcItems: {
        display: 'flex',
        alignItems: 'flex-end',
    },
    dateText: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 18,
        textAlign: 'right',
        marginTop: 4,
    },
    calcText: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 22,
        textAlign: 'right',
        maxWidth: 270,
    },
    line: {
        width: '100%',
        height: 1,
        borderRadius: 100,
        marginTop: 32,
    },
    calcBlock: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    circle: {
        width: 30,
        height: 30,
        borderRadius: 100,
    },
    circleLight: {
        backgroundColor: 'rgba(232, 232, 232, 1)',
    },
    circleDark: {
        backgroundColor: 'rgba(97, 99, 102, 1)',
    },
    belowIcons: {
        width: 32,
        height: 32,
    },
    belowTexts: {
        fontFamily: 'Poppins_500Medium'
    },
    belowBlock: {
        display: 'flex',
        alignItems: 'center',
    },
    belowCont: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        position: 'absolute',
        bottom: 32,
        backgroundColor: '#252628',
        width: '100%',
        height: 75,
        borderRadius: 15,
    },
    belowTextBlock: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        paddingHorizontal: 22,
        backgroundColor: 'red',
        position: 'absolute',
        bottom: 125,
        borderRadius: 12,
    },
    belowText: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 12,
    }
})