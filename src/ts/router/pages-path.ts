export enum MainPath {
  home = '/',
}

export interface PagesPath {
  main: typeof MainPath;
}


export const pagesPath: PagesPath = Object.freeze({
  main: MainPath,
});
