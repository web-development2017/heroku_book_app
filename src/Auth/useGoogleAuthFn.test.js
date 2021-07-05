import { renderHook } from '@testing-library/react-hooks';
import { useGoogleAuthFn } from './useGoogleAuthFn';

describe('useGoogleAuthFn', () => {
    test('Initial startupfinished State FALSE', () => {
        const { result } = renderHook(() => useGoogleAuthFn());
        expect(result.current.startupfinished).toBe(false);   
    });
});