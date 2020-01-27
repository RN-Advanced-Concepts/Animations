import React, { Component } from 'react';
import { View, Dimensions, Animated, PanResponder } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;
const SWIPE_OUT_DURATION = 250;

class Deck extends Component {
	constructor(props) {
		super(props);

		const position = new Animated.ValueXY();
		const panResponder = PanResponder.create({
			// If user tabs on the screen
			onStartShouldSetPanResponder: () => true,
			// If user drags the card
			onPanResponderMove: (event, gesture) => {
				// debugger
				// console.log('gesture', gesture);
				position.setValue({ x: gesture.dx, y: gesture.dy });
			},
			onPanResponderRelease: (event, gesture) => {
				if (gesture.dx > SWIPE_THRESHOLD) {
					console.log('gesture.dx swipe right', gesture.dx);
					this.forceSwipeRight();
				} else if (gesture.dx < -SWIPE_THRESHOLD) {
					console.log('gesture.dx swipe left', gesture.dx);
				} else {
					console.log('gesture.dx back to default', gesture.dx);
					this.resetPosition();
				}
			}
		});

		this.state = { panResponder, position };
	}

	forceSwipeRight() {
		Animated.timing(this.state.position, {
			toValue: { x: SCREEN_WIDTH + 100, y: 0 },
			duration: SWIPE_OUT_DURATION
		}).start();
	}

	resetPosition() {
		Animated.spring(this.state.position, {
			toValue: { x: 0, y: 0 }
		}).start();
	}

	getCardStyle() {
		const { position } = this.state;
		const rotate = position.x.interpolate({
			inputRange: [ -SCREEN_WIDTH * 2.5, 0, SCREEN_WIDTH * 2.5 ],
			outputRange: [ '-120deg', '0deg', '120deg' ]
		});

		return {
			...position.getLayout(),
			transform: [ { rotate } ]
		};
	}

	renderCards() {
		return this.props.data.map((item, index) => {
			if (index === 0) {
				return (
					<Animated.View key={item.id} style={this.getCardStyle()} {...this.state.panResponder.panHandlers}>
						{this.props.renderCard(item)}
					</Animated.View>
				);
			}
			return this.props.renderCard(item);
		});
	}
	render() {
		return <View>{this.renderCards()}</View>;
	}
}

export default Deck;
