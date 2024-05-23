import { useEffect, useState } from "react";
import socketService from "features/match/match-socketService";

export function useWebSocket() {
    const [data, setData] = useState<any>(null);
    
    useEffect(() => {
        socketService.connect("https://movie-match-x5ue.onrender.com/");

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
