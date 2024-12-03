import { useEffect, useRef, useState } from 'react';
import '../style/App.css';
import { asyncGet } from '../utils/fetch';
import { api } from '../enum/api';
import { Student } from '../interface/Student';
import { resp } from '../interface/resp';

function App() {
  const [students, setStudents] = useState<Array<Student>>([]);
  const [search, setSearch] = useState<string>('');
  const [filteredStudents, setFilteredStudents] = useState<Array<Student>>([]);
  const [departmentCounts, setDepartmentCounts] = useState<Record<string, number>>({});
  const cache = useRef<boolean>(false);

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

  
    
      <div className="container">
            {studentList}
      </div>

    </>
  )

}

export default App;