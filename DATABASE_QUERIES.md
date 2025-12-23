# Database Query Reference

Quick reference for common Supabase queries during development.

## User Management

### Create Test User
```sql
-- Create auth user first
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at)
VALUES (
  'test-user-123',
  'test@example.com',
  crypt('password123', gen_salt('bf')),
  NOW()
);

-- Create user profile
INSERT INTO users (id, email, username, class, level, xp, sweat_points)
VALUES (
  'test-user-123',
  'test@example.com',
  'TestWarrior',
  'sprinter',
  10,
  5000,
  1000
);

-- Create character
INSERT INTO characters (user_id, skin_color, hair_style, hair_color, outfit)
VALUES (
  'test-user-123',
  '#ffdbac',
  'short',
  '#2c1810',
  'default'
);

-- Initialize user skills
INSERT INTO user_skills (user_id, unlocked_nodes, active_abilities)
VALUES (
  'test-user-123',
  '["sprint_1", "sprint_2"]',
  '["dash"]'
);
```

### Get User with All Data
```sql
SELECT 
  u.*,
  c.skin_color, c.hair_style, c.hair_color, c.outfit,
  us.unlocked_nodes, us.active_abilities
FROM users u
LEFT JOIN characters c ON c.user_id = u.id
LEFT JOIN user_skills us ON us.user_id = u.id
WHERE u.id = 'test-user-123';
```

### Update User XP and Level
```sql
UPDATE users
SET xp = xp + 1000, level = 11, sweat_points = sweat_points + 100
WHERE id = 'test-user-123';
```

## Inventory & Items

### Give User Items
```sql
-- Give specific item
INSERT INTO inventory (user_id, item_id, quantity, is_equipped)
SELECT 'test-user-123', id, 1, false
FROM items
WHERE name = 'Lightning Blade';

-- Give random items
INSERT INTO inventory (user_id, item_id, quantity, is_equipped)
SELECT 'test-user-123', id, 1, false
FROM items
ORDER BY RANDOM()
LIMIT 5;
```

### Equip Item
```sql
-- Unequip all items of same type first
UPDATE inventory
SET is_equipped = false
WHERE user_id = 'test-user-123'
  AND item_id IN (
    SELECT id FROM items WHERE type = 'weapon'
  );

-- Equip new item
UPDATE inventory
SET is_equipped = true
WHERE user_id = 'test-user-123'
  AND item_id = 'item-id-here';
```

### Get User's Equipped Items with Stats
```sql
SELECT i.*, it.name, it.type, it.rarity, it.stats
FROM inventory i
JOIN items it ON it.id = i.item_id
WHERE i.user_id = 'test-user-123'
  AND i.is_equipped = true;
```

## Battles

### Create Battle
```sql
INSERT INTO battles (challenger_id, opponent_id, battle_data, status)
VALUES (
  'test-user-123',
  'opponent-user-456',
  '{
    "track_length": 1000,
    "challenger_position": 0,
    "opponent_position": 0,
    "challenger_actions": [],
    "opponent_actions": [],
    "turn": 0
  }'::jsonb,
  'pending'
);
```

### Get Active Battles for User
```sql
SELECT 
  b.*,
  u1.username as challenger_name,
  u2.username as opponent_name
FROM battles b
JOIN users u1 ON u1.id = b.challenger_id
JOIN users u2 ON u2.id = b.opponent_id
WHERE (b.challenger_id = 'test-user-123' OR b.opponent_id = 'test-user-123')
  AND b.status IN ('pending', 'active')
ORDER BY b.created_at DESC;
```

### Complete Battle
```sql
UPDATE battles
SET 
  status = 'completed',
  winner_id = 'test-user-123',
  completed_at = NOW()
WHERE id = 'battle-id-here';
```

## Quests & Achievements

