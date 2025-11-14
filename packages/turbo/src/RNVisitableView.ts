import {
  NativeSyntheticEvent,
  StyleProp,
  ViewStyle,
  Linking,
} from 'react-native';

import RNVisitableViewNativeComponent, {
  Commands,
} from './RNVisitableViewNativeComponent';
import type {
  AlertHandler,
  DispatchCommandTypes,
  LoadEvent,
  MessageEvent,
  VisitProposal,
  ErrorEvent,
  OpenExternalUrlEvent,
  FormSubmissionEvent,
  ContentProcessDidTerminateEvent,
  ContentInsetObject,
  ProgressViewOffsetObject,
} from './types';

// Interface should match RNVisitableView exported properties in native code
export interface RNVisitableViewProps {
  url: string;
  sessionHandle?: string;
  applicationNameForUserAgent?: string;
  pullToRefreshEnabled: boolean;
  scrollEnabled: boolean;
  contentInset: ContentInsetObject;
  progressViewOffset?: ProgressViewOffsetObject;
  refreshControlTopAnchor: number;
  webViewDebuggingEnabled: boolean;
  onLoad?: (e: NativeSyntheticEvent<LoadEvent>) => void;
  onMessage?: (e: NativeSyntheticEvent<MessageEvent>) => void;
  onError?: (e: NativeSyntheticEvent<ErrorEvent>) => void;
  onVisitProposal?: (e: NativeSyntheticEvent<VisitProposal>) => void;
  onWebAlert?: (e: NativeSyntheticEvent<AlertHandler>) => void;
  onWebConfirm?: (e: NativeSyntheticEvent<AlertHandler>) => void;
  onOpenExternalUrl?: (e: NativeSyntheticEvent<OpenExternalUrlEvent>) => void;
  onFormSubmissionStarted?: (
    e: NativeSyntheticEvent<FormSubmissionEvent>
  ) => void;
  onFormSubmissionFinished?: (
    e: NativeSyntheticEvent<FormSubmissionEvent>
  ) => void;
  onShowLoading: () => void;
  onHideLoading: () => void;
  onContentProcessDidTerminate?: (
    e: NativeSyntheticEvent<ContentProcessDidTerminateEvent>
  ) => void;
  style?: StyleProp<ViewStyle>;
}

const initializeWebView = async (webViewRef: React.RefObject<any>) => {
  const initializationPromise = new Promise<void>((resolve) =>
    setTimeout(resolve, 1)
  );

  if (!webViewRef?.current) {
    return initializationPromise;
  }

  webViewRef.current.initializationPromise =
    webViewRef.current.initializationPromise || initializationPromise;

  return webViewRef.current.initializationPromise;
};

export async function dispatchCommand(
  ref: React.RefObject<any>,
  command: DispatchCommandTypes,
  ...args: any[]
) {
  if (!ref?.current) {
    return;
  }

  // Using initializeWebView makes sure that we call the native method
  // after the native sessionHandle prop is set.
  await initializeWebView(ref);

  switch (command) {
    case 'injectJavaScript':
      Commands.injectJavaScript(ref.current, args[0] as string);
      break;
    case 'reload':
      Commands.reload(ref.current);
      break;
    case 'refresh':
      Commands.refresh(ref.current);
      break;
    case 'sendAlertResult':
      Commands.sendAlertResult(ref.current);
      break;
    case 'sendConfirmResult':
      Commands.sendConfirmResult(ref.current, args[0] as boolean);
      break;
  }
}

export async function openExternalURL({
  url,
}: OpenExternalUrlEvent): Promise<void> {
  const supported = await Linking.canOpenURL(url);

  if (supported) {
    await Linking.openURL(url);
  } else {
    console.error(`Don't know how to open this URL: ${url}`);
  }
}

export default RNVisitableViewNativeComponent;
