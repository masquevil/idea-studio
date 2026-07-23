export interface NavChild {
  name: string;
  path: string;
}

export interface NavTab {
  label: string;
  children: NavChild[];
}
