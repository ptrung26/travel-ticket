export interface ILayoutMenu {
  text: string;
  link?: string;
  permission?: string;
  level: number;
  children?: ILayoutMenu[];
}
