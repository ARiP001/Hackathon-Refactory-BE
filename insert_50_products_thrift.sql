-- Insert 50 thrift/second-hand products
INSERT INTO "Product" (product_id, uuid, category_id, name, description, highlight_img, detail_img, price, condition, status, total_qty, avail_qty) VALUES
-- Fashion items
('prod-001', '0c49d2db-69dc-410d-8064-24da8bbb3054', 'CTG-01', 'Vintage Denim Jacket', 'Classic blue denim jacket, some wear but still stylish', null, '{}', 45000, 'good', 'available', 1, 1),
('prod-002', '289abff5-dfc9-4c81-a65c-0038bb157f62', 'CTG-01', 'Used T-Shirt Collection', 'Set of 3 pre-loved cotton t-shirts', null, '{}', 25000, 'so so', 'available', 3, 3),
('prod-003', '486bbb90-81e4-465d-897b-e0ebac06eb54', 'CTG-01', 'Second-hand Handbag', 'Leather handbag with minor scuffs', null, '{}', 75000, 'good', 'available', 1, 1),
('prod-004', '5b47b9f4-cb13-46d8-a4ce-412b2cd4c635', 'CTG-01', 'Thrift Store Jeans', 'Used jeans in good condition', null, '{}', 35000, 'good', 'available', 2, 2),
('prod-005', 'd63ddb16-773f-48c6-883f-a391077d1e15', 'CTG-01', 'Pre-owned Dress', 'Vintage dress with some fading', null, '{}', 55000, 'so so', 'available', 1, 1),

-- Bags & Accessories
('prod-006', 'fd7bc13f-363f-46be-ba13-d15355bc2fa7', 'CTG-02', 'Used Backpack', 'Well-worn backpack, still functional', null, '{}', 35000, 'so so', 'available', 1, 1),
('prod-007', '0c49d2db-69dc-410d-8064-24da8bbb3054', 'CTG-02', 'Vintage Wallet', 'Old leather wallet with character', null, '{}', 25000, 'good', 'available', 1, 1),
('prod-008', '289abff5-dfc9-4c81-a65c-0038bb157f62', 'CTG-02', 'Second-hand Tote', 'Used canvas tote bag', null, '{}', 20000, 'so so', 'available', 1, 1),
('prod-009', '486bbb90-81e4-465d-897b-e0ebac06eb54', 'CTG-02', 'Old Sunglasses', 'Vintage sunglasses with minor scratches', null, '{}', 30000, 'so so', 'available', 1, 1),
('prod-010', '5b47b9f4-cb13-46d8-a4ce-412b2cd4c635', 'CTG-02', 'Used Belt', 'Leather belt with some wear', null, '{}', 15000, 'good', 'available', 1, 1),

-- Footwear
('prod-011', 'd63ddb16-773f-48c6-883f-a391077d1e15', 'CTG-03', 'Pre-owned Sneakers', 'Used running shoes, size 42', null, '{}', 65000, 'good', 'available', 1, 1),
('prod-012', 'fd7bc13f-363f-46be-ba13-d15355bc2fa7', 'CTG-03', 'Second-hand Shoes', 'Black dress shoes with scuffs', null, '{}', 45000, 'so so', 'available', 1, 1),
('prod-013', '0c49d2db-69dc-410d-8064-24da8bbb3054', 'CTG-03', 'Thrift Store Sneakers', 'White sneakers, some yellowing', null, '{}', 35000, 'so so', 'available', 1, 1),
('prod-014', '289abff5-dfc9-4c81-a65c-0038bb157f62', 'CTG-03', 'Used Boots', 'Hiking boots with wear marks', null, '{}', 55000, 'good', 'available', 1, 1),
('prod-015', '486bbb90-81e4-465d-897b-e0ebac06eb54', 'CTG-03', 'Old Sandals', 'Flip-flops with some wear', null, '{}', 15000, 'so so', 'available', 1, 1),

