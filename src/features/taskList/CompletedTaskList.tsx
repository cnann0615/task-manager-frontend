import { useContext } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "@/store/store";
import { tabCategoryContext } from "./TaskList";
import { TaskItem } from "@/@types";
import { completedTaskDelete } from "@/slices/completedTaskSlice";
import { inCompletedTaskAdd } from "@/slices/inCompletedTaskSlice";
import { showTaskDetailContext } from "@/pages";
import taskApi from "@/pages/api/task";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

// 完了タスクリスト
const CompletedTaskList: React.FC = () => {
  const dispatch = useDispatch();

  // 完了タスクStateを取得
  const completedTaskItems = useSelector((state) => state.completedTaskItems);

  // タブカテゴリ管理Stateの値を取得
  const { tabCategory } = useContext(tabCategoryContext);

  // リストに表示するタスクをtabCategoryの値で絞って抽出
  const filteredCompletedTaskItems =
    tabCategory === 0
      ? completedTaskItems.completedTaskItems
      : completedTaskItems.completedTaskItems.filter(
          (completedTaskItem) => completedTaskItem.category.id == tabCategory
        );

  // タスク未完了処理
  const switchInCompleted = async (updateTask: TaskItem) => {
    dispatch(completedTaskDelete(updateTask));
    const _updateTask = { ...updateTask, completed: false };
    dispatch(inCompletedTaskAdd(_updateTask));
    await taskApi.updateTask(_updateTask);
  };

  // タスク詳細表示処理
  const { setShowTaskDetail } = useContext(showTaskDetailContext);
  const openTaskDetail = (taskItem: TaskItem) => {
    setShowTaskDetail(taskItem);
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };

  // ドラッグ＆ドロップ処理
  const onDragEnd = (result: any) => {
    const startIndex = result.source.index;
    const endIndex = result.destination.index;

    if (startIndex === endIndex) {
      return;
    } else if (startIndex < endIndex) {
    } else if (startIndex > endIndex) {
    }
  };

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold mb-2">完了タスク</h2>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="completedTasks">
          {(provided) => (
            <ul
              className="list-none w-full"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {filteredCompletedTaskItems.length == 0 ? (
                <div className="text-gray-500">完了タスクはありません。</div>
              ) : (
                ""
              )}
              {filteredCompletedTaskItems.map((task, index) => (
                <Draggable key={task.id} draggableId={task.title} index={index}>
                  {(provided, snapshot) => (
                    <li
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      ref={provided.innerRef}
                      className="bg-white flex items-center justify-between mb-2 p-2 border"
                    >
                      <button
                        onClick={() => switchInCompleted(task)}
                        className=" text-xl text-blue-500 hover:text-blue-700"
                      >
                        ☑︎
                      </button>
                      <span
                        onClick={() => openTaskDetail(task)}
                        className="cursor-pointer hover:bg-gray-100 flex-grow mx-2 line-through"
                      >
                        {task.title}
                      </span>
                      <span className="text-center w-32">
                        〆 {task.deadLine ? task.deadLine : "なし"}
                      </span>
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default CompletedTaskList;
