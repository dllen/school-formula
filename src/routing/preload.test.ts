import { describe, expect, it } from 'vitest';
import { routeKeyForPath } from './preload';

describe('routeKeyForPath', () => {
  it('maps app and english routes to their lazy modules', () => {
    expect(routeKeyForPath('/')).toBe('home');
    expect(routeKeyForPath('/tutorial')).toBe('home');
    expect(routeKeyForPath('/knowledge/p-math-1')).toBe('knowledgeDetail');
    expect(routeKeyForPath('/poetry/primary-tang-jing-ye-si')).toBe('poemDetail');
    expect(routeKeyForPath('/en/')).toBe('referenceIndex');
    expect(routeKeyForPath('/en/math/')).toBe('referenceCategory');
    expect(routeKeyForPath('/en/math/multiplication-chart/')).toBe('referencePage');
  });
});
describe('routeKeyForPath 的 /yuwen 映射', () => {
  it('把 9 类 /yuwen 路径映射到对应页面 chunk', () => {
    expect(routeKeyForPath('/yuwen')).toBe('yuwenIndex');
    expect(routeKeyForPath('/yuwen/book/1a')).toBe('yuwenBook');
    expect(routeKeyForPath('/yuwen/lesson/G1A01')).toBe('yuwenLesson');
    expect(routeKeyForPath('/yuwen/review/1a/1')).toBe('yuwenReview');
    expect(routeKeyForPath('/yuwen/tingxie/1a/1')).toBe('yuwenTingxie');
    expect(routeKeyForPath('/yuwen/char/%E5%A4%A9')).toBe('yuwenChar');
    expect(routeKeyForPath('/yuwen/pinyin')).toBe('yuwenPinyinIndex');
    expect(routeKeyForPath('/yuwen/pinyin/a')).toBe('yuwenPinyinStem');
    expect(routeKeyForPath('/yuwen/duoyin')).toBe('yuwenDuoyin');
  });

  it('/yuwenx 不误判', () => {
    expect(routeKeyForPath('/yuwenx')).toBe('home');
  });
});
