import { Link } from 'react-router-dom';

export function Logo() {
  return (
    <Link to="/" className="wordmark" aria-label="拾艺院 首页">
      <span className="wordmark__mark" aria-hidden="true">
        拾
      </span>
      <span className="wordmark__text">
        <span className="wordmark__name">拾艺院</span>
        <span className="wordmark__sub">核心知识点库</span>
      </span>
    </Link>
  );
}
