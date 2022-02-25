export interface IRegion {
  id?: string;
  regionName?: string | null;
}

export class Region implements IRegion {
  constructor(public id?: string, public regionName?: string | null) {}
}

export function getRegionIdentifier(region: IRegion): string | undefined {
  return region.id;
}
