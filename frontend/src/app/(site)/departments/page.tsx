import type { Metadata } from 'next'
import { getSettings, getDepartments, type Department } from '@/lib/api'
import { SectionHeader, Card } from '@/components/SectionComponents'
import { PiBuildingsDuotone, PiUsersDuotone, PiLeafDuotone, PiTruckDuotone, PiShieldCheckDuotone, PiGearDuotone, PiBookOpenDuotone } from 'react-icons/pi'
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

export default async function DepartmentsPage() {
  const [settings, departments] = await Promise.all([
    getSettings(),
    getDepartments()
  ])

  const orgName = settings?.company_name || 'Yedent Agro Group'

  // Group departments by subsidiary
  const groupDepts = departments.filter((d) => !d.subsidiary_id)
  const subsidiaryDepts = departments.filter((d) => d.subsidiary_id)

  // Group by subsidiary
  const deptsBySubsidiary = new Map<string, Department[]>()
  subsidiaryDepts.forEach((dept) => {
    const key = dept.subsidiary_name || 'Other'
    if (!deptsBySubsidiary.has(key)) deptsBySubsidiary.set(key, [])
    deptsBySubsidiary.get(key)?.push(dept)
  })

  const iconMap: Record<string, React.ReactNode> = {
    'Human Resource': <PiUsersDuotone className="w-6 h-6" />,
    'Finance': <PiBookOpenDuotone className="w-6 h-6" />,
    'Safety': <PiShieldCheckDuotone className="w-6 h-6" />,
    'Engineering': <PiGearDuotone className="w-6 h-6" />,
    'Operations': <PiLeafDuotone className="w-6 h-6" />,
    'Sales': <PiUsersDuotone className="w-6 h-6" />,
    'Compliance': <PiBookOpenDuotone className="w-6 h-6" />,
    'Fortification': <PiLeafDuotone className="w-6 h-6" />,
    'Production': <PiGearDuotone className="w-6 h-6" />,
    'Bulk': <PiGearDuotone className="w-6 h-6" />,
    'Poultry': <PiLeafDuotone className="w-6 h-6" />,
  }

  function getIcon(name: string) {
    for (const [key, icon] of Object.entries(iconMap)) {
      if (name.includes(key)) return icon
    }
    return <PiBuildingsDuotone className="w-6 h-6" />
  }

  return (
    <>
      <section className="section-padding bg-cream relative overflow-hidden">
        <SectionOrbs />
        <div className="container-premium relative">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="kicker mb-6 justify-center">{settingValue(settings, 'departments_hero_kicker', 'Our Organization')}</span>
            <h1 className="text-4xl md:text-5xl font-serif text-dark leading-[1.05] mb-6">
              {settingValue(settings, 'departments_hero_heading', 'Departments & Leadership')}
            </h1>
            <p className="text-dark/75 text-lg leading-relaxed">
              {settingValue(settings, 'departments_hero_description', 'Our organizational structure spans corporate functions and subsidiary-specific operations, each led by experienced professionals committed to excellence.')}
            </p>
          </div>
        </div>
      </section>

      <ImpactBand
        kicker="People First"
        heading="Expertise behind every operation"
        body="Corporate functions and subsidiary teams work side by side, each department led by experienced professionals who keep quality, safety and service at the centre of what we do."
      />

      {/* Group Departments */}
      {groupDepts.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container-premium">
            <SectionHeader
              kicker={settingValue(settings, 'departments_group_kicker', 'Corporate Functions')}
              heading={settingValue(settings, 'departments_group_heading', 'Group-level Departments')}
              description={settingValue(settings, 'departments_group_description', 'Centralized functions supporting all subsidiaries across the Yedent Agro Group.')}
            />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groupDepts.map((dept) => (
                <Card key={dept.id} className="text-center">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-lg bg-lime/20 flex items-center justify-center text-lime">
                    {getIcon(dept.name)}
                  </div>
                  <h3 className="text-lg font-serif text-dark mb-2">{dept.name}</h3>
                  {dept.description && <p className="text-dark/75 text-sm mb-3">{dept.description}</p>}
                  {dept.head_of_department && (
                    <p className="text-dark/70 text-sm font-medium flex items-center justify-center gap-1">
                      <PiUsersDuotone className="w-3 h-3" />
                      {settingValue(settings, 'departments_head_label', 'Head:')} {dept.head_of_department}
                    </p>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Subsidiary Departments */}
      {subsidiaryDepts.length > 0 && (
        <section className="section-padding bg-cream">
          <div className="container-premium">
            <SectionHeader
              kicker={settingValue(settings, 'departments_subsidiary_kicker', 'Subsidiary Operations')}
              heading={settingValue(settings, 'departments_subsidiary_heading', 'Subsidiary-level Departments')}
              description={settingValue(settings, 'departments_subsidiary_description', 'Specialized departments within each subsidiary driving operational excellence.')}
            />
            <div className="space-y-8">
              {Array.from(deptsBySubsidiary.entries()).map(([subName, depts]) => (
                <div key={subName}>
                  <h3 className="text-2xl font-serif text-dark mb-6 flex items-center gap-2">
                    <PiBuildingsDuotone className="w-6 h-6 text-lime" />
                    {subName}
                  </h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {depts.map((dept) => (
                      <Card key={dept.id} className="text-center">
                        <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-lime/20 flex items-center justify-center text-lime">
                          {getIcon(dept.name)}
                        </div>
                        <h3 className="text-lg font-serif text-dark mb-2">{dept.name}</h3>
                        {dept.description && <p className="text-dark/75 text-sm mb-3">{dept.description}</p>}
                        {dept.head_of_department && (
                          <p className="text-dark/70 text-sm font-medium flex items-center justify-center gap-1">
                            <PiUsersDuotone className="w-3 h-3" />
                            {settingValue(settings, 'departments_head_label', 'Head:')} {dept.head_of_department}
                          </p>
                        )}
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}