-- Update menu categories for FoodCarvan.in
DELETE FROM menu_categories;
DELETE FROM menu_items;

-- Insert new categories for FoodCarvan
INSERT INTO menu_categories (name, description, display_order, active) VALUES
('Biryani', 'Authentic aromatic rice dishes with perfectly spiced meat and vegetables', 1, true),
('Combos', 'Value-packed meal combinations for the whole family', 2, true),
('Desserts', 'Sweet treats to complete your meal', 3, true),
('Soft Drinks', 'Refreshing beverages to complement your food', 4, true);

-- Insert sample menu items
-- Biryani
INSERT INTO menu_items (
  name, description, base_price, category_id, is_vegetarian, preparation_time,
  image_url, spice_levels, available_addons, is_available
) VALUES
('Hyderabadi Chicken Dum Biryani', 'Slow-cooked aromatic basmati rice with tender chicken pieces, herbs and spices', 299, 
  (SELECT id FROM menu_categories WHERE name = 'Biryani'), false, 35,
  'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8', 
  ARRAY['Mild', 'Medium', 'Hot'], 
  ARRAY['Extra Raita', 'Boiled Egg', 'Extra Gravy'], true),

('Mutton Biryani', 'Premium mutton pieces layered with fragrant basmati rice', 399,
  (SELECT id FROM menu_categories WHERE name = 'Biryani'), false, 45,
  'https://images.unsplash.com/photo-1633945274309-7ae8f638eb62',
  ARRAY['Mild', 'Medium', 'Hot'],
  ARRAY['Extra Raita', 'Boiled Egg', 'Extra Gravy'], true),

('Veg Biryani', 'Mixed vegetables with aromatic rice and exotic spices', 199,
  (SELECT id FROM menu_categories WHERE name = 'Biryani'), true, 30,
  'https://images.unsplash.com/photo-1642821373181-696a54913e93',
  ARRAY['Mild', 'Medium', 'Hot'],
  ARRAY['Extra Raita', 'Paneer', 'Extra Gravy'], true),

('Paneer Biryani', 'Cottage cheese cubes with basmati rice and aromatic spices', 249,
  (SELECT id FROM menu_categories WHERE name = 'Biryani'), true, 30,
  'https://images.unsplash.com/photo-1601050690597-df0568f70950',
  ARRAY['Mild', 'Medium'],
  ARRAY['Extra Raita', 'Extra Paneer', 'Extra Gravy'], true);

-- Combos
INSERT INTO menu_items (
  name, description, base_price, category_id, is_vegetarian, preparation_time,
  image_url, spice_levels, available_addons, is_available
) VALUES
('Family Feast', 'Chicken Biryani (2), Veg Biryani (1), Raita, Soft Drink (4)', 999,
  (SELECT id FROM menu_categories WHERE name = 'Combos'), false, 40,
  'https://images.unsplash.com/photo-1606491956689-2ea866880c84',
  ARRAY['Medium'],
  ARRAY['Extra Raita', 'Extra Drinks'], true),

('Couple Special', 'Any 2 Biryanis, 2 Desserts, 2 Soft Drinks', 599,
  (SELECT id FROM menu_categories WHERE name = 'Combos'), false, 35,
  'https://images.unsplash.com/photo-1555939594-58d7cb561ad1',
  ARRAY['Mild', 'Medium', 'Hot'],
  ARRAY['Upgrade to Mutton', 'Extra Dessert'], true),

('Veg Delight Combo', 'Veg Biryani (2), Paneer Biryani (1), Raita, Gulab Jamun, Drinks (3)', 699,
  (SELECT id FROM menu_categories WHERE name = 'Combos'), true, 35,
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
  ARRAY['Mild', 'Medium'],
  ARRAY['Extra Dessert', 'Extra Raita'], true);

-- Desserts
INSERT INTO menu_items (
  name, description, base_price, category_id, is_vegetarian, preparation_time,
  image_url, is_available
) VALUES
('Gulab Jamun (2 pcs)', 'Soft milk-solid based sweet soaked in sugar syrup', 49,
  (SELECT id FROM menu_categories WHERE name = 'Desserts'), true, 5,
  'https://images.unsplash.com/photo-1585638840835-2c88db008e0b', true),

('Rasmalai (2 pcs)', 'Cottage cheese dumplings in sweetened thick milk', 79,
  (SELECT id FROM menu_categories WHERE name = 'Desserts'), true, 5,
  'https://images.unsplash.com/photo-1624353365286-3f8d62daad51', true),

('Ice Cream Cup', 'Vanilla, Chocolate, or Strawberry', 69,
  (SELECT id FROM menu_categories WHERE name = 'Desserts'), true, 2,
  'https://images.unsplash.com/photo-1563805042-7684c019e1cb', true);

-- Soft Drinks
INSERT INTO menu_items (
  name, description, base_price, category_id, is_vegetarian, preparation_time,
  image_url, is_available
) VALUES
('Coca Cola (500ml)', 'Chilled Coca Cola', 40,
  (SELECT id FROM menu_categories WHERE name = 'Soft Drinks'), true, 2,
  'https://images.unsplash.com/photo-1554866585-cd94860890b7', true),

('Pepsi (500ml)', 'Chilled Pepsi', 40,
  (SELECT id FROM menu_categories WHERE name = 'Soft Drinks'), true, 2,
  'https://images.unsplash.com/photo-1629203851122-3726ecdf080e', true),

('Sprite (500ml)', 'Refreshing lemon-lime soda', 40,
  (SELECT id FROM menu_categories WHERE name = 'Soft Drinks'), true, 2,
  'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3', true),

('Mineral Water (1L)', 'Pure drinking water', 20,
  (SELECT id FROM menu_categories WHERE name = 'Soft Drinks'), true, 1,
  'https://images.unsplash.com/photo-1548839140-29a749e1cf4d', true),

('Lassi (Sweet)', 'Traditional yogurt-based drink', 60,
  (SELECT id FROM menu_categories WHERE name = 'Soft Drinks'), true, 5,
  'https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf', true);