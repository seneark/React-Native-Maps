import React from "react";
import {
	StyleSheet,
	Text,
	View,
	Button,
	AppState,
	Dimensions,
} from "react-native";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import Modal from "react-native-modal";
import * as IntentLauncher from "expo-intent-launcher";
import MapView, {
	PROVIDER_GOOGLE,
	Marker,
	Callout,
	Polygon,
	Circle,
} from "react-native-maps";

export default class App extends React.Component {
	constructor(props) {
		super(props);
		this._getLocation = this._getLocation.bind(this);
		this.openSetting = this.openSetting.bind(this);
		this.handleAppStateChange = this.handleAppStateChange.bind(this);
		this.state = {
			location: [],
			errors: "",
			isLocationModalVisible: false,
			openSetting: false,
			appState: AppState.currentState,
		};
	}

	handleAppStateChange = (nextAppState) => {
		if (
			this.state.appState.match(/inactive|background/) &&
			nextAppState === "active"
		) {
			console.log("App has come to the foreground!");
			this._getLocationAsync();
		}
		this.setState({ appState: nextAppState });
	};

	componentDidMount() {
		AppState.addEventListener("change", this.handleAppStateChange);
		this.interval = setInterval(() => this._getLocation(), 1000);
	}

	_getLocation = async () => {
		try {
			const { status } = await Permissions.askAsync(Permissions.LOCATION);
			if (status !== "granted") {
				this.setState({
					errors: "Permission Not Granted",
				});
			}

			const userLocation = await Location.getCurrentPositionAsync();

			this.setState({
				location: [
					userLocation.coords.longitude,
					userLocation.coords.latitude,
				],
			});
		} catch (error) {
			const status = Location.getProviderStatusAsync();
			if (!status.locationServicesEnabled) {
				this.setState({ isLocationModalVisible: true });
			}
		}
	};

	openSetting = () => {
		IntentLauncher.startActivityAsync(
			IntentLauncher.ACTION_LOCATION_SOURCE_SETTINGS
		);
		this.setState({ openSetting: false });
	};

	render() {
		return (
			<View style={styles.container}>
				<Modal
					onModalHide={
						this.state.openSetting ? this.openSetting : undefined
					}
					isVisible={this.state.isLocationModalVisible}
				>
					<View
						style={{
							height: 300,
							width: 300,
							backgroundColor: "white",
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<Button
							onPress={() =>
								this.setState({
									isLocationModalVisible: false,
									openSetting: true,
								})
							}
							title="Enable Location Services"
						></Button>
					</View>
				</Modal>
				<Text>{JSON.stringify(this.state.location[1])}</Text>
				<MapView
					style={styles.mapStyle}
					provider={PROVIDER_GOOGLE}
					region={{
						longitude: this.state.location[0],
						latitude: this.state.location[1],
						latitudeDelta: 0.0009,
						longitudeDelta: 0.0009,
					}}
				></MapView>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
	mapStyle: {
		width: Dimensions.get("window").width,
		height: 400,
	},
});
