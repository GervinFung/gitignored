ALTER TABLE template DROP CONSTRAINT template_name_key;

ALTER TABLE template ADD UNIQUE (batch_id, name);
