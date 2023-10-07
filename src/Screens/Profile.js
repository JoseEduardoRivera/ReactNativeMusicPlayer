import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Image, Dimensions, ScrollView } from 'react-native'
import React, { useRef, useCallback, useState, useEffect } from 'react'
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { useHistory } from '../context/HistoryProvider';
import { useNavigation } from "@react-navigation/native"

const { width } = Dimensions.get("window")

export function Profile() {
    const { history, addToHistory } = useHistory()

    const navigation = useNavigation();

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

    const goToDetails = useCallback(async (track) => {
        if (track) {
            // Agregar la canción al historial utilizando el contexto
            addToHistory(track);
            // Navegar a la pantalla Details
            navigation.navigate('Detalles', { track });
        }
    }, [addToHistory, navigation]);

    return (
        <>
            <SafeAreaView style={styles.container}>
                <View style={styles.content}>
                    <Text style={styles.title}>Mi perfil</Text>
                    <Text style={styles.subtitle}>Últimas canciones reproducidas</Text>
                    <FlatList
                        data={history}
                        keyExtractor={(item, index) => `${index}`}
                        renderItem={({ item }) => (
                            <View style={styles.itemContainer}>
                                <TouchableOpacity onPress={() => goToDetails(item)}>
                                    <View style={styles.leftContainer}>
                                        <View style={styles.thumbnail}>
                                            {item.image ? (
                                                <Image source={{ uri: item.image }} style={{ width: 60, height: 60, borderRadius: 10 }} />
                                            ) : (
                                                <Image source={require('../../assets/defaultAlbum.png')} style={{ width: 60, height: 60, borderRadius: 10 }} />
                                            )}
                                        </View>
                                        <View style={styles.titleContainer}>
                                            <Text numberOfLines={1} ellipsizeMode='tail' style={styles.infoSong}>
                                                {convertTime(item.duration)}
                                            </Text>
                                            <Text style={styles.songTitle} numberOfLines={1} ellipsizeMode='tail'>{item.name}</Text>
                                            <Text style={styles.songBand}>{item.artist}</Text>
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
                        )}
                    />
                </View>
            </SafeAreaView>
        </>
    )
}

const styles = StyleSheet.create({
    modalSong: {
        backgroundColor: "white",
        height: 175,
        borderTopRightRadius: 50,
        borderTopLeftRadius: 50,
        marginHorizontal: -15,
    },
    container: {
        flex: 1,
        backgroundColor: "#1D233A",
        alignItems: 'center', // Centra horizontalmente en el contenedor
    },
    content: {
        flex: 1,
    },
    title: {
        textAlign: 'center', // Centra el texto horizontalmente
        fontSize: 24,
        fontWeight: 'bold',
        color: "white"
    },
    subtitle: {
        textAlign: 'center', // Centra el texto horizontalmente
        fontSize: 16,
        color: "white",
        paddingBottom: 20
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
    titleContainer: {
        width: width - 150,
        paddingLeft: 10,
    }
    ,
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
})
