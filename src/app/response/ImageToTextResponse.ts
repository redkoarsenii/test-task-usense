interface IBoundingBox {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
}


export interface ImageToTextResponse {
  text: string;
  bounding_box: IBoundingBox
}