-- Electronics
('prod-016', '5b47b9f4-cb13-46d8-a4ce-412b2cd4c635', 'CTG-04', 'Used Headphones', 'Old wired headphones, still working', null, '{}', 25000, 'good', 'available', 1, 1),
('prod-017', 'd63ddb16-773f-48c6-883f-a391077d1e15', 'CTG-04', 'Phone Case Collection', 'Various used phone cases', null, '{}', 15000, 'so so', 'available', 5, 5),
('prod-018', 'fd7bc13f-363f-46be-ba13-d15355bc2fa7', 'CTG-04', 'Old Speaker', 'Vintage speaker, needs cleaning', null, '{}', 40000, 'so so', 'available', 1, 1),
('prod-019', '0c49d2db-69dc-410d-8064-24da8bbb3054', 'CTG-04', 'Used Charger', 'Old phone charger, works fine', null, '{}', 10000, 'good', 'available', 2, 2),
('prod-020', '289abff5-dfc9-4c81-a65c-0038bb157f62', 'CTG-04', 'Second-hand Stand', 'Used tablet stand', null, '{}', 20000, 'good', 'available', 1, 1),

-- Books & Stationery
('prod-021', '486bbb90-81e4-465d-897b-e0ebac06eb54', 'CTG-05', 'Old Programming Books', 'Used programming books with notes', null, '{}', 50000, 'so so', 'available', 3, 3),
('prod-022', '5b47b9f4-cb13-46d8-a4ce-412b2cd4c635', 'CTG-05', 'Used Notebooks', 'Partially used notebooks', null, '{}', 15000, 'so so', 'available', 5, 5),
('prod-023', 'd63ddb16-773f-48c6-883f-a391077d1e15', 'CTG-05', 'Old Pen Collection', 'Mixed used pens, some work', null, '{}', 8000, 'so so', 'available', 10, 10),
('prod-024', 'fd7bc13f-363f-46be-ba13-d15355bc2fa7', 'CTG-05', 'Second-hand Art Supplies', 'Used art supplies, some missing', null, '{}', 30000, 'so so', 'available', 1, 1),
('prod-025', '0c49d2db-69dc-410d-8064-24da8bbb3054', 'CTG-05', 'Old Planner', 'Used academic planner, some pages torn', null, '{}', 12000, 'bad', 'available', 1, 1),

-- Furniture
('prod-026', '289abff5-dfc9-4c81-a65c-0038bb157f62', 'CTG-06', 'Used Office Chair', 'Old office chair, some wear', null, '{}', 80000, 'so so', 'available', 1, 1),
('prod-027', '486bbb90-81e4-465d-897b-e0ebac06eb54', 'CTG-06', 'Second-hand Desk', 'Old study desk, some scratches', null, '{}', 120000, 'good', 'available', 1, 1),
('prod-028', '5b47b9f4-cb13-46d8-a4ce-412b2cd4c635', 'CTG-06', 'Used Bookshelf', 'Old wooden bookshelf, needs cleaning', null, '{}', 75000, 'so so', 'available', 1, 1),
('prod-029', 'd63ddb16-773f-48c6-883f-a391077d1e15', 'CTG-06', 'Storage Boxes', 'Used storage boxes, some damage', null, '{}', 25000, 'so so', 'available', 3, 3),
('prod-030', 'fd7bc13f-363f-46be-ba13-d15355bc2fa7', 'CTG-06', 'Old Lamp', 'Vintage lamp, needs new bulb', null, '{}', 35000, 'so so', 'available', 1, 1),

-- Collectibles
('prod-031', '0c49d2db-69dc-410d-8064-24da8bbb3054', 'CTG-07', 'Old Vinyl Records', 'Used vinyl records, some scratches', null, '{}', 30000, 'so so', 'available', 3, 3),
('prod-032', '289abff5-dfc9-4c81-a65c-0038bb157f62', 'CTG-07', 'Used Action Figures', 'Old action figures, some missing parts', null, '{}', 25000, 'so so', 'available', 2, 2),
('prod-033', '486bbb90-81e4-465d-897b-e0ebac06eb54', 'CTG-07', 'Vintage Clock', 'Old mechanical clock, needs repair', null, '{}', 50000, 'bad', 'available', 1, 1),
('prod-034', '5b47b9f4-cb13-46d8-a4ce-412b2cd4c635', 'CTG-07', 'Old Coin Collection', 'Used coins, some tarnished', null, '{}', 40000, 'so so', 'available', 1, 1),
('prod-035', 'd63ddb16-773f-48c6-883f-a391077d1e15', 'CTG-07', 'Used Art Prints', 'Old framed prints, some fading', null, '{}', 15000, 'so so', 'available', 2, 2),

