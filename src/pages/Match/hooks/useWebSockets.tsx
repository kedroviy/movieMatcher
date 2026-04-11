import { useEffect, useState } from 'react';
import socketService from 'features/match/match-socketService';

export function useWebSocket() {
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        const unsub = socketService.subscribeToMatchUpdates((dataFromSocket: any) => {
            console.log(dataFromSocket);
            setData(dataFromSocket);
        });

        return () => {
            unsub();
        };
    }, []);

    return data;
}

// export function useFetchMoviesAfterEvent () {
//     const [movies, setMovies] = useState<any>([]);

//     useEffect(() => {
//         socketService.subscribeToBroadcastMovies((data) => {
//             console.log('ws hook: ',data);
//             setMovies(data);
//         });

//         return () => {
//             socketService.unsubscribeFromMatchUpdates();
//             socketService.disconnect();
//         };
//     }, []);

//     return movies;
// }
