-- Yedent Agro Website Seed Data
-- Populates subsidiaries, departments, products, sales reps, awards, and site settings from source documents
-- ============ SITE SETTINGS ============
INSERT INTO site_settings (key, value) VALUES
  ('company_name', 'Yedent Agro Group of Companies Limited'),
  ('tagline', 'Affordable, convenient and nutritious cereal staple foods'),
  ('head_office_address', 'P.O. Box 1306, Sunyani – Bono Region, Ghana'),
  ('head_office_plot', 'Plot No. 27 Abesim Kyidom Industrial Area'),
  ('gps_address', 'BS-0176-4676'),
  ('phone_primary', '+233 (0)20 816 6021'),
  ('phone_secondary', '+233 (0)24 321 2389'),
  ('email', 'info@yedentghana.com'),
  ('about_summary', 'Yedent Agro Group of Companies is a wholly Ghanaian owned limited liability company founded by Mr. Samuel Kwame Ntim Adu and Mrs Perpetual Nana Ama Ntim Adu and has been in operation since 2004.'),
  ('vision', 'To become a premier multi-national fortified food manufacturer that brings nutrition, affordability, quality and convenience to cereals and other staples with social impact on the low income and vulnerable, base of the pyramid population.'),
  ('mission', 'To be a preferred supplier of cereal / legume-based products for institutional and industrial markets as well as consumer retail markets through technology, innovation and skilled labour to the satisfaction of our core stakeholders.'),
  ('footer_description', 'A wholly Ghanaian owned agricultural company producing affordable, convenient and nutritious cereal staple foods, animal feed and poultry products.'),
  ('csr_statement', 'Our corporate social responsibility involves giving to orphanages and the needy in the regions within which the company operates.'),
  ('homepage_video_url', NULL),
  ('facebook_url', 'https://facebook.com'),
  ('instagram_url', 'https://instagram.com'),
  ('twitter_url', 'https://x.com'),
  ('linkedin_url', 'https://linkedin.com'),
  ('core_values', '[{"title":"Teamwork & Knowledge Sharing","description":"We promote teamwork and exchange of varied knowledge for optimum outcomes."},{"title":"The God Factor","description":"We are in a covenant with God: entrusting the business into His able Hands."},{"title":"Safety Consciousness","description":"We aspire to build the culture of safety at all levels of the organization."},{"title":"Caring & Giving","description":"Committed to contributing our time and resources to the needy and vulnerable."},{"title":"Fairness","description":"We are committed to demonstrating fairness in every enterprise we embark on."},{"title":"Transparency & Integrity","description":"We uphold utmost integrity and the principle of being transparent in all dealings."}]')
ON CONFLICT (key) DO NOTHING;
-- ============ SUBSIDIARIES ============
INSERT INTO subsidiaries (name, slug, description, focus_area, tagline, sort_order) VALUES
  ('Yedent Agro Foods Processing Limited Company', 'yedent-agro-foods', 'Focuses on producing fortified cereal-legume based foods for institutions and consumers.', 'Fortified consumer and institutional food products (Tomvita, Koko Plus, Maisoy Forte)', 'Fortified nutrition from farm to family', 1),
  ('Yedent Agro Bulk Processing Limited Company', 'yedent-agro-bulk', 'Focuses on producing semi-finished goods for industrial purposes.', 'Industrial semi-finished goods (Maize Grit, Extruded Full Fat Soya, Soya Bean Meal, Maize Bran)', 'Quality ingredients for industry', 2),
  ('Naple Betta Farms Limited Company', 'naple-betta-farms', 'Spans across Yedent operations across the entire Integrated Poultry Value Chain.', 'Integrated poultry value chain, feed, and concentrates', 'Complete poultry value chain', 3)
