import { Student, Students } from './../types/student'
import http from 'utils/http'
import { idText } from 'typescript'

export const studentApi = {
  getStudents: (page: number | string, limit: number | string) =>
    http.get<Students>('students', {
      params: {
        _page: page,
        _limit: limit
      }
    }),

  getStudentById: (id: string | number) => http.get<Student>(`students/${id}`),

  addStudent: (student: Omit<Student, 'id'>) => http.post<Student>('/students', student),

  editStudent: (id: number | string, student: Student) => http.put<Student>(`students/${id}`, student),

  deleteStudent: (id: string | number) => http.delete(`students/${id}`)
}
