import { useEffect, useState } from "react";
import socketService from "features/match/match-socketService";
import { API } from "shared";

export function useWebSocket() {
    const [data, setData] = useState<any>(null);
    
    useEffect(() => {
        socketService.connect(API.BASE_URL);

        socketService.subscribeToMatchUpdates((dataFromSocket: any) => {
            setData(dataFromSocket);
        });

        return () => {
            socketService.unsubscribeFromMatchUpdates();
            socketService.disconnect();
        };
    }, []);

    return data;
}

export function useFetchMoviesAfterEvent () {
    const [movies, setMovies] = useState<any>([]);

    useEffect(() => {
        socketService.subscribeToBroadcastMovies((data) => {
            console.log('ws hook: ',data);
            setMovies(data);
        });

        return () => {
            socketService.unsubscribeFromMatchUpdates();
            socketService.disconnect();
        };
    }, []);

    return movies;
}
