/** 图表页唯一的主动作：调用浏览器打印。 */
export function PrintButton() {
  return (
    <button type="button" onClick={() => window.print()} className="btn btn-primary print:hidden">
      Print
    </button>
  );
}
