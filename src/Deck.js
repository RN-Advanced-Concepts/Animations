import React, { Component } from 'react';
import { View, Dimensions, Animated, PanResponder } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;
const SWIPE_OUT_DURATION = 250;

class Deck extends Component {
	// Whenever Deck is created, it will look at the props it is provided
	// and if it is not provided with any of the props that are inside of this
	// defaultProps obj it will automatically assign these ones.
	static defaultProps = {
		onSwipeRight: () => {},
		onSwipeLeft: () => {}
	};

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
				// move the card according to the move of the finger
				position.setValue({ x: gesture.dx, y: gesture.dy });
			},
			onPanResponderRelease: (event, gesture) => {
				if (gesture.dx > SWIPE_THRESHOLD) {
					// console.log('gesture.dx swipe right', gesture.dx);
					this.forceSwipe('right');
				} else if (gesture.dx < -SWIPE_THRESHOLD) {
					// console.log('gesture.dx swipe left', gesture.dx);
					this.forceSwipe('left');
				} else {
					// console.log('gesture.dx back to default', gesture.dx);
					this.resetPosition();
				}
			}
		});

		// panResponder does not call the state system
		this.state = { panResponder, position, index: 0 };
	}

	forceSwipe(direction) {
		const x = direction === 'right' ? SCREEN_WIDTH + 100 : -SCREEN_WIDTH - 100;
		// timing is more simple than spring.
		// It just moves the item.
		Animated.timing(this.state.position, {
			toValue: { x, y: 0 },
			duration: SWIPE_OUT_DURATION
		}).start(() => this.onSwipeComplete(direction)); // onSwipeComplete is callback exe after start()
	}

	onSwipeComplete(direction) {
		const { onSwipeLeft, onSwipeRight, data } = this.props;
		const item = data[this.state.index];

		direction = 'right' ? onSwipeRight(item) : onSwipeLeft(item);
		this.state.position.setValue({ x: 0, y: 0 });
		this.setState({ index: this.state.index + 1 });
	}

	resetPosition() {
		Animated.spring(this.state.position, {
			toValue: { x: 0, y: 0 }
		}).start();
	}

	getCardStyle() {
		const { position } = this.state;
		const rotate = position.x.interpolate({
			// * 2.5 = ... to have less rotation, because it take more distance to get to 120deg
			inputRange: [ -SCREEN_WIDTH * 2.5, 0, SCREEN_WIDTH * 2.5 ],
			outputRange: [ '-120deg', '0deg', '120deg' ]
		});

		return {
			// ...position.getLayout() =
			// reference the position object, get the current layout,
			// and pass it to the Animated.View, which takes it over from there
			// Note: here we need the spead operator, because we're returning a single objece
			// return {}
			// so we need to add all the properties of getLayout to that object.
			...position.getLayout(),
			transform: [ { rotate } ]
		};
	}

	renderCards() {
		if (this.state.index >= this.props.data.length) {
			return this.props.renderNoMoreCards();
		}

		return this.props.data.map((item, i) => {
			// If these cards had already been swiped return null.
			if (i < this.state.index) {
				return null;
			}

			// Make a card and attach panHandlers
			if (i === this.state.index) {
				return (
					// {...this.state.panResponder.panHandlers} connects PanResponder to the View
					// style={this.props.position.getLayout()} // No spread operator needed!!!
					<Animated.View
						key={item.id}
						style={[ this.getCardStyle(), styles.cardStyle ]}
						{...this.state.panResponder.panHandlers}
					>
						{this.props.renderCard(item)}
					</Animated.View>
				);
			}
			// else just make a card.
			return <Animated.View 
			key={item.id} 
			// i - this.state.index == move it down by 10 * the number of pixels
			// that the Card is away from becoming the top Card.
			// maybe add the next line too.
			// , left: 10 * (i - this.state.index)
			style={[styles.cardStyle, { top: 10 * (i - this.state.index) }]}

			>{this.props.renderCard(item)}</Animated.View>;
		}).reverse();
	}
	render() {
		return <Animated.View>{this.renderCards()}</Animated.View>;
	}
}

const styles = {
	cardStyle: {
		position: 'absolute',
		width: SCREEN_WIDTH
		// left: 0,
		// right: 0,
	}
};

export default Deck;
