import type { Metadata } from 'next'
import Link from 'next/link'
import { getSettings, getDepartments, getLeaders, type Leader, type Department } from '@/lib/api'
import { SectionHeader } from '@/components/SectionComponents'
import { PiArrowRightDuotone } from 'react-icons/pi'
import { settingValue } from '@/lib/settingsUtils'
import { ImpactBand, SectionOrbs } from '@/components/ImpactBand'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  const orgName = settings?.company_name || 'Yedent Agro Group'
  const description = settingValue(
    settings,
    'departments_meta_description',
    'Meet the departments and leadership team driving Yedent Agro\'s operations across all subsidiaries.'
  )

  return {
    title: 'Departments',
    description,
    openGraph: {
      title: `Departments | ${orgName}`,
      description,
    },
  }
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function Portrait({ src, alt, name }: { src: string | null; alt: string; name: string }) {
  return (
    <div className="relative shrink-0 aspect-[4/3] md:aspect-auto md:w-[38%] overflow-hidden bg-lime-100/70">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-serif text-3xl text-lime-800">{initials(name)}</span>
        </div>
      )}
    </div>
  )
}

function LeaderCard({ leader }: { leader: Leader }) {
  return (
    <Link
      href={`/leaders/${leader.id}`}
      className="card-premium overflow-hidden group flex flex-col md:flex-row"
    >
      <Portrait src={leader.image_url} alt={leader.name} name={leader.name} />
      <div className="flex-1 p-7 md:p-8 flex flex-col justify-center items-start">
        <h3 className="text-xl md:text-2xl font-serif text-dark mb-1.5 group-hover:text-lime-700 transition-colors">
          {leader.name}
        </h3>
        <p className="text-lime-700 text-[11px] font-bold uppercase tracking-[0.18em] mb-4">{leader.position}</p>
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-dark/55 group-hover:text-lime-700 transition-colors">
          View profile
          <PiArrowRightDuotone className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  )
}

function DepartmentCard({ dept }: { dept: Department }) {
  const person = dept.head_of_department || dept.name
  return (
    <div className="card-premium overflow-hidden flex flex-col md:flex-row">
      <Portrait src={dept.head_image_url} alt={dept.name} name={person} />
      <div className="flex-1 p-7 md:p-8 flex flex-col justify-center items-start">
        <h3 className="text-xl md:text-2xl font-serif text-dark mb-1.5">{person}</h3>
        {dept.head_of_department && (
          <p className="text-lime-700 text-[11px] font-bold uppercase tracking-[0.18em] mb-4">{dept.name}</p>
        )}
        {dept.description && <p className="text-dark/75 text-sm leading-relaxed">{dept.description}</p>}
      </div>
    </div>
  )
}

export default async function DepartmentsPage() {
  const [settings, departments, leaders] = await Promise.all([
    getSettings(),
    getDepartments(),
    getLeaders()
  ])

  // Only show leadership-level departments on this page; subsidiary department lists
  // live on the subsidiary pages themselves.
  const leadershipDepts = departments.filter((d) => !d.subsidiary_id)

  return (
    <>
      <section className="pt-12 pb-8 md:pt-16 md:pb-10 bg-cream relative overflow-hidden">
        <SectionOrbs />
        <div className="container-premium relative">
          <div className="max-w-3xl mx-auto text-center">
            <span className="kicker mb-6 justify-center">{settingValue(settings, 'departments_hero_kicker', 'Our Organization')}</span>
            <h1 className="text-4xl md:text-5xl font-serif text-dark leading-[1.05] mb-6">
              {settingValue(settings, 'departments_hero_heading', 'Leadership')}
            </h1>
            <p className="text-dark/75 text-lg leading-relaxed">
              {settingValue(settings, 'departments_hero_description', 'Our organizational structure spans corporate functions and subsidiary-specific operations, each led by experienced professionals committed to excellence.')}
            </p>
          </div>
        </div>
      </section>

      {/* Executive leadership — high-level leaders not tied to a department */}
      {leaders.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container-premium">
            <SectionHeader
              kicker={settingValue(settings, 'departments_leaders_kicker', 'Our Leaders')}
              heading={settingValue(settings, 'departments_leaders_heading', 'Executive Leadership')}
              description={settingValue(settings, 'departments_leaders_description', 'The high-level leaders guiding the Yedent Agro Group.')}
            />
            <div className="grid md:grid-cols-2 gap-6">
              {leaders.map((leader) => (
                <LeaderCard key={leader.id} leader={leader} />
              ))}
            </div>
          </div>
        </section>
      )}

      <ImpactBand
        kicker="People First"
        heading="Expertise behind every operation"
        body="Corporate functions and subsidiary teams work side by side, each department led by experienced professionals who keep quality, safety and service at the centre of what we do."
      />

      {/* Corporate functions — group-level departments, each led by a head */}
      {leadershipDepts.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container-premium">
            <SectionHeader
              kicker={settingValue(settings, 'departments_group_kicker', 'Corporate Functions')}
              heading={settingValue(settings, 'departments_group_heading', 'Group-level Leadership')}
              description={settingValue(settings, 'departments_group_description', 'Centralized leadership roles supporting all subsidiaries across the Yedent Agro Group.')}
            />
            <div className="grid md:grid-cols-2 gap-6">
              {leadershipDepts.map((dept) => (
                <DepartmentCard key={dept.id} dept={dept} />
              ))}
            </div>
          </div>
        </section>
      )}

    </>
  )
}