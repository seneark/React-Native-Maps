import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this._getLocation = this._getLocation.bind(this);
        this.state = {
            location: '',
            time: new Date().getTime()
        }

    }

    componentDidMount() {
        this.interval = setInterval(() => this._getLocation(), 1000);
        this.interval = setInterval(() => this.setState({ time: new Date().getTime() }), 1000);
    }

    _getLocation = async () => {
        try {
            const {status} = await Permissions.askAsync(Permissions.LOCATION);
            if (status !== 'granted') {
                console.log("Permission not granted");
            }

            const userLocation = await Location.getCurrentPositionAsync();

            this.setState({
                location: userLocation
            });
        }
        catch (error) {
            const status = Location.getProviderStatusAsync();
            if(!status.locationServicesEnabled){
                alert("rv")
            }
        }
    }
    render() {
        return (
            <View style={styles.container}>
                <Text>{JSON.stringify((this.state.time))}</Text>
                <Text>Open up App.js to start working on your app!</Text>
                <Text>{JSON.stringify((this.state.location))}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
