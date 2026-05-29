-- Create a generic SQL executor function
CREATE OR REPLACE FUNCTION exec_sql(query TEXT, params TEXT[])
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSON;
BEGIN
  EXECUTE query
  USING params[1], params[2], params[3], params[4], params[5], params[6], params[7], params[8]
  INTO result;
  
  RETURN result;
END;
$$;