ON CONFLICT (slug) DO NOTHING;
-- ============ DEPARTMENTS ============
-- Group-level (corporate) departments
INSERT INTO departments (name, slug, description, head_of_department, sort_order) VALUES
  ('Human Resource and Corporate Affairs', 'hr-corporate-affairs', 'Manages people operations and corporate affairs.', 'Mrs. Rosemond Awusi', 1),
  ('Finance', 'finance', 'Oversees financial management and reporting.', 'Mr. Patrick Gyimadu', 2),
  ('Safety, Health, Environment and Quality (SHEQ)', 'sheq', 'Ensures safety, health, environment and quality standards.', 'Ms. Anita Owusu Asantewaa', 3),
  ('Engineering', 'engineering', 'Manages engineering and maintenance.', 'Mr. Micheal Owusu', 4),
  ('Operations', 'operations', 'Oversees day-to-day operations.', 'Mrs. Ajara Yussif', 5),
  ('Sales and Marketing', 'sales-marketing', 'Drives sales and marketing efforts.', 'Mr. Kofi Ampah', 6),
  ('Compliance & Systems Audit', 'compliance-systems-audit', 'Manages compliance and systems audit.', 'Mr. Enoch Dei Kusi', 7)
ON CONFLICT (slug) DO NOTHING;
-- Subsidiary-level departments
INSERT INTO departments (subsidiary_id, name, slug, description, head_of_department, sort_order) VALUES
  ((SELECT id FROM subsidiaries WHERE slug = 'yedent-agro-foods'), 'Fortification & Quality Control', 'fortification-qc', 'Oversees fortification of cereal-legume food products and end-to-end quality assurance.', 'Ms. Anita Owusu Asantewaa', 1),
  ((SELECT id FROM subsidiaries WHERE slug = 'yedent-agro-foods'), 'Consumer Foods Production', 'consumer-foods-production', 'Runs the production lines for fortified consumer foods.', NULL, 2),
  ((SELECT id FROM subsidiaries WHERE slug = 'yedent-agro-bulk'), 'Bulk Processing Operations', 'bulk-processing-operations', 'Manages industrial milling and extrusion of bulk semi-finished goods.', NULL, 1),
  ((SELECT id FROM subsidiaries WHERE slug = 'naple-betta-farms'), 'Poultry & Feed Operations', 'poultry-feed-operations', 'Runs the integrated poultry value chain, feed and concentrates.', NULL, 1)
ON CONFLICT (slug) DO NOTHING;
-- ============ PRODUCTS ============
-- Yedent Agro Foods products
INSERT INTO products (subsidiary_id, name, slug, description, sector, fda_registration, storage_instructions, allergens, net_weight) VALUES
  (
    (SELECT id FROM subsidiaries WHERE slug = 'yedent-agro-foods'),
    'Tomvita X',
    'tomvita-x',
    'Ready to eat Cereal-Legume Mix. Maize, Soya Bean, Millet, Sugar, Vitamins and Minerals. Fortified with 18 Vitamins and Minerals. No need for sugar.',
    'consumer',
    'FDA Ce/20-173',
    'Store in a cool dry place, away from light. Keep the content in an air-tight container once opened to maintain freshness.',
    'Contains Soy beans which is a known food allergen.',
    '100g'
  ),
  (
    (SELECT id FROM subsidiaries WHERE slug = 'yedent-agro-foods'),
    'Koko Plus',
    'koko-plus',
    'Protein and micro-nutrient powder to be added to complementary foods. Give your child one sachet of Koko Plus per day.',
    'consumer',
    'FDA/Ad 19-059',
    'Store in a cool dry place.',
    'This product contains Soya',
    '15g'
  ),
  (
    (SELECT id FROM subsidiaries WHERE slug = 'yedent-agro-foods'),
    'Maisoyforte (Tombrown)',
    'maisoyforte-tombrown',
    'Cereal-legume mix fortified with 3 minerals and 7 vitamins. Ingredients: Maize, Soybeans, Millet, Minerals and Vitamins.',
    'consumer',
    'FDA/Ce 16-142',
    'Store in a cool dry place and when opened, keep the content in an air-tight container to maintain freshness.',
    'Contains Soy beans which is a known food allergen.',
    NULL
  )
