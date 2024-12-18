import { useEffect, useRef, useState } from 'react';
import '../style/App.css';
import { asyncGet } from '../utils/fetch';
import { api } from '../enum/api';
import { Student } from '../interface/Student';
import { resp } from '../interface/resp';
import { Link } from "react-router-dom";

function App() {
  const [students, setStudents] = useState<Array<Student>>([]);
  const [search, setSearch] = useState<string>('');
  const [filteredStudents, setFilteredStudents] = useState<Array<Student>>([]);
  const [departmentCounts, setDepartmentCounts] = useState<Record<string, number>>({});
  const cache = useRef<boolean>(false);

  const [newStudent, setNewStudent] = useState({
    userName: "",
    name: "",
    department: "",
    grade: "",
    class: "",
    Email: "",
  }); // 初始化表單資料
  const [message, setMessage] = useState(""); // 顯示結果訊息
   // 提交新增學生的請求
   const handleAddStudent = async () => {
    try {
      const response = await fetch(
        "http://localhost:2083/api/v1/user/insertOne",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newStudent), // 轉為 JSON 發送
        }
      );

      if (response.ok) {
        const result = await response.json();
        setMessage("新增成功！ID：" + result._id); // 成功訊息
        setNewStudent({
          userName: "",
          name: "",
          department: "",
          grade: "",
          class: "",
          Email: "",
        }); // 清空表單
      } else {
        const errorResult = await response.json();
        setMessage("新增失敗：" + errorResult.message); // 顯示錯誤訊息
      }
    } catch (error) {
      setMessage("發生錯誤：" ); // 捕捉網路錯誤
    }
  };



  useEffect(() => {
    if (!cache.current) {
      cache.current = true;
      asyncGet(api.findAll).then((res: resp<Array<Student>>) => {
        if (res.code === 200) {
          setStudents(res.body);
        }
      });
    }
  }, []);

  // 統計各系人數
  useEffect(() => {
    const counts: Record<string, number> = {};

    students.forEach((student) => {
      const department = student.department;
      if (counts[department]) {
        counts[department]++;
      } else {
        counts[department] = 1;
      }
    });

    setDepartmentCounts(counts);
  }, [students]);

  useEffect(() => {
    // 根據搜尋條件篩選學生
    const updatedList = students.filter((student) =>
      student.name.includes(search)
    );
    setFilteredStudents(updatedList);
  }, [search, students]);

  const studentList = filteredStudents.map((student: Student) => (
    <div className="student" key={student._id}>
      <p>帳號: {student.userName}</p>
      <p>座號: {student.sid}</p>
      <p>姓名: {student.name}</p>
      <p>院系: {student.department}</p>
      <p>年級: {student.grade}</p>
      <p>班級: {student.class}</p>
      <p>Email: {student.email}</p>
      <p>缺席次數: {student.absences ? student.absences : 0}</p>
      <Link to={`/student/${student._id}`}>
      <button>查看詳細</button>
    </Link>
    </div>
  ));

  // 顯示各系統計結果
  const departmentStats = Object.entries(departmentCounts).map(([department, count]) => (
    <div key={department}>
      <p>{department}: {count}人</p>
    </div>
  ));

  return (
    <>
      <h1>學生搜尋</h1>

      {/* 搜尋欄 */}
      <input
        type="text"
        placeholder="輸入學生姓名"
        value={search}
        onChange={(e) => setSearch(e.target.value)}

      />
      <h2>各系人數統計</h2>
      {departmentStats}
      <div style={{ padding: "20px" }}>
      <h1>新增學生資料</h1>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "400px", margin: "0 auto" }}>
        <input
          type="text"
          placeholder="帳號 (userName)"
          value={newStudent.userName}
          onChange={(e) =>
            setNewStudent({ ...newStudent, userName: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="姓名 (name)"
          value={newStudent.name}
          onChange={(e) =>
            setNewStudent({ ...newStudent, name: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="院系 (department)"
          value={newStudent.department}
          onChange={(e) =>
            setNewStudent({ ...newStudent, department: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="年級 (grade)"
          value={newStudent.grade}
          onChange={(e) =>
            setNewStudent({ ...newStudent, grade: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="班級 (class)"
          value={newStudent.class}
          onChange={(e) =>
            setNewStudent({ ...newStudent, class: e.target.value })
          }
        />
        <input
          type="email"
          placeholder="Email"
          value={newStudent.Email}
          onChange={(e) =>
            setNewStudent({ ...newStudent, Email: e.target.value })
          }
        />
        <button onClick={handleAddStudent}>提交新增學生</button>
      </div>
      {message && <p>{message}</p>} {/* 顯示操作訊息 */}
    </div>
  
  
    
      <div className="container">
            {studentList}
      </div>

    </>
  )

}

export default App;
