// React
import React, { useEffect } from 'react'
// Libs
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    interpolateColor,
    Easing,
} from 'react-native-reanimated'
// Icons
import { Feather } from '@expo/vector-icons'

const AnimatedFeather = Animated.createAnimatedComponent(Feather);

type AnimatedCircleProps = {
    active: boolean; // true = orange/alert, false = green/check
};

export const IconRedeemedAnimated = ({ active }: AnimatedCircleProps) => {
    const progress = useSharedValue(active ? 1 : 0);

    useEffect(() => {
        progress.value = withTiming(active ? 1 : 0, {
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
        });
    }, [active]);

    const animatedContainerStyle = useAnimatedStyle(() => {
        const backgroundColor = interpolateColor(
            progress.value,
            [0, 1],
            ['#e6007616', '#16a34a']
        );
        return { backgroundColor };
    });

    const animatedCheckIconStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotate: `${progress.value * 360}deg` }],
            opacity: 1 - progress.value,
        };
    });

    const animatedAlertIconStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotate: `${(1 - progress.value) * 360}deg` }],
            opacity: progress.value,
        };
    });

    return (
        <Animated.View
            className="justify-center items-center h-28 aspect-square mx-auto mt-20 rounded-full"
            style={animatedContainerStyle}
        >
            <AnimatedFeather
                name="check"
                size={48}
                color={'#e60076'}
                style={animatedCheckIconStyle}
            />
            <AnimatedFeather
                name="smile"
                size={48}
                color="white"
                style={[animatedAlertIconStyle, { position: 'absolute' }]}
            />
        </Animated.View>
    );
}