ON CONFLICT (slug) DO NOTHING;
-- Yedent Agro Bulk products
INSERT INTO products (subsidiary_id, name, slug, description, sector, sort_order) VALUES
  (
    (SELECT id FROM subsidiaries WHERE slug = 'yedent-agro-bulk'),
    'Maize Grit',
    'maize-grit',
    'Industrial semi-finished maize product for further processing.',
    'industrial', 10
  ),
  (
    (SELECT id FROM subsidiaries WHERE slug = 'yedent-agro-bulk'),
    'Extruded Full Fat Soya',
    'extruded-full-fat-soya',
    'Extruded full fat soya for industrial use.',
    'industrial', 20
  ),
  (
    (SELECT id FROM subsidiaries WHERE slug = 'yedent-agro-bulk'),
    'Soya Bean Meal (SBM)',
    'soya-bean-meal',
    'High protein soya bean meal for industrial feed applications.',
    'industrial', 30
  ),
  (
    (SELECT id FROM subsidiaries WHERE slug = 'yedent-agro-bulk'),
    'Maize Bran',
    'maize-bran',
    'Maize bran for industrial applications.',
    'industrial', 40
  )
ON CONFLICT (slug) DO NOTHING;
-- Naple Betta Farms products (poultry feed)
INSERT INTO products (subsidiary_id, name, slug, description, sector, sort_order) VALUES
  ((SELECT id FROM subsidiaries WHERE slug = 'naple-betta-farms'), 'Broiler Starter', 'broiler-starter', 'Broiler starter feed.', 'poultry_feed', 1),
  ((SELECT id FROM subsidiaries WHERE slug = 'naple-betta-farms'), 'Broiler Grower', 'broiler-grower', 'Broiler grower feed.', 'poultry_feed', 2),
  ((SELECT id FROM subsidiaries WHERE slug = 'naple-betta-farms'), 'Broiler Finisher', 'broiler-finisher', 'Broiler finisher feed.', 'poultry_feed', 3),
  ((SELECT id FROM subsidiaries WHERE slug = 'naple-betta-farms'), 'Broiler Concentrate', 'broiler-concentrate', 'Broiler concentrate feed.', 'poultry_feed', 4),
  ((SELECT id FROM subsidiaries WHERE slug = 'naple-betta-farms'), 'Layer Pre-starter', 'layer-pre-starter', 'Layer pre-starter feed.', 'poultry_feed', 5),
  ((SELECT id FROM subsidiaries WHERE slug = 'naple-betta-farms'), 'Layer Starter', 'layer-starter', 'Layer starter feed.', 'poultry_feed', 6),
  ((SELECT id FROM subsidiaries WHERE slug = 'naple-betta-farms'), 'Layer Grower', 'layer-grower', 'Layer grower feed.', 'poultry_feed', 7),
  ((SELECT id FROM subsidiaries WHERE slug = 'naple-betta-farms'), 'Layer Developer', 'layer-developer', 'Layer developer feed.', 'poultry_feed', 8),
  ((SELECT id FROM subsidiaries WHERE slug = 'naple-betta-farms'), 'Pre-lay', 'pre-lay', 'Pre-lay feed.', 'poultry_feed', 9),
  ((SELECT id FROM subsidiaries WHERE slug = 'naple-betta-farms'), 'Layer Phase I', 'layer-phase-i', 'Layer phase I feed.', 'poultry_feed', 10),
  ((SELECT id FROM subsidiaries WHERE slug = 'naple-betta-farms'), 'Layer Phase II', 'layer-phase-ii', 'Layer phase II feed.', 'poultry_feed', 11),
  ((SELECT id FROM subsidiaries WHERE slug = 'naple-betta-farms'), 'Layer Concentrate', 'layer-concentrate', 'Layer concentrate feed.', 'poultry_feed', 12)
