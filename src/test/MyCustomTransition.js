export const MyCustomTransition = (index, position) => {
    const inputRange = [index - 1, index, index + 0.99, index + 1];

    const opacity = position.interpolate({
        inputRange,
        outputRange: ([0, 1, 1, 0]),
    });

    const translateX = 0;
    const translateY = position.interpolate({
        inputRange,
        outputRange: ([50, 0, 0, 0]),
    });

    return {
        opacity,
        transform: [
            { translateX },
            { translateY }
        ],
    };
};