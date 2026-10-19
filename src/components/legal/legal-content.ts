export const LEGAL_PATHS = ['/privacy', '/terms', '/about', '/contact'] as const;
export type LegalPath = (typeof LEGAL_PATHS)[number];

export interface LegalPageContent {
  title: string;
  description: string;
  sections: { heading: string; paragraphs: string[] }[];
}

export const LEGAL_CONTENT: Record<LegalPath, LegalPageContent> = {
  '/privacy': {
    title: '隐私政策',
    description: '拾艺院如何收集、使用与保护访问者信息。',
    sections: [
      { heading: '我们收集什么', paragraphs: ['英文速查表页面不需要注册，不收集姓名、邮箱或儿童个人信息。', '站点使用 Google Analytics 与 AdSense 统计访问与展示广告，可能设置 Cookie。'] },
      { heading: '我们如何使用', paragraphs: ['用于了解页面访问情况与改进内容，不用于出售或出租个人信息。'] },
      { heading: '联系', paragraphs: ['如有问题请联系 support@syy.global。'] },
    ],
  },
  '/terms': {
    title: '服务条款',
    description: '使用拾艺院站点与可打印资料的条款。',
    sections: [
      { heading: '使用许可', paragraphs: ['可打印资料供个人、家庭与课堂教学免费使用，不得转售或打包再分发。'] },
      { heading: '内容准确性', paragraphs: ['我们尽力核对图表数据；如发现错误，欢迎通过 support@syy.global 告知。'] },
    ],
  },
  '/about': {
    title: '关于我们',
    description: '拾艺院是谁，以及这些可打印资料是怎么做的。',
    sections: [
      { heading: '我们做什么', paragraphs: ['拾艺院整理中小学阶段常用的参考图表，做成可以直接打印的一页纸。'] },
      { heading: '怎么制作', paragraphs: ['每张图表由编辑核对数据后排版，并在 A4 与 Letter 两种纸张上检查分页。'] },
    ],
  },
  '/contact': {
    title: '联系我们',
    description: '反馈错误、建议新图表或咨询合作。',
    sections: [
      { heading: '邮件', paragraphs: ['support@syy.global，通常 2 个工作日内回复。'] },
      { heading: '内容纠错', paragraphs: ['请附上页面链接与具体行，方便我们核对。'] },
    ],
  },
};