ON CONFLICT (slug) DO NOTHING;
-- ============ PRODUCT NUTRITION (Tomvita X) ============
INSERT INTO product_nutrition (product_id, nutrient, value, unit, category, sort_order) VALUES
  ((SELECT id FROM products WHERE slug = 'tomvita-x'), 'Energy', '407', 'kcal', 'macro', 1),
  ((SELECT id FROM products WHERE slug = 'tomvita-x'), 'Carbohydrate', '66.63', '%', 'macro', 2),
  ((SELECT id FROM products WHERE slug = 'tomvita-x'), 'Fat', '8.09', '%', 'macro', 3),
  ((SELECT id FROM products WHERE slug = 'tomvita-x'), 'Protein', '16.96', '%', 'macro', 4),
  ((SELECT id FROM products WHERE slug = 'tomvita-x'), 'Vitamin A', '1145', 'IU', 'micro', 5),
  ((SELECT id FROM products WHERE slug = 'tomvita-x'), 'Vitamin B1', '1.38', 'mg', 'micro', 6),
  ((SELECT id FROM products WHERE slug = 'tomvita-x'), 'Vitamin B2', '1.38', 'mg', 'micro', 7),
  ((SELECT id FROM products WHERE slug = 'tomvita-x'), 'Niacin', '15.40', 'mg', 'micro', 8),
  ((SELECT id FROM products WHERE slug = 'tomvita-x'), 'Vitamin B6', '1185', 'µg', 'micro', 9),
  ((SELECT id FROM products WHERE slug = 'tomvita-x'), 'Vitamin B12', '2.75', 'µg', 'micro', 10),
  ((SELECT id FROM products WHERE slug = 'tomvita-x'), 'Vitamin C', '84', 'mg', 'micro', 11),
  ((SELECT id FROM products WHERE slug = 'tomvita-x'), 'Vitamin D3', '5.75', 'µg', 'micro', 12),
  ((SELECT id FROM products WHERE slug = 'tomvita-x'), 'Vitamin E', '6.60', 'mg', 'micro', 13),
  ((SELECT id FROM products WHERE slug = 'tomvita-x'), 'Vitamin K', '0.05', 'mg', 'micro', 14),
  ((SELECT id FROM products WHERE slug = 'tomvita-x'), 'Folic acid', '0.39', 'mg', 'micro', 15),
  ((SELECT id FROM products WHERE slug = 'tomvita-x'), 'Calcium', '200', 'mg', 'micro', 16),
  ((SELECT id FROM products WHERE slug = 'tomvita-x'), 'Copper', '0.20', 'mg', 'micro', 17),
  ((SELECT id FROM products WHERE slug = 'tomvita-x'), 'Iodine', '0.04', 'mg', 'micro', 18),
  ((SELECT id FROM products WHERE slug = 'tomvita-x'), 'Iron', '5.50', 'mg', 'micro', 19),
  ((SELECT id FROM products WHERE slug = 'tomvita-x'), 'Magnesium', '72.50', 'mg', 'micro', 20),
  ((SELECT id FROM products WHERE slug = 'tomvita-x'), 'Selenium', '0.0123', 'mg', 'micro', 21),
  ((SELECT id FROM products WHERE slug = 'tomvita-x'), 'Zinc', '2.38', 'mg', 'micro', 22)
ON CONFLICT (product_id, sort_order) DO NOTHING;
-- ============ PRODUCT PREPARATION STEPS (Tomvita X) ============
INSERT INTO product_preparation_steps (product_id, step_number, instruction) VALUES
  ((SELECT id FROM products WHERE slug = 'tomvita-x'), 1, 'Wash your hands with soap and use clean implements.'),
  ((SELECT id FROM products WHERE slug = 'tomvita-x'), 2, 'Boil drinkable water for five minutes.'),
  ((SELECT id FROM products WHERE slug = 'tomvita-x'), 3, 'Pour contents of this sachet (100g) unto a plate/bowl.'),
  ((SELECT id FROM products WHERE slug = 'tomvita-x'), 4, 'Measure 200ml of boiled water unto the product in the plate/bowl.'),
  ((SELECT id FROM products WHERE slug = 'tomvita-x'), 5, 'Stir until the cereal is smooth and enjoy immediately. Do not keep the unfinished portion.')
