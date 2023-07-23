declare module 'decode-dxt' {
  export type DXTFormat = 'dxt1' | 'dxt2' | 'dxt3' | 'dxt4' | 'dxt4';

  export type DecodeDXTFn = {
    (
      imageDataView: DataView,
      width: number,
      height: number,
      format: DXTFormat
    ): Uint8Array;
  } & {
    [F in DXTFormat]: F;
  };

  const decodeDXT: DecodeDXTFn;
  export default decodeDXT;
}
