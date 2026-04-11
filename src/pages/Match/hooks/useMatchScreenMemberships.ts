import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    getMyRoomMembershipsService,
    leaveMyRoomMembershipService,
    type UserRoomMembership,
} from 'features/match/match-service';

export const matchMembershipsQueryKey = (userId: number | undefined) => ['rooms', 'my-memberships', userId] as const;

type UseMatchScreenMembershipsOptions = {
    userId: number | undefined;
    enabled: boolean;
    onMembershipsChanged?: () => void;
};

export function useMatchScreenMemberships({ userId, enabled, onMembershipsChanged }: UseMatchScreenMembershipsOptions) {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: [...matchMembershipsQueryKey(userId)],
        queryFn: () => getMyRoomMembershipsService(),
        enabled: Boolean(enabled && userId),
    });

    const leaveMutation = useMutation({
        mutationFn: (roomKey: string) => leaveMyRoomMembershipService(roomKey),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['rooms', 'my-memberships'] });
            onMembershipsChanged?.();
        },
    });

    const leavingRoomKey =
        leaveMutation.isPending && typeof leaveMutation.variables === 'string' ? leaveMutation.variables : null;

    return {
        memberships: (query.data ?? []) as UserRoomMembership[],
        isLoading: query.isLoading,
        refetch: query.refetch,
        leaveRoom: leaveMutation.mutateAsync,
        leavingRoomKey,
        isLeaving: leaveMutation.isPending,
    };
}
