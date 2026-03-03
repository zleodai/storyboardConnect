-- Seed user for development
INSERT INTO users (id, email, name, provider, provider_id, role)
VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'seed@example.com',
    'Seed User',
    'github',
    'seed-dev-001',
    'creator'
) ON CONFLICT (id) DO NOTHING;

-- Seed artists
INSERT INTO artists (id, user_id, name, avatar, banner, school, major, graduation_year, about, top_skills, board_types, is_premium, avail_status, avail_next, avail_rate, is_featured, created_at, view_count)
VALUES
    ('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Nicholas Wu', '/images/nicholas_avatar.jpg', '/images/banner_main.jpg', 'LMU', 'Film & TV Production', '2024',
     'Nicholas Wu is a storyboard artist and animator in Los Angeles, California. Nicholas studied Film & TV Production and Screenwriting at Loyola Marymount University and has worked on both live-action and animation projects.',
     ARRAY['Storyboard Pro', 'Blender', 'Photoshop'], ARRAY['Action Board', 'Cinematic'], FALSE, 'open', 'Oct 2025', 450.00, TRUE, '2025-06-15T10:00:00Z', 1240),

    ('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Maya Patel', '/images/nicholas_avatar.jpg', '/images/banner_main.jpg', 'CalArts', 'Character Animation', '2023',
     'Maya Patel is a storyboard artist and character designer based in Burbank, CA. She graduated from CalArts with a focus on character animation and has contributed boards to several animated series and indie shorts.',
     ARRAY['Storyboard Pro', 'Procreate', 'After Effects'], ARRAY['Comedy Board', 'Character-Driven'], TRUE, 'busy', 'Mar 2026', 500.00, TRUE, '2025-08-22T14:30:00Z', 3450),

    ('b0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'Jordan Lee', '/images/nicholas_avatar.jpg', '/images/banner_main.jpg', 'SVA', 'Visual Narrative', '2025',
     'Jordan Lee is a storyboard and concept artist from New York. He specializes in sci-fi and horror visual storytelling, blending cinematic compositions with graphic novel aesthetics.',
     ARRAY['Clip Studio Paint', 'Photoshop', 'Blender'], ARRAY['Cinematic', 'Horror'], FALSE, 'open', 'Feb 2026', 350.00, FALSE, '2025-11-03T09:15:00Z', 870),

    ('b0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'Anika Torres', '/images/nicholas_avatar.jpg', '/images/banner_main.jpg', 'RISD', 'Illustration', '2024',
     'Anika Torres is an illustrator and storyboard artist from Providence, RI. Her work focuses on emotionally rich, dialogue-heavy sequences for animation and live-action drama.',
     ARRAY['Storyboard Pro', 'Photoshop', 'Procreate'], ARRAY['Dialogue Board', 'Drama'], FALSE, 'open', NULL, 400.00, FALSE, '2025-12-10T16:45:00Z', 2100),

    ('b0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', 'Derek Okafor', '/images/nicholas_avatar.jpg', '/images/banner_main.jpg', 'USC', 'Animation & Digital Arts', '2023',
     'Derek Okafor is a Los Angeles-based storyboard artist with experience in commercial and music video production. Known for dynamic action sequences and bold compositions.',
     ARRAY['Storyboard Pro', 'After Effects', 'Premiere Pro'], ARRAY['Action Board', 'Commercial'], TRUE, 'unavailable', NULL, NULL, FALSE, '2026-01-18T11:00:00Z', 5670)
ON CONFLICT (id) DO NOTHING;

