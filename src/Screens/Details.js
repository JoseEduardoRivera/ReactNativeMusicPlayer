import { View, Text, StyleSheet, Image } from 'react-native'
import Slider from '@react-native-community/slider';
import { Ionicons, AntDesign } from "@expo/vector-icons"
import React from 'react'

export function Details({ route }) {
    const { track } = route.params; // Accede a la prop track desde route.params

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

    return (
        <View style={styles.container}>
            {track ? ( // Verifica si track está definido
                <>
                    <View style={styles.headerContainer}>
                        <Text style={styles.infoSong}>Playing from</Text>
                        <Text style={styles.infoSong2}>Tendencias, Todos Los Generos</Text>
                    </View>
                    <View style={styles.musicContainer}>
                        <View style={styles.colorContainer}>
                            <View style={[styles.leftSection, { flex: 2 }]}></View>
                            <View style={[styles.rightSection, { flex: 8 }]}></View>
                        </View>
                        <View style={styles.thumbnailContainer}>
                            {track.image ? (
                                <Image source={{ uri: track.image }} style={styles.thumbnailImage} />
                            ) : (
                                <Image source={require('../../assets/defaultAlbum.png')} style={styles.thumbnailImage} />
                            )}
                        </View>
                        <Text style={styles.trackName}>{track.name}</Text>
                        <Text style={styles.artistName}>{track.artist}</Text>
                        <View style={styles.sliderContainer}>
                            <View style={styles.leftContent}>
                                <Text style={{ fontSize: 12, color: "#596287" }}>
                                    0:00
                                </Text>
                            </View>
                            <View style={styles.middleContent}>
                                <Slider
                                    style={{ width: 275, height: 40 }}
                                    minimumValue={0}
                                    maximumValue={1}
                                    minimumTrackTintColor="#1D233A"
                                    maximumTrackTintColor="#000000"
                                    thumbTintColor='#1D233A'
                                />
                            </View>
                            <View style={styles.rightContent}>
                                <Text style={{ fontSize: 12, color: "#596287" }}>
                                    {convertTime(track.duration)}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.controllerContainer}>
                            <View style={styles.controllerItem}>
                                <AntDesign name="banckward" size={30} color="#1D233A" />
                            </View>
                            <View style={styles.controllerItem}>
                                <Ionicons name="md-pause-circle" size={80} style={{ color: "#596287" }} />
                            </View>
                            <View style={styles.controllerItem}>
                                <AntDesign name="forward" size={30} color="#1D233A" />
                            </View>
                        </View>
                        <View style={styles.bottomContainer}>
                            <View style={styles.positions}>
                                <AntDesign name="arrowup" size={18} color="#596287" />
                                <Text style={styles.infoSong3}>201</Text>
                                <AntDesign name="arrowdown" size={18} color="#596287" />
                            </View>
                            <View style={styles.retweet}>
                                <AntDesign name="retweet" size={18} color="#596287" />
                                <Text style={styles.infoSong3}>18</Text>
                            </View>
                            <View style={styles.plays}>
                                <Ionicons name="play" size={18} color="#596287" />
                                <Text style={styles.infoSong3}>2,004</Text>
                            </View>
                            <View style={styles.add}>
                                <Ionicons name="add" size={30} color="#596287" />
                            </View>
                        </View>
                    </View>
                </>
            ) : (
                <View style={styles.noTrackContainer}>
                    <Text style={styles.noTrackText}>
                        Por favor, selecciona una canción primero.
                    </Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    add: {
        flexDirection: "row",
    },
    plays: {
        flexDirection: "row",
    },
    retweet: {
        flexDirection: "row",
    },
    positions: {
        flexDirection: "row",
    },
    bottomContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 30,
    },
    controllerContainer: {
        flexDirection: 'row',
        justifyContent: "center", // Espacia los elementos horizontalmente
        alignItems: 'center', // Los alinea verticalmente en el centro
        marginTop: 20, // Añade margen superior
    },
    controllerItem: {
        alignItems: 'center', // Alinea cada elemento en el centro
        paddingHorizontal: 10
    },
    sliderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    leftContent: {
        flex: 1,
        alignItems: 'flex-start',
    },
    middleContent: {
        flex: 3,
        alignItems: 'center',
    },
    rightContent: {
        flex: 1,
        alignItems: 'flex-end',
    },
    container: {
        flex: 1,
    },
    headerContainer: {
        backgroundColor: "#1D233A",
        paddingBottom: 70,
    },
    infoSong: {
        color: "#596287",
        fontSize: 14,
        alignSelf: "center",
    },
    infoSong2: {
        color: "#A0A5B8",
        fontSize: 15,
        alignSelf: "center",
        fontWeight: "bold",
    },
    infoSong3: {
        color: "#A0A5B8",
        fontSize: 10,
        alignSelf: "center",
        fontWeight: "bold",
    },
    musicContainer: {
        flex: 1,
        backgroundColor: 'transparent', // Fondo transparente
        paddingHorizontal: 20, // Espaciado horizontal
        paddingTop: 20, // Espaciado superior
        marginTop: -35,
    },
    colorContainer: {
        flexDirection: 'row', // Distribuye las vistas en fila (horizontal)
        position: 'absolute', // Coloca los colores detrás de la imagen y texto
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    leftSection: {
        backgroundColor: '#E8EDFF', // Color del lado izquierdo (10% de ancho)
        borderTopLeftRadius: 45
    },
    rightSection: {
        borderTopRightRadius: 45,
        backgroundColor: 'white', // Color del lado derecho (90% de ancho)
    },
    thumbnailContainer: {
        alignSelf: 'center',
        marginTop: 20,
    },
    thumbnailImage: {
        width: 275,
        height: 275,
        borderRadius: 40,
    },
    trackName: {
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 20,
        color: "#414862"
    },
    artistName: {
        fontSize: 16,
        color: '#596287',
        textAlign: 'center',
        marginTop: 10,
    },
});
