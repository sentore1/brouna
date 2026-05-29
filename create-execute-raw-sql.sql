-- Create function to execute raw SQL with unique name
CREATE OR REPLACE FUNCTION execute_raw_sql(sql_query TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSON;
BEGIN
  EXECUTE sql_query INTO result;
  RETURN result;
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION execute_raw_sql TO service_role;
GRANT EXECUTE ON FUNCTION execute_raw_sql TO anon;
GRANT EXECUTE ON FUNCTION execute_raw_sql TO authenticated;
