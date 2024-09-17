import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface ISnapAndShareProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  context: WebPartContext; // Replace 'any' with the actual type for your SPFx context
}
