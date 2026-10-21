// areaPerimeterVolumeFormulas.ts
export const APV_FORMULAS: { label?: string; items: string[] }[] = [
  {
    "label": "Area (2D)",
    "items": [
      "Rectangle: A = l × w",
      "Square: A = s²",
      "Triangle: A = ½ × b × h",
      "Circle: A = π × r²",
      "Parallelogram: A = b × h",
      "Trapezoid: A = ½ × (a + b) × h"
    ]
  },
  {
    "label": "Perimeter / Circumference",
    "items": [
      "Rectangle: P = 2 × (l + w)",
      "Square: P = 4 × s",
      "Triangle: P = a + b + c",
      "Circle: C = 2 × π × r"
    ]
  },
  {
    "label": "Volume (3D)",
    "items": [
      "Cube: V = s³",
      "Rectangular prism: V = l × w × h",
      "Cylinder: V = π × r² × h",
      "Cone: V = (1/3) × π × r² × h",
      "Sphere: V = (4/3) × π × r³",
      "Pyramid: V = (1/3) × B × h"
    ]
  },
  {
    "label": "Surface area",
    "items": [
      "Cube: SA = 6 × s²",
      "Rectangular prism: SA = 2 × (lw + lh + wh)",
      "Sphere: SA = 4 × π × r²",
      "Cylinder: SA = 2 × π × r × (r + h)"
    ]
  }
];
