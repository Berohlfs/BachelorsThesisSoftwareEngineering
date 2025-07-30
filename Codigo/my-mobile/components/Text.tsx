// React
import { Text as RNText, TextProps, StyleSheet } from 'react-native'

export function Text(props: TextProps) {
    return (
        <RNText
            {...props}
            style={[styles.text, props.style]}
        />
    );
}

const styles = StyleSheet.create({
    text: {
        fontFamily: 'Montserrat_400Regular',
    },
})
