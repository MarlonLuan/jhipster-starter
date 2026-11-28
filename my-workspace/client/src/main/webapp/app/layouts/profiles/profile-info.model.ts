export interface InfoResponse {
  'display-ribbon-on-profiles'?: string;
  git?: any;
  build?: any;
  activeProfiles?: string[];
}

export interface ProfileInfo {
  activeProfiles?: string[];
  ribbonEnv?: string;
  inProduction?: boolean;
  openAPIEnabled?: boolean;
}