ON CONFLICT (product_id, step_number) DO NOTHING;
-- ============ PRODUCT NUTRITION (Koko Plus, per 15g sachet) ============
INSERT INTO product_nutrition (product_id, nutrient, value, unit, category, sort_order) VALUES
  ((SELECT id FROM products WHERE slug = 'koko-plus'), 'Energy', '69', 'kcal', 'macro', 1),
  ((SELECT id FROM products WHERE slug = 'koko-plus'), 'Protein', '3.4', 'g', 'macro', 2),
  ((SELECT id FROM products WHERE slug = 'koko-plus'), 'Carbohydrates', '7.7', 'g', 'macro', 3),
  ((SELECT id FROM products WHERE slug = 'koko-plus'), 'Fat', '2.7', 'g', 'macro', 4),
  ((SELECT id FROM products WHERE slug = 'koko-plus'), 'Iron', '7.8', 'mg', 'micro', 5),
  ((SELECT id FROM products WHERE slug = 'koko-plus'), 'Calcium', '213', 'mg', 'micro', 6),
  ((SELECT id FROM products WHERE slug = 'koko-plus'), 'Zinc', '2.2', 'mg', 'micro', 7),
  ((SELECT id FROM products WHERE slug = 'koko-plus'), 'Iodine', '69', 'µg', 'micro', 8),
  ((SELECT id FROM products WHERE slug = 'koko-plus'), 'Vitamin B1', '381', 'µg', 'micro', 9),
  ((SELECT id FROM products WHERE slug = 'koko-plus'), 'Vitamin B2', '249', 'µg', 'micro', 10),
  ((SELECT id FROM products WHERE slug = 'koko-plus'), 'Vitamin B6', '330', 'µg', 'micro', 11),
  ((SELECT id FROM products WHERE slug = 'koko-plus'), 'Niacin', '3.4', 'mg', 'micro', 12),
  ((SELECT id FROM products WHERE slug = 'koko-plus'), 'Folic acid', '68', 'µg', 'micro', 13),
  ((SELECT id FROM products WHERE slug = 'koko-plus'), 'Vitamin B12', '0.6', 'µg', 'micro', 14),
  ((SELECT id FROM products WHERE slug = 'koko-plus'), 'Vitamin A', '264', 'µg', 'micro', 15),
  ((SELECT id FROM products WHERE slug = 'koko-plus'), 'Vitamin E', '6.3', 'mg', 'micro', 16),
  ((SELECT id FROM products WHERE slug = 'koko-plus'), 'Vitamin K', '14', 'µg', 'micro', 17),
  ((SELECT id FROM products WHERE slug = 'koko-plus'), 'Vitamin D3', '3.1', 'µg', 'micro', 18),
  ((SELECT id FROM products WHERE slug = 'koko-plus'), 'Vitamin C', '32', 'mg', 'micro', 19),
  ((SELECT id FROM products WHERE slug = 'koko-plus'), 'Choline', '65', 'mg', 'micro', 20)
ON CONFLICT (product_id, sort_order) DO NOTHING;
-- ============ PRODUCT NUTRITION (Maisoyforte, per 100g) ============
INSERT INTO product_nutrition (product_id, nutrient, value, unit, category, sort_order) VALUES
  ((SELECT id FROM products WHERE slug = 'maisoyforte-tombrown'), 'Energy', '396.92', 'kcal', 'macro', 1),
  ((SELECT id FROM products WHERE slug = 'maisoyforte-tombrown'), 'Carbohydrate', '67.56', 'g', 'macro', 2),
  ((SELECT id FROM products WHERE slug = 'maisoyforte-tombrown'), 'Protein', '16.34', 'g', 'macro', 3),
  ((SELECT id FROM products WHERE slug = 'maisoyforte-tombrown'), 'Fat', '6.84', 'g', 'macro', 4),
  ((SELECT id FROM products WHERE slug = 'maisoyforte-tombrown'), 'Fibre', '3.8', 'g', 'macro', 5),
  ((SELECT id FROM products WHERE slug = 'maisoyforte-tombrown'), 'Vitamin A', '166', 'IU', 'micro', 6),
  ((SELECT id FROM products WHERE slug = 'maisoyforte-tombrown'), 'Thiamine', '0.128', 'mg', 'micro', 7),
  ((SELECT id FROM products WHERE slug = 'maisoyforte-tombrown'), 'Riboflavin', '0.448', 'mg', 'micro', 8),
  ((SELECT id FROM products WHERE slug = 'maisoyforte-tombrown'), 'Niacin', '4.8', 'mg', 'micro', 9),
  ((SELECT id FROM products WHERE slug = 'maisoyforte-tombrown'), 'Folate', '60', 'mcg', 'micro', 10),
  ((SELECT id FROM products WHERE slug = 'maisoyforte-tombrown'), 'Vitamin C', '48', 'mg', 'micro', 11),
  ((SELECT id FROM products WHERE slug = 'maisoyforte-tombrown'), 'Vitamin B12', '1.2', 'mcg', 'micro', 12),
  ((SELECT id FROM products WHERE slug = 'maisoyforte-tombrown'), 'Iron', '8', 'mg', 'micro', 13),
  ((SELECT id FROM products WHERE slug = 'maisoyforte-tombrown'), 'Calcium', '100', 'mg', 'micro', 14),
  ((SELECT id FROM products WHERE slug = 'maisoyforte-tombrown'), 'Zinc', '5', 'mg', 'micro', 15)
