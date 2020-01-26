import React, { Component } from 'react';
import { View, Animated, PanResponder } from 'react-native';

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
			onPanResponderRelease: () => {}
		});

		this.state = { panResponder, position };
    }
    

	renderCards() {
		return this.props.data.map((item, index) => {
			if (index === 0) {
				return (
					<Animated.View
						key={item.id}
						style={this.state.position.getLayout()}
						{...this.state.panResponder.panHandlers}
					>
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
