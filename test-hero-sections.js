const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

const envContent = fs.readFileSync('.env.local', 'utf8')
const env = {}
envContent.split('\n').forEach(line => {
  const [key, ...value] = line.split('=')
  if (key) env[key.trim()] = value.join('=').trim()
})

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function testHeroSections() {
  console.log('Fetching hero sections...')
  const { data, error } = await supabase
    .from('hero_sections')
    .select('*')
    .order('position')
  
  if (error) {
    console.error('Error:', error)
  } else {
    console.log('Hero sections found:', data?.length || 0)
    console.log(JSON.stringify(data, null, 2))
  }
}

testHeroSections()
