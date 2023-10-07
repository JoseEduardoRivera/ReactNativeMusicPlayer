import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HistoryContext = createContext();

export function HistoryProvider({ children }) {
    const [history, setHistory] = useState([]);

    // Cargar el historial desde AsyncStorage al iniciar la aplicación
    useEffect(() => {
        const loadHistory = async () => {
            try {
                const storedHistory = await AsyncStorage.getItem('history');
                if (storedHistory) {
                    const parsedHistory = JSON.parse(storedHistory);
                    setHistory(parsedHistory);
                }
            } catch (error) {
                console.error('Error al cargar el historial desde AsyncStorage:', error);
            }
        };

        loadHistory();
    }, []);

    // Agregar una canción al historial
    const addToHistory = async (track) => {
        // Verificar si la canción ya existe en el historial por su nombre
        const isTrackInHistory = history.some((historyTrack) => historyTrack.name === track.name);

        if (!isTrackInHistory) {
            // Agregar el track al historial
            const updatedHistory = [...history, track].slice(-10); // Mantener solo los últimos 10 elementos
            setHistory(updatedHistory);

            // Guardar el historial en AsyncStorage
            try {
                await AsyncStorage.setItem('history', JSON.stringify(updatedHistory));
            } catch (error) {
                console.error('Error al guardar el historial en AsyncStorage:', error);
            }
        }
    };

    // Obtener la última canción pulsada
    const getLastPressedTrack = () => {
        if (history.length > 0) {
            return history[history.length - 1];
        } else {
            return null; // No hay historial todavía
        }
    };

    return (
        <HistoryContext.Provider value={{ history, addToHistory, getLastPressedTrack }}>
            {children}
        </HistoryContext.Provider>
    );
}

export function useHistory() {
    return useContext(HistoryContext);
}
