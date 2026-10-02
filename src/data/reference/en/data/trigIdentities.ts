/** 三角恒等式的分组。标签是英文，无法中立化——`es/` 需另行撰写这一份。 */
export const TRIG_IDENTITY_GROUPS: { label?: string; items: string[] }[] = [
  {
    label: 'Pythagorean',
    items: ['sin²θ + cos²θ = 1', 'tanθ = sinθ / cosθ', '1 + tan²θ = sec²θ', '1 + cot²θ = csc²θ'],
  },
  {
    label: 'Sum / difference',
    items: [
      'sin(α ± β) = sinα cosβ ± cosα sinβ',
      'cos(α ± β) = cosα cosβ ∓ sinα sinβ',
      'tan(α ± β) = (tanα ± tanβ) / (1 ∓ tanα tanβ)',
    ],
  },
  {
    label: 'Double angle',
    items: [
      'sin2α = 2 sinα cosα',
      'cos2α = cos²α − sin²α = 2cos²α − 1 = 1 − 2sin²α',
      'tan2α = 2tanα / (1 − tan²α)',
    ],
  },
  {
    label: 'Half angle',
    items: ['sin²(α/2) = (1 − cosα) / 2', 'cos²(α/2) = (1 + cosα) / 2'],
  },
];
