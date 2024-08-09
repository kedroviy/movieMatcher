import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "redux/configure-store";
import { getUserStatusByUserIdRedux } from "redux/matchSlice";

export const useGetUserStatusByUserId = (userId: number) => {
    const dispatch: AppDispatch = useDispatch();
    const { userStatus, roomKey } = useSelector((state: any) => state.matchSlice);

    useEffect(() => {
        if (userId && roomKey) {
            dispatch(getUserStatusByUserIdRedux({ roomKey: roomKey, userId: userId }));
        }
        console.log('state userStatus from hook: ', userStatus)
    }, [dispatch, userId, userStatus]);

    return userStatus;
};
