/** アプリ全体の最上位ページを差し替え可能な薄い入口として保つファイル。 */
import { TodoPage } from "./pages/TodoPage";

/**
 * アプリケーションのルート要素を返す。
 * @returns ルート画面
 */
export function App() {
  return <TodoPage />;
}