ON CONFLICT (product_id, sort_order) DO NOTHING;
-- ============ PRODUCT PREPARATION STEPS (Maisoyforte porridge) ============
INSERT INTO product_preparation_steps (product_id, step_number, instruction) VALUES
  ((SELECT id FROM products WHERE slug = 'maisoyforte-tombrown'), 1, 'Mix one cup Maisoyforte with two cups of cool water.'),
  ((SELECT id FROM products WHERE slug = 'maisoyforte-tombrown'), 2, 'Stir mixture into two cups of boiling water on medium heat.'),
  ((SELECT id FROM products WHERE slug = 'maisoyforte-tombrown'), 3, 'Keep stirring and allow the meal to boil (for 10-15 minutes) until well cooked.'),
  ((SELECT id FROM products WHERE slug = 'maisoyforte-tombrown'), 4, 'Serve hot and add milk and sugar as desired.')
ON CONFLICT (product_id, step_number) DO NOTHING;
-- ============ PRODUCT PREPARATION STEPS (Koko Plus) ============
INSERT INTO product_preparation_steps (product_id, step_number, instruction) VALUES
  ((SELECT id FROM products WHERE slug = 'koko-plus'), 1, 'Wash your hands and all utensils with clean water and soap.'),
  ((SELECT id FROM products WHERE slug = 'koko-plus'), 2, 'Dish freshly made food into baby''s bowl, add one sachet of Koko plus, stir and serve.'),
  ((SELECT id FROM products WHERE slug = 'koko-plus'), 3, 'Koko Plus can be added to any family foods such as soup/stew eaten with banku, fufu, kenkey etc.')
ON CONFLICT (product_id, step_number) DO NOTHING;
-- ============ SALES REPRESENTATIVES (belong to a subsidiary) ============
-- These sales reps sell fortified consumer foods for Yedent Agro Foods
INSERT INTO sales_representatives (subsidiary_id, name, region, territory, phone, sort_order) VALUES
  ((SELECT id FROM subsidiaries WHERE slug = 'yedent-agro-foods'), 'Vincent Adu Gyamfi', 'Bono', NULL, '+233 50 016 1478', 1),
  ((SELECT id FROM subsidiaries WHERE slug = 'yedent-agro-foods'), 'Solomon Appiah Kubi', 'Bono East', NULL, '+233 55 807 4439', 2),
  ((SELECT id FROM subsidiaries WHERE slug = 'yedent-agro-foods'), 'Suleman Mohammed', 'Ashanti', 'Offinso Sekyere', '+233 54 643 3173', 3),
  ((SELECT id FROM subsidiaries WHERE slug = 'yedent-agro-foods'), 'Richmond Opoku Agyemang', 'Ashanti', 'Akyem', '+233 55 194 0895', 4),
  ((SELECT id FROM subsidiaries WHERE slug = 'yedent-agro-foods'), 'Isaac Oppong', 'Ashanti', 'Atwima', '+233 54 899 2651', 5),
  ((SELECT id FROM subsidiaries WHERE slug = 'yedent-agro-foods'), 'Frank Bosompem Baafi', 'Ashanti', 'Obuasi', '+233 24 841 8915', 6),
  ((SELECT id FROM subsidiaries WHERE slug = 'yedent-agro-bulk'), 'Kofi Mensah', 'Bono', NULL, '+233 24 555 6100', 7),
  ((SELECT id FROM subsidiaries WHERE slug = 'yedent-agro-bulk'), 'Yaw Owusu', 'Ashanti', 'Kumasi Metro', '+233 55 200 7890', 8),
  ((SELECT id FROM subsidiaries WHERE slug = 'naple-betta-farms'), 'Kwame Boateng', 'Bono East', NULL, '+233 50 912 3344', 9)
