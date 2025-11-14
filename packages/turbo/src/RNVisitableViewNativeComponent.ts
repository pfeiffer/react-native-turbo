import type { HostComponent, ViewProps } from 'react-native';
import type {
  DirectEventHandler,
  Double,
  Int32,
  WithDefault,
} from 'react-native/Libraries/Types/CodegenTypes';
import codegenNativeCommands from 'react-native/Libraries/Utilities/codegenNativeCommands';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';

// Event payload types
export interface LoadEvent {
  title: string;
  url: string;
}

// MessageEvent can contain arbitrary data from the web view
export type MessageEvent = Readonly<object>;

export interface ErrorEvent {
  url: string;
  statusCode: Int32;
  description?: string;
}

export interface VisitProposal {
  url: string;
  action: 'advance' | 'replace' | 'restore';
}

export interface AlertHandler {
  message: string;
}

export interface OpenExternalUrlEvent {
  url: string;
}

export interface FormSubmissionEvent {
  url: string;
}

export interface ContentProcessDidTerminateEvent {
  url: string;
}

export interface ShowLoadingEvent {}

export interface HideLoadingEvent {}

export interface ContentInset {
  top?: WithDefault<Double, 0>;
  left?: WithDefault<Double, 0>;
  bottom?: WithDefault<Double, 0>;
  right?: WithDefault<Double, 0>;
}

export interface ProgressViewOffset {
  scale: boolean;
  start: Double;
  end: Double;
}

export interface NativeProps extends ViewProps {
  url: string;
  sessionHandle?: string;
  applicationNameForUserAgent?: string;
  pullToRefreshEnabled?: WithDefault<boolean, false>;
  scrollEnabled?: WithDefault<boolean, true>;
  contentInset?: ContentInset;
  progressViewOffset?: ProgressViewOffset;
  refreshControlTopAnchor?: WithDefault<Double, 0>;
  webViewDebuggingEnabled?: WithDefault<boolean, false>;

  // Events
  onLoad?: DirectEventHandler<LoadEvent>;
  onMessage?: DirectEventHandler<MessageEvent>;
  onError?: DirectEventHandler<ErrorEvent>;
  onVisitProposal?: DirectEventHandler<VisitProposal>;
  onWebAlert?: DirectEventHandler<AlertHandler>;
  onWebConfirm?: DirectEventHandler<AlertHandler>;
  onOpenExternalUrl?: DirectEventHandler<OpenExternalUrlEvent>;
  onFormSubmissionStarted?: DirectEventHandler<FormSubmissionEvent>;
  onFormSubmissionFinished?: DirectEventHandler<FormSubmissionEvent>;
  onShowLoading?: DirectEventHandler<ShowLoadingEvent>;
  onHideLoading?: DirectEventHandler<HideLoadingEvent>;
  onContentProcessDidTerminate?: DirectEventHandler<ContentProcessDidTerminateEvent>;
}

export type ComponentType = HostComponent<NativeProps>;

interface NativeCommands {
  injectJavaScript: (
    viewRef: React.ElementRef<ComponentType>,
    script: string
  ) => void;
  reload: (viewRef: React.ElementRef<ComponentType>) => void;
  refresh: (viewRef: React.ElementRef<ComponentType>) => void;
  sendAlertResult: (viewRef: React.ElementRef<ComponentType>) => void;
  sendConfirmResult: (
    viewRef: React.ElementRef<ComponentType>,
    result: boolean
  ) => void;
}

export const Commands = codegenNativeCommands<NativeCommands>({
  supportedCommands: [
    'injectJavaScript',
    'reload',
    'refresh',
    'sendAlertResult',
    'sendConfirmResult',
  ],
});

export default codegenNativeComponent<NativeProps>('RNVisitableView');
