import { useCallback, useRef } from 'react';
import type { NativeSyntheticEvent } from 'react-native';

import type { SessionMessageCallback, MessageEvent } from '../types';

type SessionMessageCallbackArrayElement = SessionMessageCallback | undefined;

export function useMessageQueue(
  onMessageCallback: SessionMessageCallback | undefined
) {
  const onMessageCallbacks = useRef<SessionMessageCallbackArrayElement[]>([
    onMessageCallback,
  ]);

  const registerMessageListener = useCallback(
    (listener: SessionMessageCallback) => {
      onMessageCallbacks.current.push(listener);

      return {
        remove: () => {
          onMessageCallbacks.current = onMessageCallbacks.current.filter(
            (callback) => callback !== listener
          );
        },
      };
    },
    []
  );

  const handleOnMessage = useCallback(
    (e: NativeSyntheticEvent<MessageEvent>) => {
      let message: object;
      try {
        message = JSON.parse(e.nativeEvent.message);
      } catch (error) {
        console.error('Failed to parse message from native:', error);
        return;
      }

      onMessageCallbacks.current.forEach((listener) => {
        listener?.(message);
      });
    },
    []
  );

  return { registerMessageListener, handleOnMessage };
}
