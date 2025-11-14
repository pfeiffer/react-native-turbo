import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  getSessionHandles(): Promise<string[]>;
  reloadSession(sessionHandle: string): Promise<void>;
  refreshSession(sessionHandle: string): Promise<void>;
  clearSessionSnapshotCache(sessionHandle: string): Promise<void>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('RNSessionManager');
