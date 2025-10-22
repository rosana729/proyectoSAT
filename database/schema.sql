-- Tabla reports para almacenar reportes del sistema
CREATE TABLE reports (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_reports_updated_at
    BEFORE UPDATE ON reports
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Políticas RLS básicas (permitir lectura pública, escritura auth)
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir lectura pública de reports"
    ON reports FOR SELECT
    USING (true);

CREATE POLICY "Permitir inserción autenticada de reports"
    ON reports FOR INSERT
    WITH CHECK (true);  -- Simplificado: cualquier usuario puede insertar

CREATE POLICY "Permitir actualización autenticada de reports"
    ON reports FOR UPDATE
    USING (true)  -- Simplificado: cualquier usuario puede actualizar
    WITH CHECK (true);