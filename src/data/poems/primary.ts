import type { Poem } from './types';

export const PRIMARY_POEMS: Poem[] = [
  {
    id: 'primary-tang-jing-ye-si',
    title: '静夜思',
    author: '李白',
    dynasty: 'tang',
    form: '五言绝句',
    grade: 'primary',
    content: ['床前明月光', '疑是地上霜', '举头望明月', '低头思故乡'],
    pinyin: [
      'chuáng qián míng yuè guāng',
      'yí shì dì shàng shuāng',
      'jǔ tóu wàng míng yuè',
      'dī tóu sī gù xiāng',
    ],
    translation:
      '明亮的月光洒在床前的窗户纸上，好像地上泛起了一层霜。我抬起头来，看那天窗外空中的一轮明月，不由得低头沉思，想起远方的家乡。',
    appreciation:
      '全诗语言清新朴素，运用比喻和动作描写，把游子的思乡之情表达得含蓄而深远。短短二十字，写尽了静夜望月触发的乡愁，是千古传诵的思乡名作。',
    theme: '思乡',
  },
  {
    id: 'primary-tang-chun-xiao',
    title: '春晓',
    author: '孟浩然',
    dynasty: 'tang',
    form: '五言绝句',
    grade: 'primary',
    content: ['春眠不觉晓', '处处闻啼鸟', '夜来风雨声', '花落知多少'],
    pinyin: [
      'chūn mián bù jué xiǎo',
      'chǔ chǔ wén tí niǎo',
      'yè lái fēng yǔ shēng',
      'huā luò zhī duō shǎo',
    ],
    translation:
      '春日里贪睡不知不觉天就亮了，到处可以听见小鸟的啼鸣声。回想昨夜的阵阵风雨声，不知吹落了多少娇美的春花。',
    appreciation:
      '诗人抓住春天的早晨刚刚醒来时的一瞬间展开联想，描绘了春天早晨的明媚景色和诗人对落花的惋惜，语言平易浅近，却富有诗情画意。',
    theme: '写景',
  },
];