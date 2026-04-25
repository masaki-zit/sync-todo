import { TodoTemplate } from "../components/templates/TodoTemplate";
import { useTodoViewModel } from "../viewModels/useTodoViewModel";

export function TodoPage() {
  const viewModel = useTodoViewModel();
  return <TodoTemplate viewModel={viewModel} />;
}
