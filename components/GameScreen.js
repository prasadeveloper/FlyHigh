import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Alert, Switch } from 'react-native';

const { width, height } = Dimensions.get('window');

const BAR_WIDTH = 100;
const BAR_HEIGHT = 20;
const PLAYER_SIZE = 50;
const GRAVITY = 2;  // Increased gravity for faster falling
const JUMP_VELOCITY = -15; // Decrease the jump height
const BAR_SPEED = 7; // Increase bar speed for a faster game pace

const generateBar = (offsetY) => ({
  x: Math.random() * (width - BAR_WIDTH),
  y: -offsetY, // Bars start above the view and move downward
});

const lightTheme = {
  backgroundColor: '#FFFFFF',
  textColor: '#000000',
  buttonBackgroundColor: '#1E90FF',
  buttonTextColor: '#FFFFFF',
  playerColor: '#1E90FF',
  barColor: '#1E90FF',
};

const darkTheme = {
  backgroundColor: '#000000',
  textColor: '#FFFFFF',
  buttonBackgroundColor: '#333333',
  buttonTextColor: '#FFFFFF',
  playerColor: '#FF4500',
  barColor: '#FF4500',
};

const GameScreen = ({ navigation, route }) => {
  const { isDarkMode } = route.params; // Retrieve the passed dark mode state
  const theme = isDarkMode ? darkTheme : lightTheme;

  const [playerX, setPlayerX] = useState(width / 2 - PLAYER_SIZE / 2);
  const [playerY, setPlayerY] = useState(50); // Player starts at the top
  const [velocityY, setVelocityY] = useState(0);
  const [bars, setBars] = useState(() => Array.from({ length: 10 }, (_, i) => generateBar(i * 100)));
  const [countdown, setCountdown] = useState(3);
  const [isGameStarted, setIsGameStarted] = useState(false);

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setCountdown(prevCount => {
        if (prevCount <= 1) {
          clearInterval(countdownInterval);
          setIsGameStarted(true);
          return "Let's go!";
        }
        return prevCount - 1;
      });
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isGameStarted) {
        setVelocityY((prevVelocityY) => prevVelocityY + GRAVITY); // gravity effect
        setPlayerY((prevY) => prevY + velocityY);
      }

      setBars((prevBars) => {
        const updatedBars = prevBars.map(bar => ({
          ...bar,
          y: bar.y + BAR_SPEED, // move bars downward
        })).filter(bar => bar.y < height);

        while (updatedBars.length < 10) {
          const offsetY = updatedBars.length > 0 ? updatedBars[updatedBars.length - 1].y - 100 : 0;
          updatedBars.push(generateBar(offsetY));
        }

        return updatedBars;
      });

      if (isGameStarted) {
        checkCollision();
      }
    }, 30);

    return () => clearInterval(interval);
  }, [playerY, bars, velocityY, isGameStarted]);

  useEffect(() => {
    if (playerY > height) {
      Alert.alert("Game Over", "You fell down!", [
        { text: "OK", onPress: () => navigation.navigate('MainMenu') }
      ]);
      setPlayerY(50); // Reset player to the top
      setVelocityY(0);
      setBars(() => Array.from({ length: 10 }, (_, i) => generateBar(i * 100)));
      setCountdown(3);
      setIsGameStarted(false);
    }
  }, [playerY, navigation]);

  const moveLeft = () => {
    setPlayerX((prevX) => Math.max(prevX - 20, 0));
  };

  const moveRight = () => {
    setPlayerX((prevX) => Math.min(prevX + 20, width - PLAYER_SIZE));
  };

  const checkCollision = () => {
    bars.forEach(bar => {
      if (
        playerX < bar.x + BAR_WIDTH &&
        playerX + PLAYER_SIZE > bar.x &&
        playerY + PLAYER_SIZE > bar.y &&
        playerY + velocityY > bar.y &&
        playerY < bar.y + BAR_HEIGHT
      ) {
        setPlayerY(bar.y - PLAYER_SIZE);
        setVelocityY(JUMP_VELOCITY); // make the player bounce
      }
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      {!isGameStarted && (
        <View style={[styles.countdownContainer, { backgroundColor: theme.backgroundColor }]}>
          <Text style={[styles.countdownText, { color: theme.textColor }]}>{countdown}</Text>
        </View>
      )}
      <View style={[styles.player, { left: playerX, top: playerY, backgroundColor: theme.playerColor }]} />
      {bars.map((bar, index) => (
        <View key={index} style={[styles.bar, { left: bar.x, top: bar.y, backgroundColor: theme.barColor }]} />
      ))}
      <View style={styles.controls}>
        <TouchableOpacity onPress={moveLeft} style={[styles.controlButton, { backgroundColor: theme.buttonBackgroundColor }]}>
          <Text style={[styles.controlButtonText, { color: theme.buttonTextColor }]}>Left</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={moveRight} style={[styles.controlButton, { backgroundColor: theme.buttonBackgroundColor }]}>
          <Text style={[styles.controlButtonText, { color: theme.buttonTextColor }]}>Right</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  player: {
    position: 'absolute',
    width: PLAYER_SIZE,
    height: PLAYER_SIZE,
    borderRadius: PLAYER_SIZE / 2,
  },
  bar: {
    position: 'absolute',
    width: BAR_WIDTH,
    height: BAR_HEIGHT,
  },
  controls: {
    position: 'absolute',
    bottom: 50,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  controlButton: {
    width: 100,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  controlButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  countdownContainer: {
    position: 'absolute',
    top: height / 2 - 50,
    left: width / 2 - 50,
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  countdownText: {
    fontSize: 30,
  },
  switchContainer: {
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    alignItems: 'center',
  },
});

export default GameScreen;
