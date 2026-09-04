import { useStompClient } from "./useStompClient";

export const useIncomingCall = (onIncomingCall) => {
  return useStompClient({ onIncomingCall });
};
