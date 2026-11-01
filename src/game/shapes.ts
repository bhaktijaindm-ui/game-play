import type { ShapeDefinition } from './types';

export const SHAPES_LIBRARY: ShapeDefinition[] = [
  // 1. Single Dot (1 cell)
  {
    id: 'dot_1x1',
    name: 'Single Dot',
    matrix: [[1]],
    rows: 1,
    cols: 1,
    size: 1,
    category: 'small',
  },

  // 2-3. Dominoes (2 cells)
  {
    id: 'line_1x2',
    name: 'Domino H',
    matrix: [[1, 1]],
    rows: 1,
    cols: 2,
    size: 2,
    category: 'small',
  },
  {
    id: 'line_2x1',
    name: 'Domino V',
    matrix: [[1], [1]],
    rows: 2,
    cols: 1,
    size: 2,
    category: 'small',
  },

  // 4-5. Trio Lines (3 cells)
  {
    id: 'line_1x3',
    name: 'Trio H',
    matrix: [[1, 1, 1]],
    rows: 1,
    cols: 3,
    size: 3,
    category: 'small',
  },
  {
    id: 'line_3x1',
    name: 'Trio V',
    matrix: [[1], [1], [1]],
    rows: 3,
    cols: 1,
    size: 3,
    category: 'small',
  },

  // 6-7. Quad Lines (4 cells)
  {
    id: 'line_1x4',
    name: 'Quad H',
    matrix: [[1, 1, 1, 1]],
    rows: 1,
    cols: 4,
    size: 4,
    category: 'medium',
  },
  {
    id: 'line_4x1',
    name: 'Quad V',
    matrix: [[1], [1], [1], [1]],
    rows: 4,
    cols: 1,
    size: 4,
    category: 'medium',
  },

  // 8-9. Penta Lines (5 cells)
  {
    id: 'line_1x5',
    name: 'Penta H',
    matrix: [[1, 1, 1, 1, 1]],
    rows: 1,
    cols: 5,
    size: 5,
    category: 'large',
  },
  {
    id: 'line_5x1',
    name: 'Penta V',
    matrix: [[1], [1], [1], [1], [1]],
    rows: 5,
    cols: 1,
    size: 5,
    category: 'large',
  },

  // 10. Square 2x2
  {
    id: 'square_2x2',
    name: 'Square 2x2',
    matrix: [
      [1, 1],
      [1, 1],
    ],
    rows: 2,
    cols: 2,
    size: 4,
    category: 'medium',
  },

  // 11. Large Square 3x3
  {
    id: 'square_3x3',
    name: 'Big Square 3x3',
    matrix: [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ],
    rows: 3,
    cols: 3,
    size: 9,
    category: 'large',
  },

  // 12-15. Small Corner 2x2 (3 cells each, 4 rotations)
  {
    id: 'corner_2x2_tl',
    name: 'Mini Corner TL',
    matrix: [
      [1, 1],
      [1, 0],
    ],
    rows: 2,
    cols: 2,
    size: 3,
    category: 'small',
  },
  {
    id: 'corner_2x2_tr',
    name: 'Mini Corner TR',
    matrix: [
      [1, 1],
      [0, 1],
    ],
    rows: 2,
    cols: 2,
    size: 3,
    category: 'small',
  },
  {
    id: 'corner_2x2_br',
    name: 'Mini Corner BR',
    matrix: [
      [0, 1],
      [1, 1],
    ],
    rows: 2,
    cols: 2,
    size: 3,
    category: 'small',
  },
  {
    id: 'corner_2x2_bl',
    name: 'Mini Corner BL',
    matrix: [
      [1, 0],
      [1, 1],
    ],
    rows: 2,
    cols: 2,
    size: 3,
    category: 'small',
  },

  // 16-19. Large Corner 3x3 (5 cells each, 4 rotations)
  {
    id: 'corner_3x3_tl',
    name: 'Big Corner TL',
    matrix: [
      [1, 1, 1],
      [1, 0, 0],
      [1, 0, 0],
    ],
    rows: 3,
    cols: 3,
    size: 5,
    category: 'large',
  },
  {
    id: 'corner_3x3_tr',
    name: 'Big Corner TR',
    matrix: [
      [1, 1, 1],
      [0, 0, 1],
      [0, 0, 1],
    ],
    rows: 3,
    cols: 3,
    size: 5,
    category: 'large',
  },
  {
    id: 'corner_3x3_br',
    name: 'Big Corner BR',
    matrix: [
      [0, 0, 1],
      [0, 0, 1],
      [1, 1, 1],
    ],
    rows: 3,
    cols: 3,
    size: 5,
    category: 'large',
  },
  {
    id: 'corner_3x3_bl',
    name: 'Big Corner BL',
    matrix: [
      [1, 0, 0],
      [1, 0, 0],
      [1, 1, 1],
    ],
    rows: 3,
    cols: 3,
    size: 5,
    category: 'large',
  },

  // 20-23. Classic L-Shapes 3x2 & 2x3 (4 cells each)
  {
    id: 'l_shape_up',
    name: 'L-Shape Up',
    matrix: [
      [1, 0],
      [1, 0],
      [1, 1],
    ],
    rows: 3,
    cols: 2,
    size: 4,
    category: 'medium',
  },
  {
    id: 'l_shape_right',
    name: 'L-Shape Right',
    matrix: [
      [1, 1, 1],
      [1, 0, 0],
    ],
    rows: 2,
    cols: 3,
    size: 4,
    category: 'medium',
  },
  {
    id: 'l_shape_down',
    name: 'L-Shape Down',
    matrix: [
      [1, 1],
      [0, 1],
      [0, 1],
    ],
    rows: 3,
    cols: 2,
    size: 4,
    category: 'medium',
  },
  {
    id: 'l_shape_left',
    name: 'L-Shape Left',
    matrix: [
      [0, 0, 1],
      [1, 1, 1],
    ],
    rows: 2,
    cols: 3,
    size: 4,
    category: 'medium',
  },

  // 24-25. T-Shape (4 cells)
  {
    id: 't_shape_down',
    name: 'T-Shape Down',
    matrix: [
      [1, 1, 1],
      [0, 1, 0],
    ],
    rows: 2,
    cols: 3,
    size: 4,
    category: 'medium',
  },
  {
    id: 't_shape_up',
    name: 'T-Shape Up',
    matrix: [
      [0, 1, 0],
      [1, 1, 1],
    ],
    rows: 2,
    cols: 3,
    size: 4,
    category: 'medium',
  },
];
