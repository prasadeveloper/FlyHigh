import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch, Linking } from 'react-native';

const lightTheme = {
  backgroundColor: '#FFFFFF',
  textColor: '#000000',
  buttonBackgroundColor: '#1E90FF',
  buttonTextColor: '#FFFFFF',
};

const darkTheme = {
  backgroundColor: '#000000',
  textColor: '#FFFFFF',
  buttonBackgroundColor: '#333333',
  buttonTextColor: '#FFFFFF',
};

const MainMenu = ({ navigation }) => {
  const [isDarkMode, setIsDarkMode] = useState(false); // Theme state
  const theme = isDarkMode ? darkTheme : lightTheme;

  const toggleSwitch = () => setIsDarkMode(previousState => !previousState);

  const handleRateApp = () => {
    const url = 'https://play.google.com/store/apps/details?id=com.pd.flyhigh';
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  };

  const privacyPolicyPageRedirect =()=>{
    const url = 'https://privacypolicy-flyhigh.blogspot.com/';
    Linking.openURL(url).catch(err =>console.error("Couldn't load  page", err))
  };

  const shareAPP =()=> {
    const url = 'https://play.google.com/store/apps/details?id=com.pd.flyhigh';
    Linking.openURL(url).catch(err =>console.error("Couldn't load  page", err))
  };


  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <Text style={[styles.title, { color: theme.textColor }]}>Fly High</Text>
      
      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.buttonBackgroundColor }]}
        onPress={() => navigation.navigate('Game', { isDarkMode })}
      >
        <Text style={[styles.buttonText, { color: theme.buttonTextColor }]}>START</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.buttonBackgroundColor }]}
        onPress={handleRateApp}
      >
        <Text style={[styles.buttonText, { color: theme.buttonTextColor }]}>RATE APP</Text>
      </TouchableOpacity>


      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.buttonBackgroundColor }]}
        onPress={shareAPP}
      >
        <Text style={[styles.buttonText, { color: theme.buttonTextColor }]}>SHARE</Text>
      </TouchableOpacity>


      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.buttonBackgroundColor }]}
        onPress={privacyPolicyPageRedirect}
      >
        <Text style={[styles.buttonText, { color: theme.buttonTextColor }]}>PRIVACY POLICY</Text>
      </TouchableOpacity>

      <View style={styles.switchContainer}>
        <Text style={{ color: theme.textColor, fontSize: 20, fontWeight: 'bold', }}>Dark Mode</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isDarkMode ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isDarkMode}
        />
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 50,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginBottom: 20,
    width: 200,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default MainMenu;
