import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Student } from "../interface/Student";

function StudentDetail() {
  const { id } = useParams<{ id: string }>(); // 獲取路由參數
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<string>("");

  // 獲取學生詳細資料
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await fetch(`http://localhost:2083/api/v1/user/${id}`);
        const data = await response.json();

        // 確保資料中的body存在，並從中提取學生資料
        if (data && data.body) {
          setStudent(data.body);
        } else {
          setMessage("找不到學生資料");
        }
      } catch (error) {
        setMessage("載入資料失敗！");
      }
    };

    fetchStudent();
  }, [id]);

  // 更新學生資料
  const handleUpdate = async () => {
    if (!student) return;
    setIsProcessing(true);

    // 構建請求體，根據後端要求格式進行更新
    const updatedData = {
      id: student._id, // 使用學生的 _id
      name: student.name, // 更新名字
    };

    try {
      const response = await fetch(
        `http://localhost:2083/api/v1/user/updateNameByID`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedData), // 傳送更新資料
        }
      );

      if (response.ok) {
        setMessage("修改成功！");
      } else {
        const errorResult = await response.json();
        setMessage("修改失敗：" + errorResult.message);
      }
    } catch (error) {
      setMessage("發生錯誤！");
    } finally {
      setIsProcessing(false);
    }
  };

  // 刪除學生資料
  const handleDelete = async () => {
    if (!window.confirm("確定要刪除此學生嗎？")) return;
    setIsProcessing(true);
    try {
      const response = await fetch(
        `http://localhost:2083/api/v1/user/deleteById?id=${id}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        alert("刪除成功！");
        navigate("/"); // 返回主頁
      } else {
        const errorResult = await response.json();
        setMessage("刪除失敗：" + errorResult.message);
      }
    } catch (error) {
      setMessage("發生錯誤！");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!student) return <p>{message || "正在載入資料..."}</p>;

  return (
    <div className="student-detail">
      <h1>學生詳細資料</h1>
      <p>帳號: {student.userName}</p>
      <p>姓名: {student.name}</p>
      <p>座號: {student.sid}</p>
      <p>院系: {student.department}</p>
      <p>年級: {student.grade}</p>
      <p>班級: {student.class}</p>
      <p>Email: {student.email}</p>

      {/* 修改表單 */}
      <input
        type="text"
        value={student.name}
        onChange={(e) => setStudent({ ...student, name: e.target.value })}
      />
      <button onClick={handleUpdate} disabled={isProcessing}>
        確認修改
      </button>
      <button onClick={handleDelete} disabled={isProcessing}>
        確認刪除
      </button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default StudentDetail;
