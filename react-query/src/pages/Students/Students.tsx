import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import className from 'classnames'
import { studentApi } from 'api/api'
import { Link } from 'react-router-dom'
import { useQueryString } from 'utils/utils'

const limit = 10
export default function Students() {
  const queryClient = useQueryClient()
  const queryString: { page?: string } = useQueryString()
  const page = Number(queryString.page) || 1

  const useStudentQuery = useQuery({
    queryKey: ['students', page],
    queryFn: () => studentApi.getStudents(page, limit),
    keepPreviousData: true
  })

  const useDeleteStudentMutation = useMutation({
    mutationFn: (id: string | number) => studentApi.deleteStudent(id),
    onSuccess(_, id) {
      queryClient.invalidateQueries({ queryKey: ['students', page], exact: true })
    }
  })

  const handlePrefetchStudent = (id: number | string) => {
    queryClient.prefetchQuery({
      queryKey: ['student', String(id)],
      queryFn: () => studentApi.getStudentById(id as string),
      staleTime: 10000
    })
  }

  const handleDelete = (id: string | number) => {
    useDeleteStudentMutation.mutate(id)
  }
  // const { data, isLoading } = useQuery({
  //   queryKey: ['students', page],
  //   queryFn: () => studentApi.getStudents(page, limit),
  //   keepPreviousData: true
  // })
  const totalItem = Number(useStudentQuery?.data?.headers['x-total-count'] || 0)
  const totalPage = Math.ceil(totalItem / limit)

  return (
    <div>
      <h1 className='text-lg'>Students</h1>
      {useStudentQuery?.isLoading && (
        <div role='status' className='mt-6 animate-pulse'>
          <div className='mb-4 h-4  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10 rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <span className='sr-only'>Loading...</span>
        </div>
      )}
      {!useStudentQuery?.isLoading && useStudentQuery?.data && (
        <>
          <Link to='/students/add' className='mr-5 font-medium text-blue-600 hover:underline dark:text-blue-500'>
            Add
          </Link>
          <div className='relative mt-6 overflow-x-auto shadow-md sm:rounded-lg'>
            <table className='w-full text-left text-sm text-gray-500 dark:text-gray-400'>
              <thead className='bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400'>
                <tr>
                  <th scope='col' className='py-3 px-6'>
                    #
                  </th>
                  <th scope='col' className='py-3 px-6'>
                    Avatar
                  </th>
                  <th scope='col' className='py-3 px-6'>
                    Name
                  </th>
                  <th scope='col' className='py-3 px-6'>
                    Email
                  </th>
                  <th scope='col' className='py-3 px-6'>
                    <span className='sr-only'>Action</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {useStudentQuery?.data?.data.map((student) => (
                  <tr
                    key={student.id}
                    className='border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600'
                    onMouseEnter={(id) => handlePrefetchStudent(student.id)}
                  >
                    <td className='py-4 px-6'>{student.id}</td>
                    <td className='py-4 px-6'>
                      <img src={student.avatar} alt={student.email} className='h-5 w-5' />
                    </td>
                    <th scope='row' className='whitespace-nowrap py-4 px-6 font-medium text-gray-900 dark:text-white'>
                      {student.last_name}
                    </th>
                    <td className='py-4 px-6'>{student.email}</td>
                    <td className='py-4 px-6 text-right'>
                      <Link
                        to={`/students/${student.id}`}
                        className='mr-5 font-medium text-blue-600 hover:underline dark:text-blue-500'
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(student.id)}
                        className='font-medium text-red-600 dark:text-red-500'
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className='mt-6 flex justify-center'>
            <nav aria-label='Page navigation example'>
              <ul className='inline-flex -space-x-px'>
                <li>
                  {page === 1 ? (
                    <span className='cursor-not-allowed rounded-l-lg border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'>
                      Previous
                    </span>
                  ) : (
                    <Link
                      className={className(
                        'border border-gray-300 py-2 px-3 leading-tight text-gray-500 text-gray-500   hover:bg-gray-100  hover:text-gray-700'
                      )}
                      to={`/students?page=${page - 1}`}
                    >
                      Previous
                    </Link>
                  )}
                </li>
                {Array(totalPage)
                  .fill(0)
                  .map((_, index) => {
                    const pageNumber = index + 1
                    const isActive = pageNumber === page
                    return (
                      <li key={pageNumber}>
                        <Link
                          className={className(
                            'border border-gray-300 py-2 px-3 leading-tight text-gray-500 text-gray-500   hover:bg-gray-100  hover:text-gray-700',
                            { 'bg-gray-100 text-gray-700': isActive, 'bg-white text-gray-500': !isActive }
                          )}
                          to={`/students?page=${pageNumber}`}
                        >
                          {pageNumber}
                        </Link>
                      </li>
                    )
                  })}

                <li>
                  {page === totalPage ? (
                    <span className='cursor-not-allowed rounded-r-lg border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'>
                      Next
                    </span>
                  ) : (
                    <Link
                      className={className(
                        'border border-gray-300 py-2 px-3 leading-tight text-gray-500 text-gray-500   hover:bg-gray-100  hover:text-gray-700'
                      )}
                      to={`/students?page=${page + 1}`}
                    >
                      Next
                    </Link>
                  )}
                </li>
              </ul>
            </nav>
          </div>
        </>
      )}
    </div>
  )
}
