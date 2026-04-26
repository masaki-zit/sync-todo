/** TODO 画面の view model とテンプレートを結び付けるページファイル。 */
import { TodoTemplate } from "../components/templates/TodoTemplate";
import { useTodoViewModel } from "../viewModels/useTodoViewModel";

/**
 * TODO 画面の view model を生成し、テンプレートへ渡す。
 * @returns TODO 画面
 */
export function TodoPage() {
  const viewModel = useTodoViewModel();
  return <TodoTemplate viewModel={viewModel} />;
}