### Get Today's Quests for User
```sql
SELECT 
  dq.*,
  uq.progress,
  uq.completed
FROM daily_quests dq
LEFT JOIN user_quests uq ON uq.quest_id = dq.id AND uq.user_id = 'test-user-123'
WHERE dq.active_date = CURRENT_DATE;
```

### Update Quest Progress
```sql
INSERT INTO user_quests (user_id, quest_id, progress, completed)
VALUES ('test-user-123', 'quest-id-here', 5000, false)
ON CONFLICT (user_id, quest_id)
DO UPDATE SET 
  progress = EXCLUDED.progress,
  completed = CASE WHEN EXCLUDED.progress >= (
    SELECT target_value FROM daily_quests WHERE id = EXCLUDED.quest_id
  ) THEN true ELSE false END;
```

### Unlock Achievement
```sql
INSERT INTO user_achievements (user_id, achievement_id)
VALUES ('test-user-123', 'achievement-id-here')
ON CONFLICT (user_id, achievement_id) DO NOTHING;
```

### Get User Achievements
```sql
SELECT 
  a.*,
  ua.unlocked_at,
  CASE WHEN ua.id IS NOT NULL THEN true ELSE false END as unlocked
FROM achievements a
LEFT JOIN user_achievements ua ON ua.achievement_id = a.id AND ua.user_id = 'test-user-123'
ORDER BY a.reward_xp DESC;
```

## Friends & Social

### Send Friend Request
```sql
INSERT INTO friends (user_id, friend_id, status)
VALUES ('test-user-123', 'friend-user-456', 'pending');
```

### Accept Friend Request
```sql
UPDATE friends
SET status = 'accepted'
WHERE user_id = 'friend-user-456'
  AND friend_id = 'test-user-123';

-- Create reciprocal friendship
INSERT INTO friends (user_id, friend_id, status)
VALUES ('test-user-123', 'friend-user-456', 'accepted')
ON CONFLICT (user_id, friend_id) DO NOTHING;
```

### Get Friends List
```sql
SELECT 
  u.id, u.username, u.level, u.avatar_url, u.class
FROM friends f
JOIN users u ON u.id = f.friend_id
WHERE f.user_id = 'test-user-123'
  AND f.status = 'accepted'
ORDER BY u.username;
```

## Run Clubs

### Create Club
```sql
-- Create club
INSERT INTO run_clubs (name, description, owner_id, max_members, is_private)
VALUES (
  'Speed Demons',
  'Fast runners only!',
  'test-user-123',
  4,
  false
)
RETURNING id;

-- Add owner as member
INSERT INTO run_club_members (club_id, user_id, role)
VALUES ('club-id-here', 'test-user-123', 'owner');
```

### Join Club
```sql
INSERT INTO run_club_members (club_id, user_id, role)
VALUES ('club-id-here', 'test-user-123', 'member');
```

### Get Club with Members
```sql
SELECT 
  rc.*,
  json_agg(
    json_build_object(
      'id', u.id,
      'username', u.username,
      'level', u.level,
      'role', rcm.role
    )
  ) as members
FROM run_clubs rc
LEFT JOIN run_club_members rcm ON rcm.club_id = rc.id
LEFT JOIN users u ON u.id = rcm.user_id
WHERE rc.id = 'club-id-here'
GROUP BY rc.id;
```

## Health Sync

### Record Daily Health Data
```sql
INSERT INTO health_syncs (user_id, date, steps, calories, distance, active_minutes, workouts, xp_earned)
VALUES (
  'test-user-123',
  CURRENT_DATE,
  10000,
  500,
  8.5,
  60,
  '[{"type": "running", "duration": 1800, "calories": 300}]'::jsonb,
  2500
)
ON CONFLICT (user_id, date)
DO UPDATE SET
  steps = EXCLUDED.steps,
  calories = EXCLUDED.calories,
  distance = EXCLUDED.distance,
  active_minutes = EXCLUDED.active_minutes,
  workouts = EXCLUDED.workouts,
  xp_earned = EXCLUDED.xp_earned,
  synced_at = NOW();
```

