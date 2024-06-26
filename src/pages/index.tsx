import { NextPage } from "next";
import React, {
  useState,
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";
import { useDispatch } from "react-redux";

import TaskAdd from "@/features/taskAdd/TaskAdd";
import CategoryAdd from "@/features/categoryAdd/CategoryAdd";
import TaskList from "@/features/taskList/TaskList";
import TaskDetail from "@/features/taskDetails/TaskDetail";
import { Category, TaskItem } from "@/@types";
import taskApi from "./api/task";
import { inCompletedTaskAdd } from "@/slices/inCompletedTaskSlice";
import { completedTaskAdd } from "@/slices/completedTaskSlice";
import { categoryAdd } from "@/slices/categorySlice";

// 詳細表示対象タスクの状態とその更新関数の型を定義
type ShowTaskDetail = {
  showTaskDetail: TaskItem;
  setShowTaskDetail: Dispatch<SetStateAction<TaskItem>>;
};
// 詳細表示対象タスクStateを作成
export const showTaskDetailContext = createContext<ShowTaskDetail>({
  showTaskDetail: null,
  setShowTaskDetail: () => {}, // この関数はダミー。実際にはuseStateによって提供される関数に置き換わる。
});

const Home: NextPage = () => {
  // 詳細表示対象タスクをStateで管理
  const [showTaskDetail, setShowTaskDetail] = useState<TaskItem>(null);

  const dispatch = useDispatch();

  // APIを経由してデータベースから未完了タスクと完了タスク、カテゴリを取得し、それぞれのStateに反映
  useEffect(() => {
    (async () => {
      // 未完了タスク取得
      const inCompletedTaskItems: TaskItem[] =
        await taskApi.inCompletedTaskGet();
      // 完了タスク取得
      const completedTaskItems: TaskItem[] = await taskApi.completedTaskGet();
      // 取得した未完了タスクを未完了タスクStateに反映
      inCompletedTaskItems.forEach((inCompletedTaskItem) =>
        dispatch(inCompletedTaskAdd(inCompletedTaskItem))
      );
      // 取得した完了タスクを完了タスクStateに反映
      completedTaskItems.forEach((completedTaskItem) =>
        dispatch(completedTaskAdd(completedTaskItem))
      );
    })();
  }, []);

  return (
    <>
      <showTaskDetailContext.Provider
        value={{ showTaskDetail, setShowTaskDetail }}
      >
        <div className="md:flex">
          <div className="md:w-1/3 p-4">
            <TaskAdd />
            <CategoryAdd />
          </div>
          <div className="md:w-2/3 p-4">
            <TaskList />
          </div>
        </div>
        {showTaskDetail && <TaskDetail />}
      </showTaskDetailContext.Provider>
    </>
  );
};

export default Home;