-- Sports & Outdoor
('prod-036', 'fd7bc13f-363f-46be-ba13-d15355bc2fa7', 'CTG-08', 'Used Yoga Mat', 'Old yoga mat, some wear', null, '{}', 25000, 'so so', 'available', 1, 1),
('prod-037', '0c49d2db-69dc-410d-8064-24da8bbb3054', 'CTG-08', 'Second-hand Tennis Racket', 'Old tennis racket, needs new strings', null, '{}', 50000, 'so so', 'available', 1, 1),
('prod-038', '289abff5-dfc9-4c81-a65c-0038bb157f62', 'CTG-08', 'Used Camping Tent', 'Old tent, some holes patched', null, '{}', 80000, 'so so', 'available', 1, 1),
('prod-039', '486bbb90-81e4-465d-897b-e0ebac06eb54', 'CTG-08', 'Old Fitness Equipment', 'Used dumbbells, some rust', null, '{}', 40000, 'so so', 'available', 1, 1),
('prod-040', '5b47b9f4-cb13-46d8-a4ce-412b2cd4c635', 'CTG-08', 'Second-hand Helmet', 'Used bicycle helmet, some scratches', null, '{}', 20000, 'good', 'available', 1, 1),

-- Home Decor
('prod-041', 'd63ddb16-773f-48c6-883f-a391077d1e15', 'CTG-09', 'Old Wall Art', 'Used wall decorations, some fading', null, '{}', 15000, 'so so', 'available', 2, 2),
('prod-042', 'fd7bc13f-363f-46be-ba13-d15355bc2fa7', 'CTG-09', 'Used Candles', 'Partially used candles', null, '{}', 8000, 'so so', 'available', 4, 4),
('prod-043', '0c49d2db-69dc-410d-8064-24da8bbb3054', 'CTG-09', 'Old Plant Pots', 'Used ceramic pots, some cracks', null, '{}', 12000, 'so so', 'available', 3, 3),
('prod-044', '289abff5-dfc9-4c81-a65c-0038bb157f62', 'CTG-09', 'Second-hand Pillows', 'Used throw pillows, some stains', null, '{}', 20000, 'so so', 'available', 2, 2),
('prod-045', '486bbb90-81e4-465d-897b-e0ebac06eb54', 'CTG-09', 'Old Mirrors', 'Used mirrors, some spots', null, '{}', 30000, 'so so', 'available', 1, 1),

-- Miscellaneous
('prod-046', '5b47b9f4-cb13-46d8-a4ce-412b2cd4c635', 'CTG-10', 'Used Tool Kit', 'Old household tools, some missing', null, '{}', 35000, 'so so', 'available', 1, 1),
('prod-047', 'd63ddb16-773f-48c6-883f-a391077d1e15', 'CTG-10', 'Mixed Items Box', 'Box of random used items', null, '{}', 15000, 'so so', 'available', 1, 1),
('prod-048', 'fd7bc13f-363f-46be-ba13-d15355bc2fa7', 'CTG-10', 'Old Cleaning Supplies', 'Partially used cleaning products', null, '{}', 10000, 'so so', 'available', 1, 1),
('prod-049', '0c49d2db-69dc-410d-8064-24da8bbb3054', 'CTG-10', 'Used Emergency Kit', 'Old first aid kit, some items expired', null, '{}', 20000, 'bad', 'available', 1, 1),
('prod-050', '289abff5-dfc9-4c81-a65c-0038bb157f62', 'CTG-10', 'Thrift Mystery Box', 'Box of random thrift items', null, '{}', 15000, 'so so', 'available', 1, 1);