### Get Weekly Health Summary
```sql
SELECT 
  date,
  steps,
  calories,
  xp_earned
FROM health_syncs
WHERE user_id = 'test-user-123'
  AND date >= CURRENT_DATE - INTERVAL '7 days'
ORDER BY date DESC;
```

## Leaderboards

### Global Leaderboard (by Level)
```sql
SELECT 
  id,
  username,
  level,
  xp,
  avatar_url,
  ROW_NUMBER() OVER (ORDER BY level DESC, xp DESC) as rank
FROM users
ORDER BY level DESC, xp DESC
LIMIT 100;
```

### Friends Leaderboard
```sql
SELECT 
  u.id,
  u.username,
  u.level,
  u.xp,
  u.avatar_url,
  ROW_NUMBER() OVER (ORDER BY u.level DESC, u.xp DESC) as rank
FROM users u
WHERE u.id IN (
  SELECT friend_id FROM friends 
  WHERE user_id = 'test-user-123' AND status = 'accepted'
)
OR u.id = 'test-user-123'
ORDER BY u.level DESC, u.xp DESC;
```

### Club Leaderboard
```sql
SELECT 
  u.id,
  u.username,
  u.level,
  u.xp,
  ROW_NUMBER() OVER (ORDER BY u.level DESC, u.xp DESC) as rank
FROM users u
JOIN run_club_members rcm ON rcm.user_id = u.id
WHERE rcm.club_id = 'club-id-here'
ORDER BY u.level DESC, u.xp DESC;
```

## Notifications

### Create Notification
```sql
INSERT INTO notifications (user_id, type, title, message, data)
VALUES (
  'test-user-123',
  'battle_invite',
  'Battle Challenge!',
  'You have been challenged to a battle!',
  '{"battle_id": "battle-id-here", "challenger_name": "SpeedRunner"}'::jsonb
);
```

### Get Unread Notifications
```sql
SELECT *
FROM notifications
WHERE user_id = 'test-user-123'
  AND read = false
ORDER BY created_at DESC
LIMIT 20;
```

### Mark as Read
```sql
UPDATE notifications
SET read = true
WHERE id = 'notification-id-here';
```

## Useful Queries

### Reset User Progress (for testing)
```sql
UPDATE users
SET level = 1, xp = 0, sweat_points = 0
WHERE id = 'test-user-123';

DELETE FROM user_skills WHERE user_id = 'test-user-123';
DELETE FROM inventory WHERE user_id = 'test-user-123';
DELETE FROM user_achievements WHERE user_id = 'test-user-123';
```

### Get User Stats Summary
```sql
SELECT 
  u.username,
  u.level,
  u.xp,
  u.sweat_points,
  u.class,
  COUNT(DISTINCT b.id) FILTER (WHERE b.winner_id = u.id) as wins,
  COUNT(DISTINCT b.id) FILTER (WHERE b.winner_id != u.id AND b.status = 'completed') as losses,
  COUNT(DISTINCT f.id) as friend_count,
  COUNT(DISTINCT ua.id) as achievement_count
FROM users u
LEFT JOIN battles b ON (b.challenger_id = u.id OR b.opponent_id = u.id) AND b.status = 'completed'
LEFT JOIN friends f ON f.user_id = u.id AND f.status = 'accepted'
LEFT JOIN user_achievements ua ON ua.user_id = u.id
WHERE u.id = 'test-user-123'
GROUP BY u.id;
```

### Clean Up Old Data
```sql
-- Delete old notifications (30 days)
DELETE FROM notifications
WHERE created_at < NOW() - INTERVAL '30 days';

-- Delete old health syncs (90 days)
DELETE FROM health_syncs
WHERE date < CURRENT_DATE - INTERVAL '90 days';

-- Delete completed battles (30 days)
DELETE FROM battles
WHERE status = 'completed'
  AND completed_at < NOW() - INTERVAL '30 days';
```
