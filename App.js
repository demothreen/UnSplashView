/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {ActivityIndicator, StyleSheet, Text, View, Dimensions} from 'react-native';
import RandomManager from './src/RandManager';
import Swiper from 'react-native-swiper';
import Image from 'react-native-image-progress';
import * as Progress from 'react-native-progress';

const NUM_WALLPAPERS = 13;
const INDICATORS = Progress.Circle;

type Props = {};
export default class App extends Component<Props> {
    state = {
        wallsJSON: [],
        isLoading: true
    };

    componentDidMount() {
        this.fetchWallsJSON();
    }

    renderLoadingMessage = () => {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator
                    animating={true}
                    color={'#fff'}
                    size={'small'}
                    style={{margin: 15}}/>
                <Text style={{color: '#fff'}}>Contacting Unsplash</Text>
            </View>
        );
    }

    renderResults = () => {
        let {wallsJSON, isLoading} = this.state;
        if (!isLoading) {
            return (
                <Swiper style={styles.wrapper}
                        onMomentumScrollEnd={this._onMomentumScrollEnd}
                        loop={false}
                        dot={<View style={{
                            backgroundColor: 'rgba(255,255,255,.4)',
                            width: 8,
                            height: 8,
                            borderRadius: 10,
                            marginLeft: 3,
                            marginRight: 3,
                            marginTop: 3,
                            marginBottom: 3,
                        }}/>}
                        activeDot={<View style={{
                            backgroundColor: '#fff',
                            width: 13,
                            height: 13,
                            borderRadius: 7,
                            marginLeft: 7,
                            marginRight: 7
                        }}/>}
                >
                    {wallsJSON.map((wallpaper, index) => {
                        return (
                            <View key={index} style={styles.loadingContainer}>
                                <Image
                                    source={{uri: `https://unsplash.it/${wallpaper.width}/${wallpaper.height}?image=${wallpaper.id}`}}
                                    indicator={INDICATORS}
                                    indicatorProps={{
                                        size: 80,
                                        borderWidth: 0,
                                        color: 'rgba(150, 150, 150, 1)',
                                        unfilledColor: 'rgba(200, 200, 200, 0.2)'
                                    }}
                                    style={styles.wallpaperImage}>
                                    <Text style={styles.label}>Photo by</Text>
                                    <Text style={styles.label_authorName}>{wallpaper.author}</Text>
                                </Image>
                            </View>
                        );
                    })}
                </Swiper>
            );
        }
    }

    fetchWallsJSON = () => {
        let url = 'http://unsplash.it/list';
        fetch(url)
            .then(response => response.json())
            .then(jsonData => {
                let randomIds = RandomManager.uniqueRandomNumbers(NUM_WALLPAPERS, 0, jsonData.length),
                    walls = [];
                randomIds.forEach(randomId => {
                    walls.push(jsonData[randomId]);
                });

                this.setState({
                    isLoading: false,
                    wallsJSON: [].concat(walls)
                });
            })
            .catch(error => console.log('Fetch error ' + error));
    };

    render() {
        let {isLoading} = this.state;
        if (isLoading)
            return this.renderLoadingMessage();
        else
            return this.renderResults();
    }
}

const styles = StyleSheet.create({
    wrapper: {},
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    loadingContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000'
    },
    slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#9DD6EB',
    },
    wallpaperImage: {
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        backgroundColor: '#000'
    },
    label: {
        position: 'absolute',
        color: '#fff',
        fontSize: 13,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 2,
        paddingLeft: 5,
        top: 20,
        left: 20,
        width: Dimensions.get('window').width / 2
    },
    label_authorName: {
        position: 'absolute',
        color: '#fff',
        fontSize: 15,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 2,
        paddingLeft: 5,
        top: 41,
        left: 20,
        fontWeight: 'bold',
        width: Dimensions.get('window').width / 2
    }
});
