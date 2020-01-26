import React, { Component } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

class Ball extends Component {
	UNSAFE_componentWillMount() {
        this.position = new Animated.ValueXY(0, 0); // 1. current position of the element
        // 2. code that changes the current position
		Animated.spring(this.position, {
			toValue: { x: 200, y: 500 }
		}).start();
	}
	render() {
		return (
            // getLayout() - Converts {x, y} into {left, top} 
            // 3. the actuall element that is going to be changed.
			<Animated.View style={this.position.getLayout()}> 
				<View style={styles.ball} />
			</Animated.View>
		);
	}
}

const styles = StyleSheet.create({
	ball: {
		height: 60,
		width: 60,
		borderRadius: 30,
		borderWidth: 30,
		borderColor: 'black'
	}
});
export default Ball;
