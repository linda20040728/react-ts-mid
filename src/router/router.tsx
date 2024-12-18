import { createHashRouter } from "react-router";
import App from '../view/App';
import StudentDetail from "../view/StudentDetail";


export const router = createHashRouter([
    {
        path: "/",
        element: <App />,
    },
    {
        path: "/student/:id",
        element: <StudentDetail />, // 新增的詳細頁面
      },
])