ON CONFLICT (name, phone) DO NOTHING;
-- ============ AWARDS ============
INSERT INTO awards (title, award_year, conferring_body, description, sort_order) VALUES
  ('Cereal Foods Producer of the Year', 2023, 'Ghana Agriculture and Agro-Processing Awards', NULL, 1),
  ('Best Tax Payer of the Year', 2023, 'GRA', NULL, 2),
  ('Best Regional Company (Ashanti, Bono, and Bono Regions)', 2022, 'AGI Awards', NULL, 3),
  ('1ST SSTN Ghana Transformation Awards', 2022, 'Stanford Seed', NULL, 4),
  ('Best Agro-Processing Company', 2021, 'AGI Awards', NULL, 5)
ON CONFLICT (title, award_year) DO NOTHING;
-- ============ HERO SLIDES (landing carousel: company + subsidiaries) ============
INSERT INTO hero_slides (title, subtitle, description, cta_label, cta_href, slide_type, subsidiary_id, sort_order) VALUES
  ('Yedent Agro Group', 'Affordable, convenient and nutritious cereal staple foods', 'A wholly Ghanaian owned agricultural company operating across the entire cereal, legumes and poultry value chain since 2004.', 'Explore Our Products', '/products', 'company', NULL, 1),
  ('Yedent Agro Foods', 'Fortified nutrition from farm to family', 'Producing fortified cereal-legume based foods for institutions and consumers.', 'View Consumer Foods', '/about/subsidiaries/yedent-agro-foods', 'subsidiary', (SELECT id FROM subsidiaries WHERE slug = 'yedent-agro-foods'), 2),
  ('Yedent Agro Bulk', 'Quality ingredients for industry', 'Producing semi-finished goods for industrial purposes, including maize grit and soya bean meal.', 'View Bulk Products', '/about/subsidiaries/yedent-agro-bulk', 'subsidiary', (SELECT id FROM subsidiaries WHERE slug = 'yedent-agro-bulk'), 3),
  ('Naple Betta Farms', 'Complete poultry value chain', 'Spanning the entire integrated poultry value chain, from feed and concentrates to production.', 'View Poultry Feed', '/about/subsidiaries/naple-betta-farms', 'subsidiary', (SELECT id FROM subsidiaries WHERE slug = 'naple-betta-farms'), 4)
ON CONFLICT (title) DO NOTHING;

-- Correct hero-slide CTA paths that pointed to a non-existent route (/subsidiaries instead of /about/subsidiaries)
UPDATE hero_slides
SET cta_href = '/about/subsidiaries/' || slug
FROM subsidiaries
WHERE hero_slides.subsidiary_id = subsidiaries.id
  AND hero_slides.cta_href = '/subsidiaries/' || subsidiaries.slug;

-- ============ NEWS & EVENTS ============
INSERT INTO news_events (title, slug, summary, type, event_date, published_at) VALUES
  ('Yedent named Cereal Foods Producer of the Year 2023', 'cereal-foods-producer-of-the-year-2023', 'Yedent Agro Group was honoured as Cereal Foods Producer of the Year at the Ghana Agriculture and Agro-Processing Awards 2023.', 'news', NULL, NOW()),
  ('Best Tax Payer of the Year recognition from GRA', 'best-tax-payer-2023', 'The Ghana Revenue Authority recognised Yedent as Best Tax Payer of the Year 2023 for exemplary compliance.', 'news', NULL, NOW()),
  ('New fortified foods for institutional markets', 'new-fortified-foods-institutional', 'Yedent Agro Foods continues to expand its fortified cereal-legume product line for institutions and consumers.', 'news', NULL, NOW())
ON CONFLICT (slug) DO NOTHING;

-- ============ DEFAULT ADMIN USER ============
-- Default login: admin@yedentghana.com / admin123
-- IMPORTANT: change this password after first login (via the CMS Users page).
INSERT INTO users (full_name, email, password_hash, role)
SELECT 'Group Administrator', 'admin@yedentghana.com', '$2a$10$kfgudHc2Vt6RtMQaTO0f8.Zjoq7qOH.F7rZkE3ItZy5R6GUstUHb.', 'group_admin'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@yedentghana.com');
