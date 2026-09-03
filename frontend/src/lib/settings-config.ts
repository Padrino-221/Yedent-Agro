export interface SettingField {
  key: string
  label: string
  type: 'text' | 'textarea'
  help?: string
}

export interface RowField {
  key: string
  label: string
  type: 'text' | 'textarea'
  placeholder?: string
}

/** A repeated set of fields rendered as a list of JSON rows under `key`. */
export interface RowDef {
  key: string
  label: string
  addLabel: string
  emptyText: string
  fields: RowField[]
}

export interface SectionDef {
  id: string
  title: string
  description?: string
  fields?: SettingField[]
  rows?: RowDef[]
}

export interface PageDef {
  id: string
  title: string
  description: string
  sections: SectionDef[]
}

export interface RowDefValue {
  [rowKey: string]: Record<string, string>[]
}

export const pages: PageDef[] = [
  {
    id: 'global',
    title: 'Company & Contact',
    description: 'Brand identity, contact details and social links used across every page.',
    sections: [
      {
        id: 'brand',
        title: 'Company & brand',
        description: 'Used in metadata, the header and the about page.',
        fields: [
          { key: 'company_name', label: 'Company name', type: 'text' },
          { key: 'tagline', label: 'Tagline', type: 'text' },
          { key: 'about_summary', label: 'About summary', type: 'textarea' },
          { key: 'vision', label: 'Vision', type: 'textarea' },
          { key: 'mission', label: 'Mission', type: 'textarea' },
        ],
      },
      {
        id: 'contact',
        title: 'Contact details',
        description: 'Shown in the header, footer and contact page.',
        fields: [
          { key: 'head_office_address', label: 'Head office address', type: 'text', help: 'e.g. P.O. Box 1306, Sunyani – Bono Region, Ghana' },
          { key: 'head_office_plot', label: 'Plot / location', type: 'text', help: 'e.g. Plot No. 27 Abesim Kyidom Industrial Area' },
          { key: 'gps_address', label: 'GPS address', type: 'text', help: 'e.g. BS-0176-4676' },
          { key: 'phone_primary', label: 'Primary phone', type: 'text' },
          { key: 'phone_secondary', label: 'Secondary phone', type: 'text' },
          { key: 'email', label: 'Email', type: 'text' },
          { key: 'working_hours', label: 'Working hours', type: 'text' },
          { key: 'website', label: 'Website', type: 'text' },
        ],
      },
      {
        id: 'social',
        title: 'Social media',
        description: 'Links used by the header and footer.',
        fields: [
          { key: 'facebook_url', label: 'Facebook', type: 'text', help: 'https://facebook.com/…' },
          { key: 'instagram_url', label: 'Instagram', type: 'text', help: 'https://instagram.com/…' },
          { key: 'twitter_url', label: 'X (Twitter)', type: 'text', help: 'https://x.com/…' },
          { key: 'linkedin_url', label: 'LinkedIn', type: 'text', help: 'https://linkedin.com/…' },
        ],
      },
      {
        id: 'shared-cta',
        title: 'Shared call-to-action block',
        description: 'The reusable “Let’s build a more nourished Ghana together” block.',
        fields: [
          { key: 'cta_kicker', label: 'Kicker', type: 'text' },
          { key: 'cta_heading', label: 'Heading', type: 'text' },
          { key: 'cta_body', label: 'Body', type: 'textarea' },
          { key: 'cta_contact_label', label: 'First button label', type: 'text', help: 'Links to /contact' },
          { key: 'cta_products_label', label: 'Second button label', type: 'text', help: 'Links to /products' },
        ],
      },
    ],
  },
  {
    id: 'home',
    title: 'Home',
    description: 'Each section of the homepage, top to bottom.',
    sections: [
      {
        id: 'home-subs',
        title: 'Subsidiaries intro',
        description: 'The “Three subsidiaries, one mission” block.',
        fields: [
          { key: 'home_subs_kicker', label: 'Kicker', type: 'text' },
          { key: 'home_subs_heading', label: 'Heading', type: 'text' },
          { key: 'home_subs_description', label: 'Description', type: 'textarea' },
          { key: 'home_card_link_label', label: 'Card link label', type: 'text', help: 'e.g. Explore' },
        ],
      },
      {
        id: 'home-products',
        title: 'Featured products',
        fields: [
          { key: 'home_prod_kicker', label: 'Kicker', type: 'text' },
          { key: 'home_prod_heading', label: 'Heading', type: 'text' },
          { key: 'home_prod_description', label: 'Description', type: 'textarea' },
          { key: 'home_prod_cta', label: 'CTA button label', type: 'text', help: 'Links to /products' },
          { key: 'home_view_details_label', label: 'Product card link label', type: 'text', help: 'e.g. View Details' },
        ],
      },
      {
        id: 'home-awards',
        title: 'Awards showcase',
        fields: [
          { key: 'home_awards_kicker', label: 'Kicker', type: 'text' },
          { key: 'home_awards_heading', label: 'Heading', type: 'text' },
          { key: 'home_awards_description', label: 'Description', type: 'textarea' },
          { key: 'home_awards_cta', label: 'CTA button label', type: 'text', help: 'Links to /about/awards' },
        ],
      },
      {
        id: 'home-news',
        title: 'News & events',
        fields: [
          { key: 'home_news_kicker', label: 'Kicker', type: 'text' },
          { key: 'home_news_heading', label: 'Heading', type: 'text' },
          { key: 'home_news_description', label: 'Description', type: 'textarea' },
          { key: 'home_news_cta', label: 'CTA button label', type: 'text', help: 'Links to /news' },
          { key: 'home_readmore_label', label: 'Read more link label', type: 'text' },
        ],
      },
      {
        id: 'home-why',
        title: 'Why choose Yedent',
        fields: [
          { key: 'home_why_kicker', label: 'Kicker', type: 'text' },
          { key: 'home_why_heading', label: 'Heading', type: 'text' },
          { key: 'home_why_description', label: 'Description', type: 'textarea' },
        ],
        rows: [
          {
            key: 'home_values',
            label: 'Value cards',
            addLabel: 'Add value card',
            emptyText: 'No value cards yet.',
            fields: [
              { key: 'label', label: 'Label', type: 'text', placeholder: 'Quality' },
              { key: 'heading', label: 'Heading', type: 'text', placeholder: 'Fortified Standards' },
              { key: 'body', label: 'Body', type: 'textarea', placeholder: 'Description' },
            ],
          },
        ],
      },
      {
        id: 'home-stats',
        title: 'Statistics band',
        rows: [
          {
            key: 'home_stats',
            label: 'Statistics',
            addLabel: 'Add statistic',
            emptyText: 'No statistics yet.',
            fields: [
              { key: 'value', label: 'Value', type: 'text', placeholder: '18+' },
              { key: 'label', label: 'Label', type: 'text', placeholder: 'Vitamins & Minerals' },
            ],
          },
        ],
      },
      {
        id: 'home-video',
        title: 'Corporate video section',
        fields: [
          { key: 'home_video_kicker', label: 'Kicker', type: 'text' },
          { key: 'home_video_heading', label: 'Heading', type: 'text' },
          { key: 'home_video_description', label: 'Description', type: 'textarea' },
          { key: 'home_video_title', label: 'Video title', type: 'text' },
          { key: 'homepage_video_url', label: 'Video URL', type: 'text', help: 'YouTube link shown in the video section.' },
        ],
      },
      {
        id: 'home-meta',
        title: 'Search & metadata',
        fields: [
          { key: 'home_meta_description', label: 'Meta description', type: 'textarea' },
        ],
      },
    ],
  },
  {
    id: 'about',
    title: 'About',
    description: 'The /about page content.',
    sections: [
      {
        id: 'about-hero',
        title: 'Hero',
        fields: [
          { key: 'about_hero_kicker', label: 'Kicker', type: 'text' },
          { key: 'about_hero_heading', label: 'Heading', type: 'text' },
          { key: 'about_hero_founder_paragraph', label: 'Founder paragraph', type: 'textarea' },
          { key: 'about_hero_subs_label', label: 'Button — subsidiaries', type: 'text' },
          { key: 'about_hero_awards_label', label: 'Button — awards', type: 'text' },
        ],
      },
      {
        id: 'about-purpose',
        title: 'Vision & mission',
        fields: [
          { key: 'about_purpose_kicker', label: 'Kicker', type: 'text' },
          { key: 'about_purpose_heading', label: 'Heading', type: 'text' },
          { key: 'about_purpose_description', label: 'Description', type: 'textarea' },
          { key: 'about_vision_title', label: 'Vision card title', type: 'text' },
          { key: 'about_mission_title', label: 'Mission card title', type: 'text' },
        ],
      },
      {
        id: 'about-values',
        title: 'Core values',
        fields: [
          { key: 'about_values_kicker', label: 'Kicker', type: 'text' },
          { key: 'about_values_heading', label: 'Heading', type: 'text' },
          { key: 'about_values_description', label: 'Description', type: 'textarea' },
        ],
        rows: [
          {
            key: 'core_values',
            label: 'Core values',
            addLabel: 'Add value',
            emptyText: 'No core values yet.',
            fields: [
              { key: 'title', label: 'Title', type: 'text' },
              { key: 'description', label: 'Description', type: 'textarea' },
            ],
          },
        ],
      },
      {
        id: 'about-csr',
        title: 'Corporate social responsibility',
        fields: [
          { key: 'about_csr_kicker', label: 'Kicker', type: 'text' },
          { key: 'about_csr_heading', label: 'Heading', type: 'text' },
          { key: 'csr_statement', label: 'CSR statement', type: 'textarea' },
        ],
      },
      {
        id: 'about-subs',
        title: 'Subsidiaries quick links',
        fields: [
          { key: 'about_subs_kicker', label: 'Kicker', type: 'text' },
          { key: 'about_subs_heading', label: 'Heading', type: 'text' },
          { key: 'about_subs_description', label: 'Description', type: 'textarea' },
        ],
      },
      {
        id: 'about-awards',
        title: 'Awards preview',
        fields: [
          { key: 'about_awards_kicker', label: 'Kicker', type: 'text' },
          { key: 'about_awards_heading', label: 'Heading', type: 'text' },
          { key: 'about_awards_description', label: 'Description', type: 'textarea' },
          { key: 'about_awards_cta', label: 'CTA button label', type: 'text', help: 'Links to /about/awards' },
        ],
      },
      {
        id: 'about-meta',
        title: 'Search & metadata',
        fields: [{ key: 'about_meta_description', label: 'Meta description', type: 'textarea' }],
      },
    ],
  },
  {
    id: 'products',
    title: 'Products',
    description: 'The /products page content.',
    sections: [
      {
        id: 'products-hero',
        title: 'Hero',
        fields: [
          { key: 'products_hero_kicker', label: 'Kicker', type: 'text' },
          { key: 'products_hero_heading', label: 'Heading', type: 'text' },
          { key: 'products_hero_description', label: 'Description', type: 'textarea' },
        ],
      },
      {
        id: 'products-unassigned',
        title: 'Additional products section',
        fields: [
          { key: 'products_unassigned_kicker', label: 'Kicker', type: 'text' },
          { key: 'products_unassigned_heading', label: 'Heading', type: 'text' },
          { key: 'products_unassigned_description', label: 'Description', type: 'textarea' },
          { key: 'products_card_link_label', label: 'Card link label', type: 'text', help: 'e.g. View Details' },
        ],
      },
      {
        id: 'products-meta',
        title: 'Search & metadata',
        fields: [{ key: 'products_meta_description', label: 'Meta description', type: 'textarea' }],
      },
    ],
  },
  {
    id: 'subsidiaries',
    title: 'Subsidiaries',
    description: 'The /about/subsidiaries page content.',
    sections: [
      {
        id: 'subsidiaries-hero',
        title: 'Hero',
        fields: [
          { key: 'subsidiaries_hero_kicker', label: 'Kicker', type: 'text' },
          { key: 'subsidiaries_hero_heading', label: 'Heading', type: 'text' },
          { key: 'subsidiaries_hero_description', label: 'Description', type: 'textarea' },
          { key: 'subsidiaries_card_link_label', label: 'Card link label', type: 'text', help: 'e.g. Explore' },
        ],
      },
      {
        id: 'subsidiaries-chain',
        title: 'Value chain overview',
        fields: [
          { key: 'subsidiaries_chain_kicker', label: 'Kicker', type: 'text' },
          { key: 'subsidiaries_chain_heading', label: 'Heading', type: 'text' },
          { key: 'subsidiaries_chain_description', label: 'Description', type: 'textarea' },
        ],
        rows: [
          {
            key: 'subsidiaries_chain_cards',
            label: 'Value chain cards',
            addLabel: 'Add card',
            emptyText: 'No value chain cards yet.',
            fields: [
              { key: 'heading', label: 'Heading', type: 'text' },
              { key: 'body', label: 'Body', type: 'textarea' },
            ],
          },
        ],
      },
      {
        id: 'subsidiaries-meta',
        title: 'Search & metadata',
        fields: [{ key: 'subsidiaries_meta_description', label: 'Meta description', type: 'textarea' }],
      },
    ],
  },
  {
    id: 'departments',
    title: 'Departments',
    description: 'The /departments page content.',
    sections: [
      {
        id: 'departments-hero',
        title: 'Hero',
        fields: [
          { key: 'departments_hero_kicker', label: 'Kicker', type: 'text' },
          { key: 'departments_hero_heading', label: 'Heading', type: 'text' },
          { key: 'departments_hero_description', label: 'Description', type: 'textarea' },
        ],
      },
      {
        id: 'departments-group',
        title: 'Group-level departments',
        fields: [
          { key: 'departments_group_kicker', label: 'Kicker', type: 'text' },
          { key: 'departments_group_heading', label: 'Heading', type: 'text' },
          { key: 'departments_group_description', label: 'Description', type: 'textarea' },
          { key: 'departments_head_label', label: 'Head label', type: 'text', help: 'e.g. Head:' },
        ],
      },
      {
        id: 'departments-subsidiary',
        title: 'Subsidiary-level departments',
        fields: [
          { key: 'departments_subsidiary_kicker', label: 'Kicker', type: 'text' },
          { key: 'departments_subsidiary_heading', label: 'Heading', type: 'text' },
          { key: 'departments_subsidiary_description', label: 'Description', type: 'textarea' },
        ],
      },
      {
        id: 'departments-meta',
        title: 'Search & metadata',
        fields: [{ key: 'departments_meta_description', label: 'Meta description', type: 'textarea' }],
      },
    ],
  },
  {
    id: 'news',
    title: 'News & Events',
    description: 'The /news page content.',
    sections: [
      {
        id: 'news-hero',
        title: 'Hero',
        fields: [
          { key: 'news_hero_kicker', label: 'Kicker', type: 'text' },
          { key: 'news_hero_heading', label: 'Heading', type: 'text' },
          { key: 'news_hero_description', label: 'Description', type: 'textarea' },
        ],
      },
      {
        id: 'news-news',
        title: 'News section',
        fields: [
          { key: 'news_news_kicker', label: 'Kicker', type: 'text' },
          { key: 'news_news_heading', label: 'Heading', type: 'text' },
          { key: 'news_news_description', label: 'Description', type: 'textarea' },
          { key: 'news_readmore_label', label: 'Read more label', type: 'text' },
        ],
      },
      {
        id: 'news-events',
        title: 'Events section',
        fields: [
          { key: 'news_events_kicker', label: 'Kicker', type: 'text' },
          { key: 'news_events_heading', label: 'Heading', type: 'text' },
          { key: 'news_events_description', label: 'Description', type: 'textarea' },
          { key: 'news_viewdetails_label', label: 'View details label', type: 'text' },
        ],
      },
      {
        id: 'news-empty',
        title: 'Empty state',
        fields: [
          { key: 'news_empty_heading', label: 'Heading', type: 'text' },
          { key: 'news_empty_body', label: 'Body', type: 'textarea' },
        ],
      },
      {
        id: 'news-meta',
        title: 'Search & metadata',
        fields: [{ key: 'news_meta_description', label: 'Meta description', type: 'textarea' }],
      },
    ],
  },
  {
    id: 'contact',
    title: 'Contact',
    description: 'The /contact page content.',
    sections: [
      {
        id: 'contact-hero',
        title: 'Hero',
        fields: [
          { key: 'contact_hero_kicker', label: 'Kicker', type: 'text' },
          { key: 'contact_hero_heading', label: 'Heading', type: 'text' },
          { key: 'contact_hero_description', label: 'Description', type: 'textarea' },
        ],
      },
      {
        id: 'contact-head',
        title: 'Head office / main contacts',
        description: 'Field labels; the values come from Company & Contact.',
        fields: [
          { key: 'contact_head_kicker', label: 'Kicker', type: 'text' },
          { key: 'contact_head_heading', label: 'Heading', type: 'text' },
          { key: 'contact_address_label', label: 'Address label', type: 'text' },
          { key: 'contact_phone_label', label: 'Phone label', type: 'text' },
          { key: 'contact_email_label', label: 'Email label', type: 'text' },
          { key: 'contact_hours_label', label: 'Working hours label', type: 'text' },
          { key: 'contact_website_label', label: 'Website label', type: 'text' },
        ],
      },
      {
        id: 'contact-form',
        title: 'Contact form',
        description: 'Form headings, field labels and placeholders.',
        fields: [
          { key: 'contact_form_kicker', label: 'Kicker', type: 'text' },
          { key: 'contact_form_heading', label: 'Heading', type: 'text' },
          { key: 'contact_form_name_label', label: 'Name label', type: 'text' },
          { key: 'contact_form_name_placeholder', label: 'Name placeholder', type: 'text' },
          { key: 'contact_form_email_label', label: 'Email label', type: 'text' },
          { key: 'contact_form_email_placeholder', label: 'Email placeholder', type: 'text' },
          { key: 'contact_form_subject_label', label: 'Subject label', type: 'text' },
          { key: 'contact_form_subject_placeholder', label: 'Subject placeholder', type: 'text' },
          { key: 'contact_form_message_label', label: 'Message label', type: 'text' },
          { key: 'contact_form_message_placeholder', label: 'Message placeholder', type: 'text' },
          { key: 'contact_form_submit', label: 'Submit button label', type: 'text' },
        ],
      },
      {
        id: 'contact-sales-cta',
        title: 'Sales network CTA',
        fields: [
          { key: 'contact_sales_kicker', label: 'Kicker', type: 'text' },
          { key: 'contact_sales_heading', label: 'Heading', type: 'text' },
          { key: 'contact_sales_body', label: 'Body', type: 'textarea' },
          { key: 'contact_sales_button', label: 'Button label', type: 'text', help: 'Links to /contact/sales' },
        ],
      },
      {
        id: 'contact-meta',
        title: 'Search & metadata',
        fields: [{ key: 'contact_meta_description', label: 'Meta description', type: 'textarea' }],
      },
    ],
  },
  {
    id: 'sales',
    title: 'Sales Network',
    description: 'The /contact/sales page content.',
    sections: [
      {
        id: 'sales-back',
        title: 'Back link',
        fields: [{ key: 'sales_back_label', label: 'Label', type: 'text' }],
      },
      {
        id: 'sales-hero',
        title: 'Hero',
        fields: [
          { key: 'sales_hero_kicker', label: 'Kicker', type: 'text' },
          { key: 'sales_hero_heading', label: 'Heading', type: 'text' },
          { key: 'sales_hero_description', label: 'Description', type: 'textarea' },
          { key: 'sales_rep_role_label', label: 'Role label', type: 'text', help: 'e.g. Sales Representative' },
        ],
      },
      {
        id: 'sales-empty',
        title: 'Empty state',
        fields: [
          { key: 'sales_empty_heading', label: 'Heading', type: 'text' },
          { key: 'sales_empty_body', label: 'Body', type: 'textarea' },
        ],
      },
      {
        id: 'sales-meta',
        title: 'Search & metadata',
        fields: [{ key: 'sales_meta_description', label: 'Meta description', type: 'textarea' }],
      },
    ],
  },
  {
    id: 'awards',
    title: 'Awards',
    description: 'The /about/awards page content.',
    sections: [
      {
        id: 'awards-hero',
        title: 'Hero',
        fields: [
          { key: 'awards_hero_kicker', label: 'Kicker', type: 'text' },
          { key: 'awards_hero_heading', label: 'Heading', type: 'text' },
          { key: 'awards_hero_description', label: 'Description', type: 'textarea' },
        ],
      },
      {
        id: 'awards-timeline',
        title: 'Timeline section',
        fields: [
          { key: 'awards_timeline_kicker', label: 'Kicker', type: 'text' },
          { key: 'awards_timeline_heading', label: 'Heading', type: 'text' },
          { key: 'awards_timeline_description', label: 'Description', type: 'textarea' },
        ],
      },
      {
        id: 'awards-meta',
        title: 'Search & metadata',
        fields: [{ key: 'awards_meta_description', label: 'Meta description', type: 'textarea' }],
      },
    ],
  },
  {
    id: 'footer',
    title: 'Footer',
    description: 'The site-wide footer.',
    sections: [
      {
        id: 'footer-cta',
        title: 'CTA band',
        fields: [
          { key: 'footer_cta_badge', label: 'Badge', type: 'text' },
          { key: 'footer_cta_heading', label: 'Heading', type: 'text' },
          { key: 'footer_cta_body', label: 'Body', type: 'textarea' },
          { key: 'footer_cta_quote_button', label: '“Request a Quote” button', type: 'text' },
          { key: 'footer_cta_products_button', label: '“Browse Products” button', type: 'text' },
        ],
      },
      {
        id: 'footer-info',
        title: 'Footer content',
        description: 'Column headings, office hours and bottom bar.',
        fields: [
          { key: 'footer_description', label: 'Description', type: 'textarea' },
          { key: 'footer_explore_title', label: '“Explore” column title', type: 'text' },
          { key: 'footer_group_title', label: '“Our Group” column title', type: 'text' },
          { key: 'footer_sales_link_label', label: 'Sales network link label', type: 'text' },
          { key: 'footer_hours_title', label: 'Office hours title', type: 'text' },
          { key: 'footer_hours_days', label: 'Days', type: 'text', help: 'e.g. Monday – Friday' },
          { key: 'footer_hours_time', label: 'Hours', type: 'text', help: 'e.g. 8:00 AM – 5:00 PM' },
          { key: 'footer_hours_timezone', label: 'Timezone note', type: 'text', help: 'e.g. Weekdays, GMT' },
        ],
      },
      {
        id: 'footer-links',
        title: 'Explore & legal link labels',
        fields: [
          { key: 'footer_link_about', label: 'About Us', type: 'text' },
          { key: 'footer_link_subsidiaries', label: 'Subsidiaries', type: 'text' },
          { key: 'footer_link_products', label: 'Products', type: 'text' },
          { key: 'footer_link_departments', label: 'Departments', type: 'text' },
          { key: 'footer_link_awards', label: 'Awards & Recognition', type: 'text' },
          { key: 'footer_link_news', label: 'News & Events', type: 'text' },
          { key: 'footer_privacy_label', label: 'Privacy', type: 'text' },
          { key: 'footer_terms_label', label: 'Terms', type: 'text' },
        ],
      },
    ],
  },
]

/** Flattened list of every setting key referenced by the config. */
export const allSettingKeys: string[] = (() => {
  const keys: string[] = []
  for (const page of pages) {
    for (const section of page.sections) {
      for (const f of section.fields ?? []) keys.push(f.key)
      for (const r of section.rows ?? []) keys.push(r.key)
    }
  }
  return keys
})()

/** Flattened list of every row-editor key referenced by the config. */
export const allRowKeys: string[] = (() => {
  const keys: string[] = []
  for (const page of pages) {
    for (const section of page.sections) {
      for (const r of section.rows ?? []) keys.push(r.key)
    }
  }
  return keys
})()
