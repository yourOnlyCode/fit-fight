-- Seed Items
INSERT INTO items (name, description, type, rarity, stats, price_sweat_points, image_url) VALUES
-- Weapons
('Rusty Sword', 'A basic weapon for beginners', 'weapon', 'common', '{"attack": 5}', 100, 'rusty_sword.png'),
('Lightning Blade', 'Strikes with electric speed', 'weapon', 'rare', '{"attack": 15, "speed": 10}', 500, 'lightning_blade.png'),
('Shadow Dagger', 'Perfect for tricksters', 'weapon', 'epic', '{"attack": 20, "speed": 15}', 1500, 'shadow_dagger.png'),
('Titan Hammer', 'Massive damage, slow swing', 'weapon', 'legendary', '{"attack": 40, "defense": 10}', 5000, 'titan_hammer.png'),

-- Armor
('Leather Vest', 'Basic protection', 'armor', 'common', '{"defense": 5}', 100, 'leather_vest.png'),
('Steel Plate', 'Solid defense', 'armor', 'rare', '{"defense": 15, "stamina": 5}', 500, 'steel_plate.png'),
('Dragon Scale', 'Legendary protection', 'armor', 'legendary', '{"defense": 35, "stamina": 15}', 5000, 'dragon_scale.png'),

-- Accessories
('Speed Boots', 'Gotta go fast', 'accessory', 'rare', '{"speed": 20}', 400, 'speed_boots.png'),
('Endurance Ring', 'Never give up', 'accessory', 'epic', '{"stamina": 25}', 1200, 'endurance_ring.png'),
('Power Gloves', 'Increase attack power', 'accessory', 'rare', '{"attack": 12}', 450, 'power_gloves.png'),

-- Consumables
('Health Potion', 'Restore stamina mid-battle', 'consumable', 'common', '{"stamina": 50}', 50, 'health_potion.png'),
('Speed Boost', 'Temporary speed increase', 'consumable', 'common', '{"speed": 30}', 75, 'speed_boost.png');

-- Seed Skill Trees
INSERT INTO skill_trees (class, nodes) VALUES
('sprinter', '[
  {"id": "sprint_1", "name": "Quick Start", "description": "+10 Speed", "tier": 1, "position": {"x": 0, "y": 0}, "requirements": [], "cost": 1},
  {"id": "sprint_2", "name": "Dash", "description": "Unlock Dash ability", "tier": 2, "position": {"x": -1, "y": 1}, "requirements": ["sprint_1"], "cost": 2},
  {"id": "sprint_3", "name": "Sonic Boom", "description": "Unlock Sonic Boom ability", "tier": 2, "position": {"x": 1, "y": 1}, "requirements": ["sprint_1"], "cost": 2},
  {"id": "sprint_4", "name": "Lightning Speed", "description": "+25 Speed", "tier": 3, "position": {"x": 0, "y": 2}, "requirements": ["sprint_2", "sprint_3"], "cost": 3}
]'),

('tank', '[
  {"id": "tank_1", "name": "Iron Skin", "description": "+10 Defense", "tier": 1, "position": {"x": 0, "y": 0}, "requirements": [], "cost": 1},
  {"id": "tank_2", "name": "Shield Wall", "description": "Unlock Shield Wall ability", "tier": 2, "position": {"x": -1, "y": 1}, "requirements": ["tank_1"], "cost": 2},
  {"id": "tank_3", "name": "Ground Slam", "description": "Unlock Ground Slam ability", "tier": 2, "position": {"x": 1, "y": 1}, "requirements": ["tank_1"], "cost": 2},
  {"id": "tank_4", "name": "Fortress", "description": "+30 Defense, +20 Stamina", "tier": 3, "position": {"x": 0, "y": 2}, "requirements": ["tank_2", "tank_3"], "cost": 3}
]'),

('trickster', '[
  {"id": "trick_1", "name": "Sleight of Hand", "description": "+10 Attack", "tier": 1, "position": {"x": 0, "y": 0}, "requirements": [], "cost": 1},
  {"id": "trick_2", "name": "Smoke Bomb", "description": "Unlock Smoke Bomb ability", "tier": 2, "position": {"x": -1, "y": 1}, "requirements": ["trick_1"], "cost": 2},
  {"id": "trick_3", "name": "Poison Dart", "description": "Unlock Poison Dart ability", "tier": 2, "position": {"x": 1, "y": 1}, "requirements": ["trick_1"], "cost": 2},
  {"id": "trick_4", "name": "Master Assassin", "description": "+20 Attack, +15 Speed", "tier": 3, "position": {"x": 0, "y": 2}, "requirements": ["trick_2", "trick_3"], "cost": 3}
]'),

('endurance', '[
  {"id": "endure_1", "name": "Steady Pace", "description": "+10 Stamina", "tier": 1, "position": {"x": 0, "y": 0}, "requirements": [], "cost": 1},
  {"id": "endure_2", "name": "Second Wind", "description": "Unlock Second Wind ability", "tier": 2, "position": {"x": -1, "y": 1}, "requirements": ["endure_1"], "cost": 2},
  {"id": "endure_3", "name": "Marathon Runner", "description": "+15 Speed, +15 Stamina", "tier": 2, "position": {"x": 1, "y": 1}, "requirements": ["endure_1"], "cost": 2},
  {"id": "endure_4", "name": "Unstoppable", "description": "+25 Stamina, +20 Defense", "tier": 3, "position": {"x": 0, "y": 2}, "requirements": ["endure_2", "endure_3"], "cost": 3}
]');

-- Seed Achievements
INSERT INTO achievements (title, description, icon, requirement, reward_xp, reward_sweat_points) VALUES
('First Steps', 'Walk 1,000 steps', 'steps_icon', '{"type": "total_steps", "value": 1000}', 100, 10),
('Marathon Runner', 'Walk 100,000 steps', 'marathon_icon', '{"type": "total_steps", "value": 100000}', 5000, 500),
('Battle Beginner', 'Win your first battle', 'battle_icon', '{"type": "total_battles", "value": 1}', 200, 20),
('Battle Master', 'Win 100 battles', 'master_icon', '{"type": "total_battles", "value": 100}', 10000, 1000),
('Win Streak', 'Win 5 battles in a row', 'streak_icon', '{"type": "win_streak", "value": 5}', 1000, 100),
('Level 10', 'Reach level 10', 'level_icon', '{"type": "level", "value": 10}', 2000, 200),
('Level 50', 'Reach level 50', 'level_icon', '{"type": "level", "value": 50}', 15000, 1500),
('Club Leader', 'Have 10 members in your club', 'club_icon', '{"type": "club_members", "value": 10}', 3000, 300);

-- Seed Daily Quests (example for today)
INSERT INTO daily_quests (title, description, type, target_value, reward_xp, reward_sweat_points, active_date) VALUES
('Daily Walker', 'Walk 10,000 steps today', 'steps', 10000, 1000, 100, CURRENT_DATE),
('Calorie Burner', 'Burn 500 calories today', 'steps', 500, 1500, 150, CURRENT_DATE),
('Battle Ready', 'Win 3 battles today', 'battle', 3, 2000, 200, CURRENT_DATE),
('Social Butterfly', 'Add 2 new friends', 'social', 2, 500, 50, CURRENT_DATE);
