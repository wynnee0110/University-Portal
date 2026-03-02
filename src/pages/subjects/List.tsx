import React from 'react'
import { ListView } from '@/components/refine-ui/views/list-view'
import { Breadcrumb } from '@/components/refine-ui/layout/breadcrumb'
import { Search } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DEPARTMENT_OPTIONS } from '@/constants'
import { CreateButton } from '@/components/refine-ui/buttons/create'
import { useTable } from '@refinedev/react-table'
import { Subject } from '@/types'
import { useMemo } from 'react'
import { Badge } from '@/components/ui/badge'
import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/refine-ui/data-table/data-table'
import { CrudFilters } from "@refinedev/core";


const SubjectList = () => {
    const [searchQuery, setSearchQuery] = React.useState('')
    const [selectedDepartment, setSelectedDepartment] = React.useState('all')
    const departmentFilters: CrudFilters =
  selectedDepartment === "all"
    ? []
    : [
        {
          field: "department",
          operator: "eq",
          value: selectedDepartment,
        },
      ];

const searchFilter: CrudFilters =
  searchQuery === ""
    ? []
    : [
        {
          field: "name",
          operator: "contains",
          value: searchQuery,
        }
      ];
    
    const subjectsTable = useTable<Subject>({
      columns: useMemo<ColumnDef<Subject>[]>(() => [
        {
          id: 'code',
          accessorKey: 'code',
          size: 100,
          header: () => <p className="column-title ml-2">Code</p>,
          cell: ({getValue}) => <Badge>{getValue<string>()}</Badge>,
          
        },

        {
          id: 'name',
          accessorKey: 'name',
          size: 200,
          header: () => <p className="column-title ml-2">Name</p>,
          cell: ({getValue}) => <span className='text-foreground font-medium'>{getValue<string>()}</span>,
          filterFn:'includesString'
        },
        {
          id: 'department',
          accessorKey: 'department.name',
          size: 150,
          header: () => <p className="column-title ml-2">Department</p>,
          cell: ({getValue}) => <Badge variant='secondary'>{getValue<string>()}</Badge>,
          filterFn:'includesString'
        },
        {
          id: 'description',
          accessorKey: 'description',
          header: () => <p className='column-title ml-2'>Description</p>,
          cell: ({getValue}) => <span className='text-foreground font-medium'>{getValue<string>()}</span>,
          filterFn:'includesString'


        }

      ],[]),
      refineCoreProps: {
        resource: 'subjects',
        pagination: {
        pageSize: 10,
        mode: 'server'},
        filters:{
          permanent: [...departmentFilters, ...searchFilter],
          
        },
        sorters:{
          initial: [
            {
              field: 'name',
              order: 'desc',
            }
          
          ]
        },

      }

    });
  return (
    <ListView>
      <Breadcrumb/>
      <h1 className='page-title'>Subjects</h1>
     
     
      <div className='intro-row'>
        <p className='intro-text'>quick access to essential metrics and management tools.</p>
        
        <div className='actions-row '>
          <div className='search-field'>
          <Search className='search-icon size-5 pb-2'/>
          <input type="text" placeholder='Search by name...'
          className='pl-10 w-full'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}/>

          </div>
          <div className='flex gap-2 w-full sm:w-auto'>


          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger>
              <SelectValue placeholder='Filter by department'/>

            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Departments

              </SelectItem>
              {DEPARTMENT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}

            </SelectContent>
          </Select>
          <CreateButton/>



        </div>

        </div>

      </div>

      <DataTable table={subjectsTable}/>
      
    </ListView>
    
  )
}

export default SubjectList