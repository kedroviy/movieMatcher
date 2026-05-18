import { createAuthenticatedApi } from '../../shared/api/create-authenticated-api';
import { API, FeedbackMessage } from '../../shared';

export class FeedbackApiError extends Error {
    constructor(message: string, readonly status?: number, readonly code?: 'UNAUTHORIZED' | 'UNKNOWN') {
        super(message);
        this.name = 'FeedbackApiError';
    }
}

const parseFeedbackError = (response: { status?: number | null; data?: unknown; problem?: string | null }): never => {
    if (response.status === 401) {
        throw new FeedbackApiError('Session expired. Please sign in again.', 401, 'UNAUTHORIZED');
    }

    const data = response.data as { message?: string | string[] } | undefined;
    const message = Array.isArray(data?.message) ? data.message.join(', ') : data?.message;

    throw new FeedbackApiError(message || response.problem || 'Unknown API error', response.status ?? undefined);
};

export const getMyFeedbackMessages = async (signal?: AbortSignal): Promise<FeedbackMessage[]> => {
    const api = await createAuthenticatedApi();
    const response = await api.get<FeedbackMessage[]>(API.FEEDBACK_MY, undefined, { signal });

    if (response.ok && response.data) {
        return response.data;
    }

    parseFeedbackError(response);
};

export const createFeedbackMessage = async (text: string, signal?: AbortSignal): Promise<FeedbackMessage> => {
    const api = await createAuthenticatedApi();
    const response = await api.post<FeedbackMessage>(API.FEEDBACK, { text }, { signal });

    if (response.ok && response.data) {
        return response.data;
    }

    parseFeedbackError(response);
};
