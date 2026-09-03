'use client'

import ResourceList from '@/components/admin/ResourceList'
import { adminApi } from '@/lib/admin-api'
import type { Department } from '@/lib/api'

export default function DepartmentsListPage() {
  return (
    <ResourceList<Department>
      title="Departments"
      description="Operational departments and heads of department."
      newHref="/admin/departments/new"
      columns={[
        {
          key: 'name',
          label: 'Department',
          render: (d) => (
            <div>
              <p className="font-semibold text-dark">{d.name}</p>
              <p className="text-xs text-dark/45">/{d.slug}</p>
            </div>
          ),
        },
        {
          key: 'subsidiary_name',
          label: 'Subsidiary',
          render: (d) => <span className="text-dark/70">{d.subsidiary_name || 'Group-level'}</span>,
        },
        {
          key: 'head_of_department',
          label: 'Head of department',
          render: (d) => <span className="text-dark/70">{d.head_of_department || '—'}</span>,
        },
      ]}
      searchText={(d) => `${d.name} ${d.slug} ${d.head_of_department ?? ''} ${d.subsidiary_name ?? ''}`}
      fetcher={adminApi.departments.list}
      deleter={(id) => adminApi.departments.remove(id)}
      editHref={(d) => `/admin/departments/${d.id}`}
    />
  )
}