import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialCommunityIcons, AntDesign, Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { useHistory } from "../context/HistoryProvider"
import Slider from '@react-native-community/slider';
import axios from 'axios';
import _ from 'lodash';

const { width } = Dimensions.get("window")

const credentials = {
    appName: 'musicPlayer',
    apiKey: 'dd173476821cca6b86efad9109b342a4',
    secret: '3f8bcdcffcaab0ed2e9143ad9c0a3762',
    registeredTo: 'josecar501',
};

export function Home() {
    const [tracks, setTracks] = useState([]);
    const [tags, SetTags] = useState([])
    const [country, SetCountry] = useState('mexico')
    const [selectedSong, setSelectedSong] = useState(null);
    const { addToHistory } = useHistory()

    const navigation = useNavigation();


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `http://ws.audioscrobbler.com/2.0/?method=geo.gettoptracks&country=${country}&api_key=${credentials.apiKey}&limit=15&format=json`
                );

                const trackData = _.get(response, 'data.tracks.track', []);

                const trackInfoPromises = trackData.map(async (track) => {
                    const artistName = _.get(track, 'artist.name', '');
                    const trackName = _.get(track, 'name', '');
                    const duration = _.get(track, 'duration', '');

                    const response2 = await axios.get(
                        `http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${credentials.apiKey}&artist=${artistName}&track=${trackName}&format=json`
                    );

                    const trackTags = _.get(response2, 'data.track.toptags.tag', []);

                    // Extraer los valores de tag.name
                    const tagNames = trackTags.map((tag) => tag.name);

                    // Agregar los nombres de los tags al estado
                    SetTags(tagNames);


                    const trackImageUrl = _.get(response2, 'data.track.album.image[3]["#text"]', '');

                    return {
                        artist: artistName,
                        name: trackName,
                        image: trackImageUrl,
                        tags: tagNames,
                        duration,
                    };
                });

                const trackInfo = await Promise.all(trackInfoPromises);
                setTracks(trackInfo);

            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, [country]);

    const goToDetails = useCallback(async (track) => {
        if (track) {
            setSelectedSong(track)
            // Agregar la canción al historial utilizando el contexto
            addToHistory(track);
            // Navegar a la pantalla Details
            navigation.navigate('Detalles', { track });
        }
    }, [addToHistory, navigation]);


    const convertTime = (minutes) => {
        const durationT = parseInt(minutes, 10)
        if (typeof durationT === 'number' && !isNaN(minutes)) {
            const hrs = minutes / 60;
            const minute = Math.floor(hrs);
            const sec = Math.round((hrs - minute) * 60);

            const formattedMinute = minute < 10 ? `0${minute}` : `${minute}`;
            const formattedSec = sec < 10 ? `0${sec}` : `${sec}`;

            return `${formattedMinute}:${formattedSec}`;
        } else {
            return '00:00'; // Valor predeterminado si minutes no es un número válido
        }
    };


    // Función para actualizar el estado cuando el texto cambie
    const handleCountryChange = (text) => {
        SetCountry(text); // Actualiza el estado con el nuevo valor del TextInput
    };

    return (
        <>
            <View style={styles.theme}>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>País (ingles):</Text>
                    <TextInput
                        style={styles.input}
                        cursorColor="#596287"
                        placeholderTextColor="#596287"
                        placeholder='Ingresa tu país (inglés) ej: "Mexico"'
                        value={country}
                        onChangeText={handleCountryChange}
                    />
                </View>
                <ScrollView>
                    {tracks.map((track, index) => (
                        <View key={index} style={styles.itemContainer}>
                            <TouchableOpacity onPress={() => goToDetails(track)}>
                                <View style={styles.leftContainer}>
                                    <View style={styles.thumbnail}>
                                        {track.image ? (
                                            <Image source={{ uri: track.image }} style={{ width: 60, height: 60, borderRadius: 10 }} />
                                        ) : (
                                            <Image source={require('../../assets/defaultAlbum.png')} style={{ width: 60, height: 60, borderRadius: 10 }} />
                                        )}
                                    </View>
                                    <View style={styles.titleContainer}>
                                        <Text numberOfLines={1} ellipsizeMode='tail' style={styles.infoSong}>
                                            {convertTime(track.duration)} - #{tags.join(' #')}
                                        </Text>
                                        <Text style={styles.songTitle} numberOfLines={1} ellipsizeMode='tail'>{track.name}</Text>
                                        <Text style={styles.songBand}>{track.artist}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <View style={styles.rightContainer}>
                                    <MaterialCommunityIcons
                                        name="dots-horizontal"
                                        size={24}
                                        color="#596287"
                                    />
                                </View>
                            </TouchableOpacity>
                        </View>
                    ))}
                    <StatusBar style="auto" />
                </ScrollView>
                <View style={styles.modalSong}>
                    <View style={styles.colorContainer}>
                        <View style={[styles.leftSection, { flex: 3 }]}></View>
                        <View style={[styles.rightSection, { flex: 7 }]}></View>
                    </View>
                    {selectedSong ? (
                        <>
                            <View style={{ flexDirection: "row", paddingBottom: 20 }}>
                                <View style={styles.miniatura}>
                                    {selectedSong.image ? (
                                        <Image source={{ uri: selectedSong.image }} style={{ width: 55, height: 55, borderRadius: 45, marginLeft: -10 }} />
                                    ) : (
                                        <Image source={require('../../assets/defaultAlbum.png')} style={{ width: 60, height: 60, borderRadius: 45 }} />
                                    )}
                                </View>
                                <View style={styles.modalTextContainer}>
                                    <Text numberOfLines={1} ellipsizeMode='tail' style={{ fontWeight: "bold", color: "#596287" }}>
                                        {selectedSong.name}
                                    </Text>
                                </View>
                                <View style={styles.controllerContainer}>
                                    <View style={styles.controllerItem}>
                                        <AntDesign name="banckward" size={20} color="#1D233A" />
                                    </View>
                                    <View style={styles.controllerItem}>
                                        <Ionicons name="md-pause-circle" size={50} style={{ color: "#596287" }} />
                                    </View>
                                    <View style={styles.controllerItem}>
                                        <AntDesign name="forward" size={20} color="#1D233A" />
                                    </View>
                                </View>
                            </View>
                            <View style={styles.middleContent}>
                                <Slider
                                    style={{ width: 350, height: 40 }}
                                    minimumValue={0}
                                    maximumValue={1}
                                    minimumTrackTintColor="#1D233A"
                                    maximumTrackTintColor="#000000"
                                    thumbTintColor='#1D233A'
                                />
                            </View>


                        </>
                    ) : (
                        <Text>Selecciona una canción para ver los detalles.</Text>
                    )}
                </View>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    modalTextContainer: {
        flex: 1,
        justifyContent: "center",
        paddingLeft: 15,
        maxWidth: 150,
        fontWeight: "bold",
        color: "#596287"
    },
    modalSong: {
        backgroundColor: "transparent",
        height: 175,
        borderTopRightRadius: 50,
        borderTopLeftRadius: 50,
        marginHorizontal: -15,
        padding: 20,
        alignItems: "center",

    },
    controllerContainer: {
        flexDirection: 'row',
        justifyContent: "center", // Espacia los elementos horizontalmente
        alignItems: 'center', // Los alinea verticalmente en el centro
    },
    controllerItem: {
        alignItems: 'center', // Alinea cada elemento en el centro
        paddingHorizontal: 10
    },
    leftSection: {
        backgroundColor: '#E8EDFF', // Color del lado izquierdo (10% de ancho)
        borderTopLeftRadius: 45
    },
    rightSection: {
        borderTopRightRadius: 45,
        backgroundColor: 'white', // Color del lado derecho (90% de ancho)
    },
    colorContainer: {
        flexDirection: 'row', // Distribuye las vistas en fila (horizontal)
        position: 'absolute', // Coloca los colores detrás de la imagen y texto
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    theme: {
        backgroundColor: "#1D233A",
        flex: 1,
        padding: 20
    },
    inputContainer: {
        padding: 0,
        paddingBottom: 10,
        flexDirection: 'row', // Coloca los elementos en una fila
        alignItems: 'center', // Centra verticalmente los elementos
    },
    label: {
        marginRight: 10, // Espacio entre el texto y el TextInput
        color: "white",
        fontWeight: "bold"
    },
    input: {
        flex: 1, // Permite que el TextInput ocupe todo el espacio restante
        borderBottomWidth: 1, // Puedes agregar otros estilos según tus preferencias,
        color: "white",
        fontWeight: "bold",
        borderColor: "#596287"
    },
    itemContainer: {
        paddingVertical: 15,
        flexDirection: 'row',
        alignSelf: "center",
        width: width - 40,
    },
    leftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 10, // Agrega un margen entre la imagen y el textos
        justifyContent: "center"
    },
    titleContainer: {
        width: width - 150,
        paddingLeft: 10,
    },
    thumbnail: {
        height: 50,
        flexBasis: 50,
        backgroundColor: 'grey',
        borderRadius: 5, // Agrega un borde redondeado
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 3, // Eleva la sombra en dispositivos Android
        marginRight: 10
    },
    rightContainer: {
        flexBasis: 50,
        height: 50,
        width: 40,
        alignItems: "flex-end",
        justifyContent: "flex-start",
    },
    songTitle: {
        color: "white",
        fontWeight: "bold"
    },
    songBand: {
        color: "#596287",
        fontWeight: "bold"
    },
    infoSong: {
        color: "#596287",
        fontSize: 12,
    }
});
