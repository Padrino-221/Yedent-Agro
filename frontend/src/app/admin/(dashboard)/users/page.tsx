'use client'

import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { adminApi, AuthError, type AdminUser } from '@/lib/admin-api'
import { useAuth } from '@/lib/admin-auth'
import { useToast } from '@/lib/toast'
import { PageHeader, Button, Loading, ErrorState, Badge, inputClass, SelectInput } from '@/components/admin/ui'
import { Dropdown } from '@/components/admin/dropdown'
import { ConfirmDialog, Modal } from '@/components/admin/overlays'
import {
  PiShieldCheckDuotone,
  PiPencilSimpleDuotone,
  PiTrashDuotone,
  PiDotsThreeVerticalDuotone,
} from 'react-icons/pi'

export default function UsersPage() {
  const router = useRouter()
  const toast = useToast()
  const { user: currentUser, isGroupAdmin } = useAuth()
  const [users, setUsers] = useState<AdminUser[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  // Create form
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'dept_admin' | 'group_admin'>('dept_admin')

  // Edit state
  const [editing, setEditing] = useState<AdminUser | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [editRole, setEditRole] = useState<'dept_admin' | 'group_admin'>('dept_admin')
  const [editActive, setEditActive] = useState(true)
  const [newPassword, setNewPassword] = useState('')

  const load = useCallback(async () => {
    setError(null)
    try {
      setUsers(await adminApi.users.list())
    } catch (err) {
      if (err instanceof AuthError) {
        router.replace('/admin/login')
        return
      }
      setError(err instanceof Error ? err.message : 'Failed to load users')
    }
  }, [router])

  useEffect(() => {
    if (isGroupAdmin) load()
  }, [isGroupAdmin, load])

  async function handleCreate(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      await adminApi.users.create({ full_name: name, email, password, role })
      toast.success(`User ${email} created`)
      setName('')
      setEmail('')
      setPassword('')
      setRole('dept_admin')
      await load()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create user'
      setError(message)
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  function openEdit(u: AdminUser) {
    setEditing(u)
    setEditRole(u.role)
    setEditActive(u.is_active ?? true)
    setNewPassword('')
  }

  async function saveEdit() {
    if (!editing) return
    setSaving(true)
    setError(null)
    try {
      const payload: Record<string, unknown> = { role: editRole, is_active: editActive }
      if (newPassword.trim()) payload.password = newPassword.trim()
      await adminApi.users.update(editing.id, payload)
      toast.success(`User ${editing.email} updated`)
      setEditing(null)
      await load()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update user'
      setError(message)
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(u: AdminUser) {
    setDeleting(true)
    setError(null)
    try {
      await adminApi.users.remove(u.id)
      toast.success(`User ${u.email} deleted`)
      await load()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete user'
      setError(message)
      toast.error(message)
    } finally {
      setDeleting(false)
      setDeleteTarget(null)
    }
  }

  if (!isGroupAdmin) {
    return (
      <div>
        <PageHeader title="Users" />
        <div className="bg-white border border-dark/10 rounded-lg p-8 text-center">
          <PiShieldCheckDuotone className="w-8 h-8 mx-auto text-dark/30 mb-3" />
          <p className="text-dark/60">Only group administrators can manage users.</p>
        </div>
      </div>
    )
  }

  if (!users && !error) return <Loading />
  if (error && !users) return <ErrorState message={error} onRetry={load} />

  return (
    <div>
      <PageHeader title="Admin Users" description="Create and manage CMS login accounts. Department admins can manage content; group admins get full access." />

      {error && <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded">{error}</div>}

      {/* Create form */}
      <div className="bg-white border border-dark/10 rounded-lg p-6 mb-8">
        <h2 className="text-base font-bold text-dark uppercase tracking-wide text-sm mb-4">Add a new user</h2>
        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" required className={inputClass} />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" required className={inputClass} />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Temporary password" required minLength={6} className={inputClass} />
          <SelectInput
            value={role}
            onChange={(v) => setRole(v as 'dept_admin' | 'group_admin')}
            options={[
              { value: 'dept_admin', label: 'Department admin' },
              { value: 'group_admin', label: 'Group admin' },
            ]}
          />
          <div className="md:col-span-2">
            <Button type="submit" disabled={saving}>
              {saving ? 'Creating…' : 'Create user'}
            </Button>
          </div>
        </form>
      </div>

      {/* User list */}
      <div className="bg-white border border-dark/10 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-dark text-white text-left">
                <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wide">Name</th>
                <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wide">Email</th>
                <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wide">Role</th>
                <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wide">Status</th>
                <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wide text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark/10">
              {users!.map((u) => (                  <tr key={u.id} className="hover:bg-cream/60">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-dark">{u.full_name}</p>
                    {u.id === currentUser?.id && <p className="text-xs text-lime-700 font-medium">(you)</p>}
                  </td>
                  <td className="px-4 py-3 text-dark/70">{u.email}</td>
                  <td className="px-4 py-3">
                    <Badge tone={u.role === 'group_admin' ? 'blue' : 'neutral'}>{u.role.replace('_', ' ')}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone={u.is_active ? 'green' : 'red'}>{u.is_active ? 'Active' : 'Disabled'}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end">
                      <Dropdown
                        align="right"
                        label={`Actions for ${u.email}`}
                        trigger={                            <span className="inline-flex items-center justify-center w-8 h-8 rounded border border-dark/15 text-dark/60 hover:text-dark hover:border-dark/40">
                            <PiDotsThreeVerticalDuotone className="w-4 h-4" />
                          </span>
                        }
                        items={[
                          {
                            label: 'Edit user',
                            icon: <PiPencilSimpleDuotone className="w-4 h-4" />,
                            onClick: () => openEdit(u),
                          },
                          ...(u.id !== currentUser?.id
                            ? [
                                { divider: true },
                                {
                                  label: 'Delete',
                                  icon: <PiTrashDuotone className="w-4 h-4" />,
                                  danger: true,
                                  onClick: () => setDeleteTarget(u),
                                },
                              ]
                            : []),
                        ]}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) return handleDelete(deleteTarget)
        }}
        message={`Delete user ${deleteTarget?.email ?? ''}? They will lose CMS access immediately.`}
        busy={deleting}
      />

      {/* Edit modal */}
      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title="Edit user"
        description={editing ? editing.email : undefined}
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setEditing(null)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={saveEdit} disabled={saving}>
              {saving ? 'Saving…' : 'Save changes'}
            </Button>
          </>
        }
      >
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-xs font-semibold text-dark/60 mb-1.5">Role</label>
            <SelectInput
              value={editRole}
              onChange={(v) => setEditRole(v as 'dept_admin' | 'group_admin')}
              options={[
                { value: 'dept_admin', label: 'Department admin' },
                { value: 'group_admin', label: 'Group admin' },
              ]}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-dark/60 mb-1.5">New password (optional)</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Leave blank to keep current password"
              className={inputClass}
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-dark/70">
            <input type="checkbox" checked={editActive} onChange={(e) => setEditActive(e.target.checked)} className="w-4 h-4 accent-lime-600" />
            Account active
          </label>
        </div>
      </Modal>
    </div>
  )
}