-- Seed portfolio projects
INSERT INTO portfolio_projects (id, artist_id, title, image, tags, category, sort_order)
VALUES
    ('c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Way of the Shadow', '/images/project1.jpg', ARRAY['Action Boards', 'Commercial', 'Martial Arts'], 'action', 0),
    ('c0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001', 'Faces in the Water', '/images/project2.jpg', ARRAY['Cinematic Boards', 'Short Film', 'Drama'], 'cinematic', 1),
    ('c0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000002', 'Lunar Rabbit', '/images/project1.jpg', ARRAY['Comedy Boards', 'Animated Series', 'Fantasy'], 'comedy', 0),
    ('c0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000002', 'Late Shift', '/images/project2.jpg', ARRAY['Character-Driven', 'Slice of Life', 'Indie'], 'character', 1),
    ('c0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000003', 'Station Nine', '/images/project1.jpg', ARRAY['Cinematic Boards', 'Sci-Fi', 'Feature'], 'cinematic', 0),
    ('c0000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000003', 'The Hollow', '/images/project2.jpg', ARRAY['Horror', 'Short Film', 'Atmospheric'], 'horror', 1),
    ('c0000000-0000-0000-0000-000000000007', 'b0000000-0000-0000-0000-000000000004', 'Between the Lines', '/images/project1.jpg', ARRAY['Dialogue Boards', 'Drama', 'Indie Film'], 'dialogue', 0),
    ('c0000000-0000-0000-0000-000000000008', 'b0000000-0000-0000-0000-000000000004', 'Homecoming', '/images/project2.jpg', ARRAY['Drama', 'Student Film', 'Emotional'], 'drama', 1),
    ('c0000000-0000-0000-0000-000000000009', 'b0000000-0000-0000-0000-000000000005', 'Overdrive', '/images/project1.jpg', ARRAY['Action Boards', 'Music Video', 'High Energy'], 'action', 0),
    ('c0000000-0000-0000-0000-000000000010', 'b0000000-0000-0000-0000-000000000005', 'Neon District', '/images/project2.jpg', ARRAY['Commercial', 'Urban', 'Stylized'], 'commercial', 1)
ON CONFLICT (id) DO NOTHING;

-- Seed projects
INSERT INTO projects (id, created_by, title, subtitle, image, logline, school, format, length, timeline, production_type, shotlist_ready, location_secured, is_paid, visual_deck_url, contact_twitter, contact_instagram, contact_email, is_featured, created_at, view_count)
VALUES
    ('d0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Soulstealers', 'LMU Undergrad 3rd-Year Thesis', '/images/Soulstealers.jpg',
     'At the height of the 1768 Sorcery Scare in Qing Dynasty China, a bridge builder from out of town races to find the real cause of the local kid''s possession before the xenophobic town deems him guilty.',
     'LMU', 'Short Film', '15 min', '1 Month', 'Student', TRUE, TRUE, TRUE, '#', '#', '#', 'contact@example.com', TRUE, '2025-07-10T08:00:00Z', 2340),

    ('d0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Parallax', 'CalArts Senior Thesis Film', '/images/Soulstealers.jpg',
     'A retired astronaut suffering from memory loss discovers that the strange visions she keeps having aren''t hallucinations — they''re transmissions from a version of herself that never came home.',
     'CalArts', 'Short Film', '12 min', '2 Months', 'Student', TRUE, FALSE, FALSE, NULL, NULL, '#', 'parallax@example.com', TRUE, '2025-09-05T12:00:00Z', 1870),

    ('d0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'Glass Garden', 'Indie Animated Short', '/images/Soulstealers.jpg',
     'In a city where emotions manifest as plants, a florist who feels nothing must tend to the overgrown grief of a stranger before it consumes the entire neighborhood.',
     'SVA', 'Short Film', '8 min', '3 Months', 'Indie', FALSE, TRUE, TRUE, '#', '#', NULL, 'glassgarden@example.com', FALSE, '2025-10-20T15:30:00Z', 950),

    ('d0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'VANTA', 'Nike x Foot Locker Campaign', '/images/Soulstealers.jpg',
     'A 60-second spot following a dancer through impossible architecture as each move transforms the world around her into bold, kinetic geometry.',
     'USC', 'Commercial', '60 sec', '2 Weeks', 'Commercial', TRUE, TRUE, TRUE, '#', '#', '#', 'vanta@example.com', FALSE, '2025-12-01T09:00:00Z', 4200),

    ('d0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', 'Undertow', 'RISD MFA Thesis', '/images/Soulstealers.jpg',
     'Two estranged siblings return to their childhood beach house to settle their late mother''s estate, only to find that the house won''t let them leave until they confront what tore them apart.',
     'RISD', 'Short Film', '20 min', '6 Weeks', 'Student', TRUE, TRUE, FALSE, NULL, NULL, NULL, 'undertow@example.com', FALSE, '2026-01-08T14:00:00Z', 680),

    ('d0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001', 'Midnight Frequency', 'Independent Music Video', '/images/Soulstealers.jpg',
     'A pirate radio DJ in 1990s Lagos broadcasts forbidden songs that literally bring the city''s murals to life, drawing the attention of a government determined to silence him.',
     'LMU', 'MV', '4 min', '3 Weeks', 'Indie', FALSE, FALSE, TRUE, '#', '#', '#', 'midfreq@example.com', FALSE, '2026-02-01T10:00:00Z', 3100)
ON CONFLICT (id) DO NOTHING;
