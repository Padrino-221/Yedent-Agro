'use client'

import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { adminApi, AuthError } from '@/lib/admin-api'
import type { Subsidiary } from '@/lib/api'
import { PageHeader, Button, Loading, ErrorState, TextInput, TextArea, NumberInput, SelectInput, Toggle, ImageInput, Field, inputClass } from '@/components/admin/ui'
import { PiCaretLeftDuotone, PiPlusDuotone, PiTrashDuotone, PiArrowUpDuotone, PiArrowDownDuotone, PiCheckDuotone } from 'react-icons/pi'
import { slugify } from '@/lib/slug'

interface NutritionRow {
  nutrient: string
  value: string
  unit: string
  category: 'macro' | 'micro'
}

interface ImageRow {
  image_url: string
  caption: string
}

interface StepRow {
  instruction: string
}

interface VideoRow {
  video_url: string
  title: string
}

const sectorOptions = [
  { value: 'consumer', label: 'Consumer / Institutional Foods' },
  { value: 'industrial', label: 'Industrial Bulk' },
  { value: 'poultry_feed', label: 'Poultry Feed' },
]

export default function ProductForm({ id, backHref }: { id: string; backHref: string }) {
  const router = useRouter()
  const isNew = id === 'new'

  const [subsidiaries, setSubsidiaries] = useState<Subsidiary[]>([])
  const [loading, setLoading] = useState(!isNew)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const [form, setForm] = useState({
    name: '',
    slug: '',
    subsidiary_id: '',
    sector: 'consumer',
    category: '',
    description: '',
    fda_registration: '',
    storage_instructions: '',
    allergens: '',
    net_weight: '',
    cover_image_url: '',
    video_url: '',
    sort_order: '',
    is_published: true,
  })

  const [nutrition, setNutrition] = useState<NutritionRow[]>([])
  const [images, setImages] = useState<ImageRow[]>([])
  const [steps, setSteps] = useState<StepRow[]>([])
  const [videos, setVideos] = useState<VideoRow[]>([])

  const load = useCallback(async () => {
    setError(null)
    try {
      const [subs] = await Promise.all([
        adminApi.subsidiaries.list().catch(() => [] as Subsidiary[]),
        isNew ? Promise.resolve(null) : adminApi.products.get(id),
      ])
      setSubsidiaries(subs)
      if (!isNew) {
        const p = await adminApi.products.get(id)
        setForm({
          name: p.name ?? '',
          slug: p.slug ?? '',
          subsidiary_id: p.subsidiary_id ?? '',
          sector: p.sector ?? 'consumer',
          category: p.category ?? '',
          description: p.description ?? '',
          fda_registration: p.fda_registration ?? '',
          storage_instructions: p.storage_instructions ?? '',
          allergens: p.allergens ?? '',
          net_weight: p.net_weight ?? '',
          cover_image_url: p.cover_image_url ?? '',
          video_url: p.video_url ?? '',
          sort_order: p.sort_order == null ? '' : String(p.sort_order),
          is_published: p.is_published ?? true,
        })
        setNutrition((p.nutrition ?? []).map((n) => ({ nutrient: n.nutrient ?? '', value: n.value ?? '', unit: n.unit ?? '', category: (n.category as 'macro' | 'micro') ?? 'macro' })))
        setImages((p.images ?? []).map((i) => ({ image_url: i.image_url ?? '', caption: i.caption ?? '' })))
        setSteps((p.preparation_steps ?? []).map((s) => ({ instruction: s.instruction ?? '' })))
        setVideos((p.videos ?? []).map((v) => ({ video_url: v.video_url ?? '', title: v.title ?? '' })))
      }
    } catch (err) {
      if (err instanceof AuthError) {
        router.replace('/admin/login')
        return
      }
      setError(err instanceof Error ? err.message : 'Failed to load')
    } finally {
      setLoading(false)
    }
  }, [id, isNew, router])

  useEffect(() => {
    load()
  }, [load])

  const set = (key: string, value: string | boolean) => setForm((prev) => ({ ...prev, [key]: value }))

  const subsidiaryOptions = useMemo(
    () => [{ value: '', label: 'None' }, ...subsidiaries.map((s) => ({ value: s.id, label: s.name }))],
    [subsidiaries]
  )

  function buildPayload(): Record<string, unknown> {
    const cleanNutrition = nutrition.filter((n) => n.nutrient.trim())
    const cleanImages = images.filter((i) => i.image_url.trim())
    const cleanSteps = steps.filter((s) => s.instruction.trim())
    const cleanVideos = videos.filter((v) => v.video_url.trim())

    const payload: Record<string, unknown> = {
      name: form.name,
      slug: form.slug.trim() ? form.slug : slugify(form.name),
      subsidiary_id: form.subsidiary_id || null,
      sector: form.sector,
      category: form.category || null,
      description: form.description || null,
      fda_registration: form.fda_registration || null,
      storage_instructions: form.storage_instructions || null,
      allergens: form.allergens || null,
      net_weight: form.net_weight || null,
      cover_image_url: form.cover_image_url || null,
      video_url: form.video_url || null,
      sort_order: form.sort_order === '' ? 0 : Number(form.sort_order),
      is_published: form.is_published,
      nutrition: cleanNutrition.map((n, i) => ({ nutrient: n.nutrient, value: n.value || null, unit: n.unit || null, category: n.category, sort_order: i })),
      images: cleanImages.map((img, i) => ({ image_url: img.image_url, caption: img.caption || null, sort_order: i })),
      preparation_steps: cleanSteps.map((s, i) => ({ step_number: i + 1, instruction: s.instruction })),
      videos: cleanVideos.map((v, i) => ({ video_url: v.video_url, title: v.title || null, sort_order: i })),
    }
    return payload
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) {
      setError('Product name is required')
      return
    }
    setSaving(true)
    setError(null)
    try {
      if (isNew) {
        await adminApi.products.create(buildPayload())
      } else {
        await adminApi.products.update(id, buildPayload())
      }
      setSaved(true)
      setTimeout(() => router.push(backHref), 400)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
      setSaving(false)
    }
  }

  if (loading) return <Loading />
  if (error && !isNew && !form.name) {
    return (
      <div>
        <PageHeader title="Product" />
        <ErrorState message={error} onRetry={load} />
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title={isNew ? 'New Product' : 'Edit Product'}
        actions={
          <Link href={backHref} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-dark/60 hover:text-dark">
            <PiCaretLeftDuotone className="w-4 h-4" /> Back to list
          </Link>
        }
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded">{error}</div>}
        {saved && (
          <div className="px-4 py-3 bg-lime-50 border border-lime-200 text-lime-800 text-sm rounded flex items-center gap-2">
            <PiCheckDuotone className="w-4 h-4" /> Saved — redirecting…
          </div>
        )}

        {/* General */}
        <Section title="General information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Product name" required>
              <TextInput value={form.name} onChange={(v) => set('name', v)} placeholder="e.g. Tomvita X" />
            </Field>
            <Field label="Slug (URL)" help="Leave empty to auto-generate from the name.">
              <TextInput value={form.slug} onChange={(v) => set('slug', v)} placeholder="tomvita-x" />
            </Field>
            <Field label="Subsidiary">
              <SelectInput value={form.subsidiary_id} onChange={(v) => set('subsidiary_id', v)} options={subsidiaryOptions} />
            </Field>
            <Field label="Sector">
              <SelectInput value={form.sector} onChange={(v) => set('sector', v)} options={sectorOptions} />
            </Field>
            <Field label="Category">
              <TextInput value={form.category} onChange={(v) => set('category', v)} placeholder="e.g. Ready-to-eat cereal mix" />
            </Field>
            <Field label="FDA registration">
              <TextInput value={form.fda_registration} onChange={(v) => set('fda_registration', v)} placeholder="e.g. FDA Ce/20-173" />
            </Field>
            <Field label="Net weight">
              <TextInput value={form.net_weight} onChange={(v) => set('net_weight', v)} placeholder="e.g. 100g" />
            </Field>
            <Field label="Sort order" help="Lower numbers appear first.">
              <NumberInput value={form.sort_order} onChange={(v) => set('sort_order', v)} />
            </Field>
            <div className="md:col-span-2">
              <Field label="Description">
                <TextArea value={form.description} onChange={(v) => set('description', v)} rows={4} />
              </Field>
            </div>
            <div className="md:col-span-2">
              <Field label="Storage instructions">
                <TextArea value={form.storage_instructions} onChange={(v) => set('storage_instructions', v)} rows={2} />
              </Field>
            </div>
            <div className="md:col-span-2">
              <Field label="Allergen information">
                <TextArea value={form.allergens} onChange={(v) => set('allergens', v)} rows={2} />
              </Field>
            </div>
            <div className="md:col-span-2">
              <Field label="Cover image">
                <ImageInput value={form.cover_image_url} onChange={(v) => set('cover_image_url', v)} help="Main image for the product card and detail page." />
              </Field>
            </div>
            <Field label="Featured video URL">
              <TextInput value={form.video_url} onChange={(v) => set('video_url', v)} placeholder="https://www.youtube.com/watch?v=…" />
            </Field>
            <Field label="Status">
              <Toggle checked={form.is_published} onChange={(v) => set('is_published', v)} label={form.is_published ? 'Published' : 'Draft'} />
            </Field>
          </div>
        </Section>

        {/* Image gallery */}
        <Section
          title="Image gallery"
          action={
            <AddButton label="Add image" onClick={() => setImages((prev) => [...prev, { image_url: '', caption: '' }])} />
          }
        >
          {images.length === 0 && <p className="text-sm text-dark/50">No gallery images yet.</p>}
          <div className="space-y-4">
            {images.map((img, i) => (
              <div key={i} className="flex gap-3 items-start bg-cream/70 border border-dark/10 rounded p-3">
                <div className="flex-1 space-y-2">
                  <ImageInput value={img.image_url} onChange={(v) => updateRow(images, setImages, i, { image_url: v })} />
                  <input
                    type="text"
                    value={img.caption}
                    placeholder="Caption (optional)"
                    onChange={(e) => updateRow(images, setImages, i, { caption: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <RemoveButton onClick={() => removeRow(images, setImages, i)} />
              </div>
            ))}
          </div>
        </Section>

        {/* Nutrition */}
        <Section
          title="Nutritional facts"
          action={
            <AddButton label="Add nutrient" onClick={() => setNutrition((prev) => [...prev, { nutrient: '', value: '', unit: '', category: 'macro' }])} />
          }
        >
          {nutrition.length === 0 && <p className="text-sm text-dark/50">No nutrients added yet.</p>}
          <div className="space-y-2">
            {nutrition.map((n, i) => (
              <div key={i} className="flex gap-2 items-center bg-cream/70 border border-dark/10 rounded p-2.5">
                <input
                  type="text"
                  value={n.nutrient}
                  placeholder="Nutrient (e.g. Energy)"
                  onChange={(e) => updateRow(nutrition, setNutrition, i, { nutrient: e.target.value })}
                  className={`${inputClass} flex-1`}
                />
                <input
                  type="text"
                  value={n.value}
                  placeholder="Value"
                  onChange={(e) => updateRow(nutrition, setNutrition, i, { value: e.target.value })}
                  className={`${inputClass} w-24`}
                />
                <input
                  type="text"
                  value={n.unit}
                  placeholder="Unit"
                  onChange={(e) => updateRow(nutrition, setNutrition, i, { unit: e.target.value })}
                  className={`${inputClass} w-24`}
                />
                <div className="w-28">
                  <SelectInput
                    value={n.category}
                    onChange={(v) => updateRow(nutrition, setNutrition, i, { category: v as 'macro' | 'micro' })}
                    options={[
                      { value: 'macro', label: 'Macro' },
                      { value: 'micro', label: 'Micro' },
                    ]}
                  />
                </div>
                <RemoveButton onClick={() => removeRow(nutrition, setNutrition, i)} />
              </div>
            ))}
          </div>
        </Section>

        {/* Preparation steps */}
        <Section
          title="Preparation steps"
          action={
            <AddButton label="Add step" onClick={() => setSteps((prev) => [...prev, { instruction: '' }])} />
          }
        >
          {steps.length === 0 && <p className="text-sm text-dark/50">No preparation steps yet.</p>}
          <div className="space-y-2">
            {steps.map((s, i) => (
              <div key={i} className="flex gap-2 items-center bg-cream/70 border border-dark/10 rounded p-2.5">
                <span className="w-8 h-8 rounded bg-lime-100 text-lime-800 flex items-center justify-center font-bold text-sm shrink-0">
                  {i + 1}
                </span>
                <input
                  type="text"
                  value={s.instruction}
                  placeholder="Step instruction"
                  onChange={(e) => updateRow(steps, setSteps, i, { instruction: e.target.value })}
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => moveRow(steps, setSteps, i, -1)}
                  disabled={i === 0}
                  className="p-2 text-dark/40 hover:text-dark disabled:opacity-30"
                  aria-label="Move up"
                >
                  <PiArrowUpDuotone className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => moveRow(steps, setSteps, i, 1)}
                  disabled={i === steps.length - 1}
                  className="p-2 text-dark/40 hover:text-dark disabled:opacity-30"
                  aria-label="Move down"
                >
                  <PiArrowDownDuotone className="w-4 h-4" />
                </button>
                <RemoveButton onClick={() => removeRow(steps, setSteps, i)} />
              </div>
            ))}
          </div>
        </Section>

        {/* Videos */}
        <Section
          title="Videos"
          action={
            <AddButton label="Add video" onClick={() => setVideos((prev) => [...prev, { video_url: '', title: '' }])} />
          }
        >
          {videos.length === 0 && <p className="text-sm text-dark/50">No videos yet.</p>}
          <div className="space-y-2">
            {videos.map((v, i) => (
              <div key={i} className="flex gap-2 items-start bg-cream/70 border border-dark/10 rounded p-2.5">
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    value={v.video_url}
                    placeholder="YouTube URL"
                    onChange={(e) => updateRow(videos, setVideos, i, { video_url: e.target.value })}
                    className={inputClass}
                  />
                  <input
                    type="text"
                    value={v.title}
                    placeholder="Title (optional)"
                    onChange={(e) => updateRow(videos, setVideos, i, { title: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <RemoveButton onClick={() => removeRow(videos, setVideos, i)} />
              </div>
            ))}
          </div>
        </Section>

        <div className="flex items-center gap-3 pt-2">
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving…' : isNew ? 'Create product' : 'Save changes'}
          </Button>
          <Link href={backHref}>
            <Button variant="ghost">Cancel</Button>
          </Link>
        </div>
      </form>
    </div>
  )
}

// ---------- Small helpers ----------

function Section({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-dark/10 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-dark uppercase tracking-wide text-sm">{title}</h2>
        {action}
      </div>
      {children}
    </div>
  )
}

function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wide bg-lime-100 text-lime-800 rounded hover:bg-lime-200"
    >
      <PiPlusDuotone className="w-3.5 h-3.5" /> {label}
    </button>
  )
}

function RemoveButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="p-2 text-dark/40 hover:text-red-600"
      aria-label="Remove"
    >
      <PiTrashDuotone className="w-4 h-4" />
    </button>
  )
}

function updateRow<T>(rows: T[], setRows: (v: T[]) => void, index: number, patch: Partial<T>) {
  setRows(rows.map((r, i) => (i === index ? { ...r, ...patch } : r)))
}

function removeRow<T>(rows: T[], setRows: (v: T[]) => void, index: number) {
  setRows(rows.filter((_, i) => i !== index))
}

function moveRow<T>(rows: T[], setRows: (v: T[]) => void, index: number, dir: -1 | 1) {
  const target = index + dir
  if (target < 0 || target >= rows.length) return
  const copy = [...rows]
  ;[copy[index], copy[target]] = [copy[target], copy[index]]
  setRows(copy)
}